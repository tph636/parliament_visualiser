const memberOfParliamentRouter = require('express').Router();
const { fetchAll, fetchFirst } = require('../utils/dbUtils');
const { DOMParser } = require('xmldom'); // Import DOMParser for node environment

// Route to get all members of parliament
memberOfParliamentRouter.get('', async (request, response) => {
  try {
    const members = await fetchAll(`SELECT 
                                      member_of_parliament.person_id, 
                                      member_of_parliament.lastname, 
                                      member_of_parliament.firstname, 
                                      member_of_parliament.minister, 
                                      seating_of_parliament.party,
                                      seating_of_parliament.party_color,
                                      seating_of_parliament.image,
                                      seating_of_parliament.seat_number,
                                      COUNT(valihuudot.valihuuto) AS valihuuto_count, 
                                      member_of_parliament.xmldata_fi 
                                    FROM 
                                      member_of_parliament
                                    LEFT JOIN
                                      seating_of_parliament
                                    ON
                                      member_of_parliament.person_id = seating_of_parliament.heteka_id
                                    LEFT JOIN
                                      valihuudot
                                    ON
                                      member_of_parliament.firstname = valihuudot.firstname 
                                    AND 
                                      member_of_parliament.lastname = valihuudot.lastname 
                                    GROUP BY 
                                      member_of_parliament.person_id, 
                                      member_of_parliament.lastname, 
                                      member_of_parliament.firstname, 
                                      member_of_parliament.minister, 
                                      seating_of_parliament.party,
                                      seating_of_parliament.party_color,
                                      seating_of_parliament.image,
                                      seating_of_parliament.seat_number, 
                                      member_of_parliament.xmldata_fi`);

    // Parse XML data and append birth_year and parliament_group for each member
    const updatedMembers = members.map(member => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(member.xmldata_fi, 'text/xml');
      const birthDate = xmlDoc.getElementsByTagName('SyntymaPvm')[0]?.childNodes[0]?.nodeValue;
      const parliamentGroup = xmlDoc.getElementsByTagName('NykyinenEduskuntaryhma')[0]?.getElementsByTagName('Nimi')[0]?.childNodes[0]?.nodeValue;

      // Return member without XmlDataFi
      return {
        person_id: member.person_id,
        lastname: member.lastname,
        firstname: member.firstname,
        minister: member.minister,
        party: member.party,
        party_color: member.party_color,
        image: member.image,
        seat_number: member.seat_number,
        valihuuto_count: member.valihuuto_count,
        birth_year: birthDate ? new Date(birthDate).getFullYear() : null,
        parliament_group: parliamentGroup || null
      };
    });

    response.json(updatedMembers); // Return the updated member data
  } catch (err) {
    response.status(500).send('Internal Server Error');
  }
});

// Route to get a specific member of parliament by person_id
memberOfParliamentRouter.get('/:person_id', async (request, response) => {
  const { person_id } = request.params;
  try {
    const member = await fetchFirst(`SELECT 
                                      member_of_parliament.person_id, 
                                      member_of_parliament.lastname, 
                                      member_of_parliament.firstname, 
                                      member_of_parliament.minister, 
                                      seating_of_parliament.party,
                                      seating_of_parliament.party_color,
                                      seating_of_parliament.image,
                                      seating_of_parliament.seat_number,
                                      COUNT(valihuudot.valihuuto) AS valihuuto_count, 
                                      member_of_parliament.xmldata_fi 
                                    FROM 
                                      member_of_parliament
                                    LEFT JOIN
                                      seating_of_parliament
                                    ON
                                      member_of_parliament.person_id = seating_of_parliament.heteka_id
                                    LEFT JOIN
                                      valihuudot
                                    ON
                                      member_of_parliament.firstname = valihuudot.firstname 
                                    AND 
                                      member_of_parliament.lastname = valihuudot.lastname 
                                    WHERE
                                      member_of_parliament.person_id = $1
                                    GROUP BY 
                                      member_of_parliament.person_id, 
                                      member_of_parliament.lastname, 
                                      member_of_parliament.firstname, 
                                      member_of_parliament.minister,
                                      seating_of_parliament.party,
                                      seating_of_parliament.party_color,
                                      seating_of_parliament.image,
                                      seating_of_parliament.seat_number, 
                                      member_of_parliament.xmldata_fi`, [person_id]);

    // Check if member exists
    if (!member) {
      return response.status(404).json({ message: 'Member not found' });
    }

    // Parse XML data and append birth_year and parliament_group for the member
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(member.xmldata_fi, 'text/xml');
    const birthDate = xmlDoc.getElementsByTagName('SyntymaPvm')[0]?.childNodes[0]?.nodeValue;
    const parliamentGroup = xmlDoc.getElementsByTagName('NykyinenEduskuntaryhma')[0]?.getElementsByTagName('Nimi')[0]?.childNodes[0]?.nodeValue;

    // Return member without XmlDataFi
    const updatedMember = {
      person_id: member.person_id,
      lastname: member.lastname,
      firstname: member.firstname,
      minister: member.minister,
      party: member.party,
      party_color: member.party_color,
      image: member.image,
      seat_number: member.seat_number,
      valihuuto_count: member.valihuuto_count,
      birth_year: birthDate ? new Date(birthDate).getFullYear() : null,
      parliament_group: parliamentGroup || null,
    };

    response.json(updatedMember); // Return the updated member data
  } catch (err) {
    response.status(500).send('Internal Server Error');
  }
});

module.exports = memberOfParliamentRouter;

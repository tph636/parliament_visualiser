const memberOfParliamentRouter = require('express').Router();
const { getDatabase, fetchAll } = require('../utils/dbUtils');
const { DOMParser } = require('xmldom'); // Import DOMParser for node environment

memberOfParliamentRouter.get('', async (request, response) => {
  const db = getDatabase();
  try {
    const members = await fetchAll(db, `SELECT 
                                          MemberOfParliament.personId, 
                                          MemberOfParliament.lastname, 
                                          MemberOfParliament.firstname, 
                                          MemberOfParliament.party, 
                                          MemberOfParliament.minister, 
                                          COUNT(Valihuudot.valihuuto) AS valihuuto_count, 
                                          MemberOfParliament.XmlDataFi 
                                        FROM 
                                          MemberOfParliament 
                                        LEFT JOIN 
                                          Valihuudot 
                                        ON 
                                          MemberOfParliament.firstname = Valihuudot.firstname 
                                        AND 
                                          MemberOfParliament.lastname = Valihuudot.lastname 
                                        GROUP BY 
                                          MemberOfParliament.personId, 
                                          MemberOfParliament.lastname, 
                                          MemberOfParliament.firstname, 
                                          MemberOfParliament.party, 
                                          MemberOfParliament.minister, 
                                          MemberOfParliament.XmlDataFi`);

    // Parse XML data and append birthYear and parliamentGroup for each member
    const updatedMembers = members.map(member => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(member.XmlDataFi, 'text/xml');
      const birthDate = xmlDoc.getElementsByTagName('SyntymaPvm')[0]?.childNodes[0]?.nodeValue;
      const parliamentGroup = xmlDoc.getElementsByTagName('NykyinenEduskuntaryhma')[0]?.getElementsByTagName('Nimi')[0]?.childNodes[0]?.nodeValue;

      // Return member without XmlDataFi
      return {
        personId: member.personId,
        lastname: member.lastname,
        firstname: member.firstname,
        minister: member.minister,
        birthYear: birthDate ? new Date(birthDate).getFullYear() : null,
        parliamentGroup: parliamentGroup || null,
        valihuuto_count: member.valihuuto_count
      };
    });

    response.json(updatedMembers); // Return the updated member data
  } catch (err) {
    response.status(500).send('Internal Server Error');
  } finally {
    db.close();
  }
});

module.exports = memberOfParliamentRouter;

const memberOfParliamentRouter = require('express').Router();
const { fetchAll, fetchFirst } = require('../utils/dbUtils');

// Route to get all members of parliament
memberOfParliamentRouter.get('', async (request, response) => {
  try {
    const members = await fetchAll(`SELECT 
                                      member_of_parliament.person_id, 
                                      member_of_parliament.lastname, 
                                      member_of_parliament.firstname, 
                                      member_of_parliament.minister, 
                                      seating_of_parliament.heteka_id,
                                      seating_of_parliament.party,
                                      seating_of_parliament.party_color,
                                      seating_of_parliament.image,
                                      seating_of_parliament.seat_number,
                                      COUNT(valihuudot.valihuuto) AS valihuuto_count, 
                                      member_of_parliament.birth_year,
                                      member_of_parliament.parliament_group
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
                                      seating_of_parliament.heteka_id`);

    const updatedMembers = members.map(member => ({
      person_id: member.person_id,
      lastname: member.lastname,
      firstname: member.firstname,
      minister: member.minister,
      party: member.party,
      party_color: member.party_color,
      image: member.image,
      seat_number: member.seat_number,
      valihuuto_count: member.valihuuto_count,
      birth_year: member.birth_year,
      parliament_group: member.parliament_group
    }));

    response.json(updatedMembers)
  } catch (err) {
    console.error('Error:', err.message);
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
                                      seating_of_parliament.heteka_id,
                                      seating_of_parliament.party,
                                      seating_of_parliament.party_color,
                                      seating_of_parliament.image,
                                      seating_of_parliament.seat_number,
                                      COUNT(valihuudot.valihuuto) AS valihuuto_count, 
                                      member_of_parliament.birth_year,
                                      member_of_parliament.parliament_group
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
                                      seating_of_parliament.heteka_id`, [person_id]);

    if (!member) {
      return response.status(404).json({ message: 'Member not found' });
    }

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
      birth_year: member.birth_year,
      parliament_group: member.parliament_group,
    };

    response.json(updatedMember);
  } catch (err) {
    console.error('Error:', err.message);
    response.status(500).send('Internal Server Error');
  }
});

module.exports = memberOfParliamentRouter;

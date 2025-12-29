const partyRouter = require('express').Router();
const { fetchAll } = require('../utils/dbUtils');


partyRouter.get('/valihuudot', async (request, response) => {
  try {
    const parties = await fetchAll(`
      SELECT 
        seating_of_parliament.party AS party,
        seating_of_parliament.party_color AS party_color,
        COUNT(valihuudot.valihuuto) AS total_valihuudot,
        COUNT(DISTINCT member_of_parliament.person_id) AS member_count
      FROM seating_of_parliament
      LEFT JOIN member_of_parliament
        ON member_of_parliament.person_id = seating_of_parliament.heteka_id
      LEFT JOIN valihuudot
        ON member_of_parliament.firstname = valihuudot.firstname
       AND member_of_parliament.lastname = valihuudot.lastname
      GROUP BY seating_of_parliament.party, seating_of_parliament.party_color
      ORDER BY total_valihuudot DESC;
    `);

    response.json(parties);
  } catch (err) {
    console.error('Error:', err);
    response.status(500).send('Internal Server Error');
  }
});


partyRouter.get('/speeches', async (request, response) => {
  try {
    const parties = await fetchAll(`
      SELECT 
        seating_of_parliament.party AS party,
        seating_of_parliament.party_color AS party_color,
        COUNT(speeches.id) AS total_speeches,
        COUNT(DISTINCT member_of_parliament.person_id) AS member_count
      FROM seating_of_parliament
      LEFT JOIN member_of_parliament
        ON member_of_parliament.person_id = seating_of_parliament.heteka_id
      LEFT JOIN speeches
        ON member_of_parliament.firstname = speeches.firstname
       AND member_of_parliament.lastname = speeches.lastname
      GROUP BY seating_of_parliament.party, seating_of_parliament.party_color
      ORDER BY total_speeches DESC;
    `);

    response.json(parties);
  } catch (err) {
    console.error('Error:', err);
    response.status(500).send('Internal Server Error');
  }
});

module.exports = partyRouter;

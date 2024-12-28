const seatingOfParliamentRouter = require('express').Router();
const { fetchAll, fetchFirst } = require('../utils/dbUtils');

// Route to fetch all seating data
seatingOfParliamentRouter.get('', async (request, response) => {
  try {
    const seating = await fetchAll('SELECT * FROM seating_of_parliament');
    response.json(seating); // Return the seating data as JSON
  } catch (err) {
    response.status(500).send('Internal Server Error');
  }
});

// Route to fetch seating data by person_id (heteka_id)
seatingOfParliamentRouter.get('/:person_id', async (request, response) => {
  const { person_id } = request.params;
  try {
    const seating = await fetchFirst('SELECT * FROM seating_of_parliament WHERE heteka_id = $1', [person_id]);
    if (!seating) {
      return response.status(404).json({ message: 'Seating data not found' });
    }
    response.json(seating); // Return the seating data as JSON
  } catch (err) {
    response.status(500).send('Internal Server Error');
  }
});

module.exports = seatingOfParliamentRouter;

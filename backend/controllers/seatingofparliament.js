const seatingOfParliamentRouter = require('express').Router()
const { getDatabase, fetchAll } = require('../utils/dbUtils')

seatingOfParliamentRouter.get('', async (request, response) => {
  const db = getDatabase();
  try {
    const seating = await fetchAll(db, 'SELECT * FROM SeatingOfParliament');
    response.json(seating); // Return the seating data as JSON
  } catch (err) {
    response.status(500).send('Internal Server Error');
  } finally {
    db.close();
  }
});

module.exports = seatingOfParliamentRouter;



const seatingOfParliamentRouter = require('express').Router();
const { getDatabase, fetchAll } = require('../utils/dbUtils');

// Route to fetch all seating data
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

// Route to fetch seating data by personId (hetekaId)
seatingOfParliamentRouter.get('/:personId', async (request, response) => {
  const db = getDatabase();
  const { personId } = request.params;
  try {
    const seating = await fetchAll(db, 'SELECT * FROM SeatingOfParliament WHERE hetekaId = ?', [personId]);
    if (seating.length === 0) {
      return response.status(404).json({ message: 'Seating data not found' });
    }
    response.json(seating[0]); // Return the seating data as JSON
  } catch (err) {
    response.status(500).send('Internal Server Error');
  } finally {
    db.close();
  }
});

module.exports = seatingOfParliamentRouter;
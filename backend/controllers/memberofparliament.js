const memberOfParliamentRouter = require('express').Router()
const { getDatabase, fetchAll } = require('../utils/dbUtils')

memberOfParliamentRouter.get('', async (request, response) => {
  const db = getDatabase();
  try {
    const members = await fetchAll(db, 'SELECT personId, lastname, firstname, party, minister, XmlDataFi FROM MemberOfParliament');
    response.json(members); // Return the seating data as JSON
  } catch (err) {
    response.status(500).send('Internal Server Error');
  } finally {
    db.close();
  }
});

module.exports = memberOfParliamentRouter;



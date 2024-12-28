const valihuutoRouter = require('express').Router();
const { fetchAll, fetchFirst } = require('../utils/dbUtils');

valihuutoRouter.get('/:memberName/count', async (request, response) => {
  const [firstname, lastname] = request.params.memberName.split(" ");

  if (!firstname || !lastname) {
    return response.status(400).send('Bad Request: Invalid member name');
  }

  try {
    // Use parameterized query to prevent SQL injection and handle special characters
    const query = `SELECT COUNT(*) as valihuuto_count FROM valihuudot WHERE firstname=$1 AND lastname=$2`;
    const valihuutoCount = await fetchAll(query, [firstname, lastname]);
    // Return the data as JSON
    response.json(valihuutoCount); 
  } catch (err) {
    response.status(500).send('Internal Server Error');
  }
});

valihuutoRouter.get('/count', async (request, response) => {
  try {
    const query = `SELECT firstname, lastname, COUNT(*) AS valihuuto_count FROM valihuudot GROUP BY firstname, lastname`;
    const valihuutoCount = await fetchAll(query);
    // Return the data as JSON
    response.json(valihuutoCount); 
  } catch (err) {
    response.status(500).send('Internal Server Error');
  }
});

module.exports = valihuutoRouter;

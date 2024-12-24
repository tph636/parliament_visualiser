const valihuutoRouter = require('express').Router();
const { getDatabase, fetchAll } = require('../utils/dbUtils');

valihuutoRouter.get('/:memberName/amount', async (request, response) => {
  const db = getDatabase();
  const [firstname, lastname] = request.params.memberName.split(" ");

  if (!firstname || !lastname) {
    return response.status(400).send('Bad Request: Invalid member name');
  }

  try {
    // Use parameterized query to prevent SQL injection and handle special characters
    const query = `SELECT COUNT(*) as count FROM Valihuudot WHERE firstname=? AND lastname=?`;
    const valihuutoAmount = await fetchAll(db, query, [firstname, lastname]);
    // Return the data as JSON
    response.json(valihuutoAmount); 
  } catch (err) {
    response.status(500).send('Internal Server Error');
  } finally {
    db.close();
  }
});

valihuutoRouter.get('/amount', async (request, response) => {
    const db = getDatabase();
    try {
      const query = `SELECT firstname, lastname, COUNT(*) AS count FROM Valihuudot GROUP BY firstname, lastname`;
      const valihuutoAmount = await fetchAll(db, query);
      // Return the data as JSON
      response.json(valihuutoAmount); 
    } catch (err) {
      response.status(500).send('Internal Server Error');
    } finally {
      db.close();
    }
  });
  
module.exports = valihuutoRouter;

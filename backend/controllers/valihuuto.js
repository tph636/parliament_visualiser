const valihuutoRouter = require('express').Router();
const { fetchAll, fetchFirst } = require('../utils/dbUtils');


valihuutoRouter.get('/:person_id/:page', async (request, response) => {
  const { person_id, page } = request.params;
  const pageNumber = parseInt(page) || 1;
  const limit = 10;
  const offset = (pageNumber - 1) * limit;

  try {
    const valihuudot = await fetchAll(`
      SELECT 
        v.firstname,
        v.lastname,
        v.valihuuto,
        v.ptk_num,
        v.date,
        v.huuto_num
      FROM 
        valihuudot v
      INNER JOIN 
        member_of_parliament m
      ON 
        m.firstname = v.firstname AND m.lastname = v.lastname
      WHERE 
        m.person_id = $1
      ORDER BY 
        v.date DESC, v.huuto_num ASC
      LIMIT $2 OFFSET $3
    `, [person_id, limit, offset]);

    response.json({
      person_id,
      page: pageNumber,
      results: valihuudot
    });
  } catch (err) {
    console.error('Error:', err);
    response.status(500).send('Internal Server Error');
  }
});


module.exports = valihuutoRouter;

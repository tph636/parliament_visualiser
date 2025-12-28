const speechRouter = require('express').Router();
const { fetchAll, fetchFirst } = require('../utils/dbUtils');

// Search from all members
speechRouter.get('', async (request, response) => {
  const { q, page = 1 } = request.query;

  if (!q || q.trim() === '') {
    return response.status(400).json({ error: 'Missing search query' });
  }

  const pageNumber = parseInt(page) || 1;
  const limit = 1;
  const offset = (pageNumber - 1) * limit;

  try {
    const speeches = await fetchAll(
      `
      SELECT
        id,
        timestamp,
        firstname,
        lastname,
        content,
        date,
        TO_CHAR(date, 'DD.MM.YYYY') AS formatted_date,
        ptk_num,
        ts_rank(search_vector, plainto_tsquery('finnish', $1)) AS rank
      FROM speeches
      WHERE search_vector @@ plainto_tsquery('finnish', $1)
      ORDER BY date DESC, rank DESC
      LIMIT $2 OFFSET $3;
      `,
      [q, limit, offset]
    );

    const countResult = await fetchFirst(
      `
      SELECT COUNT(*) AS total
      FROM speeches
      WHERE search_vector @@ plainto_tsquery('finnish', $1)
      `,
      [q]
    );

    const total = parseInt(countResult.total, 10);

    response.json({
      page: pageNumber,
      limit,
      total,
      results: speeches
    });
  } catch (err) {
    console.error('Error:', err);
    response.status(500).send('Internal Server Error');
  }
});


// Search from a specific member
speechRouter.get('/:hetekaId', async (request, response) => {
  const { hetekaId } = request.params;
  const { q, page = 1 } = request.query;

  if (!q || q.trim() === '') {
    return response.status(400).json({ error: 'Missing search query' });
  }

  const pageNumber = parseInt(page) || 1;
  const limit = 1;
  const offset = (pageNumber - 1) * limit;

  try {
    const speeches = await fetchAll(
      `
      SELECT
        speeches.id,
        speeches.timestamp,
        speeches.firstname,
        speeches.lastname,
        speeches.content,
        speeches.date,
        TO_CHAR(speeches.date, 'DD.MM.YYYY') AS formatted_date,
        speeches.ptk_num,
        ts_rank(
          speeches.search_vector,
          plainto_tsquery('finnish', $2)
        ) AS rank
      FROM speeches
      JOIN member_of_parliament
        ON member_of_parliament.firstname = speeches.firstname
       AND member_of_parliament.lastname = speeches.lastname
      JOIN seating_of_parliament
        ON seating_of_parliament.heteka_id = member_of_parliament.person_id
      WHERE seating_of_parliament.heteka_id = $1
        AND speeches.search_vector @@ plainto_tsquery('finnish', $2)
      ORDER BY speeches.date DESC, rank DESC
      LIMIT $3 OFFSET $4;
      `,
      [hetekaId, q, limit, offset]
    );

    const countResult = await fetchFirst(
      `
      SELECT COUNT(*) AS total
      FROM speeches
      JOIN member_of_parliament
        ON member_of_parliament.firstname = speeches.firstname
       AND member_of_parliament.lastname = speeches.lastname
      JOIN seating_of_parliament
        ON seating_of_parliament.heteka_id = member_of_parliament.person_id
      WHERE seating_of_parliament.heteka_id = $1
        AND speeches.search_vector @@ plainto_tsquery('finnish', $2)
      `,
      [hetekaId, q]
    );

    const total = parseInt(countResult.total, 10);

    response.json({
      hetekaId,
      page: pageNumber,
      limit,
      total,
      results: speeches
    });
  } catch (err) {
    console.error('Error:', err);
    response.status(500).send('Internal Server Error');
  }
});

module.exports = speechRouter;

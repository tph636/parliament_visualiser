const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const helmet = require('helmet'); // Helmet helps you secure your Express apps

const app = express();

app.use(cors())

// Use Helmet to set various HTTP headers, including CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'"],
      connectSrc: ["'self'"],
    }
  }
}));

const fetchAll = (db, query) => {
  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const fetchFirst = (db, query) => {
    return new Promise((resolve, reject) => {
      db.get(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  };


app.get('/api/SeatingOfParliament', async (request, response) => {
  const db = new sqlite3.Database('./databases/database.db');

  try {
    const seating = await fetchAll(db, 'SELECT * FROM SeatingOfParliament');
    response.json(seating); // Return the seating data as JSON
  } catch (err) {
    console.log(err);
    response.status(500).send('Internal Server Error');
  } finally {
    db.close();
  }
});


app.listen(3001, () => {
  console.log("server running on port 3001");
});

const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const app = express();

app.use(cors());

// Use Helmet to set various HTTP headers, including CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'"],
      connectSrc: ["'self'"],
    }
  }
}));

// Set Cross-Origin-Resource-Policy header
app.use((req, res, next) => {
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

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

app.use('/tinyimages', express.static(path.join(__dirname, 'pictures', 'tinyMemberImages')));

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

app.get('/api/MemberOfParliament', async (request, response) => {
  const db = new sqlite3.Database('./databases/database.db');

  try {
    const members = await fetchAll(db, 'SELECT * FROM MemberOfParliament');
    response.json(members); // Return the members data as JSON
  } catch (err) {
    console.log(err);
    response.status(500).send('Internal Server Error');
  } finally {
    db.close();
  }
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});

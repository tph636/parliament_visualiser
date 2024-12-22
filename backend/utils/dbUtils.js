const sqlite3 = require('sqlite3')

const getDatabase = () => {
  return new sqlite3.Database('./databases/database.db')
};

const fetchAll = (db, query) => {
  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    });
  });
};

const fetchFirst = (db, query) => {
  return new Promise((resolve, reject) => {
    db.get(query, (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

module.exports = {
  getDatabase,
  fetchAll,
  fetchFirst
}

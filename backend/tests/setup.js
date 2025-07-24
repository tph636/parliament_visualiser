async function createMemberTable(client) {
  const sql = `
    CREATE TABLE IF NOT EXISTS member_of_parliament (
      person_id INTEGER PRIMARY KEY,
      lastname VARCHAR(100),
      firstname VARCHAR(100),
      minister BOOLEAN,
      birth_year INTEGER,
      parliament_group VARCHAR(100)
    );
  `;
  await client.query(sql);
}

async function createSeatingTable(client) {
  const sql = `
    CREATE TABLE IF NOT EXISTS seating_of_parliament (
      heteka_id INTEGER PRIMARY KEY,
      seat_number INTEGER,
      lastname VARCHAR(100),
      firstname VARCHAR(100),
      party VARCHAR(50),
      minister BOOLEAN,
      image TEXT,
      party_color TEXT
    );
  `;
  await client.query(sql);
}

async function createValihuudotTable(client) {
  const sql = `
    CREATE TABLE IF NOT EXISTS valihuudot (
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      valihuuto TEXT NOT NULL,
      ptk_num SMALLINT NOT NULL,
      date DATE NOT NULL,
      huuto_num SMALLINT NOT NULL,
      PRIMARY KEY (firstname, lastname, valihuuto, date, huuto_num)
    );
  `;
  await client.query(sql);
}

async function populateMembers(client) {
  const members = [
    {
      person_id: 1,
      firstname: 'Anna',
      lastname: 'Korhonen',
      minister: false,
      birth_year: 1975,
      parliament_group: 'Green'
    },
    {
      person_id: 2,
      firstname: 'Mikko',
      lastname: 'Laine',
      minister: true,
      birth_year: 1968,
      parliament_group: 'Social Democratic'
    },
    {
      person_id: 3,
      firstname: 'Jari',
      lastname: 'Virtanen',
      minister: false,
      birth_year: 1982,
      parliament_group: 'National Coalition'
    }
  ];

  for (const member of members) {
    await client.query(`
      INSERT INTO member_of_parliament (
        person_id, lastname, firstname, minister, birth_year, parliament_group
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      member.person_id,
      member.lastname,
      member.firstname,
      member.minister,
      member.birth_year,
      member.parliament_group
    ]);
  }
}

async function populateSeating(client) {
  const seats = [
    {
      heteka_id: 1,
      seat_number: 101,
      lastname: 'Korhonen',
      firstname: 'Anna',
      party: 'vihr',
      minister: false,
      image: 'anna.jpg',
      party_color: 'lightgreen'
    },
    {
      heteka_id: 2,
      seat_number: 102,
      lastname: 'Laine',
      firstname: 'Mikko',
      party: 'sd',
      minister: true,
      image: 'mikko.jpg',
      party_color: 'red'
    },
    {
      heteka_id: 3,
      seat_number: 103,
      lastname: 'Virtanen',
      firstname: 'Jari',
      party: 'kok',
      minister: false,
      image: 'jari.jpg',
      party_color: 'blue'
    }
  ];

  for (const seat of seats) {
    await client.query(`
      INSERT INTO seating_of_parliament (
        heteka_id, seat_number, lastname, firstname,
        party, minister, image, party_color
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      seat.heteka_id,
      seat.seat_number,
      seat.lastname,
      seat.firstname,
      seat.party,
      seat.minister,
      seat.image,
      seat.party_color
    ]);
  }
}

async function populateValihuudot(client) {
  const huudot = [
    {
      firstname: 'Anna',
      lastname: 'Korhonen',
      valihuuto: 'Hyvä idea!',
      ptk_num: 12,
      date: '2024-05-01',
      huuto_num: 1
    },
    {
      firstname: 'Mikko',
      lastname: 'Laine',
      valihuuto: 'Epärealistista!',
      ptk_num: 12,
      date: '2024-05-01',
      huuto_num: 2
    },
    {
      firstname: 'Jari',
      lastname: 'Virtanen',
      valihuuto: 'Kannatetaan!',
      ptk_num: 13,
      date: '2024-06-02',
      huuto_num: 1
    }
  ];

  for (const huuto of huudot) {
    await client.query(`
      INSERT INTO valihuudot (
        firstname, lastname, valihuuto,
        ptk_num, date, huuto_num
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT DO NOTHING
    `, [
      huuto.firstname,
      huuto.lastname,
      huuto.valihuuto,
      huuto.ptk_num,
      huuto.date,
      huuto.huuto_num
    ]);
  }
}

async function setup(client) {
  await createMemberTable(client);
  await createSeatingTable(client);
  await createValihuudotTable(client);
  await populateMembers(client);
  await populateSeating(client);
  await populateValihuudot(client);
}

module.exports = { setup };

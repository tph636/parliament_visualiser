/*
!!!!!!!!!!!!!!!!!!!
Nämä testit ovat mielestäni melko turhia backendin yksinkertaisuuden takia, 
mutta ne on tehty harjoituksen ja github actionsien opettelun vuoksi.

https://medium.com/@sohail_saifi/why-your-unit-tests-are-a-complete-waste-of-time-and-what-to-do-instead-50916ef5eecc
*/

async function createMemberTable(client) {
  const sql = `
    CREATE TABLE IF NOT EXISTS member_of_parliament (
      person_id INTEGER PRIMARY KEY,
      lastname VARCHAR(100),
      firstname VARCHAR(100),
      minister BOOLEAN,
      birth_year INTEGER,
      birth_place TEXT,
      current_municipality TEXT,
      profession TEXT,
      parliament_group VARCHAR(100),
      education JSONB,
      work_history JSONB,
      minister_roles JSONB,
      current_committees JSONB,
      previous_committees JSONB,
      affiliations JSONB,
      gifts JSONB
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

async function createSpeechesTable(client) {
  const sql = `
    CREATE TABLE IF NOT EXISTS speeches (
      id SERIAL PRIMARY KEY,
      timestamp TEXT NOT NULL,
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      content TEXT NOT NULL,
      date DATE NOT NULL,
      ptk_num SMALLINT NOT NULL,
      search_vector tsvector
    );
  `;
  await client.query(sql);

  // Create trigger function for auto-updating search_vector
  await client.query(`
    CREATE OR REPLACE FUNCTION speeches_search_vector_update()
    RETURNS trigger AS $$
    BEGIN
      NEW.search_vector := to_tsvector('finnish', NEW.content);
      RETURN NEW;
    END
    $$ LANGUAGE plpgsql;
  `);

  // Create trigger
  await client.query(`
    DROP TRIGGER IF EXISTS tsvectorupdate ON speeches;
    CREATE TRIGGER tsvectorupdate
    BEFORE INSERT OR UPDATE ON speeches
    FOR EACH ROW EXECUTE FUNCTION speeches_search_vector_update();
  `);

  // Create GIN index for fast full-text search
  await client.query(`
    CREATE INDEX IF NOT EXISTS speeches_search_idx
    ON speeches
    USING GIN (search_vector);
  `);
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
    },
    {
      person_id: 4,
      firstname: 'Eero',
      lastname: 'Nieminen',
      minister: false,
      birth_year: 1990,
      parliament_group: 'Centre'
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
    },
    {
      heteka_id: 4,
      seat_number: 104,
      lastname: 'Nieminen',
      firstname: 'Eero',
      party: 'kesk',
      minister: false,
      image: 'eero.jpg',
      party_color: 'orange'
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

async function populateSpeeches(client) {
  const speeches = [
    {
      timestamp: '10:15:00',
      firstname: 'Anna',
      lastname: 'Korhonen',
      content: 'Tämä on ympäristöasioiden puheenvuoro. Ilmastonmuutos on vakava ongelma.',
      date: '2024-05-01',
      ptk_num: 12
    },
    {
      timestamp: '10:30:00',
      firstname: 'Mikko',
      lastname: 'Laine',
      content: 'Sosiaaliturvaa on parannettava. Työttömyys on kasvussa.',
      date: '2024-05-01',
      ptk_num: 12
    },
    {
      timestamp: '11:00:00',
      firstname: 'Jari',
      lastname: 'Virtanen',
      content: 'Talouspolitiikka vaatii vastuullisuutta. Budjetti on tasapainotettava.',
      date: '2024-06-02',
      ptk_num: 13
    },
    {
      timestamp: '11:15:00',
      firstname: 'Anna',
      lastname: 'Korhonen',
      content: 'Uusiutuvat energiat ovat tulevaisuus. Vihreä siirtymä on välttämätön.',
      date: '2024-06-02',
      ptk_num: 13
    }
  ];

  for (const speech of speeches) {
    await client.query(`
      INSERT INTO speeches (
        timestamp, firstname, lastname, content, date, ptk_num
      )
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      speech.timestamp,
      speech.firstname,
      speech.lastname,
      speech.content,
      speech.date,
      speech.ptk_num
    ]);
  }
}

async function setup(client) {
  await createMemberTable(client);
  await createSeatingTable(client);
  await createValihuudotTable(client);
  await createSpeechesTable(client);
  await populateMembers(client);
  await populateSeating(client);
  await populateValihuudot(client);
  await populateSpeeches(client);
}

module.exports = { setup };

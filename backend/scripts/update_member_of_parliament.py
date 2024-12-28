import requests
from time import sleep
from db_util import connectToDb

conn, cursor = connectToDb()

# Fetch member data
counter = 1
def fetch_data(member_id):
    global counter
    print(counter)
    counter += 1
    sleep(0.1)
    url = f"https://avoindata.eduskunta.fi/api/v1/tables/MemberOfParliament/rows?perPage=10&page=0&columnName=personId&columnValue={member_id}"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

# Retrieve member IDs from the SeatingOfParliament table
cursor.execute('''SELECT heteka_id FROM seating_of_parliament''')
member_ids = cursor.fetchall()

# Fetch row data
row_data = [row for id in member_ids for row in fetch_data(id[0])["rowData"]]
table_data = fetch_data(member_ids[0][0])

# Combine data
combined_data = {
    "tableName": table_data["tableName"],
    "columnNames": table_data["columnNames"],
    "rowData": row_data
}

# Drop the table if it already exists
cursor.execute('DROP TABLE IF EXISTS member_of_parliament')

# Create the MemberOfParliament table with appropriate columns
cursor.execute(f'''
               CREATE TABLE member_of_parliament (
               person_id INTEGER PRIMARY KEY,
               lastname TEXT,
               firstname TEXT,
               party TEXT,
               minister TEXT,
               xmldata TEXT,
               xmldata_sv TEXT,
               xmldata_fi TEXT,
               xmldata_en TEXT
               )''')

# Insert combined data into the MemberOfParliament table
for row in combined_data["rowData"]:
    cursor.execute('''
                   INSERT INTO member_of_parliament (person_id, lastname, firstname, party, minister, xmldata, xmldata_sv, xmldata_fi, xmldata_en)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)''', (row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8]))

# Commit the changes and close the connection
conn.commit()
conn.close()

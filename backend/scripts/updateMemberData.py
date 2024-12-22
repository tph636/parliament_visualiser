
import requests
from time import sleep
from db_util import connectToDb

conn, cursor = connectToDb()

# Fetch member data
counter = 1
def fetch_data(memberId):
    global counter
    print(counter)
    counter += 1
    sleep(0.1)
    url = f"https://avoindata.eduskunta.fi/api/v1/tables/MemberOfParliament/rows?perPage=10&page=0&columnName=personId&columnValue={memberId}"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()


memberIds = cursor.execute('''SELECT hetekaId FROM SeatingOfParliament''').fetchall()
rowData = [row for id in memberIds for row in fetch_data(id[0])["rowData"]]
tableData = fetch_data(memberIds[0][0])

combined_data = {
    "tableName": tableData["tableName"],
    "columnNames": tableData["columnNames"],
    "rowData": rowData
}
# Drop the table if it already exists
cursor.execute('DROP TABLE IF EXISTS MemberOfParliament')

# Create the seatingplan table with appropriate columns
cursor.execute(f'''
               CREATE TABLE MemberOfParliament (
               personId INTEGER PRIMARY KEY,
               lastname TEXT,
               firstname TEXT,
               party TEXT,
               minister TEXT,
               XmlData TEXT,
               XmlDataSv TEXT,
               XmlDataFi TEXT,
               XmlDataEn TEXT
               )''')

# Insert combined data into the MemberOfParliament table
for row in combined_data["rowData"]:
    cursor.execute('''
                   INSERT INTO MemberOfParliament (personId, lastname, firstname, party, minister, XmlData, XmlDataSv, XmlDataFi, XmlDataEn)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''', (row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8]))

# Commit the changes and close the connection
conn.commit()
conn.close()
import requests
from db_util import connectToDb
from findPicture import findMemberPicture

conn, cursor = connectToDb()

# Fetch seating plan data
def fetch_data(page):
    url = f"https://avoindata.eduskunta.fi/api/v1/tables/SeatingOfParliament/rows?perPage=100&page={page}"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

# It is not possible to get the seats for all 200 parliament members at once
# so we have to do it in two parts
data_page_0 = fetch_data(0)
data_page_1 = fetch_data(1)

# Combine rowData from both pages
combined_data = {
    "tableName": data_page_0["tableName"],
    "columnNames": data_page_0["columnNames"],
    "rowData": data_page_0["rowData"] + data_page_1["rowData"],  # Combine rowData
}

#print(json.dumps(combined_data, indent=4, ensure_ascii=False))

# Drop the table if it already exists
cursor.execute('DROP TABLE IF EXISTS seating_of_parliament')

# Create the seating plan table with appropriate columns
cursor.execute(f'''
               CREATE TABLE seating_of_parliament (
               heteka_id INTEGER PRIMARY KEY,
               seat_number INTEGER,
               lastname TEXT,
               firstname TEXT,
               party TEXT,
               minister TEXT,
               party_color TEXT,
               image_path TEXT
               )''')

party_colors = {
    "kok": "blue",
    "sd": "red",
    "vas": "pink",
    "vihr": "lightgreen",
    "kesk": "green",
    "ps": "cyan",
    "r": "yellow",
    "kd": "purple",
    "liik": "orange"
}

# Insert combined data into the seating_of_parliament table
for row in combined_data["rowData"]:
    image_path = findMemberPicture(str(row[0]), False) # Add the image path for the member (true for full resolution)
    cursor.execute('''
                   INSERT INTO seating_of_parliament (heteka_id, seat_number, lastname, firstname, party, minister, party_color, image_path)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s)''', (row[0], row[1], row[2], row[3], row[4], row[5], party_colors.get(row[4],"dimgrey"), image_path))

# Commit the changes and close the connection
conn.commit()
conn.close()

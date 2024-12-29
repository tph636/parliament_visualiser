import json
import requests
from db_util import connectToDb

conn, cursor = connectToDb()

# Function to fetch the seating plan data
def fetch_data():
    url = "https://avoindata.eduskunta.fi/api/v1/seating/"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

# Drop the table if it already exists
cursor.execute('DROP TABLE IF EXISTS seating_of_parliament')

# Create the seating plan table with the new party_color column
cursor.execute('''
    CREATE TABLE seating_of_parliament (
        heteka_id INTEGER PRIMARY KEY,
        seat_number INTEGER,
        lastname TEXT,
        firstname TEXT,
        party TEXT,
        minister BOOLEAN,
        picture_url TEXT,
        party_color TEXT
    )
''')


data = fetch_data()

# Dictionary mapping party to colors
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

# Insert data into the table
for member in data:
    party_color = party_colors.get(member['party'], 'grey')  # Default to 'grey' if party not found
    cursor.execute('''
        INSERT INTO seating_of_parliament (heteka_id, seat_number, lastname, firstname, party, minister, picture_url, party_color)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    ''', (member['hetekaId'], member['seatNumber'], member['lastname'], member['firstname'], member['party'], member['minister'], member['pictureUrl'], party_color))

# Commit the changes
conn.commit()

# Close the connection
cursor.close()
conn.close()

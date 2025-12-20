import json
import requests
from db_ops.db_util import connectToDb

def fetch_data():
    url = "https://avoindata.eduskunta.fi/api/v1/seating/"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

def main(args=None):
    print("Updating seating of parliament postgres")

    conn, cursor = connectToDb()

    # Drop the table if it already exists
    cursor.execute('DROP TABLE IF EXISTS seating_of_parliament')

    # Create the seating plan table with the new party_color and image columns
    cursor.execute('''
        CREATE TABLE seating_of_parliament (
            heteka_id INTEGER PRIMARY KEY,
            seat_number INTEGER,
            lastname TEXT,
            firstname TEXT,
            party TEXT,
            minister BOOLEAN,
            image TEXT,
            party_color TEXT
        )
    ''')

    # Fetch the data
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
        picture_name = member['pictureUrl'].split('/')[-1]       # Extract just the picture name

        cursor.execute('''
            INSERT INTO seating_of_parliament (
                heteka_id, seat_number, lastname, firstname,
                party, minister, image, party_color
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            member['hetekaId'],
            member['seatNumber'],
            member['lastname'],
            member['firstname'],
            member['party'],
            member['minister'],
            picture_name,
            party_color
        ))

    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    main()

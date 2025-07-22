import requests
from time import sleep
from db_ops.db_util import connectToDb
import xml.etree.ElementTree as ET

def extract_birth_year(xml_str):
    if not xml_str:
        return None
    try:
        root = ET.fromstring(xml_str)
        birth_date_elem = root.find('.//SyntymaPvm')
        if birth_date_elem is not None and birth_date_elem.text:
            try:
                return int(birth_date_elem.text[:4])
            except Exception:
                return None
        return None
    except Exception:
        return None

def extract_parliament_group(xml_str):
    if not xml_str:
        return None
    try:
        root = ET.fromstring(xml_str)
        group_elem = root.find('.//NykyinenEduskuntaryhma/Nimi')
        return group_elem.text if group_elem is not None else None
    except Exception:
        return None

def main(args=None):
    conn, cursor = connectToDb()
    counter = 1

    def fetch_data(member_id):
        nonlocal counter
        print(counter)
        counter += 1
        sleep(0.1)
        url = (
            f"https://avoindata.eduskunta.fi/api/v1/tables/MemberOfParliament/rows"
            f"?perPage=10&page=0&columnName=personId&columnValue={member_id}"
        )
        response = requests.get(url)
        response.raise_for_status()
        return response.json()

    # Retrieve member IDs
    cursor.execute("SELECT heteka_id FROM seating_of_parliament")
    member_ids = cursor.fetchall()

    # Fetch row data for all members
    row_data = [row for id in member_ids for row in fetch_data(id[0])["rowData"]]
    table_data = fetch_data(member_ids[0][0])  # Get table metadata

    combined_data = {
        "tableName": table_data["tableName"],
        "columnNames": table_data["columnNames"],
        "rowData": row_data
    }

    # Drop existing table and recreate it
    cursor.execute("DROP TABLE IF EXISTS member_of_parliament")
    cursor.execute('''
        CREATE TABLE member_of_parliament (
            person_id INTEGER PRIMARY KEY NOT NULL,
            lastname TEXT NOT NULL,
            firstname TEXT NOT NULL,
            party TEXT NOT NULL,
            minister TEXT NOT NULL,
            xmldata XML,
            xmldata_sv XML NOT NULL,
            xmldata_fi XML NOT NULL,
            xmldata_en XML NOT NULL,
            birth_year INTEGER,
            parliament_group TEXT
        )
    ''')

    # Insert new data
    for row in combined_data["rowData"]:
        xmldata_fi = row[7]
        birth_year = extract_birth_year(xmldata_fi)
        parliament_group = extract_parliament_group(xmldata_fi)
        cursor.execute('''
            INSERT INTO member_of_parliament (
                person_id, lastname, firstname, party, minister,
                xmldata, xmldata_sv, xmldata_fi, xmldata_en,
                birth_year, parliament_group
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            row[0], row[1], row[2], row[3], row[4],
            row[5], row[6], row[7], row[8],
            birth_year, parliament_group
        ))

    conn.commit()
    conn.close()

if __name__ == "__main__":
    main()

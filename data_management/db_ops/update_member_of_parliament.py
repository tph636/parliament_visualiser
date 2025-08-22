import requests
from time import sleep
from db_ops.db_util import connectToDb
import xml.etree.ElementTree as ET

def extract_person_data(xml_str):
    if not xml_str:
        return None

    data = {
        'birth_year': None,
        'birth_place': None,
        'current_municipality': None,
        'profession': None,
        'parliament_group': None,
        'education': [],
        'work_history': [],
        'minister_roles': [],
        'current_committees': [],
        'previous_committees': [],
        'affiliations': [],
        'gifts': []
    }

    try:
        root = ET.fromstring(xml_str)

        # Henkilötiedot
        data['birth_year'] = root.findtext('.//SyntymaPvm')
        data['birth_place'] = root.findtext('.//SyntymaPaikka')
        data['current_municipality'] = root.findtext('.//NykyinenKotikunta')
        data['profession'] = root.findtext('.//Ammatti')
        data['parliament_group'] = root.findtext('.//NykyinenEduskuntaryhma/Nimi')

        # Koulutus
        for education in root.findall('.//Koulutus'):
            data['education'].append({
                'name': education.findtext('Nimi'),
                'institution': education.findtext('Oppilaitos'),
                'year': education.findtext('Vuosi')
            })

        # Työura
        for work in root.findall('.//Tyo'):
            data['work_history'].append({
                'name': work.findtext('Nimi'),
                'period': work.findtext('AikaJakso')
            })

        # Ministeritehtävät
        for minister_role in root.findall('.//ValtioneuvostonJasenyydet/Jasenyys'):
            data['minister_roles'].append({
                'ministry': minister_role.findtext('Ministeriys'),
                'name': minister_role.findtext('Nimi'),
                'government': minister_role.findtext('Hallitus'),
                'start_date': minister_role.findtext('AlkuPvm'),
                'end_date': minister_role.findtext('LoppuPvm')
            })

        # Nykyiset toimielimet
        for committee in root.findall('.//NykyisetToimielinjasenyydet/Toimielin'):
            data['current_committees'].append({
                'name': committee.findtext('Nimi'),
                'role': committee.findtext('.//Jasenyys/Rooli'),
                'start_date': committee.findtext('.//Jasenyys/AlkuPvm')
            })

        # Aiemmat toimielimet
        for committee in root.findall('.//AiemmatToimielinjasenyydet/Toimielin'):
            data['previous_committees'].append({
                'name': committee.findtext('Nimi'),
                'role': committee.findtext('.//Jasenyys/Rooli'),
                'start_date': committee.findtext('.//Jasenyys/AlkuPvm'),
                'end_date': committee.findtext('.//Jasenyys/LoppuPvm')
            })

        # Sidonnaisuudet
        for affiliation in root.findall('.//Sidonnaisuudet/Sidonnaisuus'):
            sidonta = affiliation.findtext('Sidonta')
            if sidonta and sidonta != "Ei ilmoitettavia sidonnaisuuksia":
                data['affiliations'].append(sidonta)

        # Lahjailmoitukset
        for gift in root.findall('.//Sidonnaisuudet/Sidonnaisuus[RyhmaOtsikko="Lahjailmoitus"]'):
            data['gifts'].append(gift.findtext('Sidonta'))

    except Exception as e:
        print(f"Error parsing XML: {e}")

    return data

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

    cursor.execute("SELECT heteka_id FROM seating_of_parliament")
    member_ids = cursor.fetchall()

    row_data = [row for id in member_ids for row in fetch_data(id[0])["rowData"]]

    cursor.execute("DROP TABLE IF EXISTS member_of_parliament")
    cursor.execute('''
        CREATE TABLE member_of_parliament (
            person_id INTEGER PRIMARY KEY NOT NULL,
            lastname TEXT NOT NULL,
            firstname TEXT NOT NULL,
            party TEXT NOT NULL,
            minister TEXT NOT NULL,
            birth_year INTEGER,
            birth_place TEXT,
            current_municipality TEXT,
            profession TEXT,
            parliament_group TEXT,
            education TEXT,
            work_history TEXT,
            minister_roles TEXT,
            current_committees TEXT,
            previous_committees TEXT,
            affiliations TEXT,
            gifts TEXT
        )
    ''')

    for row in row_data:
        xmldata_fi = row[7]
        person_data = extract_person_data(xmldata_fi)

        cursor.execute('''
            INSERT INTO member_of_parliament (
                person_id, lastname, firstname, party, minister,
                birth_year, birth_place, current_municipality, profession,
                parliament_group, education, work_history, minister_roles,
                current_committees, previous_committees, affiliations, gifts
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            row[0], row[1], row[2], row[3], row[4],
            person_data['birth_year'],
            person_data['birth_place'],
            person_data['current_municipality'],
            person_data['profession'],
            person_data['parliament_group'],
            str(person_data['education']),
            str(person_data['work_history']),
            str(person_data['minister_roles']),
            str(person_data['current_committees']),
            str(person_data['previous_committees']),
            str(person_data['affiliations']),
            str(person_data['gifts'])
        ))

    conn.commit()
    conn.close()

if __name__ == "__main__":
    main()

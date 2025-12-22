import os
import re
from db_ops.db_util import connectToDb
from datetime import date
from db_ops.extractVälihuudot import extract_välihuudot
from db_ops.välihuuto import Välihuuto

def main(args=None):

    # Connect to the database
    conn, cursor = connectToDb()

    # Create the table if it does not exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS valihuudot (
            firstname TEXT NOT NULL,
            lastname TEXT NOT NULL,
            valihuuto TEXT NOT NULL,
            ptk_num SMALLINT NOT NULL,
            date DATE NOT NULL,
            huuto_num SMALLINT NOT NULL,
            PRIMARY KEY (firstname, lastname, valihuuto, date, huuto_num)
        )
    ''')

    # Define the documents folder
    folder = './assets/documents/2025'

    # Regular expression to match the filenames
    pattern = re.compile(r'PTK-(\d+)\+2025-vp\.pdf')
    count = 1

    # Process files in the documents folder
    for filename in os.listdir(folder):
        match = pattern.match(filename)
        if match:
            currentPtkNum = int(match.group(1))
            file_path = os.path.join(folder, filename)
            print(f"Processing: {file_path}")
            # Open and process the PDF file
            with open(file_path, 'rb') as file:
                try:
                    välihuudot = extract_välihuudot(file)
                    for huuto in välihuudot:
                        cursor.execute('''
                            INSERT INTO valihuudot (
                                firstname, lastname, valihuuto,
                                ptk_num, date, huuto_num
                            ) 
                            VALUES (%s, %s, %s, %s, to_date(%s, 'DD.MM.YYYY'), %s)
                            ON CONFLICT (firstname, lastname, valihuuto, date, huuto_num) DO NOTHING
                        ''', (
                            huuto.firstName, huuto.lastName, huuto.huuto,
                            currentPtkNum, huuto.date, huuto.huutoNum
                        ))
                        print(f'{count}. {huuto.firstName} {huuto.lastName}: {huuto.huuto} PTK({currentPtkNum}) {huuto.date} (Huuto #{huuto.huutoNum})')
                        count += 1
                except Exception as e:
                    print(f"Failed to process {file_path}: {e}")

    # Commit changes and close connections
    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    main()

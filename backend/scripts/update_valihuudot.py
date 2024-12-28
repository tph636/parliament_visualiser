import os
import re
from db_util import connectToDb
from datetime import date
from extractVälihuudot import extract_välihuudot
from välihuuto import Välihuuto

# Connect to the database
conn, cursor = connectToDb()

# Create the table if it does not exist
# Jos henkilö huutaa saman huudon esimerkiksi kaksi kertaa päivässä niin huutoNum erottaa kyseiset huudot
cursor.execute('''CREATE TABLE IF NOT EXISTS valihuudot (
               firstname TEXT,
               lastname TEXT,
               valihuuto TEXT,
               ptk_num INTEGER,
               date TEXT,
               huuto_num INTEGER,
               PRIMARY KEY (firstname, lastname, valihuuto, date, huuto_num)
)
''')

# Define the documents folder
folder = 'documents/2024'

# Regular expression to match the filenames
pattern = re.compile(r'PTK-(\d+)\+2024-vp\.pdf')

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
                        INSERT INTO valihuudot (firstname, lastname, valihuuto, ptk_num, date, huuto_num) 
                        VALUES (%s, %s, %s, %s, %s, %s)
                        ON CONFLICT (firstname, lastname, valihuuto, date, huuto_num) DO NOTHING
                    ''', (huuto.firstName, huuto.lastName, huuto.huuto, currentPtkNum, huuto.date, huuto.huutoNum))
                    print(f'{huuto.firstName} {huuto.lastName}: {huuto.huuto} PTK({currentPtkNum}) {huuto.date} (Huuto #{huuto.huutoNum})')
            except Exception as e:
                print(f"Failed to process {file_path}: {e}")

# Commit the changes and close the connection
conn.commit()
conn.close()

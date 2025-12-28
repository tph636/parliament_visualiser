import os
import re
from db_ops.db_util import connectToDb
from db_ops.extract_speeches import extract_speeches

def main(args=None):

    conn, cursor = connectToDb()

    # Create the table if it does not exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS speeches (
            id SERIAL PRIMARY KEY,
            timestamp TEXT NOT NULL,
            firstname TEXT NOT NULL,
            lastname TEXT NOT NULL,
            content TEXT NOT NULL,
            date DATE NOT NULL,
            ptk_num SMALLINT NOT NULL,
            search_vector tsvector
        )
    ''')
    conn.commit()

    # Create GIN index for fast full‑text search
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS speeches_search_idx
        ON speeches
        USING GIN (search_vector);
    ''')
    conn.commit()

    # Create trigger function for auto‑updating search_vector
    cursor.execute('''
        CREATE OR REPLACE FUNCTION speeches_search_vector_update()
        RETURNS trigger AS $$
        BEGIN
            NEW.search_vector :=
                to_tsvector('finnish', NEW.content);
            RETURN NEW;
        END
        $$ LANGUAGE plpgsql;
    ''')
    conn.commit()

    # Create trigger
    cursor.execute('''
        CREATE TRIGGER tsvectorupdate
        BEFORE INSERT OR UPDATE ON speeches
        FOR EACH ROW EXECUTE FUNCTION speeches_search_vector_update();
    ''')
    conn.commit()

    folder = './assets/documents/2025'

    # Regular expression to match the filenames
    pattern = re.compile(r'PTK-(\d+)\+2025-vp\.pdf')

    # Count the amount of items added (Useful for debugging)
    count = 1

    # Process files in the documents folder
    for filename in os.listdir(folder):
        match = pattern.match(filename)

        if match:
            currentPtkNum = int(match.group(1))
            file_path = os.path.join(folder, filename)

            print(f"Processing: {file_path}")

            try:
                speeches = extract_speeches(file_path)

                for speech in speeches:
                    cursor.execute('''
                        INSERT INTO speeches (
                            timestamp, firstname, lastname, content, date, ptk_num
                        )
                        VALUES (%s, %s, %s, %s, to_date(%s, 'DD.MM.YYYY'), %s)
                    ''', (
                        speech.timestamp,
                        speech.firstname,
                        speech.lastname,
                        speech.content,
                        speech.date,
                        currentPtkNum
                    ))

                    print(f"{count}. {speech.date} {speech.firstname} {speech.lastname} {speech.content[:30]}")
                    count += 1

            except Exception as e:
                print(f"Failed to process {file_path}: {e}")

    # Backfill search_vector for any rows inserted before trigger existed
    cursor.execute('''
        UPDATE speeches
        SET search_vector = to_tsvector('finnish', content)
        WHERE search_vector IS NULL;
    ''')
    conn.commit()

    cursor.close()
    conn.close()

    print("\nDone! All speeches processed.")

if __name__ == "__main__":
    main()

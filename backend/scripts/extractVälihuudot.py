import fitz
import re
from välihuuto import Välihuuto

# TODO: Jos henkilöllä on kaksiosainen sukunimi esim. Miapetra Kumpula-Natri ja pdf:ssä
# sukunimi on jaettu kahdelle eri riville niin sukunimestä tulee KumpulaNatri.
# Sama ongelma on etunimillä.

def extract_välihuudot(file):
    doc = fitz.open(stream=file.read(), filetype="pdf")

    # Regular expression to find lines that start with a full name followed by a double colon and end with a sentence all encapsulated in square brackets
    huuto_pattern = re.compile(r'\[([^\[\]]+)\]')
    
    # Regular expression to find the first date in the form d.m.y
    date_pattern = re.compile(r'\b(\d{1,2}\.\d{1,2}\.\d{4})\b')

    välihuudot = []
    first_date = None

    # Dictionary to track the number of occurrences of each huuto for each person
    huuto_count = {}

    for page in doc:
        text = page.get_text()

        # Find the date of the document
        if first_date is None:
            date_match = date_pattern.search(text)
            if date_match:
                first_date = date_match.group(1)

        # All text inside square brackets eg. [Ben Zyskowicz: Höpö höpö!], [Puhemies koputtaa] and remove newline
        in_square_brackets = list(map(lambda n: n.replace('-\n', '').replace('\n', ' '), huuto_pattern.findall(text)))
        
        # Include only sentences where someone is speaking eg. [Ben Zyskowicz: Höpö höpö!], [Sosiaalidemokraat- tien ryhmästä: Ja lausumia!]
        speakingNotSplit = [huuto for huuto in in_square_brackets if ": " in huuto]
        
        # Split sentences where two people are speaking eg. [Ben Zyskowicz: Höpö höpö! - Krista Kiuru: Kyllä!]
        speaking = []
        for i in speakingNotSplit:
            if " — " in i:
                parts = i.split(" — ")
                speaking.extend(parts)
            else:
                speaking.append(i)

        # Regular expression pattern to match Finnish names followed by ": "
        pattern = re.compile(r"^[A-ZÅÄÖ][a-zA-ZäöåÄÖÅ]*[-]?[A-ZÄÖÅ]?[a-zA-ZäöåÄÖÅ]* [A-ZÅÄÖ][a-zA-ZäöåÄÖÅ]*[-]?[A-ZÄÖÅ]?[a-zA-ZäöåÄÖÅ]*: ")
        matches = [s for s in speaking if pattern.match(s)]

        for match in matches:

            full_name, sentence = match.split(": ", 1)

            firstName, lastName = full_name.split(' ', 1)

            # Track the number of occurrences of this huuto for this person
            if full_name not in huuto_count:
                huuto_count[full_name] = {}
            if sentence not in huuto_count[full_name]:
                huuto_count[full_name][sentence] = 0
            huuto_count[full_name][sentence] += 1
            huutoNum = huuto_count[full_name][sentence]

            välihuudot.append(Välihuuto(firstName, lastName, sentence, first_date, huutoNum))
    
    return välihuudot

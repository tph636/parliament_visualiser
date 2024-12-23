import fitz
import re
from välihuuto import Välihuuto

def extract_välihuudot(file):
    doc = fitz.open(stream=file.read(), filetype="pdf")

    # Regular expression to find lines that start with a full name followed by a double colon and end with a sentence all encapsulated in square brackets
    huuto_pattern = re.compile(r'\[([A-ZÄÖ][a-zäö]+\s[A-ZÄÖ][a-zäö]+):\s(.*?)\]')
    
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

        matches = huuto_pattern.findall(text)
        
        for match in matches:
            full_name, sentence = match

            # Remove newlines from the sentence
            full_name = full_name.replace('\n', ' ')
            sentence = sentence.replace('\n', ' ')
            
            # Split full name into first name and last name
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

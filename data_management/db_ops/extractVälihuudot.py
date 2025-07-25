import fitz
import re
from db_ops.välihuuto import Välihuuto

def extract_välihuudot(file):
    doc = fitz.open(stream=file.read(), filetype="pdf")

    # Regular expression to find the first date in the form d.m.y
    date_pattern = re.compile(r'\b(\d{1,2}\.\d{1,2}\.\d{4})\b')

    välihuudot = []
    first_date = None
    huuto_count = {}

    for page in doc:
        text = page.get_text()

        # Find the date of the document
        if first_date is None:
            date_match = date_pattern.search(text)
            if date_match:
                first_date = date_match.group(1)

        # 1. Extract all bracketed sections
        brackets = re.findall(r'\[([^\[\]]+)\]', text, re.DOTALL)

        for bracket in brackets:
            # 2. Clean up hyphenated names split across lines (regex replacement)
            bracket = re.sub(r'([A-ZÄÖÅ][a-zäöå]*-)\n([A-ZÄÖÅ][a-zäöå]*)', r'\1\2', bracket)
            # 3. Remove hyphen+newline and replace newlines with space (regex replacement)
            bracket = re.sub(r'-\n', '', bracket)
            bracket = re.sub(r'\n', ' ', bracket)
            # 4. Split multiple speakers (regex split)
            speakers = re.split(r'\s—\s', bracket)
            for speaker in speakers:
                # 5. Match name and sentence (regex match)
                # Require both first and last name, each starting with a capital letter
                m = re.match(r'^([A-ZÅÄÖ][a-zA-ZäöåÄÖÅ\-]+\s[A-ZÅÄÖ][a-zA-ZäöåÄÖÅ\-]+): (.+)$', speaker)
                if m:
                    name, sentence = m.groups()
                    name = re.sub(r'\s+', ' ', name).strip()  # Clean up extra spaces
                    # Try to split name into first and last (regex split)
                    name_parts = re.split(r'\s+', name, maxsplit=1)
                    if len(name_parts) == 2:
                        firstName, lastName = name_parts
                        # Track the number of occurrences of this huuto for this person
                        full_name = f"{firstName} {lastName}".strip()
                        if full_name not in huuto_count:
                            huuto_count[full_name] = {}
                        if sentence not in huuto_count[full_name]:
                            huuto_count[full_name][sentence] = 0
                        huuto_count[full_name][sentence] += 1
                        huutoNum = huuto_count[full_name][sentence]
                        välihuudot.append(Välihuuto(firstName, lastName, sentence.strip(), first_date, huutoNum))
    return välihuudot

import fitz
import re

class Speech:
    def __init__(self, timestamp, firstname, lastname, content, date):
        self.timestamp = timestamp
        self.firstname = firstname
        self.lastname = lastname
        self.content = content
        self.date = date

    def __repr__(self):
        return f"[{self.date} {self.timestamp}] {self.firstname} {self.lastname}: {self.content[:60]}..."


def clean_speech_content(content):
    """Removes PTK pattern, square brackets content, and fixes hyphenated words in speech content."""
    content = re.sub(r'(\w+)-\s+(\w+)', r'\1\2', content)
    content = re.sub(r'\[.*?\]', '', content)
    ptk_pattern = re.compile(r'Pöytäkirja PTK \d{1,3}/\d{4} vp')
    content = ptk_pattern.sub('', content)
    return ' '.join(content.split())


def extract_speeches(file_path):
    doc = fitz.open(file_path)

    # Detect date (same logic as välihuudot)
    date_pattern = re.compile(r'\b(\d{1,2}\.\d{1,2}\.\d{4})\b')
    first_date = None

    full_text = ""

    for page in doc:
        text = page.get_text()
        full_text += text

        if first_date is None:
            m = date_pattern.search(text)
            if m:
                first_date = m.group(1)


    # Fix hyphenated words globally
    full_text = re.sub(r'(\w+)-\s+(\w+)', r'\1\2', full_text)

    # Speech pattern
    speech_pattern = re.compile(
        r'(\d{1,2}\.\d{1,2})\s+([^\n:]+):\s*(.*?)(?=\n\d{1,2}\.\d{1,2}|\n(?:Yleiskeskustelu|Keskustelu) päättyi|\n(?:Ensimmäinen|Toinen) varapuhemies|\nPuhemies)',
        re.DOTALL
    )

    speeches = []

    for match in speech_pattern.finditer(full_text):
        timestamp = match.group(1)

        speaker = match.group(2).strip()
        speaker = match.group(2).strip()

        # 1) Remove parentheses like "(vastauspuheenvuoro)"
        speaker = re.sub(r'\(.*?\)', '', speaker).strip()

        # 2) Remove trailing party tag like "sd" / "kok" / "ps" (1–4 lowercase letters)
        speaker = re.sub(r'\s+[a-zåäö]{1,4}$', '', speaker).strip()

        # 3) Take the LAST two capitalized words before end of string
        name_pattern = re.compile(
            r'([A-ZÅÄÖ][a-zA-ZåäöÅÄÖ\-]+)\s+([A-ZÅÄÖ][a-zA-ZåäöÅÄÖ\-]+)\s*$'
        )

        m = name_pattern.search(speaker)

        if m:
            firstname = m.group(1)
            lastname = m.group(2)
        else:
            firstname = speaker
            lastname = ""


        content = match.group(3).strip()
        content = ' '.join(content.split())
        content = clean_speech_content(content)
        
        speeches.append(
            Speech(
                timestamp=timestamp,
                firstname=firstname,
                lastname=lastname,
                content=content,
                date=first_date
            )
        )

    return speeches
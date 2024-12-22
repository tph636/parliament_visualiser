import fitz
import re

# 'https://www.eduskunta.fi/FI/vaski/Poytakirja/Documents/PTK_90+2024.pdf'

def extract_välihuudot(file):

    doc = fitz.open(file)

    # Regular expression to find lines that start with a full name followed by a double colon and end with a sentence all encapsulated in square brackets
    pattern = re.compile(r'\[([A-ZÄÖ][a-zäö]+\s[A-ZÄÖ][a-zäö]+):\s(.*?)\]')

    välihuudot = {}

    for page in doc:
        text = page.get_text()

        matches = pattern.findall(text)
        
        for match in matches:
            full_name, sentence = match

            # Remove newlines from the sentence
            full_name = full_name.replace('\n', ' ')
            sentence = sentence.replace('\n', ' ')
            
            if full_name in välihuudot:
                välihuudot[full_name].append(sentence)
            else:
                välihuudot[full_name] = [sentence]

    return välihuudot
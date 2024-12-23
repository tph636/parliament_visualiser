import requests
import os
import re

def get_latest_downloaded_number(folder):
    pattern = re.compile(r'PTK-(\d+)\+2024-vp\.pdf')
    max_number = 0
    for filename in os.listdir(folder):
        match = pattern.match(filename)
        if match:
            number = int(match.group(1))
            if number > max_number:
                max_number = number
    return max_number

def download_documents(folder='documents/2024'):
    base_url = 'https://s3-eu-west-1.amazonaws.com/eduskunta-avoindata-documents-prod/vaski%2FPTK-{}%2B2024-vp.pdf'
    
    # Create the folder if it doesn't exist
    if not os.path.exists(folder):
        os.makedirs(folder)
    
    latest_number = get_latest_downloaded_number(folder)
    startNum = latest_number + 1
    
    while True:
        url = base_url.format(startNum)
        response = requests.get(url)
        
        if response.status_code == 200:
            file_path = os.path.join(folder, f'PTK-{startNum}+2024-vp.pdf')
            with open(file_path, 'wb') as file:
                file.write(response.content)
            print(f'Downloaded: {file_path}')
            startNum += 1
        else:
            print(f'Failed to download: PTK-{startNum}+2024-vp.pdf (Status code: {response.status_code})')
            break  # Stop downloading if a file fails to download

if __name__ == "__main__":
    download_documents()

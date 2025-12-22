import requests
import os
import re

def get_latest_downloaded_number(folder):
    pattern = re.compile(r'PTK-(\d+)\+2025-vp\.pdf')
    max_number = 0
    for filename in os.listdir(folder):
        match = pattern.match(filename)
        if match:
            number = int(match.group(1))
            if number > max_number:
                max_number = number
    return max_number

def main(args=None):

    folder = './assets/documents/2025'
    base_url = 'https://s3-eu-west-1.amazonaws.com/eduskunta-avoindata-documents-prod/vaski%2FPTK-{}%2B2025-vp.pdf'
    
    if not os.path.exists(folder):
        os.makedirs(folder)
    
    latest_number = get_latest_downloaded_number(folder)
    startNum = latest_number + 1
        
    while True:
        url = base_url.format(startNum)
        response = requests.get(url)
        
        if response.status_code == 200:
            file_path = os.path.join(folder, f'PTK-{startNum}+2025-vp.pdf')
            with open(file_path, 'wb') as file:
                file.write(response.content)
            print(f'Downloaded: {file_path}')
            startNum += 1
        else:
            print(f'FINISHED DOWNLOADING. Failed to download: PTK-{startNum}+2025-vp.pdf (Status code: {response.status_code}), this is likely unimportant if PTK number is not 1.')
            break

if __name__ == "__main__":
    main()

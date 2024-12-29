import os
import requests
from PIL import Image
from io import BytesIO
from db_util import connectToDb

# Connect to the database
conn, cursor = connectToDb()

# Create directories if they don't exist
os.makedirs('./images/high-res', exist_ok=True)
os.makedirs('./images/low-res', exist_ok=True)

# Fetch image names from the database
cursor.execute('SELECT image FROM seating_of_parliament')
images = cursor.fetchall()

# Base URL for images
base_url = "https://avoindata.eduskunta.fi/attachment/member/pictures/"

# Function to download and save images
def download_and_resize_images(image_name):
    try:
        # Download image
        response = requests.get(base_url + image_name)
        response.raise_for_status()  # Check for request errors
        img = Image.open(BytesIO(response.content))

        # Save high-res image
        high_res_path = f"./images/high-res/{image_name}"
        img.save(high_res_path)

        # Resize image to 70px wide using LANCZOS filter
        low_res_path = f"./images/low-res/{image_name}"
        img = img.resize((70, int((70 / img.width) * img.height)), Image.LANCZOS)
        img.save(low_res_path)

        print(f"Downloaded and resized {image_name}")

    except Exception as e:
        print(f"Failed to download {image_name}: {e}")

# Process each image
for (image_name,) in images:
    download_and_resize_images(image_name)

# Close the database connection
cursor.close()
conn.close()

import os
import requests
from PIL import Image
from io import BytesIO
from db_ops.db_util import connectToDb

# Base URL for images
base_url = "https://avoindata.eduskunta.fi/attachment/member/pictures/"

def download_and_resize_images(image_name):
    try:
        # Download image
        response = requests.get(base_url + image_name)
        response.raise_for_status()
        img = Image.open(BytesIO(response.content))

        # Save high-res image
        high_res_path = f"./assets/images/high-res/{image_name}"
        img.save(high_res_path)

        # Resize and save low-res image
        low_res_path = f"./assets/images/low-res/{image_name}"
        img = img.resize((70, int((70 / img.width) * img.height)), Image.LANCZOS)
        img.save(low_res_path)

        print(f"Downloaded and resized {image_name}")

    except Exception as e:
        print(f"Failed to download {image_name}: {e}")

def main(args=None):
    print("Downloading member images")

    # Connect to the database
    conn, cursor = connectToDb()

    # Create directories
    os.makedirs('./assets/images/high-res', exist_ok=True)
    os.makedirs('./assets/images/low-res', exist_ok=True)

    # Fetch image names from the database
    cursor.execute('SELECT image FROM seating_of_parliament')
    images = cursor.fetchall()

    # Download and resize images
    for (image_name,) in images:
        download_and_resize_images(image_name)

    # Clean up
    cursor.close()
    conn.close()

if __name__ == "__main__":
    main()

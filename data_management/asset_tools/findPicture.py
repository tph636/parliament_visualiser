import os

# Get the script's current directory
script_dir = os.path.dirname(os.path.abspath(__file__))

# Paths to images
fullResDir = os.path.join(script_dir, '..', 'pictures', 'memberImages')
tinyPicDir = os.path.join(script_dir, '..', 'pictures', 'tinyMemberImages')

def findMemberPicture(hetekaId, fullRes):
    if fullRes:
        search_dir = fullResDir
    else:
        search_dir = tinyPicDir

    # Iterate through files in the directory
    for root, dirs, files in os.walk(search_dir):
        for file in files:
            # Check if the file name contains the hetekaId and ends with .jpg
            if '-' + str(hetekaId) + '.jpg' in file:
                # Return the relative path from the backend directory
                #relative_path = os.path.relpath(os.path.join(root, file), script_dir)
                return file
    
    return None


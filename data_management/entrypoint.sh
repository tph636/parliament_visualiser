#!/bin/bash
set -e

# Paths to check
PDF_DIR="/app/assets/documents/2024"
IMG_DIR="/app/assets/images"

# Ensure necessary directories exist
mkdir -p "$PDF_DIR"
mkdir -p "$IMG_DIR"

# Check for PDFs
if [ ! -d "$PDF_DIR" ] || [ -z "$(ls -A $PDF_DIR 2>/dev/null)" ]; then
    NEED_INIT=1
fi

# Check for images
if [ ! -d "$IMG_DIR" ] || [ -z "$(ls -A $IMG_DIR 2>/dev/null)" ]; then
    NEED_INIT=1
fi

# Wait for postgres to start
sleep 10

# Check for database tables (example: check for 'valihuudot' table)
TABLE_EXISTS=$(python check_db_initialized.py)
if [ "$TABLE_EXISTS" != "1" ]; then
    NEED_INIT=1
fi

if [ "$NEED_INIT" = "1" ]; then
    echo "Initializing data..."
    python main.py download_documents_2024
    python main.py update_seating_of_parliament
    python main.py update_member_of_parliament
    python main.py update_valihuudot
    python main.py download_images
else
    echo "Data already initialized. Skipping initialization."
fi

# Start cron and keep container running
cron
exec tail -f /dev/null
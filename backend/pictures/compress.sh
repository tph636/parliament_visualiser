#!/bin/bash

# Check if the input directory and output directory are provided
if [ $# -ne 2 ]; then
  echo "Usage: $0 input_directory output_directory"
  exit 1
fi

INPUT_DIR=$1
OUTPUT_DIR=$2

# Create the output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Loop through all images in the input directory
for img in "$INPUT_DIR"/*.{jpg,jpeg,png,gif}; do
  # Get the filename without the path
  filename=$(basename "$img")
  
  # Resize and crop the image to 50x50 pixels
  convert "$img" -resize 50x50^ -gravity center -extent 50x50 "$OUTPUT_DIR/$filename"
done

echo "Images resized and saved to $OUTPUT_DIR"

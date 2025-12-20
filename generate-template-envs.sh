#!/bin/bash

set -e

ENV_DIR="./env"
TEMPLATE_DIR="./env/templates"

mkdir -p "$ENV_DIR"

# Prompt user for credentials
read -p "Enter development database username: " DEV_DB_USER
read -s -p "Enter development database password: " DEV_DB_PASSWORD
echo ""
read -p "Enter production database username: " PROD_DB_USER
read -s -p "Enter production database password: " PROD_DB_PASSWORD
echo ""

# Default values for dev
DEV_VALUES=(
  "BACKEND_PORT=3000"
  "FRONTEND_PORT=3001"
  "ENVIRONMENT=development"
  "NODE_ENV=development"
  "POSTGRES_DB=parliament"
  "POSTGRES_USER=$DEV_DB_USER"
  "POSTGRES_PASSWORD=$DEV_DB_PASSWORD"
  "POSTGRES_HOST=postgres"
  "POSTGRES_PORT=5432"
  "VITE_BACKEND_API_URL=http://localhost:3000"
  "INTERNAL_BACKEND_API_URL=http://backend:3000"
)

# Default values for prod
PROD_VALUES=(
  "BACKEND_PORT=3000"
  "FRONTEND_PORT=3001"
  "ENVIRONMENT=production"
  "NODE_ENV=production"
  "POSTGRES_DB=parliament"
  "POSTGRES_USER=$PROD_DB_USER"
  "POSTGRES_PASSWORD=$PROD_DB_PASSWORD"
  "POSTGRES_HOST=postgres"
  "POSTGRES_PORT=5432"
  "VITE_BACKEND_API_URL="
  "INTERNAL_BACKEND_API_URL=http://backend:3000"
)

generate_env_file() {
  template=$1
  output=$2
  shift 2
  values=("$@")

  content=$(cat "$template")

  for pair in "${values[@]}"; do
    key="${pair%%=*}"
    value="${pair#*=}"
    content="${content//\{\{$key\}\}/$value}"
  done

  echo "$content" > "$output"
  echo "Generated $output"
}

# Generate dev envs
generate_env_file "$TEMPLATE_DIR/backend.env.template" "$ENV_DIR/backend.dev.env" "${DEV_VALUES[@]}"
generate_env_file "$TEMPLATE_DIR/frontend.env.template" "$ENV_DIR/frontend.dev.env" "${DEV_VALUES[@]}"
generate_env_file "$TEMPLATE_DIR/datamanagement.env.template" "$ENV_DIR/datamanagement.dev.env" "${DEV_VALUES[@]}"

# Generate prod envs
generate_env_file "$TEMPLATE_DIR/backend.env.template" "$ENV_DIR/backend.prod.env" "${PROD_VALUES[@]}"
generate_env_file "$TEMPLATE_DIR/frontend.env.template" "$ENV_DIR/frontend.prod.env" "${PROD_VALUES[@]}"
generate_env_file "$TEMPLATE_DIR/datamanagement.env.template" "$ENV_DIR/datamanagement.prod.env" "${PROD_VALUES[@]}"

echo "Environment files have been generated."

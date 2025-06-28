# Docker Setup Guide

This guide will help you set up and use the Docker environment for this project.


## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)


## Setup Instructions


1. **Clone the Repository:**

   ```bash
   git clone git@github.com:kar4nka/parliament_visualiser.git
   ```


2. **Create Environment Files:**

   You need to create two environment files in project root: `.env.dev` and `.env.prod`. These files will contain environment-specific variables.

- **`.env.dev`** (Development environment):

  ```plaintext
  # Postgres variables used by the Postgres image
  POSTGRES_USER=postgres
  POSTGRES_PASSWORD=securepassword
  POSTGRES_DB=project_db

  # Postgres variables used by backend and data_management
  DB_HOST=postgres
  DB_USER=postgres
  DB_PASSWORD=securepassword
  DB_NAME=project_db
  DB_PORT=5432

  # Express backend
  BACKEND_PORT=3000

  # Remix app
  FRONTEND_PORT=3001
  VITE_BACKEND_API_URL=http://localhost:3000
  INTERNAL_BACKEND_API_URL=http://backend:3000
  ```

- **`.env.prod`** (Production environment):

  ```plaintext
  # Postgres variables used by the Postgres image
  POSTGRES_USER=postgres
  POSTGRES_PASSWORD=securepassword
  POSTGRES_DB=project_db

  # Postgres variables used by backend and data_management
  DB_HOST=postgres
  DB_USER=postgres
  DB_PASSWORD=securepassword
  DB_NAME=project_db
  DB_PORT=5432

  # Express backend
  BACKEND_PORT=3000

  # Remix app
  FRONTEND_PORT=3001
  VITE_BACKEND_API_URL=http://localhost:3000
  INTERNAL_BACKEND_API_URL=http://backend:3000
  ```

   Replace the placeholder values with your actual configuration.

3. **Build and Start the Containers:**

   To build and start the containers in a development environment, use the following command:

   ```bash
   docker compose --env-file .env.dev -f compose.yaml -f compose.dev.yaml up --build -d
   ```
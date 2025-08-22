TODO: 
* Do not download duplicate images if download_images.py is ran twice
* Fix image width of cards for different party members

# Docker Setup Guide

This guide will help you set up and use the Docker environment for this project.


## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)


## Setup and Usage Instructions


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
  VITE_BACKEND_API_URL=
  INTERNAL_BACKEND_API_URL=http://backend:3000
  ```

   Replace the placeholder values with your actual configuration.

3. **Build and Start the Containers:**

   Build and start development:

   ```bash
   docker compose --env-file .env.dev -f compose.yaml -f compose.dev.yaml up --build -d
   ```

   Build and start production:

   ```bash
   docker compose --env-file .env.prod -f compose.yaml -f compose.prod.yaml up --build -d
   ```


4. **Temporarily Stop and Start Containers (used in production to disable access to the site)**

   Stop production:

   ```bash
   docker compose --env-file .env.prod -f compose.yaml -f compose.prod.yaml stop
   ```

   Start production:

   ```bash
   docker compose --env-file .env.prod -f compose.yaml -f compose.prod.yaml start
   ```

5. **Completely delete the containers and their volumes and networks**

   ```bash
   docker compose down --volumes --rmi all --remove-orphans
   docker volume rm $(docker volume ls -q | grep '_postgres_data$')
   ```

   After build as normal
   
5. **Additional information**

   Ports can be disabled on the system; docker will automatically open ports when the containers are started

   Purge all containers:
    docker stop $(docker ps -aq) && \
    docker rm -f $(docker ps -aq) && \
    docker system prune -a --volumes -f


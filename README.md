TODO: 
* Puolueiden omat tilastot
* Kansanedustajien pitämät puheet ja keyword search

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
   ```bash
   chmod -x generate-template-envs.sh
   ./generate-template-envs.sh
   ```
   
3. **Build and Start the Containers:**

   Build and start development:

   ```bash
   docker compose -f compose.dev.yaml up --build -d
   ```

   Build and start production:

   ```bash
   docker compose -f compose.prod.yaml up --build -d
   ```


4. **Wait for the setup/download**

   You can follow the initialization via logs:

   ```bash
   docker logs <data_management container name>
   ```

5. **Connect to the site**

   Development environment:

   ```bash
   localhost:3001
   ```

   Production environment:
   
   ```bash
   <site IP/domain>
   ```


6. **Completely delete the containers and their volumes and networks**

   ```bash
   docker compose down --volumes --rmi all --remove-orphans
   docker volume rm $(docker volume ls -q | grep '_postgres_data$')
   ```

   After build as normal
 
 


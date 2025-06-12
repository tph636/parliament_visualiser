import psycopg2
import os
from dotenv import load_dotenv

# Specify the path to the .env file
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=env_path)

def connectToDb():
    # Define your PostgreSQL database connection parameters
    conn_params = {
        'dbname': os.getenv('DB_NAME'),
        'user': os.getenv('DB_USER'),
        'host': os.getenv('DB_HOST'),
        'port': os.getenv('DB_PORT'),
        'password': os.getenv('DB_PASSWORD')
    }
    
    # Establish the connection
    conn = psycopg2.connect(**conn_params)
    cursor = conn.cursor()
    return conn, cursor

import os
from pathlib import Path
from dotenv import load_dotenv
import psycopg2

# Only load .env in development
if os.getenv("PYTHON_ENV", "development") == "development":
    env_path = Path(__file__).resolve().parents[2] / ".env"
    load_dotenv(dotenv_path=env_path)

def connectToDb():
    conn_params = {
        "dbname": os.getenv("DB_NAME"),
        "user": os.getenv("DB_USER"),
        "host": os.getenv("DB_HOST"),
        "port": os.getenv("DB_PORT"),
        "password": os.getenv("DB_PASSWORD")
    }

    conn = psycopg2.connect(**conn_params)
    cursor = conn.cursor()
    return conn, cursor

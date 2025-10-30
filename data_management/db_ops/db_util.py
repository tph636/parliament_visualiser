import os
from pathlib import Path
from dotenv import load_dotenv
import psycopg2

# Load env from per-folder file: .env.prod when ENVIRONMENT=production else .env.dev
env_name = "prod" if os.getenv("ENVIRONMENT") == "production" else "dev"
env_path = Path(__file__).resolve().parents[1] / f".env.{env_name}"
load_dotenv(dotenv_path=env_path)

def connectToDb():
    conn_params = {
        "dbname": os.getenv("POSTGRES_DB"),
        "user": os.getenv("POSTGRES_USER"),
        "host": os.getenv("POSTGRES_HOST"),
        "port": os.getenv("POSTGRES_PORT"),
        "password": os.getenv("POSTGRES_PASSWORD"),
    }

    conn = psycopg2.connect(**conn_params)
    cursor = conn.cursor()
    return conn, cursor

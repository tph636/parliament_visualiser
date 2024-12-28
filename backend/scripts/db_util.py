import psycopg2
import os

def connectToDb():
    # Define your PostgreSQL database connection parameters
    conn_params = {
        'dbname': 'vhproduction',
        'user': 'tomi',
        'host': 'localhost',
        'port': 5432
    }
    
    # Establish the connection
    conn = psycopg2.connect(**conn_params)
    cursor = conn.cursor()
    return conn, cursor



import sqlite3
import os

def connectToDb():
    db_path = os.path.join(os.path.dirname(__file__), '..', 'databases', 'database.db')
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    return conn, cursor

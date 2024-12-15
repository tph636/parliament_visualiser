import requests
import json
import sqlite3
import os 
from time import sleep
from db_util import connectToDb

conn, cursor = connectToDb()
print(cursor.execute('''SELECT XmlDataFi FROM MemberOfParliament''').fetchall())
conn.close()
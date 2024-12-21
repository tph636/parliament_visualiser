import requests
import json
import sqlite3
import os 
from time import sleep
from db_util import connectToDb

conn, cursor = connectToDb()
#statement = str(cursor.execute('''SELECT XmlDataFi FROM MemberOfParliament WHERE personId=1109''').fetchall()[0])
statement = str(cursor.execute('''SELECT * FROM SeatingOfParliament WHERE lastname="Harkimo"''').fetchall())
print(statement[2:-3])

conn.close()
import requests
import json
import sqlite3
import os 
from time import sleep
from db_util import connectToDb

conn, cursor = connectToDb()
#statement = str(cursor.execute('''SELECT XmlDataFi FROM MemberOfParliament WHERE personId=1109''').fetchall()[0])
#statement = str(cursor.execute('''SELECT * FROM SeatingOfParliament WHERE lastname="Harkimo"''').fetchall())
#cursor.execute('''DROP TABLE valihuudot''').fetchall()
#statement = str(cursor.execute('''SELECT firstname, lastname, COUNT(*) FROM Valihuudot GROUP BY firstname, lastname ORDER BY COUNT(*) DESC''').fetchall())
statement = str(cursor.execute('''Select party, COUNT(*) FROM Valihuudot, SeatingOfParliament WHERE Valihuudot.firstname=SeatingOfParliament.firstname AND Valihuudot.lastname=SeatingOfParliament.lastname GROUP BY party''').fetchall())
print(statement[:])

conn.close()
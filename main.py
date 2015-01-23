from backend import databaseMethods as db
from subprocess import call

#db.fillSnapshotDatabase()

#Exports mongodb to csv, so you don't have to!
call(["mongoexport", "--db", "webdesign", "--collection", "snapshots", "--csv", "--fields", "tables_num,time,url", "--out", "newdata.csv"])

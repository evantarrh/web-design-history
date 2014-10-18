from pymongo import MongoClient
import datetime

client = MongoClient()
db = client.webdesign



#snapshot methods

def addSnapshot(url, time, content):
	snapshot = {"url" : url, "time": timestamp}

	return db.snapshots.insert(snapshot)
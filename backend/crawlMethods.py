import Queue
from databaseMethods import db
from pymongo import MongoClient
from HTMLParser import HTMLParser

# create a subclass and override the handler methods
class MyHTMLParser(HTMLParser):
	def __init__(self, url, time):
		HTMLParser.__init__(self)
		self.url = url
		self.time = time

	def handle_starttag(self, tag, attrs):
		if tag == "link":
			print "found link"
			for attr in attrs:
				print (db.snapshots.update({"url": self.url, "time": self.time}, { "$addToSet": {"links" : attr}}))
				print attr
		if tag == "table":
			print "found table....lol"
			for attr in attrs:
				print (db.snapshots.update({"url": self.url, "time": self.time}, { "$inc": {"tables_num" : 1}}))

def addLinks():
	all_snapshots = db.snapshots.find()
	for single_snapshot in all_snapshots:
		if single_snapshot.get('content') is not None:
			parser = MyHTMLParser(single_snapshot['url'], single_snapshot['time'])
			tmpstring = ""
			tmpstring += single_snapshot.get('content')
			parser.feed(tmpstring)
from pymongo import MongoClient
import requests
from websites import sites
from HTMLParser import HTMLParser
from pymongo.son_manipulator import SONManipulator

client = MongoClient()
db = client.webdesign

# create a subclass and override the handler methods
class MyHTMLParser(HTMLParser):
	def __init__(self, url, time):
		HTMLParser.__init__(self)
		self.url = url
		self.time = time

	def handle_starttag(self, tag, attrs):
		if tag == "link":
			for attr in attrs:
				print "found a link: " + str(attr)
				#db.snapshots.update({"url": self.url, "time": self.time}, { "$addToSet": {"links" : attr}})
		if tag == "table":
			for attr in attrs:
				db.snapshots.update({"url": self.url, "time": self.time}, { "$inc": {"tables_num" : 1}})

"""
class ObjectIdManipulator(SONManipulator):
    def transform_incoming(self, son, collection):
        son['$id'] = str(son['$id'])      
        return son

db.add_son_manipulator(ObjectIdManipulator())
"""

#def get_snapshot(q, site, timestamp):
def get_snapshot(site, timestamp):
	resp = requests.get('https://archive.org/wayback/available?url=' + site + '&timestamp=' + str(timestamp))
	
	resp_dict = resp.json()

	archive = resp_dict.get("archived_snapshots").get("closest")
	if archive is not None:
		new_url = archive.get("url")
		new_text = requests.get(new_url).text
		new_time = archive.get("timestamp")
		#time_str = "{\"time\": \"" + new_time + "\"}"
		time_dict = {'time': str(new_time)}
		print time_dict
		#only add snapshot to db if snapshots doesn't already contain an item with this timestamp
		#(this is to prevent duplicates)
		if db.snapshots.find_one(time_dict) is None:
			snapshot = {"url" : site, "time": new_time, "links": [], "tables_num": 0}
			snapshot_id = db.snapshots.insert(snapshot)
			getStats(new_text, site, new_time)


def fillSnapshotDatabase():

	for site in sites:
		timestamp = 20000101000000
		
		# range should be (0, 120) for 10 years
		for x in range(0, 4):
			if (x + 1) % 12 == 0:
				timestamp = timestamp + 9200000000
				get_snapshot(site, timestamp)
			elif (x + 1) % 4 == 0:
				timestamp = timestamp + 400000000
				get_snapshot(site, timestamp)


def getStats(plainHtml, snapshotUrl, snapshotTime):
	parser = MyHTMLParser(snapshotUrl, snapshotTime)
	parser.feed(plainHtml)

def tmp():
	for x in range (0, 10):
		snap = {"time": 5000}
		time_str = {"time": 5000}
		print time_str
		print db.snapshots.find_one(time_str)
		db.snapshots.insert(snap)
		


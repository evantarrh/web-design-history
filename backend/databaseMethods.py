from pymongo import MongoClient
import requests
from websites import sites
from HTMLParser import HTMLParser

client = MongoClient()
db = client.webdesign

# create a subclass and override the handler methods
class MyHTMLParser(HTMLParser):
	def __init__(self, url, time):
		HTMLParser.__init__(self)
		self.url = url
		self.time = time

	def handle_starttag(self, tag, attrs):
		if tag == "h1":
			for attr in attrs:
				print "found a link: " + str(attr)
				#db.snapshots.update({"url": self.url, "time": self.time}, { "$addToSet": {"links" : attr}})
		if tag == "table":
			for attr in attrs:
				print str(attr)
				db.snapshots.update({"url": self.url, "time": self.time}, { "$inc": {"tables_num" : 1}})

def get_snapshot(site, timestamp):
	resp = requests.get('https://archive.org/wayback/available?url=' + site + '&timestamp=' + str(timestamp))
	
	resp_dict = resp.json()

	archive = resp_dict.get("archived_snapshots").get("closest")
	if archive is not None:
		new_url = archive.get("url")
		new_text = requests.get(new_url).text
		new_time = archive.get("timestamp")

		#only add snapshot to db if snapshots doesn't already contain an item with this timestamp
		#(this is to prevent duplicates)
		if db.snapshots.find_one(time_dict) is None:
			snapshot = {"url" : site, "time": new_time, "links": [], "tables_num": 0}
			snapshot_id = db.snapshots.insert(snapshot)
			getStats(new_text, site, new_time)


def fillSnapshotDatabase():

	for site in sites:
		# The starting date (January 1st, 2000 at 00:00:00).
		start_date = 20000101000000
		
		# The number of months after the start date to analyze, e.g. (0, 120) for 10 years
		for x in range(0, 168):
			if (x + 1) % 12 == 0:
				start_date = start_date + 9200000000
				get_snapshot(site, start_date)
			# (x + 1) % 4 looks for three snapshots a year
			elif (x + 1) % 4 == 0:
				start_date = start_date + 400000000
				get_snapshot(site, start_date)


def getStats(plainHtml, snapshotUrl, snapshotTime):
	parser = MyHTMLParser(snapshotUrl, snapshotTime)
	parser.feed(plainHtml)

def tmp():
	get_snapshot("nbcnews.com", 20040327155606)	


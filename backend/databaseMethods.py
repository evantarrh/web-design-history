from pymongo import MongoClient
import requests
from websites import sites
import Queue
import threading
from HTMLParser import HTMLParser

client = MongoClient()
db = client.webdesign

#q = Queue.Queue()

# create a subclass and override the handler methods
class MyHTMLParser(HTMLParser):
	def __init__(self, url, time):
		HTMLParser.__init__(self)
		self.url = url
		self.time = time

	def handle_starttag(self, tag, attrs):
		if tag == "link":
			#print "found link"
			for attr in attrs:
				print (db.snapshots.update({"url": self.url, "time": self.time}, { "$addToSet": {"links" : attr}}))
				print attr
		if tag == "table":
			#print "found table....lol"
			for attr in attrs:
				print (db.snapshots.update({"url": self.url, "time": self.time}, { "$inc": {"tables_num" : 1}}))


#def get_snapshot(q, site, timestamp):
def get_snapshot(site, timestamp):
	resp = requests.get('https://archive.org/wayback/available?url=' + site + '&timestamp=' + str(timestamp))
	
	resp_dict = resp.json()

	archive = resp_dict.get("archived_snapshots").get("closest")
	if archive is not None:
		new_url = archive.get("url")
		new_text = requests.get(new_url).text
		new_time = archive.get("timestamp")
		snapshot = {"url" : site, "time": new_time, "links": [], "tables_num": 0}
		snapshot_id = db.snapshots.insert(snapshot)
		print "should be getting stats for" + new_url + "at" + new_time + "now"
		getStats(new_text, site, new_time)
		#getting rid of queueing/threading
		#q.put(snapshot_id)


def fillSnapshotDatabase():

	for site in sites:
		timestamp = 20000101
		
		for x in range(0, 2):
			if (x + 1) % 12 == 0:
				timestamp = timestamp + 10000
				#that should probably be 8900 because math (i.e., starting over at the next january)
			else:
				timestamp = timestamp + 100
			get_snapshot(site, timestamp)

			#t = threading.Thread(target=get_snapshot, args=(q, site, timestamp))
			#t.daemon = True
			#t.start()

	#s = q.get()


def getStats(plainHtml, snapshotUrl, snapshotTime):
	parser = MyHTMLParser(snapshotUrl, snapshotTime)
	parser.feed(plainHtml)


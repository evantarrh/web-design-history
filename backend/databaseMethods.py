from pymongo import MongoClient
import datetime
import time
import requests
from websites import sites
import Queue
import threading

client = MongoClient()
db = client.webdesign

q = Queue.Queue()

def get_snapshot(q, site, timestamp):
	resp = requests.get('https://archive.org/wayback/available?url=' + site + '&timestamp=' + str(timestamp))
	#addSnapshot(crawlSnapshot(resp.json()))
	#addSnapshot(resp.json())
	
	resp_dict = resp.json()
	archive = resp_dict.get("archived_snapshots").get("closest")
	if archive is not None:
		new_url = archive.get("url")
		new_text = requests.get(new_url).text
		snapshot = {"url" : site, "time": timestamp, "content": new_text}
		snapshot_id = db.snapshots.insert(snapshot)
		q.put(snapshot_id)


def fillSnapshotDatabase():

    for site in sites:

    	timestamp = 20000101
    	
    	for x in range(0, 2):

    		if (x + 1) % 12 == 0:
    			timestamp = timestamp + 10000
    		else:
    			timestamp = timestamp + 100

			t = threading.Thread(target=get_snapshot, args=(q, site, timestamp))
			t.daemon = True
			t.start()

	s = q.get()
	print s

#def crawlSnapshot()


#snapshot methods

# def addSnapshot(url, time, content):

# 	content = (result of scraping the url)

# 	snapshot = {"url" : url, "time": timestamp, "content": , "num_tables": }

# 	return db.snapshots.insert(snapshot)


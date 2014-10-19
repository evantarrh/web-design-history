from backend import databaseMethods as db
from backend import crawlMethods as crawler

from flask import Flask, render_template, redirect, url_for, session
app = Flask(__name__)
app.config["DEBUG"] = True

@app.route('/')
def hello():
	print "hello"
	db.fillSnapshotDatabase()
	crawler.addLinks()
	print "hello again"
	#db.snapshots.find()

	return render_template("index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0")
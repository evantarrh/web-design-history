from backend import databaseMethods as db

from flask import Flask, render_template, redirect, url_for, session
app = Flask(__name__)
app.config["DEBUG"] = True

@app.route('/')
def hello():
	#db.fillSnapshotDatabase()
	#db.tmp()

	return render_template("index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0")

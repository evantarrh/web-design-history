web-design-history
==================

A history of web design using the Wayback Machine and d3.

### Dependencies
In order to run this, you'll need [MongoDB](http://mongodb.com) and [d3](http://d3js.org).

### Filling the database
1. Run `mongod` from within the directory.
2. While mongo is running, use another shell window to run `main.py` from within the directory.
   * **NOTE: The current dataset takes at least half an hour to run.**
   * To customize what websites you'd like to see, edit `websites.py`.
   * To change the timeframe, edit the `start_date` in `databaseMethods.py`.
3. `main.py` will export the mongo data to CSV.

After this, you'll be good to go. Have fun!

from flask import Flask, request, jsonify
from flask_cors import CORS
from yelp import *

#initilize flask and cors
app = Flask(__name__)
CORS(app)

"""@app.route("/HelloWorld/<name>", methods=["GET"])
def helloworld(name):
    return jsonify({"message":"Hello World", "name": name})
"""

@app.route("/getHalalRestaurant/<location>/<price>", methods=["GET"])
def getHalal(location, price):

    allHalalRestaurants = getHalalFood(location,price)
    return allHalalRestaurants

if __name__ == "__main__": 
    app.run(debug = True)
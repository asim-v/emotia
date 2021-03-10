from flask import Flask,render_template,jsonify,send_from_directory
import firebase_admin
from firebase_admin import credentials
cred = credentials.Certificate("key.json")
firebase_admin.initialize_app(cred)


#Twitter
# Imports from the Tweepy API
import tweepy
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
from tweepy import API
# To check if the file exist
import os.path
# Another imports to parse the json
import json
from urllib3.exceptions import ProtocolError

CON_KEY = "CkulBfQE91jOJBNIuMb1TUbWt"
CON_KEY_SECRET = "aWAm88ju62F7CnK8s7fS5r8eDj6mXGEWnhSMKP5aMJiz5WGVfs"
ACC_TOKEN = "2796790086-9ffNbN5qpRrMd3B6eSKx0dBQhgHk7kEjDLqRAA1"
ACC_TOKEN_SECRET = "wYQzqIaMgSXICG5Zh7FDE3EBgW5R45paax763eTfyxt9E"
# Validate the Credentials
Auth = OAuthHandler(CON_KEY, CON_KEY_SECRET)
# Validate the Acces Tokens
Auth.set_access_token(ACC_TOKEN, ACC_TOKEN_SECRET)
api = tweepy.API(Auth)


app = Flask(__name__)


@app.route('/')
def index():
	return render_template('index.html')

@app.route('/concept/<name>')
def generate_concept_map(name):
	return jsonifiy(name)


##STATIC
@app.route('/js/<path:path>')
def send_js(path):
	return send_from_directory('static/js', path)
@app.route('/images/<path:path>')
def send_img(path):
	return send_from_directory('static/images', path)
@app.route('/css/<path:path>')
def send_css(path):
	return send_from_directory('static/css', path)
@app.route('/fonts/<path:path>')
def send_fonts(path):
	return send_from_directory('static/fonts', path)
@app.route('/favicons/<path:path>')
def send_icons(path):
	return send_from_directory('static/favicons', path)


if __name__ == '__main__':
	app.run('0.0.0.0',debug=True)
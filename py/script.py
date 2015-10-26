from __future__ import print_function
from alchemyapi import AlchemyAPI
import pymongo
# connect to database
connection = pymongo.MongoClient("mongodb://localhost")

import newspaper
from newspaper import Article
from goose import Goose
g = Goose()

alchemyapi = AlchemyAPI() 
db = connection.thesis
segue = db.segue


##		INIT SOURCES
# newYorker_paper = newspaper.build('http://www.newyorker.com/')
# atlantic_paper = newspaper.build('http://www.theatlantic.com/')
# npr_paper = newspaper.build('http://www.npr.org/')
# natGeo_paper = newspaper.build('http://www.nationalgeographic.com/')
# time_paper = newspaper.build('http://time.com/')
# wired_paper = newspaper.build('http://www.wired.com/')
# motherJones_paper = newspaper.build('http://www.motherjones.com/')
# vox_paper = newspaper.build('http://www.vox.com/')
# nyMag_paper = newspaper.build('http://nymag.com/')
# nyTimes_paper = newspaper.build('http://www.nytimes.com/')
# wsj_paper =newspaper.build('http://www.wsj.com/')
# slate_paper = newspaper.build('http://www.slate.com/')
cnn_paper = newspaper.build('http://cnn.com', memoize_articles=False)
# forbes_paper = newspaper.build('http://www.forbes.com/')
# bbc_paper = newspaper.build('http://www.bbc.com/')
# huffPost_paper = newspaper.build('http://www.huffingtonpost.com/')
# nbc_paper = newspaper.build('http://www.nbcnews.com/')
# medium_paper = newspaper.build('https://medium.com/')

# sources = [newYorker, atlantic, npr, natGeo, time, wired, motherJones, vox, nyMag, nyTimes, wsj, slate, cnn, forbes, bbc, huffPost, nbc, medium]

##		CONTENT EXTRACTION
# for source in sources:
# 	for article in source.articles:
# 		print("source: " + article.url)

article_list = cnn_paper.articles
i = 0

while (i < 80):
	articleObj = cnn_paper.articles[i] #finding specific article
	source = cnn_paper.brand
	url = articleObj.url

	articleObj.download()
	articleObj.parse()

	a_articleObj = Article(articleObj.url)
	a_articleObj.download()
	a_articleObj.parse()

	title = a_articleObj.title
	
	g_articleObj = g.extract(url=url)
	description = g_articleObj.meta_description

	#getting text of article
	response = alchemyapi.text('url', url)
	text = ""
	if response['status'] == 'OK':
		text = response['text'].encode('utf-8')
	else:
		print('Error in text extraction call: ', response['statusInfo'])

   	#getting keywords
   	response = alchemyapi.keywords('text', text, {'keywordExtractMode': 'strict', 'maxRetrieve': 15})
	keywords = []
	if response['status'] == 'OK':
		for keyword in response['keywords']:
			# splitting keywords into individual words for easier matching
			if ' ' in keyword['text'].encode('utf-8'):
				splitkey = keyword['text'].encode('utf-8').split()
				for k in splitkey:
					# print(k)
					keywords.append(k)
			else:
				# print(keyword['text'].encode('utf-8'))
				keywords.append(keyword['text'].encode('utf-8'))
	else:
		print('Error in keyword extraction call: ', response['statusInfo'])

	#getting concepts
	response = alchemyapi.concepts('text', text)
	if response['status'] == 'OK':
	    for concept in response['concepts']:
	    	keywords.append(concept['text'])

	else:
	    print('Error in concept tagging call: ', response['statusInfo'])

	articles = {
		'source': source,
		'url': url,
		'title': title,
		'description': description,
		'keywords': keywords
	}

	segue.insert_one(articles)
	print(keywords)

	i = i + 1
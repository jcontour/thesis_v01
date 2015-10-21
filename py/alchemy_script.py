from __future__ import print_function
from alchemyapi import AlchemyAPI
import pymongo
import newspaper
import json

# connect to database
connection = pymongo.MongoClient("mongodb://localhost")
alchemyapi = AlchemyAPI()

# db = connection.test
# alchemyData = db.alchemyData

# cnn_paper = newspaper.build('http://cnn.com', memoize_articles=False) # building source
# url = cnn_paper.articles[1].url	# getting url
url = 'http://www.cnn.com/interactive/2015/08/health/elizabeth-explains-allergies/'

response = alchemyapi.text('url', url)
article_text = ""

if response['status'] == 'OK':
    # print('## Response Object ##')
    # print(json.dumps(response, indent=4))

    # print('')
    # print('## Text ##')
    # print('text: ', response['text'].encode('utf-8'))
    article_text = response['text'].encode('utf-8')
    # print('')
else:
    print('Error in text extraction call: ', response['statusInfo'])


response = alchemyapi.keywords('text', article_text, {'sentiment': 1})
article_keywords = []

if response['status'] == 'OK':
#     print('## Response Object ##')
#     print(json.dumps(response, indent=4))

#     print('')
#     print('## Keywords ##')
    for keyword in response['keywords']:
#         print('text: ', keyword['text'].encode('utf-8'))
        article_keywords.append(keyword['text'].encode('utf-8'))
#         print('relevance: ', keyword['relevance'])
#         print('sentiment: ', keyword['sentiment']['type'])
#         if 'score' in keyword['sentiment']:
#             print('sentiment score: ' + keyword['sentiment']['score'])
#         print('')
else:
    print('Error in keyword extaction call: ', response['statusInfo'])

print(article_text)
print("keywords: ")
print(article_keywords)

#alchemyData.insert_one(articles)
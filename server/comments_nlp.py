# - * - coding: utf - 8 -*-
from os import path
from scipy.misc import imread
import matplotlib.pyplot as plt
import jieba
import pymongo
import numpy as np
import sys
from wordcloud import WordCloud,ImageColorGenerator
from snownlp import SnowNLP
reload(sys)
sys.setdefaultencoding('utf8')
weibo_id = sys.argv[1]
#db连接
mongoclient = pymongo.MongoClient(host='localhost',port = 27017)
db = mongoclient.Weibo_comments
collection = db[weibo_id]

#评论内容获取

textList = list(collection.find({},{'_id':0,'text':1}))
text = []

#DB提取评论
def getTextList():
    for item in textList:
    # text.append(item.text)
        if item[u'text']:
            text.append(item[u'text'])

def snowanalysis(textlist):
    sentimentslist = []
    for li in textlist:
        s = SnowNLP(li)
        # print(li)
        # print(s.sentiments)
        sentimentslist.append(s.sentiments)
    plt.xlabel(u'情感评估值')
    plt.ylabel(u'评论数量/条')
    plt.title(u'评论内容情感分布图')
    plt.hist(sentimentslist,bins=np.arange(0,1,0.02),facecolor='blue',edgecolor='black')
    plt.show()

if __name__=='__main__':
    getTextList()
    snowanalysis(text)
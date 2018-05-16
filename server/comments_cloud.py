# - * - coding: utf - 8 -*-
from os import path
from scipy.misc import imread
import matplotlib.pyplot as plt
import jieba
import pymongo
import sys
from wordcloud import WordCloud,ImageColorGenerator
reload(sys)
sys.setdefaultencoding('utf8')
wordcloud_pic = sys.argv[1]
weibo_id = sys.argv[2]
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
        text.append(item[u'text'])

def wordtocloud(textlist):
    fulltext = ''
    isCN = 1
    back_coloring = imread(wordcloud_pic)
    cloud = WordCloud(font_path='Fonts/zhuohei.ttf', # 若是有中文的话，这句代码必须添加，不然会出现方框，不出现汉字
            background_color="white",  # 背景颜色
            max_words=2000,  # 词云显示的最大词数
            mask=back_coloring,  # 设置背景图片
            max_font_size=100,  # 字体最大值
            random_state=42,
            width=1000, height=860, margin=2,# 设置图片默认的大小,但是如果使用背景图片的话,那么保存的图片大小将会按照其大小保存,margin为词语边缘距离
            )
    for li in textlist:
        fulltext += ' '.join(jieba.cut(li,cut_all = False))
    wc = cloud.generate(fulltext)
    # 从背景图片生成颜色值
    image_colors = ImageColorGenerator(back_coloring)
    # 标题设置
    plt.figure("wordc")
    # plt显示图片
    plt.imshow(wc)
    plt.axis("off")
    plt.show()
    # 保存图片
    wc.to_file(u'simple.png')
    # 绘制词云
    plt.imshow(wc.recolor(color_func=image_colors))
    plt.axis('off')
    # 绘制背景图片为颜色的图片
    plt.figure()
    plt.imshow(back_coloring,cmap=plt.cm.gray)
    plt.axis('off')
    plt.show()
    # 保存图片
    wc.to_file(u'mix.png')

if __name__=='__main__':
    #运行
    getTextList()
    wordtocloud(text)
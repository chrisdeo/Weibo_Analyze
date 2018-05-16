# - * - coding: utf - 8 -*-
import jieba
import json
import pymongo
import numpy as np
import sys   
import re
import copy
import math
from snownlp import SnowNLP
reload(sys) 
sys.setdefaultencoding('utf8')  
#db连接
# mongoclient = pymongo.MongoClient(host='localhost',port = 27017)
# db = mongoclient.Weibo_content
# collection = db.Copy_of_contentFinal
# signCollection = db.signCollection
#评论内容获取

# textList = list(collection.find({},{'_id':0}))
text = sys.argv[1]
text1 = sys.argv[2]

def vectorGenerate(text,text1):
    # text = u'好运说来就来彭于晏的红包中抽到了提供的元礼包靠谱又惊喜快来嗨抢吧彭于晏的红包​​​不要再这样下去一晚一晚的熬想东想西实在是矫情真的该关掉手机断了一些没必要的联系扔掉所有负能量认认真真的生活再去做一些正儿八经的事儿​​​​理由为了你们留下简简单单几个字饱含了多少深情​​​'
    # text1 = u'给大家说句心里话我每天熬夜复盘总结的行情信息都是免费给粉丝的个别人不要总是过来喷我炒股多年白天盯盘晚上复盘现在我的目标就是让支持我的粉丝免费富起来现在准备收一批学生从零学起亲自带不收费老规矩关注我私信回复查看加入股市有风险你们需要个引路人​​​讲股堂掘金进行时海能证券通的一直播下载App​​​发布了头条文章政府工作报告中的机会政府工作报告中的机会​​​讲股堂收盘综述海能证券通的一直播下载App​​​两会期间行情走势基本以维稳为主排名靠前的板块有食品安全航空航天国产芯片工业互联等相对而言工业互联和国产芯片走势持续度较高​​​重磅中共中央关于修改宪法部分内容的建议权威发布点击看全文重磅中共中央关于修改宪法部分内容的建议​​​理由积极拥护党的领导跟着政策走做好投资​​​三月苹果要出新品IPAD与苹果产业链相关的高端制造这块还是要多关注​​​今天中小盘表现不错吗权重搭台小盘起舞才是对绝大多数投资人最有利的走势​​​根均线确定买卖点简单实用图解​​​​'
    # text = u'好运说来就来彭于晏的红包中抽到了提供的元礼包靠谱又惊喜快来嗨抢吧彭于晏的红包​​​不要再这样下去​​​'
    # text1 = u'​​​彭于晏余文乐彭于晏带着家人去旅行成功引起六叔的注意余文乐忍不住打视频电话询问对方到底去哪里了两大男神还分别po出视频截图这真的是情侣视角眼神充满着爱意'
    # r = '[’!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~，。]+'  
    text = re.sub("[\s+\.\!\/_,$%^*(+\"\']+|[+——！，。？、~@#￥%……&*（）]+".decode("utf8"), "".decode("utf8"),text)
    # print text
    text1 = re.sub("[\s+\.\!\/_,$%^*(+\"\']+|[+——！，。？、~@#￥%……&*（）]+".decode("utf8"), "".decode("utf8"),text1)
    # print text1
    text2 = text+text1
    seg_list = jieba.cut(text,cut_all=False)
    seg_list1 = jieba.cut(text1,cut_all=False)
    seg_list2 = jieba.cut(text2,cut_all=False)
    segList = list(seg_list)
    segList1 = list(seg_list1)
    segList2 = list(seg_list2)
    d = {}
    for item in segList2:
        if d.has_key(item):
            pass
        else:
            d[item]=0
    # print json.dumps(d).decode('unicode-escape')
    d1 = copy.copy(d)
    d2 = copy.copy(d)
    for item in segList:
        if d1.has_key(item):
            d1[item]+=1
        else:
            pass
    for item in segList1:
        if d2.has_key(item):
            d2[item]+=1
        else:
            pass
    list_d1 = list(d1.values())
    list_d2 = list(d2.values())
    print list_d1
    print list_d2
    print get_cossimi(list_d1,list_d2)
    print 180/(math.pi/math.acos(get_cossimi(list_d1,list_d2)))
    # print json.dumps(d).decode('unicode-escape')

    # str1 =  ",".join(seg_list)
    # str2 =  ",".join(seg_list1)
    # str3 = ",".join(seg)
    # print str1
    # print str2
    # print str3
    # result = get_cossimi([1,0,2,1,0,0,1],[2,1,2,1,1,0,1])
    # print result

def get_cossimi(x,y):  
    myx=np.array(x)  
    myy=np.array(y)  
    cos1=np.sum(myx*myy)  
    cos21=np.sqrt(sum(myx*myx))  
    cos22=np.sqrt(sum(myy*myy))  
    return cos1/float(cos21*cos22)  

if __name__=='__main__':
    # getSign()
    # textRank(text)
    vectorGenerate(text,text1)
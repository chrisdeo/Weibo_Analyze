# encoding:UTF-8
import sys
import pymongo
import time,re,requests
reload(sys)
sys.setdefaultencoding('utf8')
weibo_id = sys.argv[1]
url='https://m.weibo.cn/api/comments/show?id=' + weibo_id + '&page={}'

headers = {
    'User-agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:55.0) Gecko/20100101 Firefox/55.0',
    'Host' : 'm.weibo.cn',
    'Accept' : 'application/json, text/plain, */*',
    'Accept-Language' : 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
    'Accept-Encoding' : 'gzip, deflate, br',
    'Referer' : 'https://m.weibo.cn/status/' + weibo_id,
    'Cookie' : '_T_WM=e25a28bec35b27c72d37ae2104433873; WEIBOCN_WM=3349; H5_wentry=H5; backURL=http%3A%2F%2Fm.weibo.cn%2F; SUB=_2A250zXayDeThGeVJ7VYV8SnJyTuIHXVUThr6rDV6PUJbkdBeLRDzkW1FrGCo75fsx_qRR822fcI2HoErRQ..; SUHB=0sqRDiYRHXFJdM; SCF=Ag4UgBbd7u4DMdyvdAjGRMgi7lfo6vB4Or8nQI4-9HQ4cLYm_RgdaeTdAH_68X4EbewMK-X4JMj5IQeuQUymxxc.; SSOLoginState=1506346722; M_WEIBOCN_PARAMS=featurecode%3D20000320%26oid%3D3638527344076162%26luicode%3D10000011%26lfid%3D1076031239246050; H5_INDEX=3; H5_INDEX_TITLE=%E8%8A%82cao%E9%85%B1',
    'DNT' : '1',
    'Connection' : 'keep-alive',
    }

i = 0
comment_num = 1
count = 0 
mongoclient = pymongo.MongoClient(host='localhost',port = 27017)
db = mongoclient.Weibo_comments
collection = db[weibo_id]

if collection.find({}).count() > 0:
    collection.remove()

while True:
    r = requests.get(url.format(i),headers = headers)
    if r.status_code == 200 and r.json()['ok'] == 1:
        try:
            dataRes = r.json()['data']
            dataList = dataRes['data']
            for item in dataList:
                comment_id = item['id']
                user_name = item['user']['screen_name']
                user_id = item['user']['id']
                created_at = item['created_at']
                text = re.sub('<.*?>|回复<.*?>:|[\U00010000-\U0010ffff]|[\uD800-\uDBFF][\uDC00-\uDFFF]','',item['text'])
                likenum = item['like_counts']
                source = re.sub('[\U00010000-\U0010ffff]|[\uD800-\uDBFF][\uDC00-\uDFFF]','',item['source'])
                try:
                    collection.insert({
                        'comment_id': comment_id,
                        'user_name': user_name,
                        'user_id': user_id,
                        'text': text,
                        'like_num': likenum,
                        'source': source,
                        'created_at': created_at
                    })                    
                except Exception as e:
                    print(e)
                comment_num+=1
            if i == 100:
                break
            i+=1
            time.sleep(3)        
        except:
            i+=1
            pass
    else:
        break

for _id in collection.distinct('comment_id'):  
    num= collection.count({"comment_id":_id}) 
    for i in range(1,num): 
        collection.remove({"comment_id":_id},0)  

db2 = mongoclient.Weibo_topic
collection2 = db2.topic
collection2.update({'topic_id':str(weibo_id)},{'$set':{'status':1}})
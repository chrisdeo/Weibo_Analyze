import requests
import re,time,pymongo
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By

headers = {
    'User-agent' : 'Mozilla/5.0 (Linux; U; Android 2.3.6; en-us; Nexus S Build/GRK39F) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
    'Host' : 'm.weibo.cn',
    'Accept' : 'application/json, text/plain, */*',
    'Accept-Language' : 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
    'Accept-Encoding' : 'gzip, deflate, br',
    'cookie': '_T_WM=78074593574758328ead23332997dc50; SCF=AncU5PbxpChwFtRCp3dtxRjjlSfwCgf4eO_bHaY1DK-G0TFCnhNn6uLinXy2oCJ2I43EXcAb9PxkRsU57jQq3KQ.; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9WFOCVsMFF91PwDT7miiP3YN5JpX5K-hUgL.Foz4SK5fSh5RSKM2dJLoI0qLxK-L12qLB-2LxKqL1KnLB-qLxKML1h2LB-eLxKML1-eL12zLxK-L1K5LBK-LxKqL1hML1hzt; SUB=_2A253mMNPDeRhGeNJ61EX8ybFyD-IHXVVYu0HrDV6PUJbkdAKLWfTkW1NSBNBg2SO4U1GUWFqEpiKiSe4FK1eYp4f; SUHB=0xnCiMFy1pfaUb; H5_INDEX_TITLE=%E7%89%B9%E5%88%AB%E5%85%B3%E6%B3%A8; H5_INDEX=2; M_WEIBOCN_PARAMS=luicode%3D10000011%26lfid%3D106003type%253D1',
    'DNT' : '1',
    'Connection' : 'keep-alive',
    'Referer' : 'https://m.weibo.cn/searchs'
}

url = 'https://m.weibo.cn/container/getIndex?containerid=106003type=1'

response = requests.get(url,headers = headers)
# if response.status_code == 200:
#     try:
#         dataRes = response.json()['data']
#         dataList = dataRes['data']
#         print dataList
#         card_group = dataList['cards'][0]
#         group = card_group[1]['group']
#         print group
#     except Exception as e:
#         print(e)

dataRes = response.json()['data']
cards = dataRes['cards'][0]
card_group = cards['card_group'][1]
group = card_group['group']
# topicGroup = []

def getTopic():
    mongoclient = pymongo.MongoClient(host='localhost',port = 27017)
    db = mongoclient.Weibo_topic
    collection = db.topic

    if collection.find({}).count() > 0:
        collection.remove()

    options = webdriver.ChromeOptions()
    options.set_headless()
    options.add_argument('--disable-gpu')
    browser = webdriver.Chrome(options=options)

    for index in range(len(group)):
        # print item['title_sub'].encode('gbk')
        print group[index]['scheme'] 
        if index == len(group)-1:
            break

        topicName = group[index]['title_sub']
        browser.get(group[index]['scheme'])
        
        # print(requests.get(item['scheme'],headers = headers).text)

        time.sleep(3)

        # btn = browser.find_element_by_xpath("//div[@class='m-diy-btn m-box-col m-box-center m-box-center-a']")
        # browser.find_elements_by_css_selector('.m-diy-btn.m-box-col.m-box-center.m-box-center-a')[3].click()
        icon = browser.find_element_by_xpath("//footer/div[@class='m-diy-btn m-box-col m-box-center m-box-center-a'][2]")
        icon.click()

        time.sleep(4)
        
        pattern = re.compile(r'https://m.weibo.cn/status/(\d+)')
        topicId = pattern.match(browser.current_url).group(1)
        # topicGroup.append(topicId)
        try:
            collection.insert({
                'topic_name': topicName,
                'topic_id': topicId,
                'status': 0,
            })                    
        except Exception as e:
            print(e)
        time.sleep(2)
        # reg = re.compile(r'/status/(.*)')
        # status = reg.match(browser.get(url)).group(0)
        # print status

    browser.close()

if __name__=='__main__':
    getTopic()
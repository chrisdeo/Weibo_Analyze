# -*- coding: utf-8 -*-  
import matplotlib.pyplot as plt
import networkx as nx
import pymongo
import re
import sys
reload(sys)
sys.setdefaultencoding('utf8')

col = sys.argv[1]
nick = sys.argv[2]
print type(nick)
nick1 = nick.decode('gbk')
print type(nick1)
flag = sys.argv[3]

mongoclient = pymongo.MongoClient(host='localhost',port = 27017)
db = mongoclient.SinaWeibo_repost1
collection = db[col]


contentList = list(collection.find({},{'_id':0,'Content':1}))
userList = []
repostUserList = []
list_edge = []
userDict = dict()

def getUserList():
    for item in contentList:
        name = item['Content'].split(':')[0].strip()
        if name not in userList:
            userList.append(name)
    print len(userList)
    find_name1 = r'\s@(.*?)\s'
    # find_name = r'@([\u4e00-\u9fa5\w\-]+)'

    for item in contentList:
        k = re.findall(find_name1,item['Content'])
        name = item['Content'].split(':')[0].strip()
        if k:
            lengh_k = len(k)
            userDict[name] = lengh_k
            if lengh_k==1:
                temp = ('%s' % name,'%s' % k[0])
                list_edge.append(temp)
            else:
                for i in range(lengh_k-1):
                    temp = ('%s' % k[i],'%s' % k[i+1])
                    list_edge.append(temp)
                temp = ('%s' % k[lengh_k-1],'%s' % name)
                list_edge.append(temp)
        else:
            userDict[name] = 0
    
    for item in userDict:
        if item!=nick1 and userDict[item]==0:
            temp = ('%s' % nick1,'%s' % item)
            list_edge.append(temp)
            

    G = nx.Graph()
    G.add_nodes_from(userList)
    G.add_edges_from(list_edge)
    Gc = max(nx.connected_component_subgraphs(G), key=len)
    degree = nx.degree_histogram(Gc)
    
    x = range(len(degree))

    for i in x:
        if degree[i] > 0:
            print i

    judge = str(True)
    jud = flag == judge

    nx.draw_spring(Gc,node_size=10,with_labels=jud,alpha=0.8)
    plt.show()

if __name__=='__main__':
    getUserList()

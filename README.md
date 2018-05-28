#爬虫系统环境为python2.7，需安装Scrapy框架需求的相关依赖，可以直接执行看控制台报错去安装相关库

#数据库环境 2个 MongoDB 和 Redis，GUI用Studio3T和RedisDesktopManager
安装后启动指令：
MongoDB 默认端口27017:
先进入指定安装的bin目录下，如C:\Program Files\MongoDB\Server\3.4\bin
输入如下命令启动数据库服务
mongod --dbpath "C:\Program Files\MongoDB\Server\3.4\bin\data\db"

Redis 默认端口3306:
同样进入到安装目录下，键入redis-server.exe redis.conf启动服务

#SinaWeibo_Spider_Master
通过修改spiders/Weibo_Spider.py下的Weibo_UserID list进行指定用户组的数据爬取
配置好后直接在目录下键入python Main.py执行

#SinaWeibo_Spider_RepostBlog_noGUI
通过修改spiders/Weibo_Spider.py下的正则替换转发BlogID url
配置好后直接在目录下键入python Main.py执行

#weibo-analyze 前端文件frontend和后端文件server
前端文件先键入npm install安装相关依赖
输入yarn start启动client，默认端口为3000

后端文件与前端操作相同，前端webpack带有热更新，后端要装nodemon依赖，安装前可以直接yarn start在3007端口启服务，安装后nodemon server.js启动。

#前后端服务启动完毕后就是整个用户界面，根据相关模块选择需求的分析功能即可
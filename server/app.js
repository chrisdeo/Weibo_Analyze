const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const Monk = require('monk');
const cors = require('koa2-cors');
const app = new Koa();
const db = new Monk('localhost:27017/SinaWeibo');
const repost = new Monk('localhost:27017/SinaWeibo_repost1')
const commentdb = new Monk('localhost:27017/Weibo_topic');
const contentdb = new Monk('localhost:27017/Weibo_content')


db.then(() => {
    console.log('connected successfully');
})

const personalInformation = db.get('PersonalInformation');
const blog = db.get('PersonalBlog');
const topic = commentdb.get('topic');
const content = contentdb.get('content');
const contentSolved = contentdb.get('contentSolved')
const contentFinal = contentdb.get('contentFinal')
const usersign = contentdb.get('UserSign')
const user = contentdb.get('UserList')
const personalFollowAndFans = db.get('PersonalFollowAndFans')
const repost1 = repost.get('RepostBlog')
const repost2 = repost.get('RepostBlog1')
const repost3 = repost.get('RepostBlog2')

app.use(bodyParser());
router.get('/', async (ctx, next) => {
    ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
});

router.post('/signin', async (ctx, next) => {
    var
        name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if (name === 'koa' && password === '12345') {
        ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
    } else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
    }
});

router.get('/getPersonalInformation', async (ctx, next) => {
    let query = await personalInformation.find({});
    query.forEach((x) => {
        let tmp = x.Label.split(',').filter(x => { return x; });
        tmp.shift();
        x.Label = tmp.join();
    })
    ctx.response.type = "application/json";
    ctx.response.body = query;
});

router.get('/getUserList', async (ctx, next) => {
    let query = await blog.distinct('UserID');
    for (let id of query) {
        let weiboContentList = await blog.find({ UserID: id }, { _id: 0, Content: 1 });
        let contentStr = '';
        weiboContentList.forEach((x) => {
            contentStr += x.Content;
        })
        content.insert({
            'user_id': id,
            'weibo_content': contentStr,
        })
    }
    ctx.response.type = "application/json";
    ctx.response.body = { code: 'success' };
    console.log('finished')
});

router.get('/regexContent', async (ctx, next) => {

    const regex = /转发了(.*)的微博/g
    const reg = /\s/g     //剔除空格
    const reg1 = /#(.*)#/g   //替换爬取的主题无关内容
    const reg2 = /(\[(.+?)\])/g  //替换爬取的无关文字符号表情
    const reg3 = /@[^\s:：，,.。@]*(?=[\s:：，,.。])/g //剔除@信息
    const reg4 = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g
    const reg5 = /[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|'…'|'，'|'ㄧ'|'。'|'：'|'；'|'·'|'！'|'‼️'|'？'|'“'|'”'|'’'|'‘'|'】'|'【'|'（'|'）'|'《'|'》'|'、'|'「'|'」'|'～']/g
    const reg6 = /\d/g
    const reg7 = /转发|赞|评论|收藏|原文|原图|微博|分享图片|秒拍视频|抱歉此已被作者删除查看帮助|分享自|查看更多/g

    let query = await content.find({}, { _id: 0 });
    query.forEach((x) => {
        let content = x.weibo_content.replace(regex, '').replace(reg1, '').replace(reg2, '').replace(reg3, '').replace(reg, '').replace(reg4, '')
            .replace(reg5, '').replace(reg6, '').replace(reg7, '').trim();
        let id = x.user_id;
        contentFinal.insert({
            'user_id': id,
            'weibo_content': content,
        })
    })

    ctx.response.type = "application/json";
    ctx.response.body = { code: 'success' };
});

router.get('/tagComparison', async (ctx, next) => {
    let query = await usersign.find({}, { _id: 0 });
    query.forEach(async (x) => {
        let res = await personalInformation.find({ UserID: x.user_id });

        await usersign.update({ user_id: x.user_id }, {
            $set: {
                label: res[0].Label,
                nickname: res[0].Nickname, auth: res[0].Authentication, brief: res[0].BriefIntroduction
            }
        });
    })
    ctx.response.type = "application/json";
    ctx.response.body = { code: 'success' };
});

router.get('/getRepostList', async (ctx, next) => {
    let rep = await repost1.find({OriginalBlogID:'0'}, { _id: 0 ,Repost_Nickname:1,OriginalBlogTitle:1,});
    let rep1 = await repost2.find({OriginalBlogID:'0'}, { _id: 0 ,Repost_Nickname:1,OriginalBlogTitle:1,});
    let rep2 = await repost3.find({OriginalBlogID:'0'}, { _id: 0 ,Repost_Nickname:1,OriginalBlogTitle:1,});
    let repList = [];
    repList.push({
        'OriginalBlogTitle':rep[0].OriginalBlogTitle,
        'Repost_Nickname':rep[0].Repost_Nickname,
        'collection':'RepostBlog',
    });
    repList.push({
        'OriginalBlogTitle':rep1[0].OriginalBlogTitle,
        'Repost_Nickname':rep1[0].Repost_Nickname,
        'collection': 'RepostBlog1'
    });  
    repList.push({
        'OriginalBlogTitle':rep2[0].OriginalBlogTitle,
        'Repost_Nickname':rep2[0].Repost_Nickname,
        'collection': 'RepostBlog2'
    });   
    ctx.response.type = "application/json";
    ctx.response.body = repList;
});


router.get('/getPersonalTag', async (ctx, next) => {
    let query = await usersign.find({}, { _id: 0 });
    query.forEach((x) => {
        let tmp = x.label.split(',').filter(x => { return x; });
        tmp.shift();
        x.label = tmp.join();
    })
    ctx.response.type = "application/json";
    ctx.response.body = query;
});

router.get('/getComUser', async (ctx, next) => {
    let query = await personalFollowAndFans.distinct('UserID');
    let tableObj = [];    
    let start = async ()=>{
        for (let i = 0; i<query.length;i++){
            let nick = await personalInformation.find({'UserID':query[i]});
            user.insert({
                'Nickname':nick[0].Nickname,
                'UserID': query[i]
            })
        }
    }
    await start();
    ctx.response.type = "application/json";
    ctx.response.body = { code: 'success' };
});

router.get('/getComList', async (ctx, next) => {
    let query = await user.find({},{_id:0});
    ctx.response.type = "application/json";
    ctx.response.body = query;
});

router.get('/vagueQuery', async (ctx, next) => {
    let data  =  ctx.query.data;
    let query = await blog.find({'Content':{$regex:data}}, { _id: 0 ,Content:1,UserID:1});
    ctx.response.type = "application/json";
    ctx.response.body = query;
});


router.get('/calCompact', async (ctx, next) => {
    let list  =  ctx.query['list[]'];
    let username1 = JSON.parse(list[0]).Nickname;
    let username2 = JSON.parse(list[1]).Nickname;;
    let userid1 = JSON.parse(list[0]).UserID;
    let userid2 = JSON.parse(list[1]).UserID;

    let uesrx = await personalFollowAndFans.find({ UserID: userid1 }, { _id: 0, Follow_UserID: 1 });
    let usery = await personalFollowAndFans.find({ UserID: userid2 }, { _id: 0, Follow_UserID: 1 });
    let weibox = await blog.find({ UserID: userid1 }, { _id: 0, Content: 1 })
    let userxList = [];
    let useryList = [];
    const regex = /转发了(.*)的微博/g
    const reg = /@[^\s:：，,.。@]*(?=[\s:：，,.。])/g
    uesrx.forEach((x) => {
        if (x.Follow_UserID)
            userxList.push(x.Follow_UserID);
    })
    usery.forEach((x) => {
        if (x.Follow_UserID)
            useryList.push(x.Follow_UserID);
    })
    let rep = 0;
    let at = 0;
    weibox.forEach((x) => {
        let content = x.Content;
        if (regex.test(content)) {
            let repname = regex.exec(content.match(regex)[0])[1].trim();
            // console.log('转发用户昵称：', repname);
            repname == username2 ? rep++ : {};
        }
        if (reg.test(content)) {
            let atname = content.match(reg)[0].substr(1);
            // console.log('@用户昵称：', atname);
            atname == username2 ? at++ : {};
            //每日情感签名1740924090
        }
    })
    console.log('转发次数：',rep);
    console.log('@次数：',at);
    // console.log(userxList);
    // console.log(useryList);
    let xy = [...userxList, ...useryList];
    let union = new Set(xy);
    let unionSize = union.size;
    console.log('关注交集数：', xy.length - unionSize);
    console.log('关注并集数：', unionSize);
    let jaccard = unionSize==0? 0 : (xy.length - unionSize) / unionSize;
    console.log('关注Jaccard系数: ', jaccard)
    let compact = jaccard*0.5 + 0.7*rep + 0.3*at;
    console.log('紧密度计算结果：',compact);

    ctx.response.type = "application/json";
    ctx.response.body = compact;
});



router.get('/getPersonalBirthday', async (ctx, next) => {
    let query = await personalInformation.find({}, { _id: 0, Birthday: 1 });
    ctx.response.type = "application/json";
    ctx.response.body = query;
});

router.get('/getMaleCount', async (ctx, next) => {
    let query = await personalInformation.count({ Gender: '男' });
    ctx.response.type = "application/json";
    ctx.response.body = query;
});

router.get('/getFemaleCount', async (ctx, next) => {
    let query = await personalInformation.count({ Gender: '女' });
    ctx.response.type = "application/json";
    ctx.response.body = query;
});

router.get('/getRegion', async (ctx, next) => {
    let query = await personalInformation.find({}, { _id: 0, Region: 1 });
    ctx.response.type = "application/json";
    ctx.response.body = query;
});

router.get('/getLabel', async (ctx, next) => {
    let query = await personalInformation.find({}, { _id: 0, Label: 1 });
    ctx.response.type = "application/json";
    ctx.response.body = query;
});

router.get('/getTopicUrl', async (ctx, next) => {
    let query = await topic.find({}, { _id: 0, topic_name: 1, topic_id: 1, status: 1 });
    ctx.response.type = "application/json";
    ctx.response.body = query;
});

router.get('/getStatus', async (ctx, next) => {
    let id = ctx.query.id;
    let query = await topic.find({ topic_id: { $eq: id } }, { _id: 0, status: 1 });
    ctx.response.type = "application/json";
    ctx.response.body = query;
});

router.get('/getPostContent', async (ctx, next) => {
    let query = await blog.find({ Repost_BlogID: { $exists: false } }, { _id: 0, Content: 1 });
    let lenArr = [0, 0, 0, 0, 0, 0, 0]
    const regex = /转发了(.*)的微博/g
    const reg = /\s/g     //剔除空格
    const reg1 = /#(.*)#/g   //替换爬取的主题无关内容
    const reg2 = /(\[(.+?)\])/g  //替换爬取的无关文字符号表情
    const reg3 = /@[^\s:：，,.。@]*(?=[\s:：，,.。])/g //剔除@信息
    query.forEach((x) => {
        let len = x.Content.replace(reg1, '').replace(reg2, '').replace(reg3, '').replace(reg, '').length;
        if (len >= 0 && len <= 20)
            lenArr[0]++;
        else if (len > 20 && len <= 40)
            lenArr[1]++;
        else if (len > 40 && len <= 60)
            lenArr[2]++;
        else if (len > 60 && len <= 80)
            lenArr[3]++;
        else if (len > 80 && len <= 100)
            lenArr[4]++;
        else if (len > 100 && len <= 120)
            lenArr[5]++;
        else if (len > 120 && len <= 140)
            lenArr[6]++;
    })
    // let lenArr = [];
    // for(var x in lenObj)
    //     lenArr.push(lenObj[x])
    ctx.response.type = "application/json";
    ctx.response.body = lenArr;
});

router.get('/getRepostCommentNum', async (ctx, next) => {
    let rep_num = await blog.count({ Repost_BlogID: { $exists: true } });
    let comment_num = await blog.count({ Number_Comment: { $gt: 0 } });
    let repcom_num = await blog.count({ $or: [{ Repost_BlogID: { $exists: true } }, { Number_Comment: { $gt: 0 } }] })
    let total = await blog.count({});
    let query = [rep_num, comment_num, total, repcom_num];
    ctx.response.type = "application/json";
    ctx.response.body = query;
})

router.get('/getTimePost', async (ctx, next) => {
    let query = await blog.find({}, { _id: 0, PostTimeAndFromType: 1 });
    let timeObj = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    const reg = /(\d{2}):/;
    query.forEach((x) => {
        if (reg.test(x.PostTimeAndFromType)) {
            let time = parseInt(reg.exec(x.PostTimeAndFromType)[1]);
            if (time == 24 || time == 0)
                timeObj[0]++;
            else if (time == 1)
                timeObj[1]++;
            else if (time == 2)
                timeObj[2]++;
            else if (time == 3)
                timeObj[3]++;
            else if (time == 4)
                timeObj[4]++;
            else if (time == 5)
                timeObj[5]++;
            else if (time == 6)
                timeObj[6]++;
            else if (time == 7)
                timeObj[7]++;
            else if (time == 8)
                timeObj[8]++;
            else if (time == 9)
                timeObj[9]++;
            else if (time == 10)
                timeObj[10]++;
            else if (time == 11)
                timeObj[11]++;
            else if (time == 12)
                timeObj[12]++;
            else if (time == 13)
                timeObj[13]++;
            else if (time == 14)
                timeObj[14]++;
            else if (time == 15)
                timeObj[15]++;
            else if (time == 16)
                timeObj[16]++;
            else if (time == 17)
                timeObj[17]++;
            else if (time == 18)
                timeObj[18]++;
            else if (time == 19)
                timeObj[19]++;
            else if (time == 20)
                timeObj[20]++;
            else if (time == 21)
                timeObj[21]++;
            else if (time == 22)
                timeObj[22]++;
            else if (time == 23)
                timeObj[23]++;
        }
    })
    ctx.response.type = "application/json";
    ctx.response.body = timeObj;
});

router.get('/getBlogNum', async (ctx, next) => {
    let query = await personalInformation.aggregate({ $group: { _id: { Number_Blog: "$Number_Blog" }, total: { $sum: 1 } } }, { $sort: { total: 1 } })
    let loge = Math.log;
    let arr = [];
    query.forEach(x => {
        arr.push([loge(x._id.Number_Blog), loge(x.total)])
    })
    ctx.response.type = "application/json";
    ctx.response.body = arr;
});

router.get('/spiderForTopic', (ctx, next) => {
    ctx.response.body = `<h1>热搜爬虫程序已启动</h1>`;
    let child_process = require('child_process');
    let exec = child_process.exec;
    exec('python getTopicUrl.py', function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);;
            console.log('Error code:' + error.code);
            return;
        } else {
            console.log('succeed in crawling topic list!');
        }
    })
})

router.get('/spiderForComment', async (ctx, next) => {
    ctx.response.body = `<h1>评论爬虫程序已启动</h1>`;
    let child_process = require('child_process');
    let exec = child_process.exec;
    let id = ctx.query.id;
    exec('python weibo_comment_spider.py ' + id, function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);;
            console.log('Error code:' + error.code);
            return;
        } else {
            console.log('succeed in crawling topic comments!');
        }
    })
});

router.get('/nlpAnalyze', (ctx, next) => {
    ctx.response.body = `<h1>nlp情感分析</h1>`;
    let child_process = require('child_process');
    let exec = child_process.exec;
    let id = ctx.query.id;
    exec('python comments_nlp.py ' + id, function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);;
            console.log('Error code:' + error.code);
            return;
        } else {
            console.log('succeed in analyzing in nlp model');
        }
    })
})

router.get('/generateWordCloud', (ctx, next) => {
    ctx.response.body = `<h1>词云生成</h1>`;
    let child_process = require('child_process');
    let exec = child_process.exec;
    let id = ctx.query.id;
    let pic = 'assets/pic/' + ctx.query.pic;
    exec('python comments_cloud.py ' + pic + ' ' + id, function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);;
            console.log('Error code:' + error.code);
            return;
        } else {
            console.log('succeed in generating wordcloud');
        }
    })
})

router.post('/upload', async (ctx, next) => {
    ctx.body = {
        code: 'success',
    }
});

router.get('/repostLink', (ctx, next) => {
    ctx.response.body = `<h1>转发链路分析</h1>`;
    let child_process = require('child_process');
    let exec = child_process.exec;
    let collection = ctx.query.collection;
    let nickname = ctx.query.nickname;
    let flag = ctx.query.flag;
    console.log(flag);
    console.log('python repostLink.py ' + collection + ' ' + nickname + ' ' + flag);
    exec('python repostLink.py ' + collection + ' ' + nickname + ' ' + flag, function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);;
            console.log('Error code:' + error.code);
            return;
        } else {
            console.log('succeed in generating repost Link');
        }
    })
})

router.get('/calSim', (ctx, next) => {
    const regex = /转发了(.*)的微博/g
    const reg = /\s/g     //剔除空格
    const reg1 = /#(.*)#/g   //替换爬取的主题无关内容
    const reg2 = /(\[(.+?)\])/g  //替换爬取的无关文字符号表情
    const reg3 = /@[^\s:：，,.。@]*(?=[\s:：，,.。])/g //剔除@信息
    const reg4 = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g
    const reg5 = /[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|'…'|'，'|'ㄧ'|'。'|'：'|'；'|'·'|'！'|'‼️'|'？'|'“'|'”'|'’'|'‘'|'】'|'【'|'（'|'）'|'《'|'》'|'、'|'「'|'」'|'～']/g
    const reg6 = /\d/g
    const reg7 = /转发|赞|评论|收藏|原文|原图|微博|分享图片|秒拍视频|抱歉此已被作者删除查看帮助|分享自|查看更多/g
    let list  =  ctx.query['list[]'];
    let text = JSON.parse(list[0]).Content;
    let text1 = JSON.parse(list[1]).Content;
    text = text.replace(regex, '').replace(reg1, '').replace(reg2, '').replace(reg3, '').replace(reg, '').replace(reg4, '')
    .replace(reg5, '').replace(reg6, '').replace(reg7, '').trim();
    text1 = text1.replace(regex, '').replace(reg1, '').replace(reg2, '').replace(reg3, '').replace(reg, '').replace(reg4, '')
    .replace(reg5, '').replace(reg6, '').replace(reg7, '').trim();
    console.log(text);
    console.log(text1);
    ctx.response.body = `<h1>相似度计算</h1>`;
    let child_process = require('child_process');
    let exec = child_process.exec;
    exec('python similarity.py ' + text + ' ' +text1, function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);;
            console.log('Error code:' + error.code);
            return;
        } else {
            console.log(stdout);
        }
    })
})


app.use(cors({
    origin: '*',
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'],
}));

app.use(router.routes());

app.listen(3007);
console.log('app started at port 3007');

// const io = require('socket.io')(app);

// io.on('connection', (socket) => {
//     socket.emit('spider', { hello: 'world' });
//     socket.on('please start spider', (res) => {
//         console.log(res)
//     })
// })





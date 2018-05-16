import React from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import Charts from '../components/echarts';
import HomePage from '../page/HomePage';
import Table from '../components/table';
import Post from '../components/post';
import Analysis from '../components/analysis';
import Tag from '../components/tag';
import Repost from '../components/repost';
import Compact from '../components/compact';
import Query from '../components/query';
import App from '../App';
const RouterConfig = () => {
    return (
        <Router history={hashHistory}>

            <Route exact path="/" component={App}>
                <IndexRoute component={HomePage} />
                <Route exact path="/table" component={Table} />
                <Route exact path="/charts" component={Charts} />
                <Route exact path="/postanalysis" component={Post} />
                <Route exact path="/compact" component={Compact} />  
                <Route exact path="/query" component={Query} />   
                <Route exact path="/tag" component={Tag} />
                <Route exact path="/analysis" component={Analysis} />
                <Route exact path="/repost" component={Repost} />   
            </Route>

            {/* <Route path="filesystem" component = {Filesystem}>
            </Route> */}
        </Router>
    )
}

export default RouterConfig;
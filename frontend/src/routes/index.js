import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import Simple from '../components/echarts';
import HomePage from '../page/HomePage';
import Table from '../components/table';
import App from '../App';
const RouterConfig = ()=>{
    return (
        <Router history={hashHistory}>
            <Route component = {App}>
                <Route path="/" component = {HomePage}/>
                <Route path="/charts" component = {Simple}/>
                <Route path="/table" component = {Table} />
            </Route>
            {/* <Route path="filesystem" component = {Filesystem}>
            </Route> */}
        </Router>     
    )
}

export default RouterConfig;
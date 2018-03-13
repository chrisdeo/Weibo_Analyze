import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import RouterConfig from './routes';
import registerServiceWorker from './registerServiceWorker';
import App from './App';


ReactDOM.render(
    <RouterConfig/>,
     document.getElementById('root'));

registerServiceWorker();

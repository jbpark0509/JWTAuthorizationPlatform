import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import createStore from './store';

import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import useScroll from 'scroll-behavior/lib/useStandardScroll';

import getRoutes from './routes';

const _browserHistory = useScroll(() => browserHistory)();
const dest = document.getElementById('myApp');
const store = createStore(_browserHistory, window.__INITSTATE__);
const history = syncHistoryWithStore(_browserHistory, store);

function initSocket() {
    const socket = io('', { path: '/ws' });
    socket.on('news', (data) => {
        console.log('Data from Server', data);
        socket.emit('test', { my: 'data from client' });
    });
    return socket;
}

global.socket = initSocket();

ReactDOM.render(
    <Provider store={store}>
  	  	<Router children={getRoutes(store)} history={history}/>
  	</Provider>, dest
);

if (__DEVELOPMENT__) {
    const devtool = document.getElementById('devtool');
    const DevTools = require('./containers/DevTools/DevTools');
    ReactDOM.render(
        <DevTools store={store}/>, devtool
    );
}

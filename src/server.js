import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import config from './config';
import favicon from 'serve-favicon';
import compression from 'compression';
import httpProxy from 'http-proxy';
import path from 'path';
import createStore from './store';
import Html from './helpers/Html';
import PrettyError from 'pretty-error';
import http from 'http';
import cookieParser from 'cookie-parser';

import { RouterContext, match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import createHistory from 'react-router/lib/createMemoryHistory';
import { Provider } from 'react-redux';
import getRoutes from './routes';
import { validateToken } from './actions/AuthActions';

const targetUrl = 'http://' + config.apiHost + ':' + config.apiPort;
// const targetUrl = 'https://agape-web-api.herokuapp.com';
const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);
const proxy = httpProxy.createProxyServer({
    target: targetUrl,
    ws: true
});

// function ensureSecure(req, res, next) {
//     if(req.protocol === 'https'){
//         next();
//     } else {
//         res.redirect('https://'+req.host+req.url);
//     }
// };

// app.all('*', ensureSecure);

app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));
app.use(cookieParser());
app.use(Express.static(path.join(__dirname, '..', 'static')));

// Proxy to API server for api
app.use('/api', (req, res) => {
    proxy.web(req, res, {
        target: targetUrl,
        // changeOrigin: true 
    });
});

// Proxy to API server for websockets
app.use('/ws', (req, res) => {
    proxy.web(req, res, { target: targetUrl + '/ws' });
});

server.on('upgrade', (req, socket, head) => {
    proxy.ws(req, socket, head);
});

proxy.on('error', (error, req, res) => {
    let json;
    if (error.code !== 'ECONNRESET') {
        console.error('proxy error', error);
    }
    if (!res.headersSent) {
        res.writeHead(500, { 'content-type': 'application/json' });
    }

    json = { error: 'proxy_error', reason: error.message };
    res.end(JSON.stringify(json));
});

app.use((req, res) => {

    if (__DEVELOPMENT__) {
        // Do not cache webpack stats: the script file would change since
        // hot module replacement is enabled in the development env
        webpackIsomorphicTools.refresh();
    }

    const memoryHistory = createHistory(req.originalUrl);
    const store = createStore(memoryHistory);
    const history = syncHistoryWithStore(memoryHistory, store);

    function hydrateOnClient() {
        res.send('<!doctype html>\n' +
            ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}/>));
    }

    if (__DISABLE_SSR__) {
        hydrateOnClient();
        return;
    }

    //Get cookies
    const at = req.cookies.a;
    const rt = req.cookies.r;

    //Validate tokens
    store.dispatch(validateToken(at, rt))
        .then(() => {
            return;
        })
        .catch(() => {
            return;
        })
        .then(() => {
            match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
                if (redirectLocation) {
                    res.redirect(redirectLocation.pathname + redirectLocation.search);
                } else if (error) {
                    console.error('ROUTER ERROR:', pretty.render(error));
                    res.status(500);
                    hydrateOnClient();
                } else if (renderProps) {
                    const component = (
                        <Provider store={store}>
                            <RouterContext {...renderProps}></RouterContext>
                        </Provider>
                    );
                    res.status(200);
                    global.navigator = { userAgent: req.headers['user-agent'] };
                    res.send('<!doctype html>\n' +
                        ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store} component={component}/>));
                } else {
                    res.status(404).send('Not found');
                }
            });
        });
});

if (config.port) {
    server.listen(config.port, (err) => {
        if (err) {
            console.error(err);
        }
        console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
        console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
    });
} else {
    console.error('==>     ERROR: No PORT environment variable has been specified');
}

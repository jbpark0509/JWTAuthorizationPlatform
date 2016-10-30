'use strict';

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';

export default class Html extends Component {

    constructor(props) {
        super(props);
    }

    initStates() {

    }

    render() {
        const { assets, component, store } = this.props;
        const content = component ? ReactDOM.renderToString(component) : '';
        return (
            <html lang="en-US">
              <head>
                <title>Isomorphic Template</title>
                <meta charSet="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <link href='https://fonts.googleapis.com/css?family=Lato:400,300' rel='stylesheet' type='text/css' />
                {/* styles (will be present only in production with webpack extract text plugin) */}
                {Object.keys(assets.styles).map((style, key) =>
                  <link href={assets.styles[style]} key={key} media="screen, projection"
                        rel="stylesheet" type="text/css" charSet="UTF-8"/>
                )}
      
                {/* (will be present only in development mode) */}
                {/* outputs a <style/> tag with all bootstrap styles + App.scss + it could be CurrentPage.scss. */}
                {/* can smoothen the initial style flash (flicker) on page load in development mode. */}
                {/* ideally one could also include here the style for the current page (Home.scss, About.scss, etc) */}
                { Object.keys(assets.styles).length === 0 ? <style dangerouslySetInnerHTML={{__html: require('../theme/bootstrap.config.js') }}/> : null }
              </head>
              <body>
                <div className="container-fluid">
                  <div id="myApp" dangerouslySetInnerHTML={{__html: content}}/>
                  <div id="devtool"/>
                </div>
                  <script dangerouslySetInnerHTML={{__html: `window.__INITSTATE__=${serialize(store.getState())};`}} charSet="UTF-8"/>
                  <script src={assets.javascript.main} charSet="UTF-8"/>
              </body>
            </html>
        );
    }
}

Html.propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
    store: PropTypes.object
}

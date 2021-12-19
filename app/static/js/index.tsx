// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import 'core-js/stable';

import React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import { BrowserHistory } from 'utils/navigationUtils';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from 'pages/HomePage';

ReactDOM.render(
  <DocumentTitle title="Corona AI">
    {/* <Provider store={store}> */}
    <Router history={BrowserHistory}>
      <div id="main">
        {/* Page component */}
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </Router>
    {/* </Provider> */}
  </DocumentTitle>,
  document.getElementById('content') || document.createElement('div')
);
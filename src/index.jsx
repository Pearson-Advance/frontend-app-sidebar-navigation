import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage, PageRoute } from '@edx/frontend-platform/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Switch } from 'react-router-dom';

import CourseOutline from './features/outline/CourseOutline';

import './index.scss';
import initializeStore from './store';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider store={initializeStore()}>
      <Switch>
        <PageRoute path="/:courseId">
          <CourseOutline />
        </PageRoute>
      </Switch>
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  messages: [],
  requireAuthenticatedUser: true,
});

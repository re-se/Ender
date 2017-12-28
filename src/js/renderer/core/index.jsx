// @flow

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Game from '../components/Game';
import reducers from '../reducers/reducers';

import type { Store } from '../types/types';

const store: Store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

render(
  <Provider store={store}>
    <Game />
  </Provider>,
  document.getElementById('contents')
);

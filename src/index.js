import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";

import rootReducer from "./reducers";
import rootSaga from "./sagas";
import * as serviceWorker from "./services/serviceWorker";
import App from "./components/app/App";
import "./index.css";

const sagaMiddleware = createSagaMiddleware();

let store = createStore(
  rootReducer,
  compose(
    applyMiddleware(sagaMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
)

sagaMiddleware.run(rootSaga);

render(
  <Provider store={store}>
      <App/>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();

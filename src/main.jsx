import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { RxStateProvider, createState } from "rx_state";

import App from "./containers/App/App";
import Games from "./containers/Games/Games";
import Game from "./containers/Game/Game";
import rootReducer$ from "./reducers";

ReactDOM.render(
  <RxStateProvider state$={createState(rootReducer$)}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Games} />
        <Route path="game/:id" component={Game} />
      </Route>
    </Router>
  </RxStateProvider>,
  document.getElementById("root")
);

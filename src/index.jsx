import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import PortfolioDemo from "pages/PortfolioDemo";
import { Welcome } from "pages/PortfolioDemo";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path={["/welcome", "/login"]} exact render={(props) => <Welcome {...props} />} />
      <Route path="/demo/:tab?" exact render={(props) => <PortfolioDemo {...props} />} />
      <Redirect to="/demo/timeline" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);

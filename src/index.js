import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss";

import Login from "pages/Login.jsx";
import Group from "pages/Group";
import Profile from "pages/Profile.jsx";
import Register from "pages/Register.jsx";
import Timeline from "pages/Timeline.jsx";
import EditProfile from "pages/EditProfile";
import Update from "pages/Update";
import Admin from "pages/Admin";
import PrivateRoute from "./privateRoute";
import FriendsPage from "pages/FirendsPage";
import Chat from "pages/chat";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

ReactDOM.render(

  <I18nextProvider i18n={i18n}>
      <BrowserRouter>
    <Switch>
      <Route path="/login" exact render={(props) => <Login {...props} />} />
      <PrivateRoute
        path="/profile"
        render={(props) => <Profile {...props} />}
        exact
      />
      <PrivateRoute
        path="/group"
        render={(props) => <Group {...props} />}
        exact
      />
      <PrivateRoute
        path="/edit-profile"
        render={(props) => <EditProfile {...props} />}
        exact
      />
      {/* <PrivateRoute
        path="/update"
        render={(props) => <Update {...props} />}
        exact
      /> */}

      <Route
        path="/register"
        exact
        render={(props) => <Register {...props} />}
      />



<PrivateRoute
        path="/admin"
        exact
        render={(props) => <Admin {...props} />}
      />


      <PrivateRoute
        path="/chat/:fuid"
        exact
        render={(props) => <Chat {...props} />}
      />
      {/* <PrivateRoute
        path="/friend"
        render={(props) => <FriendsPage {...props} />}
        exact
      /> */}
        <PrivateRoute path="/friend/:fuid" exact render={props => <FriendsPage {...props} />} />

      <PrivateRoute
        path="/home"
        render={(props) => <Timeline {...props} />}
        exact
      />
      <Redirect to="/profile" />
    </Switch>
  </BrowserRouter>
  </I18nextProvider>,
  document.getElementById("root")
);

import React from "react";
//import { createStore } from "redux";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss";

import Login from "pages/Login.jsx";
import Register from "pages/Register.jsx";
import LoginFunctional from "pages/LoginFunctional";
import Group from "pages/Group";
import Profile from "pages/Profile.jsx";
import Timeline from "pages/Timeline.jsx";
import EditProfile from "pages/EditProfile";
import Update from "pages/Update";
import Admin from "pages/Admin";
import PrivateRoute from "./privateRoute";
import PublicRoute from "./publicRoute";
import FriendsPage from "pages/FirendsPage";
import PostPage from "pages/PostPage";
import Chat from "pages/chat";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import store from "./redux/store";
import PubNavbar from "components/Navbars/PubNavbar";

// const initialState = { user3: 8 };

// function reducer(state = initialState, action) {
//   switch (action.type) {
//     case "increment":
//       return {
//         user3: state.user3 + 1,
//       };
//     default:
//       return state;
//   }
// }

//const store = createStore(reducer);

// store.dispatch({ type: "increment" });

ReactDOM.render(
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
      {/* <PubNavbar  /> */}
        <Switch>
          <PublicRoute
            path="/loginF"
            exact
            render={(props) => <LoginFunctional {...props} />}
          />
          <PublicRoute
            path="/register"
            exact
            render={(props) => <Register {...props} />}
          />

          <PublicRoute
            path="/login"
            render={(props) => <Login {...props} />}
            exact
          />
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

          <PrivateRoute
            path="/post/:pId"
            exact
            render={(props) => <PostPage {...props} />}
          />
          {/* <PrivateRoute
        path="/friend"
        render={(props) => <FriendsPage {...props} />}
        exact
      /> */}
          <PrivateRoute
            path="/friend/:fuid"
            exact
            render={(props) => <FriendsPage {...props} />}
          />

          <PrivateRoute
            path="/home"
            render={(props) => <Timeline {...props} />}
            exact
          />
          <Redirect to="/profile" />
        </Switch>
      </BrowserRouter>
    </I18nextProvider>
  </Provider>,
  document.getElementById("root")
);

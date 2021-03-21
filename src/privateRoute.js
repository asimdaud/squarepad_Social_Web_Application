import React from "react";
import { Route, Redirect } from "react-router-dom";
import Timeline from "pages/Timeline";
import Profile from "pages/Profile";
import EditProfile from "pages/EditProfile";
import Update from "pages/Update";
import Chat from "pages/chat";
import FriendsPage from "pages/FirendsPage";
import Group from "pages/Group";
import Admin from "pages/Admin";
import PostPage from "pages/PostPage";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import * as firebase from "firebase";
import moment from "moment";
import UserNavbar from "components/Navbars/UserNavbar";
import FlashMessage from "components/FlashMessage";



// import { Grade } from "@material-ui/icons";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const currentUser = JSON.parse(localStorage.getItem("uid"));
  if (currentUser == null) return <Redirect to="/login" />;
  else {
    firebase.firestore().collection("users").doc(currentUser).update({
      lastOnline: moment().valueOf().toString(),
    });
  }

  return (
    <>
      <I18nextProvider i18n={i18n}>
        <UserNavbar/>
        <Route path="/home" exact render={(props) => <Timeline {...props} />} />
        {/* <Route path="/friend" exact render={props => <FriendsPage {...props} />} /> */}
        <Route
          path="/friend/:fuid"
          exact
          render={(props) => {
            if (currentUser == props.match.params.fuid) {
              return <Redirect to="/profile" />;
            } else return <FriendsPage {...props} />;
          }}
        />
        <Route
          path="/profile"
          exact
          render={(props) => <Profile {...props} />}
        />
        <Route
          path="/edit-profile"
          exact
          render={(props) => <EditProfile {...props} />}
        />
        <Route
          path="/chat/:fuid"
          exact
          render={(props) => <Chat {...props} />}
        />
        <Route
          path="/post/:pId"
          exact
          render={(props) => <PostPage {...props} />}
        />

        <Route path="/group" exact render={(props) => <Group {...props} />} />
        <Route path="/admin" exact render={(props) => <Admin {...props} />} />
        {/* <Route path="/update" exact render={props => <Update {...props} />} /> */}
        <FlashMessage show={true} /> 

      </I18nextProvider>
    </>
  );
};
export default PrivateRoute;

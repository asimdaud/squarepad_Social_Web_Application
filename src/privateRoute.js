import React from "react";
import { Route, Redirect } from "react-router-dom";
import Timeline from "pages/Timeline";
import Profile from "pages/Profile";
import EditProfile from "pages/EditProfile";
import Chat from "pages/chat";
import FriendsPage from "pages/FirendsPage";
import Group from "pages/Group";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
// import { Grade } from "@material-ui/icons";
const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
 const currentUser = JSON.parse(localStorage.getItem('uid'));

 if(currentUser==null)
  return <Redirect to="/register" />
  return (
 <>
   <I18nextProvider i18n={i18n}>
        <Route path="/home" exact render={props => <Timeline {...props} />} />
        {/* <Route path="/friend" exact render={props => <FriendsPage {...props} />} /> */}
        <Route path="/friend/:fuid" exact render={props => <FriendsPage {...props} />} />
        <Route path="/profile" exact render={props => <Profile {...props} />} />
        <Route path="/edit-profile" exact render={props => <EditProfile {...props} />} />
        <Route path="/chat/:fuid" exact render={props => <Chat {...props} />} />
        <Route path="/group" exact render={props => <Group {...props} />} />
 </I18nextProvider>
</>
);
};
export default PrivateRoute;
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import PubNavbar from "components/Navbars/PubNavbar";
import FlashMessage from "components/FlashMessage";

import Login from "pages/Login.jsx";
import Register from "pages/Register.jsx";
import LoginFunctional from "pages/LoginFunctional";


// import { Grade } from "@material-ui/icons";

const PublicRoute = ({ component: RouteComponent, ...rest }) => {

  return (
    <>
      <I18nextProvider i18n={i18n}>
        <PubNavbar/>
        <Route
            path="/loginF"
            exact
            render={(props) => <LoginFunctional {...props} />}
          />
          <Route
            path="/register"
            exact
            render={(props) => <Register {...props} />}
          />

          <Route
            path="/login"
            render={(props) => <Login {...props} />}
            exact
          />


        {/* <FlashMessage show={true} />  */}

      </I18nextProvider>
    </>
  );
};
export default PublicRoute;

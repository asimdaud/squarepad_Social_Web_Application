import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import PubNavbar from "components/Navbars/PubNavbar.jsx";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import { firebase, ui } from "../services/firebase";
import { SigninUser } from "../services/authServices";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { ActionsCreator } from "../redux/actions";

function LoginFunctional(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [value, setValue] = useState(
    localStorage.getItem("lang") ? localStorage.getItem("lang") : "en"
  );
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("lang", "en");

    firebase.auth().onAuthStateChanged((user) => {
      setIsSignedIn(!!user);
      //this.setState({ isSignedIn: !!user });
      console.log("user", user);
      if (isSignedIn) next(user);
    });
  }, []);

  const handleChange = (event) => {
    console.log("selected val is ", event.target.value);
    let newlang = event.target.value;
    //this.setState((prevState) => ({ value: newlang }));
    setValue(newlang);
    console.log("state value is", newlang, props.i18n.changeLanguage);
    props.i18n.changeLanguage(newlang);
  };

  const uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false,
    },
  };

  const next = (user) => {
    localStorage.setItem(
      "uid",
      JSON.stringify(firebase.auth().currentUser.uid)
    );
    localStorage.setItem("user", JSON.stringify(firebase.auth().currentUser));
    props.history.push("/profile");
  };

  const handleChangeData = (e, type) => {
    if (type === "email") {
      setEmail(e.target.value);
    } else if (type === "password") {
      setPassword(e.target.value);
    }
  };

  const onLogin = (e) => {
    e.preventDefault();
    localStorage.clear();
    //const { email, password } = this.state;
    //SigninUser(email, password)

    props
      .getUserInfo(email, password)
      .then((res) => {
        props.history.push("/profile");
        props.getNotificationsRedux(
          JSON.stringify(firebase.auth().currentUser.uid)
        );
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
        //setState({ error: err.message });
      });
  };

  const { t } = props;
  return (
    <>
      <PubNavbar />
      <main
      // style={{ height: "100%" }}
      >
        <section
          className="section-shaped"
          style={{
            paddingTop: "4rem",
            overflow: "auto",
            width: "-webkit-fill-available",
            display: "table",
            position: "absolute",
            height: "-webkit-fill-available",
          }}
        >
          <div
            className="shape shape-style-1 bg-gradient-default"
            style={{ position: "fixed" }}
          >
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <Container className="pt-lg-md ">
            {/* <br/><br/> */}
            <Row className="justify-content-center">
              <Col lg="5">
                <Card className="bg-secondary shadow border-0">
                  <CardHeader className="bg-white pb-5">
                    <div className="text-muted text-center mb-3">
                      <small>{t("Sign in with")}</small>
                      <StyledFirebaseAuth
                        uiConfig={uiConfig}
                        firebaseAuth={firebase.auth()}
                      />
                    </div>
                  </CardHeader>
                  <CardBody className="px-lg-5 py-lg-5">
                    <div className="text-center text-muted mb-4">
                      <small>{t("Or sign in with credentials")}</small>
                    </div>
                    <Form id="formLogin" role="form" onSubmit={onLogin}>
                      <FormGroup className="mb-3">
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-email-83" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            id="email"
                            placeholder={t("Email")}
                            type="email"
                            onChange={(e) => handleChangeData(e, "email")}
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-lock-circle-open" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            id="password"
                            placeholder={t("Password")}
                            type="password"
                            autoComplete="off"
                            onChange={(e) => handleChangeData(e, "password")}
                          />
                        </InputGroup>
                      </FormGroup>
                      <div className="text-muted font-italic justify-content-center">
                        <small>
                          {/* password strength:{" "} */}
                          <span className="text-danger font-weight-100">
                            {error}
                          </span>
                        </small>
                      </div>

                      <div className="text-center">
                        <Button
                          className="my-4"
                          color="primary"
                          type="submit"
                          onClick={onLogin}
                        >
                          {t("Sign in")}
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
                <Row className="mt-3">
                  <Col xs="6">
                    <a
                      className="text-light"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      <small>Forgot password?</small>
                    </a>
                  </Col>{" "}
                  <Col className="text-right" xs="6">
                    <Link to="/register">
                      {" "}
                      <small>{t("Create new account")}</small>
                    </Link>
                  </Col>
                </Row>
              </Col>
            </Row>
            <SimpleFooter />
          </Container>
        </section>
      </main>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    uidRedux: state.UseReducer.uidRedux,
  };
};
const mapDispatchToProps = (dispatch) => ({
  getUserInfo: (email, password) =>
    dispatch(ActionsCreator.getUserInfo(email, password)),
    getNotificationsRedux: (uid) =>
    dispatch(ActionsCreator.getNotificationsRedux(uid)),
});

//export default connect(mapStateToProps, mapDispatchToProps)(App);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(LoginFunctional));

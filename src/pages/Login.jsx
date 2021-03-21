import React from "react";
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
import { DropdownDivider } from "semantic-ui-react";

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    isSignedIn: false,
    value: localStorage.getItem("lang") ? localStorage.getItem("lang") : "en",
    error: "",
  };

  handleChange = (event) => {
    console.log("selected val is ", event.target.value);
    let newlang = event.target.value;
    this.setState((prevState) => ({ value: newlang }));
    console.log("state value is", newlang, this.props.i18n.changeLanguage);
    this.props.i18n.changeLanguage(newlang);
  };

  uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        scopes: ["https://www.googleapis.com/auth/contacts.readonly"],
        customParameters: {
          // Forces account selection even when one account
          // is available.
          prompt: "select_account",
        },
      },
      // {
      //   provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      //   scopes: [
      //     'public_profile',
      //     'email',
      //     'user_likes',
      //     'user_friends'
      //   ],
      //   customParameters: {
      //     // Forces password re-entry.
      //     auth_type: 'reauthenticate'
      //   }
      // },
      // firebase.auth.TwitterAuthProvider.PROVIDER_ID, // Twitter does not support scopes.
      // firebase.auth.EmailAuthProvider.PROVIDER_ID // Other providers don't need to be given as object.
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false,
    },
  };

  componentDidMount = () => {
    localStorage.setItem("lang", "en");

    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ isSignedIn: !!user });
      console.log("user", user);
      if (this.state.isSignedIn) this.next(user);
    });
  };

  next = (user) => {
    localStorage.setItem(
      "uid",
      JSON.stringify(firebase.auth().currentUser.uid)
    );
    localStorage.setItem("user", JSON.stringify(firebase.auth().currentUser));
    this.props.history.push("/profile");
  };
  handleChangeData = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  onLogin = (e) => {
    e.preventDefault();
    localStorage.clear();
    const { email, password } = this.state;
    SigninUser(email, password)
      .then((res) => {
        this.props.history.push("/profile");
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error: err.message });
      });
  };

  render() {
    const { t } = this.props;
    let BackgroundImage = require("assets/img/theme/login_bg.png");
    return (
      <>
        <PubNavbar />
        <main
          ref="main"
          style={{
            // backgroundColor:"black",
            paddingTop: "2rem",
            // overflow: "auto",
            width: "-webkit-fill-available",
            display: "table",
            position: "absolute",
            height: "-webkit-fill-available",
            backgroundSize: "cover",
            backgroundImage: `url(${BackgroundImage})`,
            // "linear-gradient(to top, #e5a8cf, #c99bca, #ab90c3, #8b85ba, #6a7aae, #7679b0, #8277b0, #8f75af, #c67caa, #ee8a98, #ffa484, #fcc67a)",

          }}
        >
          <section
            className="section-shaped"
            style={{
              // paddingTop: "4rem",
            }}
          >
            <Container className="pt-lg-md ">
              {/* <br/><br/> */}
              <Row className="justify-content-center">
                <Col lg="5">
                  <Card className=
                  // bg-secondary
                   "shadow border-0"
                   style={{backgroundColor: "transparent", paddingTop:"20px", borderRadius:"40px", webkittextstroke: "thin"}} >
                    <div className=
                    // bg-white
                    "pb-5">
                      <div className=
                      
                      "text-white text-center mb-3">
                        <small>{t("Sign in with")}</small>
                        <StyledFirebaseAuth
                          uiConfig={this.uiConfig}
                          firebaseAuth={firebase.auth()}
                        />
                      </div>
                    </div>
                    <CardBody
                      className="px-lg-5 py-lg-5"
                    >
                      <div className="text-center text-white mb-4">
                        <small>{t("Or sign in with credentials")}</small>
                      </div>
                      <Form id="formLogin" role="form" onSubmit={this.onLogin}>
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
                              onChange={this.handleChangeData}
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
                              onChange={this.handleChangeData}
                            />
                          </InputGroup>
                        </FormGroup>
                        <div className="text-muted font-italic justify-content-center">
                          <small>
                            {/* password strength:{" "} */}
                            <span className="text-danger font-weight-100">
                              {this.state.error}
                            </span>
                          </small>
                        </div>

                        <div className="text-center">
                          <Button
                            className="my-4"
                            color="primary"
                            type="submit"
                            onClick={this.onLogin}
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
}
export default withTranslation()(Login);

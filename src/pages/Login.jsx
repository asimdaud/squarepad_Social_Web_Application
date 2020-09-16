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
class Login extends React.Component {
  state = {
    email: "",
    password: "",
    isSignedIn: false,
    value: "en",
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
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false,
    },
  };

  componentDidMount = () => {
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
    return (
      <>
        <PubNavbar />
        <main ref="main">
          <section className="section-shaped" style={{paddingTop: "4rem"}}>
            <div className="shape shape-style-1 bg-gradient-default">
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
                          uiConfig={this.uiConfig}
                          firebaseAuth={firebase.auth()}
                        />
                      </div>

                    </CardHeader>
                    <CardBody className="px-lg-5 py-lg-5">
                      <div className="text-center text-muted mb-4">
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
                        onClick={e => e.preventDefault()}
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

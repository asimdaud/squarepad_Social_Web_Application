import React from "react";
import classnames from "classnames";

import { Link } from "react-router-dom";
import "../assets/css/login.css"
import Snackbar from "@material-ui/core/Snackbar";
import { Alert } from "reactstrap";
import images from "../components/Themes/images";

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
        // scopes: ["https://www.googleapis.com/auth/contacts.readonly"],
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
// localStorage.clear();


//     localStorage.setItem("lang", "en");

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

  onDismiss=()=>{
    this.setState({error:""})
  }

  render() {
    const { t } = this.props;
    let BackgroundImage = require("assets/img/theme/login_bg.png");
    return (
      <>
        {/* <PubNavbar /> */}
        <main
          ref="main"
          style={{
            // backgroundColor:"black",
            // paddingTop: "2rem",
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
{/* <div 
style={{
  width: "-webkit-fill-available",
  display: "table",
  position: "absolute",
  height: "-webkit-fill-available",
  backgroundSize: "cover",
  backgroundImage: `url(${BackgroundImage})`,
  WebkitFilter:"blur(2px)"


}}
>
  </div>
 */}


          <section
            // className="section-shaped"
            style={{
              paddingTop: "4rem",
              // top:"50px"
            }}
          >
            <Container className="pt-lg-md ">
              {/* <br/><br/> */}
              <Row className="justify-content-center">
                <Col lg="5">
                  <Card className=
                  
                  // bg-secondary
                   "shadow border-0"
                   style={{ backdropFilter:"blur(15px)"  
                     ,backgroundColor: "transparent", paddingTop:"20px", borderRadius:"40px", webkittextstroke: "thin"}} >
                    <div 
                    style={{zIndex:"0px"}}
                    // className=
                    // "bg-white
                    // pb-5"
                    >
                      <div className=
                      
                      "text-white text-center mb-3">
                        {/* <small>{t("Sign in with")}</small> */}
                        <StyledFirebaseAuth
                          uiConfig={this.uiConfig}
                          firebaseAuth={firebase.auth()}
                        />
                      </div>
                    </div>
                    <CardBody
                      className="px-lg-5 "
                      // py-lg-5
                    >
                      <div className="text-center text-white mb-4">
                        <small>{t("Or sign in with credentials")}</small>
                      </div>
                      <Form id="formLogin" role="form" onSubmit={this.onLogin}>
                        <FormGroup className="mb-3">
                          <InputGroup 
                          
                          className={classnames(
                            "input-group-alternative",
                            {
                              "input-group-focus": this.state.focus1,
                            }
                          )}
                          style={{

                            outlineStyle:this.state.error?"double":"none",
                            outlineColor:this.state.error?"red":"none",
                            outlineWidth:this.state.error?"thin":"none"
                          }}
                          >
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
                              onFocus={(e) => this.setState({ focus1: true })}
                              onBlur={(e) => this.setState({ focus1: false })}
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <InputGroup 
                          
                          className={classnames(
                            "input-group-alternative",
                            {
                              "input-group-focus": this.state.focus2,
                            }
                          )}

                          style={{

                            outlineStyle:this.state.error?"double":"none",
                            outlineColor:this.state.error?"red":"none",
                            outlineWidth:this.state.error?"thin":"none"
                          }}>
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
                              onFocus={(e) => this.setState({ focus2: true })}
                              onBlur={(e) => this.setState({ focus2: false })}
                            />
                          </InputGroup>
                        </FormGroup>
                          {/* <div className="text-muted font-italic justify-content-center">
                            <small>
                              <span className="text-danger font-weight-100">
                                {this.state.error}
                              </span>
                            </small>
                          </div> */}
                        <div className="text-center">
                          <Button
                            className="my-4"
                            color={!this.state.error?
                          "primary"
                              :
                          "danger"
                          }
                            type="submit"
                            onClick={this.onLogin}
                          >
                            {t("Sign in")}
                          </Button>
                        </div>
                      </Form>
                      <Row className="mt-3">
                    <Col xs="6"
                                        style={{fontWeight:"bold", fontSize:"73%"}}>

                
                    <Link to="/forgotPassword">
                      
                        {t("Forgot password?")}
                      </Link>
                    </Col>{" "}
                    <Col className="text-right" xs="6"
                    style={{fontWeight:"bold", fontSize:"73%"}}>
                      <Link to="/register">
                        {" "}
                        {t("Create new account")}
                      </Link>
                    </Col>
                  </Row>

                    </CardBody>
                
                 
                  </Card>
                
                    <Snackbar
                  open={this.state.error}
                  autoHideDuration={5000}
                  onClose={this.onDismiss}
                  // message={this.state.error}
                  // style={{ width: "100%" }}
                >
                  <Alert

                  style={{backgroundColor:"#ba2c2c"
                ,borderRadius:"45px", paddingTop:"25px",zoom:"80%"}}

                >
                  <p
                  style={{textAlign:"-webkit-center"}}>
                    <img
                        className="icSend"
                        src={images.errorCircle}
                        alt="icon send"
                        
                      />

{this.state.error}
                      </p>
                </Alert>
                </Snackbar>
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

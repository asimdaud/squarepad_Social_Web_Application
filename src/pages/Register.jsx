import React from "react";

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
  FormFeedback,
  InputGroup,
  Container,
  Row,
  Col,
  Label,
} from "reactstrap";

// core components
import PubNavbar from "components/Navbars/PubNavbar.jsx";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import firebase from "firebase";
import { CreateUser } from "../services/authServices";
import "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { withTranslation } from "react-i18next";

// const [, ] = useState(false);

// const handleSubmit = (event) => {
//   const form = event.currentTarget;
//   if (form.checkValidity() === false) {
//     event.preventDefault();
//     event.stopPropagation();
//   }

//   setValidated(true);
// };


class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      name: "",
      email: "",
      password: "",
      bio: "",
      isSignedIn: false,
      isUsernameAvailable: true,
      usernameChecked: false,
      isUsernameValid: true,
      // value: "en",
      value: localStorage.getItem("lang")
        ? localStorage.getItem("lang")
        : "en",
      // setValidated: false,
      // validated: false,
      error: "",
      text: "",
    };
  }

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
      // firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false,
    },
  };

  componentDidMount = () => {
    localStorage.setItem("lang", "en");
    // localStorage.setItem("ss", "en");
// console.log(   JSON.parse(localStorage.getItem("lang")))   ;
// console.log(   localStorage.getItem("lang")) ;
// console.log(   localStorage.getItem("ss")) ;

// console.log(   JSON.parse(localStorage.getItem("ss")))   ;
    
// this.hollow().then(() => {

    // this.handleSubmit();
    // });

    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ isSignedIn: !!user });
      console.log("user", user);
      if (this.state.isSignedIn) 
      {      this.next(user);
    
      }
      });
  };

  componentWillUnmount = () => {};

  // UNSAFE_componentWillMount=()=>{
  //   firebase.auth().onAuthStateChanged((user) => {
  //     this.setState({ isSignedIn: !!user });
  //     console.log("user", user);
  //     if(this.state.isSignedIn)
  //     this.next(user);

  //   });

  // }

  next = (user) => {
    // if (!firebase.firestore().collection("users").doc(user.uid)) {

      
      
      
      firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .set({
        // username: user.email.replace('@','').toLowerCase(),   
        name: user.displayName,
          email: user.email,
          profilePic: user.photoURL,
          publicProfile: true,
          emailAlert: false,
          bio: user.displayName + "'s bio.",
        });
        // }
        localStorage.setItem(
          "uid",
          JSON.stringify(firebase.auth().currentUser.uid)
    );
    localStorage.setItem("user", JSON.stringify(firebase.auth().currentUser));
    
    // localStorage.setItem("lang", "en");
    
    // this.props.history.push("/update");
    
    
    // alert(localStorage.getItem("uid"));
    // console.log(cred);
    // this.props.history.push("/profile");
  };
  
  handleChangeData = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  // checkUsernameAvailability = () => {
  //   // this.setState({
  //   //   [e.target.id]: e.target.value,
  //   // });

  //   firebase.firestore().collection("usernames").doc(this.state.username)
  //     .get()
  //     .then((snapshot) => {
  //       if (snapshot.exists) {
  //         this.setState({ isUsernameAvailable: false });
  //       } else {
  //         alert("Username is taken");        }
  //     });
  //   // if (firebase.firestore().collection("usernames").doc(this.state.username))
  //   //   this.setState({ isUsernameAvailable: false });
  //   // else alert("Username is taken");
  // };
  textInput = (word) => {
    this.setState({
      [word.target.id]: word.target.value,
    });

    // word.preventDefault();
    // this.setState({ username: word });
    this.searchUsername(word.target.value);
    // console.log("textinput+   " + word);
  };

  searchUsername(word) {
    // let userCollectionRef = firebase.firestore().collection("usernames");
    // let userCollectionRef = firebase.firestore().collection("users");

    // // console.log(word);
    // // let users = [];

    //   .get()
    //   .then((querySnapshot) => {

    //       this.setState({ isUsernameAvailable: false });
    //               console.log(this.state.isUsernameAvailable,"LOLA",word);

    //     });

    // if (userCollectionRef.where("username", "==", word)) {
    //   this.setState({ isUsernameAvailable: false });
    //   console.log(this.state.isUsernameAvailable, "n/a", word);
    // } else console.log(this.state.isUsernameAvailable, "free", word);

    let userCollectionRef = firebase.firestore().collection("users");
    var pattern = new RegExp(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/); //unacceptable chars

    // console.log(word);
    if (word.length > 3) {
      this.setState({ usernameChecked: true });
    }
    let users = [];
    userCollectionRef
      .where("username", "==", word.toLowerCase())
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          users.push(documentSnapshot.data());
          //   console.log(documentSnapshot.id);
          // this.setState({
          //   // username: documentSnapshot.username,
          //   isUsernameAvailable: true,
          //   // usernameChecked: true,
          // });
          // console.log(this.state.foundUser)
          // console.log(users);
        });
        // console.log(this.state.searchResults);
        // console.log(this.state.foundUser);
        if (pattern.test(word)) {
          this.setState({
            isUsernameValid: false,
            isUsernameAvailable:false,

          });
          console.log(this.state.isUsernameValid, "Invalid");
        } else {
          if (users.length == 0) {
            this.setState({
              isUsernameAvailable: true,
            });
            console.log(this.state.isUsernameAvailable, "free");
          } else {
            this.setState({
              username: "",
              isUsernameAvailable: false,
            });
            console.log(this.state.isUsernameAvailable, "taken");
          }

        }
    
     
      });
  }

  //   hollow =  async () => {
  // console.log("hollow");
  //   };

  handleSubmit = (e) => {
    e.preventDefault();
    var pattern = new RegExp(/[~`@!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/); //unacceptable chars
    localStorage.clear();
    const { username, name, email, password, bio } = this.state;
    console.log(this.state);
    // CreateUser()
    if (username == "" || name == "" || email == "" || password == "") {
      alert("Please fill in the fields");
    } else if (pattern.test(username)) {
      alert("Please only use standard alphanumerics for username");
    }
    //  if (username !== "" && name !== "")
    else if(this.state.isUsernameAvailable) {
      CreateUser(username, name, email, password, bio)
        .then((res) => {
          console.log(res);
          this.props.history.push("/profile");
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  // handleSubmit = (e) => {
  //   e.preventDefault();
  //   localStorage.clear();
  //   const { username, name, email, password, bio } = this.state;
  //   console.log(this.state);
  //   // CreateUser()
  //   // if (this.state.username !== "") {
  //     CreateUser(username, name, email, password, bio)
  //     // this.hollow()
  //       .then(() => {
  //         this.props.history.push("/profile");
  //       })
  //       .catch((err) => {
  //         console.log(err.message);
  //         this.setState({ error: err.message });
  //       });
  //   // }
  // };

  render() {
    const { t } = this.props;

    return (
      <>
        <PubNavbar />
        <main ref="main">
          <section className="section-shaped" style={{ paddingTop: "4rem" }}>
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
            <Container className="pt-lg-md mt--100">
              <br />
              <br />
              <Row className="justify-content-center">
                <Col lg="5">
                  <Card className="bg-secondary shadow border-0">
                    <CardHeader className="bg-white pb-5">
                      <div className="text-muted text-center mb-3">
                        <small>{t("Sign up with")}</small>
                      </div>
                      <div className="text-center">
                        <StyledFirebaseAuth
                          uiConfig={this.uiConfig}
                          firebaseAuth={firebase.auth()}
                        />
                      </div>
                    </CardHeader>
                    <CardBody className="px-lg-5 py-lg-5">
                      <div className="text-center text-muted mb-4">
                        <small>{t("Or sign up with credentials")}</small>
                      </div>
                      <Form role="form" onSubmit={this.handleSubmit}>
                        <FormGroup>

                        <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-hat-3" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder={t("Display Name")}
                              type="text"
                              id="name"
                              onChange={this.handleChangeData}
                            />
                          </InputGroup>

                          <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                {/* <i className="ni ni-email-83" /> */}@
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              valid={
                                this.state.isUsernameAvailable &&
                                this.state.usernameChecked 
                                // &&
                                // this.state.isUsernameValid
                              }
                              invalid={
                                !this.state.isUsernameAvailable &&
                                this.state.usernameChecked
                                //  &&
                                // !this.state.isUsernameValid
                              }
                              // style={{

                              //   color:"orange",
                              //   backgroundColor:"pink"
                              // }}
                              placeholder={t("username")}
                              type="text"
                              id="username"
                              className="form-control"
                              onChange={(word) => this.textInput(word)}
                              aria-describedby="inputGroupPrepend"
                              required
                            />

                            <FormFeedback valid>
                              Sweet! that username is available
                            </FormFeedback>

                            <FormFeedback invalid>
                              Bummer! 
                            </FormFeedback>
                            {/* <Form.Control
                              type="text"
                              placeholder="Username"
                              aria-describedby="inputGroupPrepend"
                              onChange={(word) => this.textInput(word)}
                              id="username"
                              required
                            />
                            <FormFeedback invalid>
                              Please choose a username.
                            </FormFeedback> */}

                            {/* <Input
                              // style={{

                              //   color:"orange",
                              //   backgroundColor:"pink"
                              // }}
                              placeholder={t("Username")}
                              type="text"
                              id="username"
                              className="form-control"
                              onChange={(word) => this.textInput(word)}
                              aria-describedby="inputGroupPrepend" required
                            /> */}
                          </InputGroup>


                        </FormGroup>

                        {/* <FormGroup
                          className={
                            this.state.isUsernameAvailable &&
                            this.state.usernameChecked
                              ? "has-success"
                              : "has-danger"
                          }
                        >
                          <InputGroup>
                            <Input
                              placeholder={t("Username")}
                              type="text"
                              id="username"
                              className={
                                this.state.isUsernameAvailable &&
                                this.state.usernameChecked
                                  ? "form-control is-valid"
                                  : "form-control is-invalid"
                              }
                              onChange={(word) => this.textInput(word)}
                              aria-describedby="inputGroupPrepend"
                              required
                            />
                          </InputGroup>
                        </FormGroup> */}

                        <FormGroup>
                          <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-email-83" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder={t("Email")}
                              type="email"
                              id="email"
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
                              placeholder={t("Password")}
                              type="password"
                              id="password"
                              onChange={this.handleChangeData}
                              autoComplete="off"
                            />
                          </InputGroup>
                        </FormGroup>
                        {/* <InputGroup className="input-group-alternative mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-email-83" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder={t("My Bio")}
                            type="text"
                            id="bio"
                            onChange={this.handleChangeData}
                          />
                        </InputGroup> */}

                        <div className="text-muted font-italic">
                          <small>
                            {/* password strength:{" "} */}
                            <span className="text-danger font-weight-700">
                              {this.state.error}
                            </span>
                          </small>
                        </div>

                        {/* <div className="text-muted font-italic">
                          <small>
                            password strength:{" "}
                            <span className="text-success font-weight-700">
                              strong
                            </span>
                          </small>
                        </div> */}
                        <Row className="my-4">
                          <Col xs="12">
                            {/* <div className="custom-control custom-control-alternative custom-checkbox">
                              <input
                                className="custom-control-input"
                                id="customCheckRegister"
                                type="checkbox"
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="customCheckRegister"
                              >
                                <span>
                                  I agree with the{" "}
                                  <a
                                    href="#pablo"
                                    onClick={e => e.preventDefault()}
                                  >
                                    Privacy Policy
                                  </a>
                                </span>
                              </label>
                            </div> */}
                          </Col>
                        </Row>
                        <div className="text-center">
                          <Button
                            className="mt-4"
                            color="primary"
                            type="submit"
                            onClick={this.handleSubmit}
                          >
                            {t("Create account")}
                          </Button>
                        </div>
                      </Form>
                    </CardBody>
                  </Card>
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

export default withTranslation()(Register);

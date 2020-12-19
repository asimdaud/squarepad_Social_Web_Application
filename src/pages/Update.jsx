import React from "react";
import moment from "moment";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Badge,
  InputGroupAddon,
  InputGroupText,
  FormFeedback,
  InputGroup,
  Col,
  Modal,
} from "reactstrap";
// import DemoNavbar from "components/Navbars/DemoNavbar";
import UserNavbar from "components/Navbars/UserNavbar";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
// import {profilePic} from "../examples/Profile";
import { Link } from "react-router-dom";
import imageCompression from 'browser-image-compression';

import * as firebase from "firebase";
import { EditUser } from "../services/authServices";

import { withTranslation } from "react-i18next";

class Update extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user3: JSON.parse(localStorage.getItem("uid")),
      uid: "uid",
      profilePic: require("assets/img/icons/user/user1.png"),
      // "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg",
      username: "",
      bio: "",
      name: "",
      email: "",
      publicProfile: true,
      emailAlert: true,
      interestsArr: [],
addedUsername:"",
      defaultModal: true,
      modalItem: undefined,
      progress: 0,
      isLoading: false,
      isUsernameAvailable: true,
      usernameChecked: false,
      isUsernameValid: true,
      value: localStorage.getItem("lang") ? localStorage.getItem("lang") : "en",
      error: "",
      text: "",
    };
  }

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };

  handleChange = (event) => {
    console.log("selected val is ", event.target.value);
    let newlang = event.target.value;
    this.setState((prevState) => ({ value: newlang }));
    console.log("state value is", newlang, this.props.i18n.changeLanguage);
    this.props.i18n.changeLanguage(newlang);
  };

  toggleChangeProfile = () => {
    this.setState({
      publicProfile: !this.state.publicProfile, // flip boolean value
    });
  };

  toggleChangeAlert = () => {
    this.setState({
      emailAlert: !this.state.emailAlert, // flip boolean value
    });
  };

  handleChangeData = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      username,
      name,
      bio,
      publicProfile,
      profilePic,
      emailAlert,
    } = this.state;
    console.log(this.state);
    if (!username) {
      alert("Username cannot be empty");
    } else if (username.length < 4) {
      alert("Username must be atleast 4 characters");
    } else {
      EditUser(username, name, bio, publicProfile, profilePic, emailAlert);
      // this.props.history.push("/profile");
      this.setState({addedUsername:username});

    }
  };

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user: user });

      firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .onSnapshot((doc) => {
          const res = doc.data();

          if (res != null) {
            this.setState({
              username: res.username,
              bio: res.bio,
              name: res.name,
              email: res.email,
              profilePic: res.profilePic,
              emailAlert: res.emailAlert,
              publicProfile: res.publicProfile,
              addedUsername: res.username,
            });
          }
          // console.log(res);
        });
    });
  };

  handleImageUpload = async  (event) => {

    const imageFile = event.target.files[0];
    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    try {
      const compressedFile = await imageCompression(imageFile, options);
      console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
      console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

      await this.handleUpload(compressedFile);
      // console.log(compressedFile)
      // uploadToServer(compressedFile); // write your own logic
    } catch (error) {
      console.log(error);
    }

  }

 

  handleUpload = (file) => {
    const uploadTask = firebase
      .storage()
      .ref()
      .child("profilePics/(" + this.state.user3 + ")ProfilePic")
      .put(file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function ...
        const getProgress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress: getProgress });
      },
      (error) => {
        // Error function ...
        console.log(error);
      },
      () => {
        // complete function ...

        // profile pic
        const firebaseProfilePic = firebase
          .storage()
          .ref()
          .child("profilePics/(" + this.state.user3 + ")ProfilePic");
        firebaseProfilePic
          .getDownloadURL()
          .then((url) => {
            // Inserting into an State and local storage incase new device:
            this.setState({ profilePic: url });
          })
          .catch((error) => {
            // Handle any errors
            switch (error.code) {
              case "storage/object-not-found":
                // File doesn't exist
                this.setState({
                  profilePic: require("assets/img/icons/user/user1.png"),
                });
                break;
              default:
            }
            console.log(error);
          });
      }
    );
  };

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
            isUsernameAvailable: false,
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

  render() {
    const { t } = this.props;
    return (
      <>
        <Modal
          size="lg"
        isOpen={!this.state.addedUsername}
          toggle={() => this.toggleModal("defaultModal")}
          className="fluid"
          // style={{overflowWrap:"anywhere"}}
        >
          <Card className="card-profile shadow">
            <CardHeader className="bg-white border-0">
              <Row className="align-items-center">
                <Col xs="8">
                  <h3 className="mb-0">{t("Set Up Your Account")}</h3>
                </Col>
                {/* <Col className="text-right" xs="4">
                  <Button
                    color="default"
                    size="sm"
                    to="/profile"
                    tag={Link}
                    disabled
                  >
                    {t("Your Profile")}
                  </Button>
                </Col> */}
              </Row>
            </CardHeader>
            <CardBody>
              <Form role="form" onSubmit={this.handleSubmit}>
                <div className="pl-lg-4">
                  {this.state.profilePic ? (
                    <Row className="justify-content-center" style={{marginTop:"30px"}}>
                      <Col lg="8">
                        <FormGroup>
                          <Row className="justify-content-center">
                            <a
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              <img
                                alt="..."
                                style={{
                                  width: "200px",
                                  height: "200px",
                                  display: "block",
                                  objectFit: "cover",
                                }}
                                src={this.state.profilePic}
                                className="rounded-circle img-responsive"
                              />
                            </a>
                          </Row>{" "}
                          <Row className="justify-content-center">
                            <label className="form-control-label">
                              <h6 className="description">
                                {" "}
                                {t("Profile Picture")}
                              </h6>{" "}
                            </label>
                          </Row>
                          <Row className="justify-content-center">
                            <Col lg="4"></Col>
                            <Col>
                              <input
                                ref={(el) => {
                                  this.refInput = el;
                                }}
                                accept="image/*"
                                className="small"
                                type="file"
                                onChange={event => this.handleImageUpload(event)}
                              />

                              <progress value={this.state.progress} max="100" />
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    </Row>
                  ) : (
                    <Row className="justify-content-center" style={{marginTop:"30px"}}>
                      <Col lg="8">
                        <FormGroup>
                          <Row className="justify-content-center">
                            <a
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              <img
                                // className="rounded img-responsive"
                                alt="..."
                                style={{
                                  width: "200px",
                                  height: "200px",
                                  display: "block",
                                  objectFit: "cover",
                                }}
                                src={
                                  require("assets/img/icons/user/user1.png")
                                  // "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg"
                                }
                                className="rounded-circle img-responsive"
                              />
                            </a>
                          </Row>{" "}
                          <Row className="justify-content-center">
                            <label
                              className="form-control-label"
                              // htmlFor="input-username"
                              style={{ padding: "2px" }}
                            >
                              <h6 className="description">
                                {" "}
                                {t("Upload Your Profile Picture")}
                              </h6>{" "}
                            </label>
                          </Row>
                          <Row className="justify-content-center">
                            <Col lg="4"></Col>
                            <Col>
                              <input
                                ref={(el) => {
                                  this.refInput = el;
                                }}
                                accept="image/*"
                                className="small"
                                type="file"
                                onChange={event => this.handleImageUpload(event)}
                              />

                              <progress value={this.state.progress} max="100" />
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    </Row>
                  )}

                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="3">
                        <label
                          className="form-control-label"
                          // htmlFor="input-username"
                        >
                          {t("Username")}
                          {/* <h2 className="description">
                            {t("Choose a username")}
                          </h2> */}
                        </label>
                      </Col>
                      <Col lg="8">
                        {/* <Input
                          className="form-control-alternative"
                          placeholder={this.state.username}
                          type="text"
                          id="username"
                          onChange={this.handleChangeData}
                        /> */}

                        <InputGroup className="input-group-alternative mb-3 shadow">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>@ </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            valid={
                              this.state.isUsernameAvailable &&
                              this.state.usernameChecked
                            }
                            invalid={
                              !this.state.isUsernameAvailable &&
                              this.state.usernameChecked
                            }
                            placeholder={this.state.username}
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

                          <FormFeedback invalid>Bummer!</FormFeedback>
                        </InputGroup>
                      </Col>
                      {/* </FormGroup> */}
                    </Row>
                  </div>

                  {!this.state.name ? (
                    <div
                      className="pl-lg-4"
                      style={{ marginTop: "30px", marginBottom: "20px" }}
                    >
                      <Row>
                        <Col lg="3">
                          <label
                            className="form-control-label"
                            // htmlFor="input-last-name"
                          >
                            {t("Display Name")}
                            {/* <h4 className="description">{t("Display Name")}</h4> */}
                          </label>
                        </Col>

                        <Col lg="8">
                          <Input
                            className="form-control-alternative shadow"
                            placeholder={this.state.name}
                            type="text"
                            id="name"
                            onChange={this.handleChangeData}
                          />
                        </Col>
                      </Row>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <hr className="my-4" />
                  <div className="pl-lg-4" style={{ marginBottom: "30px" }}>
                    <FormGroup>
                      <label>{t("Add Your Bio")}</label>
                      <Input
                        className="form-control-alternative shadow"
                        rows="2"
                        placeholder={this.state.bio}
                        type="textarea"
                        id="bio"
                        onChange={this.handleChangeData}
                      />
                    </FormGroup>
                  </div>
                

                <Row className="justify-content-center">
                  <Col lg="2">
                    <Button
                      color="outline-info"
                      type="submit"
                      onClick={this.handleSubmit}
                      size="md"
                      block
                    >
                      {t("Update")}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Modal>
      </>
    );
  }
}

export default withTranslation()(Update);

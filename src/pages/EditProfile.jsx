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
  Col,
  Modal,
} from "reactstrap";
// import DemoNavbar from "components/Navbars/DemoNavbar";
import UserNavbar from "components/Navbars/UserNavbar";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
// import {profilePic} from "../examples/Profile";
import { Link } from "react-router-dom";

import * as firebase from "firebase";
import { EditUser } from "../services/authServices";

import { withTranslation } from "react-i18next";

class EditProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user3: JSON.parse(localStorage.getItem("uid")),
      uid: "uid",
      profilePic:
      require('assets/img/icons/user/user1.png'),
        // "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg",
      username: "Username",
      bio: "This is my bio",
      name: "Name",
      email: "email@default.com",
      publicProfile: true,
      emailAlert: true,
      interestsArr: [],
      // posts: [],
      // loading: true
      // showModal: false,
      // defaultModal: false
      defaultModal: false,
      modalItem: "",
      progress: 0,
      isLoading: false,
      value: "en",
  
    };
  }

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
      emailAlert: !this.state.emailAlert  // flip boolean value
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
    EditUser(username, name, bio, publicProfile, profilePic, emailAlert);
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
              publicProfile: res.publicProfile
            });
          }
          // console.log(res);
        });
    });
  };

  onChoosePhoto = (event) => {
    if (event.target.files && event.target.files[0]) {
      this.setState({ isLoading: true });
      this.currentPhotoFile = event.target.files[0];
      // Check this file is an image?
      const prefixFiletype = event.target.files[0].type.toString();
      if (prefixFiletype.indexOf("image/") === 0) {
        // this.uploadPhoto();
        this.handleUpload();
      } else {
        this.setState({ isLoading: false });
        this.props.showToast(0, "This file is not an image");
      }
    } else {
      this.setState({ isLoading: false });
    }
  };

  uploadPhoto = () => {
    const uploadTask = firebase
      .storage()
      .ref()
      .child("profilePics/(" + this.state.user3 + ")ProfilePic")
      .put(this.currentPhotoFile);

    firebase
      .firestore()
      .collection("users")
      // .doc(auth.currentUser.uid)
      .doc(this.state.user3)
      .update({
        profilePic: "profilePics/(" + this.state.user3 + ")ProfilePic",
      });

    uploadTask.on(
      // "state_changed",
      // null,
      (snapshot) => {
        const getProgress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress: getProgress });
      },
      (err) => {
        this.setState({ isLoading: false });
        // this.props.showToast(0, err.message);
      },

      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          this.setState({ isLoading: false });
          // this.onSendMessage(downloadURL, 1);
        });
      }
    );
  };

  handleUpload = () => {
    const uploadTask = firebase
      .storage()
      .ref()
      .child("profilePics/(" + this.state.user3 + ")ProfilePic")
      .put(this.currentPhotoFile);

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
                  profilePic:
                  require('assets/img/icons/user/user1.png'),
                });
                break;
              default:
            }
            console.log(error);
          });
      }
    );
  };

  render() {
    const {t}= this.props;
    return (
      <>
        <UserNavbar />
        <main
          className="profile-page"
          ref="main"
          style={{
            // backgroundColor:"black",
            backgroundImage:
              "radial-gradient(circle, #e4efe9, #c4e0dd, #a7cfd9, #94bcd6, #93a5cf)",
          }}
        >
          <section
            className="section section-blog-info"
            style={{ marginTop: "200px" }}
          >
            <Container className="" fluid>
              <Row className="justify-content-center">
                <Col className="order-xl-1" xl="8">
                  <Card className="card-profile shadow">
                    <CardHeader className="bg-white border-0">
                      <Row className="align-items-center">
                        <Col xs="8">
                          <h3 className="mb-0">{t("My account")}
                          </h3>
                        </Col>
                        <Col className="text-right" xs="4">
                          <Button
                            color="info"
                            type="submit"
                            onClick={this.handleSubmit}
                            size="sm"
                          >
                            {t("Save")}
                          </Button>

                          <Button
                            color="default"
                            size="sm"
                            to="/profile"
                            tag={Link}
                          >
                            
                            {t("Back to profile")}
                          </Button>
                        </Col>
                      </Row>
                    </CardHeader>
                    <CardBody>
                      <Form role="form" onSubmit={this.handleSubmit}>
                        <div className="pl-lg-4">
                          <Row className="justify-content-center">
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
                                        this.state.profilePic
                                          ? this.state.profilePic
                                          : 
                                          require('assets/img/icons/user/user1.png')
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
                                  >
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
                                      onChange={this.onChoosePhoto}
                                    />

                                    <progress
                                      value={this.state.progress}
                                      max="100"
                                    />
                                  </Col>
                                </Row>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  // htmlFor="input-username"
                                >
                                  {" "}
                                  <h4 className="description">{t("Username")}</h4>
                                </label>
                                <Input
                                  className="form-control-alternative"
                                  placeholder={this.state.username}
                                  type="text"
                                  id="username"
                                  onChange={this.handleChangeData}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  // htmlFor="input-last-name"
                                >
                                  <h4 className="description">
                                  {t("Display Name")}
                                  </h4>
                                </label>

                                <Input
                                  className="form-control-alternative"
                                  placeholder={this.state.name}
                                  type="text"
                                  id="name"
                                  onChange={this.handleChangeData}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <br />
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label className="form-control-label">
                                  {" "}
                                  <h4 className="description">
                                    
                                    {t("Profile privacy settings")}
                                  </h4>
                                </label>

                                <div className="custom-control custom-checkbox mb-3">
                                  <input
                                    className="custom-control-input"
                                    id="emailAlert"
                                    type="checkbox"
                                    checked={this.state.emailAlert}
                                    onChange={this.toggleChangeAlert}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="emailAlert"
                                  >
                                    <p className="description">
                                      
                                      {t("Send email everytime you login")}
                                    </p>
                                  </label>
                                </div>

                                <div className="custom-control custom-checkbox mb-3">
                                  <input
                                    className="custom-control-input"
                                    id="publicProfile"
                                    type="checkbox"
                                    checked={!this.state.publicProfile}
                                    onChange={this.toggleChangeProfile}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="publicProfile"
                                  >
                                    <p className="description">
                                      {t("Private profile")}
                                      
                                    </p>
                                  </label>
                                </div>

                              </FormGroup>
                            </Col>
                          </Row>
                        </div>
                        <hr className="my-4" />
                        {/* Description */}
                        <h6 className="heading-small text-muted mb-4">
                          {t("About Me")}
                          
                        </h6>
                        <div className="pl-lg-4">
                          <FormGroup>
                            <label>
                              {t("My Bio")}
                            </label>
                            <Input
                              className="form-control-alternative"
                              rows="4"
                              placeholder={this.state.bio}
                              type="textarea"
                              id="bio"
                              onChange={this.handleChangeData}
                            />
                          </FormGroup>
                        </div>

                        <hr className="my-4" />
                      </Form>

                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </section>
        <SimpleFooter />
        </main>
      </>
    );
  }
}

export default withTranslation()(EditProfile);

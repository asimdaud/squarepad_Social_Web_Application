import React from "react";
import moment from "moment";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import imageCompression from "browser-image-compression";
import Avatar from "react-avatar-edit";
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
  ModalFooter,
  ModalHeader,
} from "reactstrap";
// import DemoNavbar from "components/Navbars/DemoNavbar";
import UserNavbar from "components/Navbars/UserNavbar";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
// import {profilePic} from "../examples/Profile";
import { Link } from "react-router-dom";
import Update from "./Update";

import * as firebase from "firebase";
import { EditUser } from "../services/authServices";

import { withTranslation } from "react-i18next";

class EditProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user3: JSON.parse(localStorage.getItem("uid")),
      uid: "uid",
      profilePic: require("assets/img/icons/user/user1.png"),
      // "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg",
      username: "Username",
      bio: "This is my bio",
      name: "Name",
      email: "email@default.com",
      publicProfile: true,
      emailAlert: true,
      interestsArr: [],
      defaultModal: false,
      modalItem: "",
      progress: 0,
      isLoading: false,
      value: "en",
      preview: null,
    };
    this.onCrop = this.onCrop.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onBeforeFileLoad = this.onBeforeFileLoad.bind(this);
  }

  onClose() {
    this.setState({ preview: null, defaultModal: false });
  }

  onCrop(preview) {
    this.setState({ preview: preview });
    // this.handleImageUpload(preview);
    // this.handleUpload(preview);
    // console.log(this.state.preview);
  }

  onBeforeFileLoad(elem) {
    // if(elem.target.files[0].size > 71680){
    //   alert("File is too big!",elem,"lola",elem.target.files[0].size);
    //   elem.target.value = "";
    // };
    // console.log(elem);
    // this.handleImageUpload(elem);
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
              publicProfile: res.publicProfile,
            });
          }
          // console.log(res);
        });
    });
  };

  handleImageUpload = async (event) => {
    const imageFile = event.target.files[0];
    console.log("originalFile instanceof Blob", imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      console.log(
        "compressedFile instanceof Blob",
        compressedFile instanceof Blob
      ); // true
      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      ); // smaller than maxSizeMB
      console.log("asim", compressedFile);
      console.log("daud", event);
      await this.handleUpload(compressedFile);
      // console.log(compressedFile)
      // uploadToServer(compressedFile); // write your own logic
    } catch (error) {
      console.log(error);
    }
  };

  // onChoosePhoto = (event) => {
  //   if (event.target.files && event.target.files[0]) {
  //     this.setState({ isLoading: true });
  //     this.currentPhotoFile = event.target.files[0];
  //     // Check this file is an image?
  //     const prefixFiletype = event.target.files[0].type.toString();
  //     if (prefixFiletype.indexOf("image/") === 0) {
  //       // this.uploadPhoto();
  //       this.handleUpload();
  //     } else {
  //       this.setState({ isLoading: false });
  //       this.props.showToast(0, "This file is not an image");
  //     }
  //   } else {
  //     this.setState({ isLoading: false });
  //   }
  // };

  // uploadPhoto = (file) => {
  //   const uploadTask = firebase
  //     .storage()
  //     .ref()
  //     .child("profilePics/(" + this.state.user3 + ")ProfilePic")
  //     .put(file);

  //   firebase
  //     .firestore()
  //     .collection("users")
  //     // .doc(auth.currentUser.uid)
  //     .doc(this.state.user3)
  //     .update({
  //       profilePic: "profilePics/(" + this.state.user3 + ")ProfilePic",
  //     });

  //   uploadTask.on(
  //     // "state_changed",
  //     // null,
  //     (snapshot) => {
  //       const getProgress = Math.round(
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //       );
  //       this.setState({ progress: getProgress });
  //     },
  //     (err) => {
  //       this.setState({ isLoading: false });
  //       // this.props.showToast(0, err.message);
  //     },

  //     () => {
  //       uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
  //         this.setState({ isLoading: false });
  //         // this.onSendMessage(downloadURL, 1);
  //       });
  //     }
  //   );
  // };

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
            const {
              username,
              name,
              bio,
              publicProfile,
              profilePic,
              emailAlert,
            } = this.state;
            console.log(this.state);
            EditUser(
              username,
              name,
              bio,
              publicProfile,
              profilePic,
              emailAlert
            );
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

  base64toblob = (b64String) => {
    const base64String = b64String.split(",")[1];
    const x = b64String.split(":");
    const contentType = x[1].split(";");
    const blob = this.b64toBlob(base64String, contentType[0]);
    this.handleUpload(blob);
    this.setState({ defaultModal: false });
  };

  b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  render() {
    const { t } = this.props;
    return (
      <>
        {/* <UserNavbar /> */}
        <main
          className="profile-page"
          ref="main"
          style={{
            // backgroundColor:"black",
            height:"100%",
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
                          <h3 className="mb-0">{t("My account")}</h3>
                        </Col>
                        <Col className="text-right" xs="4">
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
                                          : require("assets/img/icons/user/user1.png")
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
                                {/* <input
                                      ref={(el) => {
                                        this.refInput = el;
                                      }}
                                      accept="image/*"
                                      className="small"
                                      type="file"
                                      // onChange={this.onChoosePhoto}
                                      onChange={(event) =>
                                        this.handleImageUpload(event)
                                      }
                                    /> */}
                                <Row
                                  className="justify-content-center"
                                  style={{ padding: "10px" }}
                                >
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      // this.setState({ modalItem: post });
                                      this.setState({ defaultModal: true });
                                    }}
                                  >
                                    Change profile picture
                                  </Button>
                                </Row>
                                <Row className="justify-content-center">
                                  <progress
                                    value={this.state.progress}
                                    max="100"
                                  />
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
                                  <h4 className="description">
                                    {t("Username")}
                                  </h4>
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
                            <label>{t("My Bio")}</label>
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

                        <Row className="justify-content-center">
                          <Button
                            color="info"
                            type="submit"
                            onClick={this.handleSubmit}
                            size="lg"
                            block
                          >
                            {t("Save")}
                          </Button>
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </section>
          <SimpleFooter />
        </main>
        <Modal
          size="xl"
          isOpen={this.state.defaultModal}
          toggle={() => this.toggleModal("defaultModal")}
          className="fluid"
        >
          <Row>
            <Col>
              <Card
                style={{
                  padding: "20px",
                  fontFamily: "system-ui",
                  fontWeight: "normal",
                  textAlign: "center",
                }}
              >
                <ModalHeader>Avatar editor</ModalHeader>
                <div style={{ overflow: "auto", padding: "inherit" }}>
                  <Avatar
                    width={390}
                    height={295}
                    onCrop={this.onCrop}
                    onClose={this.onClose}
                    onBeforeFileLoad={this.onBeforeFileLoad}
                    // src={
                    //   this.state.profilePic
                    //   // ? this.state.profilePic
                    //   // : require("assets/img/icons/user/user1.png")
                    //   // "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg"
                    // }
                  />
                </div>
                {this.state.preview ? (
                  <div style={{ padding: "20px" }}>
                    <img
                      src={this.state.preview}
                      alt="Preview"
                      className="rounded-circle img-responsive border border-danger"
                      style={{
                        padding: "2px",
                        width: "fit-content",
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}
                <ModalFooter>
                  {this.state.preview ? (
                    <Button
                      onClick={() => this.base64toblob(this.state.preview)}
                      color="primary"
                      size="sm"
                    >
                      Save
                    </Button>
                  ) : (
                    ""
                  )}
                  <Button
                    onClick={() => this.onClose()}
                    color="secondary"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </Card>
            </Col>
          </Row>
        </Modal>

        {/* <Update/> */}
      </>
    );
  }
}

export default withTranslation()(EditProfile);

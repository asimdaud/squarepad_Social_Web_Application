import React from "react";
import moment from "moment";
import FadeIn from "react-fade-in";

// reactstrap components
import { Button, Card, Container, Row, Col, Modal, Badge } from "reactstrap";
// import SmoothImage from "react-smooth-image";
// core components
// import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";

// import UserHeader from "components/Headers/UserHeader.jsx";
import * as firebase from "firebase";
// import PostModal from "components/Modal/postModal";
import Post from "../components/post";
import PostPicOnly from "../components/postPicOnly";
import Update from "./Update";
import { Redirect, Link, useRouteMatch } from "react-router-dom";


import UserNavbar from "components/Navbars/UserNavbar";
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  FormControl,
} from "@material-ui/core";
import { withTranslation } from "react-i18next";
import ExampleNavbar from "components/Navbars/ExampleNavbar";
// import defModal from "components/Modal/defModal";
// import postModal from "components/Modal/postModal";
// import Modals from "components/Modal/Modals";

// const user3 = JSON.parse(localStorage.getItem("uid"));

// user3 ? console.log("cSAnt") : console.log("lll");

// const ModalPost = ({showM, handleClose})=> {

//   // const {showM, handleClose} = this.props;

//       // const [modal, setModal] = useState(false);

//       // const toggle = () => setModal(!modal);

//       return (
//       <div>
//         {/* <Button color="danger" onClick={toggle}>{buttonLabel}</Button> */}
//         <Modal
//         isOpen={showM}
//         >
//           <ModalHeader >Modal title</ModalHeader>
//           <ModalBody>
//   <Post/>
//           </ModalBody>
//           <ModalFooter>
//             {/* <Button color="primary" onClick={toggle}>Do Something</Button>{' '} */}
//             <Button color="secondary" onClick={handleClose}>Cancel</Button>
//           </ModalFooter>
//         </Modal>
//       </div>
//     );

//   }

// const onMouseOver = event => {
// event.target.style.color = "#f7f7f7";
// };

// const onMouseOut = event => {
//   event.target.style.color = "#f7f7f7";
// };

class Profile extends React.Component {
  firestoreUsersRef = firebase.firestore().collection("users");
  firestorePostRef = firebase.firestore().collection("posts");

  constructor(props) {
    super(props);

    this.state = {
      user3: JSON.parse(localStorage.getItem("uid")),
      user: {},
      userdb: {},
      uid: "uid",
      profilePic: require("assets/img/icons/user/user1.png"),
      // "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg",
      username: "Username",
      bio: "This is my bio",
      name: "Name",
      email: "email@default.com",
      posts: [],
      loading: true,
      followingList: [],
      followingListData: [],
      followerList: [],
      followerListData: [],
      // showModal: false,
      defaultModal: false,
      modalItem: "",
      value: localStorage.getItem("lang"),
      admin: false,
    };
  }

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user: user });
      // moment().valueOf().toString()

      firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          const res = doc.data();

          if (res != null) {
            this.setState({
              username: res.username,
              bio: res.bio,
              name: res.name,
              email: res.email,
              profilePic: res.profilePic,
              userdb: res,
            });

            if (doc.data().admin) {
              this.setState({ admin: true });
            }
          }

          console.log(res, this.state.userdb);
        });

      // this.interval = setInterval(
      //   () =>
      //   firebase.firestore().collection("users").doc(user.uid).update({
      //     lastOnline: moment().valueOf().toString(),
      //   }),
      //   30000
      // );
    });

    // localStorage.setItem("groupId", JSON.stringify("TCeQwxQ2DprIpZpr431V"));

    this.getFriendList();
    this.getPosts();
    // this.getProfilePic();
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }

  componentWillUnmount() {
    // this.getFollowCount();
    // this.getPosts();
    // this.getProfilePic();
    // clearInterval(this.interval);
  }

  getPosts = () => {
    const cloudImages = [];
    this.firestorePostRef
      .doc(this.state.user3)
      .collection("userPosts")
      .orderBy("time", "desc")
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          let article = {
            username: this.state.username,
            userId: this.state.user3,
            profilePic: this.state.profilePic,
            title: "post",
            // cta: "cta",
            // location: doc.data().location.coordinates,
            // locName: doc.data().location.locationName,
            caption: doc.data().caption,
            image: doc.data().image,
            postId: doc.data().postId,
            timeStamp: doc.data().time,
            // likes:0,
            // locLatLng: "Address",
          };
          cloudImages.push(article);
        });
      });
    this.setState({ posts: cloudImages });
  };

  getFriendList = async () => {
    let following = [];
    let follower = [];
    await this.firestoreUsersRef
      .doc(this.state.user3)
      .collection("followedBy")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((docSnap) => {
          follower.push(docSnap.id);
        });
      });
    await this.firestoreUsersRef
      .doc(this.state.user3)
      .collection("following")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((docSnap) => {
          following.push(docSnap.id);
        });
      });
    this.setState({ followerList: follower, followingList: following });
    // console.log(this.state.followerList);
    // console.log(this.state.followingList);
    this.viewFriendListData();
  };

  viewFriendListData = () => {
    let followerArr = [];
    let Fravatar = require("assets/img/icons/user/user1.png");
    // "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg";
    let Frname, Frusername;
    this.state.followerList.forEach((userId) => {
      //  avatar =  this.getUserPic(userId);
      this.firestoreUsersRef
        .doc(userId)
        .get()
        .then((doc) => {
          Frname = doc.data().name;
          avatar = doc.data().profilePic
            ? doc.data().profilePic
            : require("assets/img/icons/user/user1.png");
          Frusername = doc.data().username;
          let followerList = {
            userId: userId,
            Frname: Frname,
            Frusername: Frusername,
            Fravatar: Fravatar,
          };

          followerArr.push(followerList);
          this.setState({ followerListData: followerArr });
          // console.log(this.state.followedUsersData);
        })
        .catch((err) => {
          console.warn(err);
        });
    });
    let followingArr = [];
    let avatar = require("assets/img/icons/user/user1.png");
    // "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg";
    let name, username;
    this.state.followingList.forEach((userId) => {
      //  avatar =  this.getUserPic(userId);
      this.firestoreUsersRef
        .doc(userId)
        .get()
        .then((doc) => {
          name = doc.data().name;
          avatar = doc.data().profilePic
            ? doc.data().profilePic
            : require("assets/img/icons/user/user1.png");
          username = doc.data().username;

          let followingList = {
            userId: userId,
            name: name,
            avatar: avatar,
            username: username,
          };

          followingArr.push(followingList);
          this.setState({ followingListData: followingArr });
          // console.log(this.state.followedUsersData);
        })
        .catch((err) => {
          console.warn(err);
        });
    });
  };

  postsView = () => {
    const { t } = this.props;
    if (this.state.posts.length > 0) {
      return (
        <div className="container-fluid bg-3 text-center">
          <h3>Posts</h3>
          <div className="row">
            {this.state.posts.map((post, index) => (
              <Card
                className="col-sm-4"
                style={{ padding: "10px", justifyContent: "center",
              }}
                key={index}
                onClick={() => {
                  this.setState({ modalItem: post });
                  this.setState({ defaultModal: true });
                  console.log(this.state.modalItem);
                }}
              >
                <img
                style={{height: "255px", objectFit:"cover"}}
                  src={post.image}
                  className="img-fluid"
                  alt=""
                  // style={{height:'98%'}}
                  // onClick={() => <Modals/>}
                />
              </Card>
            ))}
          </div>
        </div>
        /* <a
      href="#"
      onClick={() => this.toggleModal("defaultModal")}
    >
      Show more
    </a> */
      );
    } else {
      return (
        <div className="container-fluid bg-3 text-center">
          <h6>{t("This user has not posted")}</h6>
          <div className="row"></div>
        </div>
      );
    }
  };

  editprofile() {
    return <Redirect to="/edit-profile" tag={Link} />;
  }

  logOut() {
    localStorage.clear();
  }

  // onHover = (userId) => {
  //   localStorage.setItem("Fuid", JSON.stringify(userId));
  // };

  onMouseOverColor = (event) => {
    event.target.backgroudColor = "#FFFFFF";
  };

  render() {
    const { t } = this.props;
    // const { classes } = this.props;

    // if (this.state.loading){
    //   return <div>My sweet spinner</div>;
    // }
    return (
      <>
        {/* <UserNavbar /> */}
        {/* <ExampleNavbar/> */}
        <main
          className="profile-page"
          ref="main"
          style={{
            // backgroundColor:"black",
            paddingTop: "2rem",
            // overflow: "auto",
            width: "-webkit-fill-available",
            display: "table",
            position: "absolute",
            height: "-webkit-fill-available",
            backgroundImage:
              "radial-gradient(circle, #e4efe9, #c4e0dd, #a7cfd9, #94bcd6, #93a5cf)",
          }}
        >
          <section className="section" style={{ marginTop: "200px" }}>
            <Container>
              <FadeIn transitionDuration={2100} delay={80}>
                <Card className="card-profile shadow">
                  <div className="px-4">
                    <Row className="justify-content-center">
                      <Col
                        className="order-lg-2"
                        lg="3"
                        style={{ padding: "15px" }}
                      >
                        <div className="card-profile-image">
                          <a href="#pablo" onClick={(e) => e.preventDefault()}>
                            <img
                              className="rounded-circle"
                              style={{
                                width: "200px",
                                // height: "200px",
                                // display: "table",
                                objectFit: "cover",
                              }}
                              src={
                                this.state.userdb.profilePic
                                  ? this.state.userdb.profilePic
                                  : require("assets/img/icons/user/user1.png")
                              }
                            />
                          </a>
                        </div>
                      </Col>
                      <Col
                        className="order-lg-3 text-lg-right align-self-lg-center"
                        lg="4"
                      >
                        <div
                          className="card-profile-actions py-4 mt-lg-0"
                          style={{ padding: "5px" }}
                        >
                          <Button
                            className="mr-4"
                            color="default"
                            size="sm"
                            to="/edit-profile"
                            tag={Link}
                          >
                            {t("Edit Profile")}
                          </Button>

                          {this.state.admin ? (
                            <Button
                              className="float-right"
                              color="danger
 "
                              size="sm"
                              to="/admin"
                              tag={Link}
                            >
                              {t("Admin Panel")}
                            </Button>
                          ) : (
                            ""
                          )}
                        </div>
                      </Col>
                      <Col className="order-lg-1" lg="4">
                        <div className="card-profile-stats d-flex justify-content-center">
                          <div>
                            <span className="heading">
                              {" "}
                              {this.state.posts.length}
                            </span>
                            <span className="description">{t("Posts")}</span>
                          </div>

                          <div
                            onClick={
                              this.state.followerList < 1
                                ? (e) => e.preventDefault()
                                : () => this.toggleModal("defaultModal3")
                            }
                          >
                            <span className="heading">
                              {" "}
                              {this.state.followerList.length}
                            </span>
                            <span className="description">
                              {t("Followers")}
                            </span>
                          </div>
                          <div
                            onClick={
                              this.state.followingList < 1
                                ? (e) => e.preventDefault()
                                : () => this.toggleModal("defaultModal2")
                            }
                          >
                            <span className="heading">
                              {" "}
                              {this.state.followingList.length}
                            </span>
                            <span className="description">
                              {t("Following")}
                            </span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <div className="text-center mt-5">
                      <h3>{this.state.name} </h3>
                      <span className="font-weight-light">
                        {"@"}
                        {this.state.username}
                      </span>
                      {/* <div className="h6 font-weight-300">
                      <i className="ni location_pin mr-2" />
                      Bucharest, Romania
                    </div> */}
                      <div className="h6 mt-4">
                        <i className="ni business_briefcase-24 mr-2" />
                        {this.state.bio}
                      </div>
                      {/* <div>
                      <i className="ni education_hat mr-2" />
                      University of Computer Science
                    </div> */}
                    </div>

                    {/* {this.state.admin ? (
                    <div className="text-center mt-5">
                      <Button
                        //  className="float-right"
                        color="danger
 "
                        size="sm"
                        to="/admin"
                        tag={Link}
                      >
                        {t("Admin Panel")}
                      </Button>
                    </div>
                  ) : (
                    ""
                  )} */}

                    <div className="mt-5 py-5 border-top text-center">
                      <Row className="justify-content-center">
                        <Col lg="11">{this.postsView()}</Col>
                      </Row>
                    </div>
                  </div>
                </Card>
              </FadeIn>
            </Container>
          </section>
          <SimpleFooter />
        </main>

        <Modal
          size="md"
          isOpen={this.state.defaultModal3}
          toggle={() => this.toggleModal("defaultModal3")}
          className="fluid"
        >
          {" "}
          <Row>
            <Col>
              <ul>
                <h3 className="mb-0 text-dark">Followers</h3>

                {this.state.followerListData.map((user, postindex) => (
                  <li key={postindex} item={this.state.followerList}>
                    <Row
                    // className="justify-content-center"
                    >
                      <Col lg="6">
                        <Link to={`/friend/${user.userId}`}>
                          <div
                            className="d-flex align-items-center"
                            style={{ margin: "5px" }}
                          >
                            <img
                              alt="Image placeholder 2"
                              className="media-comment-avatar avatar rounded-circle"
                              style={{
                                display: "block",
                                objectFit: "cover",
                                padding: "2px",
                                margin: "5px",
                              }}
                              src={user.Fravatar}
                            />
                            <div className="mx-3">
                              <h5 className="mb-0 text-black">{user.Frname}</h5>
                              <small className="text-muted">
                                @{user.Frusername}
                              </small>
                            </div>
                          </div>
                        </Link>
                      </Col>
                    </Row>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </Modal>

        <Modal
          size="md"
          isOpen={this.state.defaultModal2}
          toggle={() => this.toggleModal("defaultModal2")}
          className="fluid"
          // style={{overflowWrap:"anywhere"}}
        >
          {" "}
          <Row>
            <Col>
              <ul>
                <h3 className="mb-0 text-dark">Following</h3>

                {this.state.followingListData.map((user, postindex) => (
                  <li key={postindex} item={this.state.followingList}>
                    <Row
                    // className="justify-content-center"
                    >
                      <Col lg="6">
                        <Link to={`/friend/${user.userId}`}>
                          <div
                            className="d-flex align-items-center"
                            style={{ margin: "5px" }}
                          >
                            <img
                              alt="Image placeholder 2"
                              className="media-comment-avatar avatar rounded-circle"
                              style={{
                                display: "block",
                                objectFit: "cover",
                                padding: "2px",
                                margin: "5px",
                              }}
                              src={user.avatar}
                            />
                            <div className="mx-3">
                              <h5 className="mb-0 text-black">{user.name}</h5>
                              <small className="text-muted">
                                @{user.username}
                              </small>
                            </div>
                          </div>
                        </Link>
                      </Col>
                    </Row>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        </Modal>

        <Modal
          size="md"
          isOpen={this.state.defaultModal}
          toggle={() => this.toggleModal("defaultModal")}
          className="fluid"
        >
          {" "}
          {this.state.modalItem && <Post item={this.state.modalItem} />}
        </Modal>

        {/* <Update /> */}
      </>
    );
  }
}

export default withTranslation()(Profile);

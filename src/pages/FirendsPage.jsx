
import React from "react";
import moment from "moment";

import Loader from "react-loader-advanced";
import LoaderSpinner from "react-loader-spinner";
import FadeIn from "react-fade-in";
// reactstrap components
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Modal,
  Badge,
  DropdownMenu,
  Spinner,
  DropdownItem,
  DropdownToggle,
  ButtonDropdown,
} from "reactstrap";
// import HttpsOutlinedIcon from '@material-ui/icons/HttpsOutlined';
// core components
// import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";

// import UserHeader from "components/Headers/UserHeader.jsx";
import { isUserSignedIn } from "../services/authServices";

import * as firebase from "firebase";
// import PostModal from "components/Modal/postModal";
import Post from "../components/post";
import { Redirect, Link } from "react-router-dom";

import UserNavbar from "components/Navbars/UserNavbar";
import { withTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

// const friendId = JSON.parse(localStorage.getItem("Fuid"));
// const currentUserUid = JSON.parse(localStorage.getItem("uid"));

class FriendsPage extends React.Component {
  firestoreUsersRef = firebase.firestore().collection("users");
  firestorePostRef = firebase.firestore().collection("posts");

  // state = {
  //   // friendId: JSON.parse(localStorage.getItem("Fuid")),
  //   friendId: useParams(),
  //   currentUserUid: JSON.parse(localStorage.getItem("uid")),
  //   uid: friendId,
  //   profilePic:
  //     "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg",
  //   username: "",
  //   bio: "",
  //   name: "",
  //   email: "",
  //   posts: [],
  //   postCount: 0,
  //   following: false,
  //   pending: false,
  //   publicProfile: true,
  //   loading: true,
  //   followingList: [],
  //   followingListData: [],
  //   followerList: [],
  //   followerListData: [],
  //   value: "en",
  //   isOpen: false,
  // };

  constructor(props) {
    super(props);

    this.state = {
      // friendId: JSON.parse(localStorage.getItem("Fuid")),
      friendId: this.props.match.params.fuid
        ? this.props.match.params.fuid
        : "",
      currentUserUid: JSON.parse(localStorage.getItem("uid")),
      uid: this.props.match.params.fuid ? this.props.match.params.fuid : "",
      profilePic: require("assets/img/icons/user/user1.png"),
      // "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg",
      username: "",
      bio: "",
      name: "",
      email: "",
      posts: [],
      postCount: 0,
      following: false,
      pending: false,
      publicProfile: true,
      loading: true,
      followingList: [],
      followingListData: [],
      followerList: [],
      followerListData: [],
      closeFriends: false,
      value: "en",
      isOpen: false,
      loaderAdv: true,
      currentUsername:undefined,
    };
  }

  handleChange = (event) => {
    console.log("selected val is ", event.target.value);
    let newlang = event.target.value;
    this.setState((prevState) => ({ value: newlang }));
    console.log("state value is", newlang, this.props.i18n.changeLanguage);
    this.props.i18n.changeLanguage(newlang);
  };

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };
  componentWillMount = () => {
    // this.getFriendId().then(() => {
    //   this.getFriendList();
    //   this.getPosts();
    //   this.checkFollow();
    //   this.getProfilePic();
    // });
  };

  getFriendId = async () => {
    // this.state.friendId = JSON.parse(localStorage.getItem("Fuid"));
  };

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;

    this.setState({ uid: this.props.match.params.fuid });
    this.setState({
      friendId: this.props.match.params.fuid,
    });

    this.getFriendId().then(() => {
      this.getFriendList();
      this.checkFollow();
      this.getPosts();

      this.getProfilePic();
      this.getCurrentUsername();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.fuid !== this.props.match.params.fuid) {
      this.setState({ loaderAdv: true });
      this.setState({ uid: this.props.match.params.fuid });

      this.getFriendId().then(() => {
        this.getFriendList();
        this.checkFollow();
        this.getPosts();
        this.getProfilePic();
        this.setState({
          defaultModal3: false,
          defaultModal2: false,
          defaultModal: false,
        });
      });
    }

    if (prevState.following !== this.state.following) {
      this.getFriendList();
    }

    if (prevState.closeFriends !== this.state.closeFriends) {
      this.checkFollow();

      this.renderFollow();
    }
  }

  componentWillUnmount = () => {
    this.getFriendList();
    this.getFriendId();
  };

  getProfilePic = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(this.state.uid)
      .onSnapshot((doc) => {
        const res = doc.data();

        this.setState({
          username: res.username,
          bio: res.bio,
          name: res.name,
          email: res.email,
          publicProfile: res.publicProfile,
          profilePic: res.profilePic
            ? res.profilePic
            : require("assets/img/icons/user/user1.png"),
        });
      });

    // profile pic
    // const firebaseProfilePic = firebase
    //   .storage()
    //   .ref()
    //   .child("profilePics/(" + this.state.uid + ")ProfilePic");
    // firebaseProfilePic
    //   .getDownloadURL()
    //   .then((url) => {
    //     // Inserting into an State and local storage incase new device:
    //     // this.setState({ profilePic: url });
    //     console.log(this.state.profilePic);
    //   })
    //   .catch((error) => {
    //     // Handle any errors
    //     switch (error.code) {
    //       case "storage/object-not-found":
    //         // File doesn't exist
    //         this.setState({
    //           profilePic: require("assets/img/icons/user/user1.png"),
    //         });
    //         break;
    //     }
    //     console.log(error);
    //   });
  };

  getProfileInfo = () => {
    const { t } = this.props;
    return (
      <>
        <div className="card-profile-stats d-flex justify-content-center">
          <div>
            <span className="heading"> {this.state.posts.length}</span>
            <span className="description">{t("Posts")}</span>
          </div>
          <div
            onClick={
              this.state.followerList < 1
                ? ""
                : () => this.toggleModal("defaultModal3")
            }
          >
            {" "}
            <span className="heading"> {this.state.followerList.length}</span>
            <span className="description">{t("Followers")}</span>
          </div>
          <div
            onClick={
              this.state.followingList < 1
                ? ""
                : () => this.toggleModal("defaultModal2")
            }
          >
            {" "}
            <span className="heading"> {this.state.followingList.length}</span>
            <span className="description">{t("Following")}</span>
          </div>
        </div>
      </>
    );
  };

  getPosts = () => {
    const cloudImages = [];
    firebase
      .firestore()
      .collection("posts")
      .doc(this.state.uid)
      .collection("userPosts")
      .orderBy("time", "desc")
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          let article = {
            username: this.state.username,
            userId: this.state.uid,
            title: "post",
            profilePic: this.state.profilePic,
            image: doc.data().image,
            // cta: "cta",
            caption: doc.data().caption,
            location: doc.data().location.coordinates,
            locName: doc.data().location.locationName,
            postId: doc.data().postId,
            timeStamp: doc.data().time,
            // likes:0,
            locLatLng: "Address",
          };
          cloudImages.push(article);
        });
      });
    this.setState({ posts: cloudImages });
  };

  editprofile() {
    return <Redirect to="/edit-profile" tag={Link} />;
  }

  logOut() {
    localStorage.clear();
  }

  toggle = () => {
    this.setState({
      // dropdown: !this.state.dropdown,
      isOpen: !this.state.isOpen,
    });
  };

  checkFollow = async () => {
    this.firestoreUsersRef
      .doc(this.state.currentUserUid)
      .collection("following")
      .doc(this.state.uid)
      .get()
      .then((snapshot) => {
        if (!snapshot.exists) {
          this.firestoreUsersRef
            .doc(this.state.currentUserUid)
            .collection("sent")
            .doc(this.state.uid)
            .get()
            .then((snapshot) => {
              if (!snapshot.exists) {
                this.setState({
                  following: false,
                  pending: false,
                  closeFriends: false,
                });
              }
              // else {
              //   this.setState({ pending: false });
              // }
            });
        }
      });
    // this.firestoreUsersRef
    //   .doc(this.state.currentUserUid)
    //   .collection("closeFriends")
    //   .doc(this.state.uid)
    //   .get()
    //   .then((snapshot) => {
    //     if (snapshot.exists) {
    //       this.setState({ closeFriends: true , following: true});
    //     }
    //   });

    this.firestoreUsersRef
      .doc(this.state.currentUserUid)
      .collection("following")
      .doc(this.state.uid)
      .get()
      .then((snapshot) => {
        // if (snapshot.exists) {
        //   this.setState({ following: true, pending: false });
        // }

        this.firestoreUsersRef
          .doc(this.state.currentUserUid)
          .collection("closeFriends")
          .doc(this.state.uid)
          .get()
          .then((snapshot2) => {
            if (snapshot2.exists && snapshot.exists) {
              this.setState({
                closeFriends: true,
                following: true,
                pending: false,
              });
            } else if (snapshot.exists)
              this.setState({
                following: true,
                pending: false,
                closeFriends: false,
              });
          });
      });

    this.firestoreUsersRef
      .doc(this.state.currentUserUid)
      .collection("sent")
      .doc(this.state.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          this.firestoreUsersRef
            .doc(this.state.uid)
            .collection("received")
            .doc(this.state.currentUserUid)
            .get()
            .then((snapshot) => {
              if (snapshot.exists) {
                this.setState({
                  following: false,
                  pending: true,
                  closeFriends: false,
                });
              } else {
                this.setState({ pending: false });
              }
            });
        }
      });
  };

  cancelRequest = () => {
    this.firestoreUsersRef
      .doc(this.state.currentUserUid)
      .collection("sent")
      .doc(this.state.uid)
      .delete() &&
      this.firestoreUsersRef
        .doc(this.state.uid)
        .collection("received")
        .doc(this.state.currentUserUid)
        .delete() && 
        firebase
        .firestore()
        .collection("notifications")
        .doc(this.state.uid)
        .collection("userNotifications")     
        .doc(this.state.currentUserUid)
        .delete()
        .then(() => {
          this.setState({ following: false, pending: false });
          console.log("pending: " + this.state.pending);
        });
  };

  unfollow = () => {
    this.firestoreUsersRef
      .doc(this.state.currentUserUid)
      .collection("following")
      .doc(this.state.uid)
      .delete() &&
      this.firestoreUsersRef
        .doc(this.state.uid)
        .collection("followedBy")
        .doc(this.state.currentUserUid)
        .delete() &&
      this.firestoreUsersRef
        .doc(this.state.currentUserUid)
        .collection("closeFriends")
        .doc(this.state.uid)
        .delete()

        .then(() => {
          this.setState({ following: false, closeFriends: false });
          // console.log("UNFOLLOWED");
          // console.log("pending: " + this.state.pending);
        });
  };


  getCurrentUsername() {
    this.firestoreUsersRef
      .doc(this.state.currentUserUid)
      .get()
      .then((document) => {
        this.setState({ currentUsername: document.data().username });
      });
  }

   follow =  () => {
    //unknown private account

    if (!this.state.following && !this.state.publicProfile) {
      this.firestoreUsersRef
        .doc(this.state.currentUserUid)
        .collection("sent")
        .doc(this.state.uid)
        .set({
          userId: this.state.uid,
        }) &&
        this.firestoreUsersRef
          .doc(this.state.uid)
          .collection("received")
          .doc(this.state.currentUserUid)
          .set({
            userId: this.state.currentUserUid,
          }) &&
          firebase
          .firestore()
          .collection("notifications")
          .doc(this.state.uid)
          .collection("userNotifications")     
          .doc(this.state.currentUserUid)
          .set({
            type:"request",
            content: "sent you a follow request",
            // postId: item.postId,
            // postUserId: item.userId,
            sender: this.state.currentUsername,
            senderId: this.state.currentUserUid,
            receiverId: this.state.uid,
            time: moment().valueOf().toString(),
          })
          .then(() => {
            this.setState({ pending: true, following: false });
            console.log("follow request sent");
            // console.log("pending: " + this.state.pending);
          });
    }
    //unknown publicProfile account
    else if (!this.state.following && this.state.publicProfile) {
      this.firestoreUsersRef
        .doc(this.state.currentUserUid)
        .collection("following")
        .doc(this.state.uid)
        .set({
          userId: this.state.uid,
        }) &&
        this.firestoreUsersRef
          .doc(this.state.uid)
          .collection("followedBy")
          .doc(this.state.currentUserUid)
          .set({
            userId: this.state.currentUserUid,
          })
          &&    firebase
          .firestore()
          .collection("notifications")
          .doc(this.state.uid)
          .collection("userNotifications")     
          .doc(this.state.currentUserUid)
          .set({
            type:"follow",
            content: "started following you",
            // postId: item.postId,
            // postUserId: item.userId,
            sender: this.state.currentUsername,
            senderId: this.state.currentUserUid,
            receiverId: this.state.uid,
            time: moment().valueOf().toString(),
          })
       
          .then(() => {
            this.setState({ following: true, pending: false });
            console.log("followed");
            // console.log("pending: " + this.state.pending);
          });
    }
  };

  addCloseFriend = () => {
    this.firestoreUsersRef
      .doc(this.state.currentUserUid)
      .collection("closeFriends")
      .doc(this.state.uid)
      .set({
        userId: this.state.uid,
      })
      .then(() => {
        this.setState({ closeFriends: true });
      });
  };

  removeCloseFriend = () => {
    this.firestoreUsersRef
      .doc(this.state.currentUserUid)
      .collection("closeFriends")
      .doc(this.state.uid)
      .delete()
      .then(() => {
        this.setState({ closeFriends: false });
      });
  };

  renderFollow = () => {
    const { t } = this.props;
    if (!this.state.following && !this.state.pending) {
      return (
        <Button
          className="mr-4"
          color="info"
          size="sm"
          // shadowless={false}
          onClick={() => this.follow()}
        >
          {t("Follow")}
        </Button>
      );
    } else if (this.state.pending && !this.state.following) {
      return (
        <Button
          className="mr-4"
          // color="info"
          size="sm"
          // shadowless={false}
          onClick={() => this.cancelRequest()}
        >
          {t("Request Sent")}
          <i className="ni ni-fat-remove" />
        </Button>
      );
    } else if (this.state.following && !this.state.pending) {
      return (
        <>
          {/* <Link to={`/chat/${this.state.uid}`}>
            <Button className="mr-4" color="outline-success" size="sm">
              {t("Message")}
            </Button>
          </Link> */}

          <ButtonDropdown isOpen={this.state.isOpen} toggle={this.toggle}>
            {this.state.closeFriends ? (
              <Button
                // id="caret"
                // color="info"
                color="outline-success"
                size="sm"
                onClick={() => this.unfollow()}
              >
                {t("Close Friends")}
              </Button>
            ) : (
              <Button
                // id="caret"
                // color="info"
                color="outline-info"
                size="sm"
                onClick={() => this.unfollow()}
              >
                {t("Following")}
              </Button>
            )}

            {this.state.closeFriends ? (
              <DropdownToggle caret color="outline-success" size="sm" />
            ) : (
              <DropdownToggle
                caret
                color="outline-info"
                // className="mr-4"
                size="sm"
              />
            )}
            <DropdownMenu>
              {/* <DropdownItem header>Header</DropdownItem> */}
              {/* <DropdownItem disabled>Action</DropdownItem> */}

              <DropdownItem>
                <Link to={`/chat/${this.state.uid}`}>
                  {/* <Button className="mr-4" color="outline-success" size="sm"> */}
                  {t("Send Message")}
                  {/* </Button> */}
                </Link>
              </DropdownItem>
              <DropdownItem divider />
              {this.state.closeFriends ? (
                <DropdownItem onClick={() => this.removeCloseFriend()}>
                  {t("Remove from Close Friends")}
                </DropdownItem>
              ) : (
                <DropdownItem onClick={() => this.addCloseFriend()}>
                  {t("Add to Close Friends")}
                </DropdownItem>
              )}
            </DropdownMenu>
          </ButtonDropdown>
        </>
      );
    }
  };

  privateProfile = () => {
    const { t } = this.props;
    if (!this.state.following && !this.state.publicProfile) {
      return (
        <div className="container-fluid bg-3 text-center">
          <h3 className="display-3 lead">
            {t("This Account is Private")}{" "}
            <i className="fa fa-lock" aria-hidden="true"></i>
            {/* <HttpsOutlinedIcon fontSize="small" color="lead"/> */}
          </h3>
          <p className="lead description">
            {t("Follow this account to see their posts")}
          </p>

          <div className="row"></div>
        </div>
      );
    } else if (
      (this.state.publicProfile || this.state.following) &&
      this.state.posts.length > 0
    ) {
      return (
        <div className="container-fluid bg-3 text-center">
          <h3>{t("Posts")}</h3>
          <div className="row">
            {this.state.posts.map((post, index) => (
              <Card
                className="col-sm-4"
                style={{ padding: "10px" }}
                key={index}
                onClick={() => {
                  this.setState({ modalItem: post });
                  this.setState({ defaultModal: true });
                }}
              >
                <img
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
      );
    } else
      return (
        <div className="container-fluid bg-3 text-center">
          <h6>{t("This user has not posted")}</h6>
          <div className="row"></div>
        </div>
      );
  };

  getFriendList = async () => {
    let following = [];
    let follower = [];
    await this.firestoreUsersRef
      .doc(this.state.uid)
      .collection("followedBy")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((docSnap) => {
          follower.push(docSnap.id);
        });
      });
    await this.firestoreUsersRef
      .doc(this.state.uid)
      .collection("following")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((docSnap) => {
          following.push(docSnap.id);
        });
      });
    this.setState({ followerList: follower, followingList: following });

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
          Frname = doc.data().username;
          Fravatar = doc.data().profilePic
            ? doc.data().profilePic
            : require("assets/img/icons/user/user1.png");
          Frusername = doc.data().username;

          let followerList = {
            userId: userId,
            Frname: Frname,
            Fravatar: Fravatar,
            Frusername: Frusername,
          };

          followerArr.push(followerList);
          this.setState({ followerListData: followerArr });
          // console.log(this.state.followedUsersData);
        })
        .catch((err) => {
          // alert(err);
          console.log(err);
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
          username = doc.data().username;
          name = doc.data().name;
          avatar = doc.data().profilePic
            ? doc.data().profilePic
            : require("assets/img/icons/user/user1.png");

          let followingList = {
            userId: userId,
            name: name,
            username: username,
            avatar: avatar,
          };

          followingArr.push(followingList);
          this.setState({ followingListData: followingArr });
          // console.log(this.state.followedUsersData);
        })
        .catch((err) => {
          // alert(err);
          console.log(err);
        });
    });
    this.setState({ loaderAdv: false });
  };

  onHover = (userId) => {
    localStorage.setItem("Fuid", JSON.stringify(userId));
  };

  render() {
    const { t } = this.props;
    //console.log(this.state.friendId);
    console.log(this.state.uid);
    //console.log(this.props.match.params.fuid);

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
            <Container>
              {this.state.loaderAdv ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "50px",
                    marginBottom:"200px",
                    // zoom:"60%"
                  
                    // mixBlendMode: "screen",
                  }}
                >
                  <LoaderSpinner
                    type="Puff"
                    color="#00BFFF"
                    height={100}
                    width={100}
                    // timeout={100000} //1 secs
                  />
                </div>
              ) : (
                <>
                  <FadeIn transitionDuration={1100} delay={80}>
                    <Card className="card-profile shadow">
                      <div className="px-4">
                        <Row className="justify-content-center">
                          <Col className="order-lg-2" lg="3" style={{padding:"15px"}}>
                            <div className="card-profile-image">
                              <a
                                href="#pablo"
                                onClick={(e) => e.preventDefault()}
                              >
                                <img
                                  style={
                                    this.state.closeFriends
                                      ? {
                                          width: "200px",
                                          height: "200px",
                                          display: "table",
                                          objectFit: "cover",
                                          padding: "5px",
                                        }
                                      : {
                                          width: "200px",
                                          height: "200px",
                                          display: "table",
                                          objectFit: "cover",
                                          // padding : "5px"
                                        }
                                  }
                                  className={
                                    this.state.closeFriends
                                      ? "rounded-circle img-responsive border border-success"
                                      : "rounded-circle img-responsive"
                                  }
                                  alt="..."
                                  src={this.state.profilePic}
                                />
                              </a>
                            </div>
                          </Col>
                          <Col
                            className="order-lg-3 text-lg-right align-self-lg-center"
                            lg="4"
                          >
                            <div className="card-profile-actions py-4 mt-lg-0">
                              {/* <Button
                          className="mr-4"
                          color="info"
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                          size="sm"
                        >
                          Follow
                        </Button>

                        <Button
                          onClick={this.toggleFollow}
                          className={
                            this.state.ifFollowed === true ? "fa fa-heart" : "fa fa-heart-o"
                          }
                        >

                          {" " }
                        </Button> */}

                              {this.renderFollow()}

                              {/* <Button
                          onClick={this.toggleFollow}
                          className={
                            this.state.following === true ? (
                              <Button
                                className="mr-4 fa fa-heart"
                                color="info"
                                href="#pablo"
                                onClick={e => e.preventDefault()}
                                size="sm"
                              >
                                " " 
                              </Button>
                            ) : (
                              <Button
                                className="mr-4 fa fa-heart-o"
                                color="outline-info"
                                href="#pablo"
                                onClick={e => e.preventDefault()}
                                size="sm"
                              >
                                
                              </Button>
                            )
                          }
                        >
                          {" " + this.state.likes}
                        </Button> */}
                            </div>
                          </Col>
                          <Col className="order-lg-1" lg="4">
                            {this.getProfileInfo()}
                            {/* <div
                        className="card-profile-stats d-flex justify-content-center"
                        onClick={() => this.toggleModal("notificationModal")}
                      >
                        <div>
                          <span className="heading">
                            {" "}
                            {this.state.posts.length}
                          </span>
                          <span className="description">{t("Posts")}</span>
                        </div>
                        <div>
                          <span className="heading">
                            {" "}
                            {this.state.followerList.length}
                          </span>
                          <span className="description">{t("Followers")}</span>
                        </div>
                        <div>
                          <span className="heading">
                            {" "}
                            {this.state.followingList.length}
                          </span>
                          <span className="description">{t("Following")}</span>
                        </div>
                      </div>
                   */}
                          </Col>
                        </Row>
                        <div className="text-center mt-5">
                          {/* <h3>
                      @{this.state.username}{" "}
                    </h3> */}

                          <h3>{this.state.name} </h3>
                          <span
                            className="font-weight-light"

                            // style={{
                            //   color:"#2dce89",
                            //   textShadow: "1px 1px 2px black, 0 0 25px blue, 0 0 5px darkblue"

                            // }}
                          >
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
                        <div className="mt-5 py-5 border-top text-center">
                          <Row className="justify-content-center">
                            <Col lg="11">
                              {this.privateProfile()}

                              {/* 
                        
                        <div className="container-fluid bg-3 text-center">
                          <h3>Posts</h3>
                          <div className="row">
                            {this.state.posts.map((post, index) => (
                              <Card
                                className="col-sm-4"
                                style={{ padding: "10px" }}
                                key={index}
                                onClick={() => {
                                  this.setState({ modalItem: post });
                                  this.setState({ defaultModal: true });
                                }}
                              >
                                <img
                                  src={post.image}
                                  className="img-fluid"
                                  alt=""
                                  // style={{height:'98%'}}
                                  // onClick={() => <Modals/>}
                                />
                              </Card>
                            ))}
                          </div>
                        </div> */}
                              {/* <a
                          href="#"
                          onClick={() => this.toggleModal("defaultModal")}
                        >
                          Show more
                        </a> */}
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </Card>
                  </FadeIn>
                </>
              )}
            </Container>
          </section>
          <SimpleFooter />
        </main>

        <Modal
          size="lg"
          isOpen={this.state.defaultModal}
          toggle={() => this.toggleModal("defaultModal")}
          className="fluid"
        >
          {" "}
          {this.state.modalItem && <Post item={this.state.modalItem} />}
        </Modal>

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
      </>
    );
  }
}

export default withTranslation()(FriendsPage);

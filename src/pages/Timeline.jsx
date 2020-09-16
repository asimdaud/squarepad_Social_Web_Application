/*global google*/

import React from "react";
import Post from "../components/post.jsx";
import Ad from "../components/ad.jsx";
import {
  // Button,
  Card,
  CardBody,
  CardText,
  Alert,
  CardTitle,
  CardLink,
  CardSubtitle,
  Badge,
  Row,
  Button,
  // CardHeader,
  // CardBody,
  // NavItem,
  // NavLink,
  // Nav,
  // Progress,
  // Table,
  Container,
  Jumbotron,
  Col,
} from "reactstrap";
//  import * as firebase from 'firebase';
import { firebase } from "../services/firebase";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import { Redirect, Link } from "react-router-dom";
// import {
//   CardImg, CardText,  CardTitle, CardSubtitle
// } from 'reactstrap';
import UserNavbar from "components/Navbars/UserNavbar.jsx";
import { withTranslation } from "react-i18next";
import GoogleAd from "components/GoogleAd.jsx";
import AdSense from 'react-adsense';


const user3 = JSON.parse(localStorage.getItem("uid"));
const userId = JSON.parse(localStorage.getItem("uid"));

class Timeline extends React.Component {
  firestoreUsersRef = firebase.firestore().collection("users");
  firestorePostRef = firebase.firestore().collection("posts");
  firestoreUserRecommendationsRef = firebase
    .firestore()
    .collection("userRecommendations");

  state = {
    user3: JSON.parse(localStorage.getItem("uid")),
    posts: [],
    userData: {},
    followedUsers: [],
    avatar: "",
    isLoading: true,
    friendReqData: [],
    friendReq: [],
    alreadyFriendsCheck: false,
    userRec: [],
    userRecData: [],
    userLocation: "",
    following: false,
    pending: false,
    publicProfile: true,
    loading: true,
    value: "en",
  };

  handleChange = (event) => {
    console.log("selected val is ", event.target.value);
    let newlang = event.target.value;
    this.setState((prevState) => ({ value: newlang }));
    console.log("state value is", newlang, this.props.i18n.changeLanguage);
    this.props.i18n.changeLanguage(newlang);
  };

  componentWillUnmount() {
    this.getFollowedUsers();
    this.getFollowingPosts();
  }

  getFriendId = async () => {
    // this.state.friendId = JSON.parse(localStorage.getItem("Fuid"));
  };

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;

    this.getFriendId().then(() => {
      this.getProfilePic();
      this.getFollowedUsers();
      this.getFollowingPosts();

      // this.getUserRec();
      // this.getPlaces();
    });
  }

  getFollowedUsers = async () => {
    let users = [];
    await this.firestoreUsersRef
      .doc(this.state.user3)
      .collection("following")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((docSnap) => {
          users.push(docSnap.id);
        });
        // this.setState({followedUsers: users});
      });
    this.setState({ followedUsers: users });
    // console.log(this.state.followedUsers);
  };

  // Get all posts of each user3 and push them in a same array
  getFollowingPosts = async () => {
    // 1. Get all the users the current user3 is following
    await this.getFollowedUsers().then(async () => {
      // console.log(this.state.followedUsers);

      let users = this.state.followedUsers;
      let allPosts = [];

      // 2. Get posts of each user3 seperately and putting them in one array.
      //  users.forEach(async (user3) => {
      for (const eachUser of users) {
        await this.getProfilePic(eachUser).then(async () => {
          // console.log("Avatar:" + this.state.avatar);
          await this.firestoreUsersRef
            .doc(eachUser)
            .get()
            .then(async (document) => {
              this.setState({ userData: document.data() });

              // console.log(document.data());
              await this.firestorePostRef
                .doc(eachUser)
                .collection("userPosts")
                .orderBy("time", "desc")
                // .limit(9)
                .get()
                .then((snapshot) => {
                  snapshot.forEach((doc) => {
                    let article = {
                      username: this.state.userData.username,
                      userId: eachUser,
                      title: "post",
                      profilePic: this.state.userData.profilePic,
                      image: doc.data().image,
                      cta: "cta",
                      caption: doc.data().caption,
                      location: doc.data().location.coordinates,
                      locName: doc.data().location.locationName,
                      postId: doc.data().postId,
                      timeStamp: doc.data().time,
                      // likes:0,
                      locLatLng: "Address",
                    };
                    allPosts.push(article);
                  });
                });
              this.setState({ posts: allPosts });
            });
        });
        // allPosts.sort(function(a,b){
        //   // Turn your strings into dates, and then subtract them
        //   // to get a value that is either negative, positive, or zero.
        //   return new Date(b.timeStamp) - new Date(a.timeStamp) ;
        // });

        // this.setState({posts: allPosts});
        // console.log(this.state.posts);
      }
    });
  };

  getProfilePic = async (user) => {
    const firebaseProfilePic = await firebase
      .storage()
      .ref()
      .child("profilePics/(" + user + ")ProfilePic");
    firebaseProfilePic
      .getDownloadURL()
      .then((url) => {
        // console.log("got profile pic of" +user3 + url);
        this.setState({ avatar: url });
        console.log(this.state.avatar);

        return url;
      })
      .catch((error) => {
        // Handle any errors
        switch (error.code) {
          case "storage/object-not-found":
            // File doesn't exist
            this.setState({
              avatar:
                "https://clinicforspecialchildren.org/wp-content/uploads/2016/08/avatar-placeholder.gif",
            });
            return "https://clinicforspecialchildren.org/wp-content/uploads/2016/08/avatar-placeholder.gif";
          // break;
        }
        console.log(error);
      });
  };

  noFriendsTimeline = () => {
    const { t } = this.props;
    if (this.state.posts.length > 0) {
      return (
        <Col
          sm="6"
          md="6"
          lg="6"
          className="order-md-2"
          style={{ zoom: "85%" }}
        >
          {this.state.posts.map((post, postindex) => (
            <Post item={post} key={postindex} />
          ))}
        </Col>
      );
    } else if (this.state.posts.length < 1) {
      return (
        <Col
          sm="6"
          md="6"
          lg="6"
          className="order-md-2"
          style={{ zoom: "85%" }}
        >
          <Card className="container justify-content-center">
            <h3 className="display-3 lead">
              {t("Nothing to Show")}{" "}
              <i className="fa fa-lock" aria-hidden="true"></i>
            </h3>
            <p className="lead description">
              {t("Follow more accounts to see their posts")}
            </p>
          </Card>
        </Col>
      );
    } else {
      return (
        <Col
          sm="6"
          md="6"
          lg="6"
          className="order-md-2"
          style={{ zoom: "85%" }}
        >
          <Card className="container justify-content-center ">
            <h3 className="display-3 lead">
              {t("You aren't following any users")}{" "}
              <i className="fa fa-lock" aria-hidden="true"></i>
              {/* <HttpsOutlinedIcon fontSize="small" color="lead"/> */}
            </h3>
            <p className="lead description">
              {t("Follow accounts to see their posts")}
            </p>
          </Card>
        </Col>
      );
    }
  };
  onHover = (userId) => {
    localStorage.setItem("Fuid", JSON.stringify(userId));
  };

  render() {
    return (
      <>
        <UserNavbar />
        <main
          className="profile-page"
          ref="main"
          style={{
            // height:"100%",
            // backgroundPosition: "center",
            // backgroundRepeat: "no-repeat",
            // backgroundSize: "cover",
            // backgroundColor: "black",
            backgroundImage:
              "linear-gradient(to right bottom, #e4efe9, #d9ede8, #cfeae9, #c6e6ed, #c0e2f1, #bcdef2, #badaf3, #bad5f4, #b7d1f2, #b5ccf1, #b3c8ef, #b1c3ed)",
          }}
        >
          <section
            className="section section-blog-info"
            style={{ marginTop: "20px" }}
          >
            <Row 
            style={{padding:"20px"}}
            // className="d-flex justify-content-center"
            >
            <Col
                sm="2"
                md="2"
                lg="2"
                className="order-md-1"
                style={{ zoom: "85%" }}
              >
                {/* <Card>Say helleyo!</Card> */}
                <div>
                <GoogleAd slot="1742211567" timeout={1000} 
                // classNames="page-bottom"
                 />
                </div>
              </Col>
              {this.noFriendsTimeline()}
              <Col
                sm="4"
                md="4"
                lg="4"
                className="order-md-3"
                style={{ zoom: "85%" }}
              >
                {/* <Card> */}
                <AdSense.Google
  client='ca-pub-3206659815873877'
  slot='1742211567'
/>

                {/* </Card> */}
              </Col>
            </Row>
          </section>
          <SimpleFooter />
        </main>
      </>
    );
  }
}

export default withTranslation()(Timeline);

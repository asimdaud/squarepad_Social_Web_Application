import React from "react";
import moment from "moment";
// reactstrap components
import { Button, Card, Container, Row, Col, Modal } from "reactstrap";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import { isUserSignedIn } from "../services/authServices";
import * as firebase from "firebase";
import { Redirect, Link } from "react-router-dom";

import UserNavbar from "components/Navbars/UserNavbar";
import { withTranslation } from "react-i18next";

class FriendReq extends React.Component {
  // componentDidMount() {
  //   document.documentElement.scrollTop = 0;
  //   document.scrollingElement.scrollTop = 0;
  //   this.refs.main.scrollTop = 0;
  // }

  firestoreUsersRef = firebase.firestore().collection("users");

  constructor(props) {
    super(props);

    this.state = {
      currentUserUid: JSON.parse(localStorage.getItem("uid")),
      friendReqData: [],
      friendReq: [],
      value: "en",
      currentUsername: undefined,
    };
  }

  handleChange = (event) => {
    console.log("selected val is ", event.target.value);
    let newlang = event.target.value;
    this.setState((prevState) => ({ value: newlang }));
    console.log("state value is", newlang, this.props.i18n.changeLanguage);
    this.props.i18n.changeLanguage(newlang);
  };

  componentDidMount() {
    this.getFriendReq();
    this.getCurrentUsername();
    // document.documentElement.scrollTop = 0;
    // document.scrollingElement.scrollTop = 0;
    // this.refs.main.scrollTop = 0;
  }

  getFriendReq = async () => {
    let users = [];
    await this.firestoreUsersRef
      .doc(this.state.currentUserUid)
      .collection("received")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((docSnap) => {
          users.push(docSnap.id);
        });
      });
    this.setState({ friendReq: users });
    // console.log("FRIENDS LIST: " + this.state.followedUsers);
    this.viewFriendReq();
  };

  viewFriendReq = () => {
    let friendReqArr = [];
    let avatar = require("assets/img/icons/user/user1.png");
    // "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg";
    let name;
    let fullName;
    this.state.friendReq.forEach((userId) => {
      //  avatar =  this.getUserPic(userId);
      this.firestoreUsersRef
        .doc(userId)
        .get()
        .then((doc) => {
          name = doc.data().username;
          fullName = doc.data().name;
          avatar = doc.data().profilePic;
          let friendReqData = {
            userId: userId,
            name: name,
            avatar: avatar,
            fullName: fullName,
          };

          friendReqArr.push(friendReqData);
          this.setState({ friendReqData: friendReqArr });
          // console.log(this.state.friendReqData);
        })
        .catch((err) => {
          alert(err);
        });
    });
  };

  handleAccept = (uId) => {
    this.firestoreUsersRef
      .doc(this.state.currentUserUid)
      .collection("followedBy")
      .doc(uId)
      .set({
        userId: uId,
      }) &&
      this.firestoreUsersRef
        .doc(uId)
        .collection("following")
        .doc(this.state.currentUserUid)
        .set({
          userId: uId,
        }) &&
      this.firestoreUsersRef
        .doc(this.state.currentUserUid)
        .collection("received")
        .doc(uId)
        .delete() &&
      this.firestoreUsersRef
        .doc(uId)
        .collection("sent")
        .doc(this.state.currentUserUid)
        .delete() &&
      firebase
        .firestore()
        .collection("notifications")
        .doc(uId)
        .collection("userNotifications")
        .doc(this.state.currentUserUid)
        .set({
          type: "requestAccepted",
          content: "accepted your follow request",
          accepter: this.state.currentUsername,
          accepterId: this.state.currentUserUid,
          userId: uId,
          time: moment().valueOf().toString(),
        }) &&
        firebase
        .firestore()
        .collection("notifications")
        .doc(this.state.currentUserUid)
        .collection("userNotifications")
        .doc(uId)
        .delete();
        ;

    console.log("accepted");
    // .then(() => {
    //     this.setState({ following: true });
    //   });
  };

  handleReject = (uId) => {
    this.firestoreUsersRef
      .doc(this.state.currentUserUid)
      .collection("received")
      .doc(uId)
      .delete() &&
      this.firestoreUsersRef
        .doc(uId)
        .collection("sent")
        .doc(this.state.currentUserUid)
        .delete() &&
      firebase
        .firestore()
        .collection("notifications")
        .doc(this.state.currentUserUid)
        .collection("userNotifications")
        .doc(uId)
        .delete();
    console.log("rejected");
    // .then(() => {
    //     this.setState({ following: true });
    //   });
  };

  getCurrentUsername() {
    this.firestoreUsersRef
      .doc(this.state.currentUserUid)
      .get()
      .then((document) => {
        this.setState({ currentUsername: document.data().username });
      });
  }

  checkCondition = () => {
    const { t } = this.props;
    if (this.state.friendReq.length < 1) {
      return (
        // <Card className="card-profile shadow">
        // <div className="px-4 border-top">
        <h1
          // className="description"
          className="text-black ml-auto description font-italic justify-content-center"
        >
          {t("No new friend requests")}
          {" :("}
        </h1>

        // </div>
        // </Card>
      );
    } else {
      return (
        // <Card className="card-profile shadow">
        <div>
          <Row>
            <Col lg="4">
              <h2
                // className="description"
                className="text-white ml-auto description"
              >
                {t("Friend Requests")}
                {": "}
              </h2>
            </Col>
          </Row>{" "}
          <ul>
            {
              // this.state.followedUsers.map((followedUsers) => {
              this.state.friendReqData.map((user, postindex) => (
                <li key={postindex} item={this.state.friendReq}>
                  <Row
                    className="justify-content-center"
                    style={{
                      borderRadius: "15px",
                    }}
                  >
                    <Col className="justify-content-center">
                      {" "}
                      <img
                        alt="Avatar"
                        className="media-comment-avatar avatar rounded-circle"
                        style={{
                          display: "block",
                          objectFit: "cover",
                          padding: "2px",
                          margin: "5px",
                        }}
                        src={user.avatar}
                      />
                    </Col>
                    <Col className="justify-content-center">
                      {/* <div className="card-profile-stats d-flex justify-content-center"> */}

                      <a href="/friend" class="description link">
                        {user.name}
                      </a>
                      <p className="mb-0 text-black font-weight-bold small">
                        {user.fullName}
                        {/* {user.userId} */}

                        {/* {this.storingUserId} */}
                        {/* <span className="badge badge-success"></span> */}
                      </p>

                      {/* </div> */}
                    </Col>
                    <Col className="justify-content-center">
                      <Button
                        // className="mr-4"
                        color="info"
                        size="sm"
                        onClick={() => this.handleAccept(user.userId)}
                      >
                        {" "}
                        {t("Accept")}{" "}
                      </Button>{" "}
                      <Button
                        // className="mr-4"
                        color="danger"
                        size="sm"
                        onClick={() => this.handleReject(user.userId)}
                      >
                        {t("Reject")}
                      </Button>
                    </Col>
                  </Row>
                </li>
              ))
            }
          </ul>
        </div>
        // </Card>
      );
    }
  };

  render() {
    // if (this.state.loading){
    //   return <div>My sweet spinner</div>;
    // }
    return (
      <>
        <Container
        // style={{ zoom: "90%" }}
        >
          <section
          // style={{ padding: "16px" }}
          >
            {this.checkCondition()}
          </section>
        </Container>
      </>
    );
  }
}

export default withTranslation()(FriendReq);

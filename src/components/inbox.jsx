/*global google*/

import React from "react";
import moment from "moment";
import FadeIn from 'react-fade-in';
import { Favorite, FavoriteBorder, Comment } from "@material-ui/icons";
import SmoothImage from "react-smooth-image";
import Loader from 'react-loader-advanced';
import LoaderSpinner from 'react-loader-spinner';
// reactstrap components
import {
  // UncontrolledCollapse,
  // NavbarBrand,
  // Navbar,
  // NavItem,
  // NavLink,
  // Nav,
  Button,
  Card,
  // CardHeader,
  CardBody,
  // FormGroup,
  // Form,
  Input,
  UncontrolledTooltip,
  Row,
  UncontrolledPopover,
  PopoverBody,
  PopoverHeader,
  Form,
  Container,
  UncontrolledCollapse,
  Collapse,
  Modal,
} from "reactstrap";

import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";

import * as firebase from "firebase";

const userId = JSON.parse(localStorage.getItem("uid"));
const firestoreUsersRef = firebase.firestore().collection("users");

class Inbox extends React.Component {
  firestoreUsersRef = firebase.firestore().collection("users");
  firestorePostRef = firebase.firestore().collection("posts");
  // firestoreFollowingRef = firebase
  //   .firestore()
  //   .collection("following")
  //   .doc(userId)
  //   .collection("userFollowing");
  user = firebase.auth().currentUser;
  constructor(props) {
    super(props);
    this.state = {
      //        user: firebase.auth().currentUser,
      // userId: this.props.item.userId,
      //   progress: 0,
        userName: "username",
        name: "name",
      numOfChat: 0,
      inboxUsersData: [],
      inboxData: [],
      inbox: {},
      groupChats: [],
      isLoading: false,
      value: "en",
      loaderInbox:true,
    };
    this.currentUserId = JSON.parse(localStorage.getItem("uid"));
    this.listInbox = [];
    this.groupChatId = null;
    // this.removeListener = null;
    // this.currentPhotoFile = null;
  }

  handleChange = (event) => {
    console.log("selected val is ", event.target.value);
    let newlang = event.target.value;
    this.setState((prevState) => ({ value: newlang }));
    console.log("state value is", newlang, this.props.i18n.changeLanguage);
    this.props.i18n.changeLanguage(newlang);
  };

  componentDidUpdate(prevProps, prevState) {
    // if (prevProps.match.params.fuid !== this.props.match.params.fuid) {
    //   this.currentPeerUserId = this.props.match.params.fuid;
    //   this.getInboxUsers();
    // }
    // this.getInboxUsers();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
  };

  componentDidMount() {
    // For first render, it's not go through componentWillReceiveProps
    this.getInboxUsers();


    firestoreUsersRef.doc(this.currentUserId).onSnapshot((doc) => {
      const res = doc.data();
      if (res != null) {
        this.setState({
          username: res.username,
          name: res.name,
        });
      }
    });

  }

  componentWillMount = () => {
    this.getInboxUsers();
  };

  getInboxUsers = async () => {
    let users = [];

    await firebase
      .firestore()
      .collection("messages")
      .where("members", "array-contains", this.currentUserId)
      .orderBy("timestamp", "desc")
      .limit(6)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((docSnap) => {
          firebase
            .firestore()
            .collection("messages")
            .doc(docSnap.id)
            .onSnapshot((doc) => {
              const groupChatId = docSnap.id;
              let res = "";
              if (this.currentUserId == doc.data().members[0]) {
                res = doc.data().members[1];
              } else res = doc.data().members[0];
              let inboxData = {
                peer: res,
                groupChatId: groupChatId,
              };
              users.push(inboxData);
            });
        });
      });
    await firebase
      .firestore()
      .collection("fake")
      .get()
      .then((querySnapshot2) => {
        console.log(querySnapshot2.size);
      });
    this.setState({ groupChats: users });
    this.getInboxUsersData();
  };

  getInboxUsersData = () => {
    let inboxUsersDataArr = [];
    let name,
      username,
      profilePic,
      idFrom,
      peername,
      peerusername,
      peerprofilePic;

    this.state.groupChats.forEach((id) => {
      // console.log(id);

      firebase
        .firestore()
        .collection("messages")
        .doc(id.groupChatId)
        .get()
        .then((doc) => {
          console.log(doc.data().latestMessage);
          console.log(doc.data().messageSender);

          this.firestoreUsersRef
            .doc(id.peer)
            .get()
            .then((doco) => {
              this.firestoreUsersRef
                .doc(doc.data().messageSender)
                .get()
                .then((docot) => {
                  let inboxUsersData = {
                    name: docot.data().name,
                    username: docot.data().username,
                    peername: doco.data().name,
                    peerusername: doco.data().username,
                    peerprofilePic: doco.data().profilePic?doco.data().profilePic:require("assets/img/icons/user/user1.png"),
                    content: doc.data().latestMessage,
                    timestamp: doc.data().timestamp,
                    peerid: id.peer,
                    idFrom: doc.data().messageSender,
                    groupChatId: id.groupChatId,
                  };
                  inboxUsersDataArr.push(inboxUsersData);
                  this.listInbox.push(inboxUsersData);
                  this.setState({
                    inboxUsersData: inboxUsersDataArr,
                  });
                  // console.log(this.listInbox);
                  // console.log(this.state.inboxUsersData);
                });
            })
            .catch((err) => {
              alert(err);
            });
          this.setState({ inboxData: this.listInbox, numOfChat: this.state.groupChats.length });
          this.setState({loaderInbox:false});
        });

      // firebase
      //   .firestore()
      //   .collection("messages")
      //   .doc(id.groupChatId)
      //   .collection("msg")
      //   .orderBy("timestamp", "desc")
      //   .limit(1)
      //   .onSnapshot(
      //     (snapshot) => {
      //       snapshot.docChanges().forEach((change) => {
      //         if (change.type === "added") {
      //           // console.log("adeedede");
      //           this.firestoreUsersRef
      //             .doc(id.peer)
      //             .get()
      //             .then((doco) => {
      //               this.firestoreUsersRef
      //                 .doc(change.doc.data().idFrom)
      //                 .get()
      //                 .then((docot) => {

      //                   let inboxUsersData = {
      //                     name: docot.data().name,
      //                     username: docot.data().username,
      //                     peername: doco.data().name,
      //                     peerusername: doco.data().username,
      //                     peerprofilePic: doco.data().profilePic,
      //                     content: change.doc.data().content,
      //                     timestamp: change.doc.data().timestamp,
      //                     peerid: id.peer,
      //                     idFrom: change.doc.data().idFrom,
      //                     groupChatId: id.groupChatId,
      //                   };
      //                   inboxUsersDataArr.push(inboxUsersData);
      //                   this.listInbox.push(inboxUsersData);
      //                   this.setState({
      //                     inboxUsersData: inboxUsersDataArr,
      //                   });
      //                   // console.log(this.listInbox);
      //                   // console.log(this.state.inboxUsersData);
      //                 });
      //             })
      //             .catch((err) => {
      //               alert(err);
      //             });
      //         }
      //       });
      //       this.setState({ inboxData: this.listInbox });
      //       // console.log(this.state.inboxData);
      //       // console.log(this.state.inboxData);
      //       // console.log(this.state.inboxUsersData);
      //       // this.setState({ isLoading: false });
      //     },
      //     (err) => {
      //       // this.props.showToast(0, err.toString());
      //       alert(err.toString());
      //     }
      //   );
    });
  };

  render() {
    const { t } = this.props;
    const { numOfChat } = this.state;
    return (
      <>

<Loader 

// foregroundStyle={{color: 'white'}}
backgroundStyle={{ backgroundColor:"white",borderRadius:"10px"}}


show={this.state.loaderInbox} 
message={

  <LoaderSpinner
visible={this.state.loaderInbox}
  type="Rings"
  color="#00BFFF"
  height={50}
  width={50}
  timeout={1000} //1 sec
/>

} 
contentBlur={225} 
hideContentOnLoad={true} >

      
        {numOfChat > 0 ? (
              <FadeIn>
                
          <div className="card bg-secondary" style={{ borderRadius:"35px", 
         overflow: "hidden"
         }}>
            <form className="card-header mb-3 text-center bg-gradient-muted">
              <span className="text-black font-weight-bold">
                {/* {this.state.groupChats.length} Friends online */}
                {t("Inbox")}

                {/* {"!"} */}
              </span>
            </form>
            {this.state.inboxUsersData.map((user) => (
              
              
              <div className="list-group list-group-chat list-group-flush" style={{zoom:"85%"}}>
                <FadeIn transitionDuration={1000} delay={50}>
         
                <a
                  className="list-group-item bg-gradient-white"
                  // onMouseOver={() => this.onHover(user.idFrom)}
                >
                    <Link to={`/chat/${user.peerid}`}>
                  <div className="media">
                    <Link to={`/friend/${user.peerid}`}>
                      <img
                        alt="peerPic"
                        src={user.peerprofilePic}
                        className="avatar"
                      />
                    </Link>
                    <div className="media-body ml-2">
                      <div className="justify-content-between align-items-center">
                        <h6 className="mb-0 text-black font-weight-bold">
                          {user.peername}
                          <span className="badge badge-success"></span>
                        </h6>
                        <div>
                          <small className="text-muted">


                          {user.name==this.state.name?"You":user.name}

                            {/* {user.name} */}
                            
                             : {user.content}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                  </Link>
                </a>
              </FadeIn>
              </div>
            ))}
          </div>
          </FadeIn>
        ) : (
          <div className="card bg-secondary" style={{ overflow: "auto", borderRadius:"35px"}}>
            <Card className="card-header text-center bg-gradient-muted">
              <span className="text-black font-weight-bold">
                {t("No Recent Chats")}
              </span>
              {/* </form> */}
            </Card>
          </div>
        )}
        </Loader>
      </>
    );
  }
}
export default withTranslation()(Inbox);

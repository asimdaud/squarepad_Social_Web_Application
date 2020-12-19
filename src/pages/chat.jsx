/*global google*/

import moment from "moment";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
// reactstrap components
import {
  Card,
  Container,
  Row,
  Button,
  FormGroup,
  Form,
  ListGroup,
  ListGroupItem,
  UncontrolledCollapse,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import imageCompression from 'browser-image-compression';
import ReactPlayer from "react-player/lazy";
import ReactLoading from "react-loading";
import ReactShadowScroll from "react-shadow-scroll";
import images from "../components/Themes/images";
// import gif from '../components/Themes/images';

// import { HeatmapLayer } from '@react-google-maps/api';
import UserNavbar from "components/Navbars/UserNavbar.jsx";
// import HeatmapLayer from "react-google-maps/lib/components/visualization/HeatmapLayer";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import SearchBox from "react-google-maps/lib/components/places/SearchBox";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import { firebase } from "../services/firebase";
import Timeline from "pages/Timeline";
import { DeleteOutline } from "@material-ui/icons";

import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";

import { Carousel } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import Inbox from "components/inbox";
import Update from "./Update";

const userId = JSON.parse(localStorage.getItem("uid"));
const firestoreUsersRef = firebase.firestore().collection("users");

const gf = new GiphyFetch("sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh");
// fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)

// const firestorePostRef = firebase.firestore().collection("posts");
// const firestoreFollowingRef = firebase.firestore()
//   .collection("following")
//   .doc(userId)
//   .collection("userFollowing");

class chat extends React.Component {
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
      progress: 0,
      userName: "username",
      name: "name",
      // followedUsersData: [],
      inboxUsersData: [],
      inboxData: [],
      // inbox: {},
      groupChats: [],
      peerName: "peer",
      peerUserName: "peer username",
      friendName: "friend name",
      friendUserName: "friend username",
      profilePic: require("assets/img/icons/user/user1.png"),
      peerPic: require("assets/img/icons/user/user1.png"),
      friendPic: require("assets/img/icons/user/user1.png"),
      followedUsers: [],
      isLoading: false,
      chatDeleted: false,
      inputValue: "",
      isShowSticker: false,
      value: "en",
    };
    this.currentUserId = JSON.parse(localStorage.getItem("uid"));
    this.currentUserAvatar = this.state.profiePic;
    this.listMessage = [];
    this.listInbox = [];
    // this.currentPeerUser = this.props.match.params.fuid;
    this.currentPeerUserId = this.props.match.params.fuid;
    // this.FListId = this.getFollowedUsers;
    // this.fListPic=;
    // this.fListName=;
    this.groupChatId = null;
    this.removeListener = null;
    this.currentPhotoFile = null;
  }

  handleChange = (event) => {
    console.log("selected val is ", event.target.value);
    let newlang = event.target.value;
    this.setState((prevState) => ({ value: newlang }));
    console.log("state value is", newlang, this.props.i18n.changeLanguage);
    this.props.i18n.changeLanguage(newlang);
  };

  getCurrentUsername() {
    this.firestoreUsersRef
      .doc(this.user.uid)
      .get()
      .then((document) => {
        this.setState({ currentUsername: document.data().username });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.inputValue !== this.state.inputValue) {
      this.fetchGifs();
    }

    //     functions.firestore()
    //     .collection("messages")
    //     .where("members", "array-contains", this.currentUserId)
    //     .onUpdate((change, context) => {
    //       // ... Your code here

    // this.getInboxUsers();
    //     });

    // if (prevProps.inputValue !== this.state.inputValue) {
    //   this.getInboxUsers();
    // }

    if (prevProps.match.params.fuid !== this.props.match.params.fuid) {
      this.currentPeerUserId = this.props.match.params.fuid;

      firestoreUsersRef.doc(this.props.match.params.fuid).onSnapshot((doc) => {
        const res = doc.data();
        if (res != null) {
          this.setState({
            peerUserName: res.username,
            peerName: res.name,
            peerPic: res.profilePic
              ? res.profilePic
              : require("assets/img/icons/user/user1.png"),
          });
        }
      });
      this.getListHistory();
    }
    this.scrollToBottom();
  }

  componentDidMount() {
    // For first render, it's not go through componentWillReceiveProps

    this.getListHistory();
    this.scrollToBottom();

    this.getInboxUsers();

    // this.getFollowedUsers();
  }

  // onUpdateItem = i => {
  //   this.setState(state => {
  //     const list = state.groupChats.map((item, j) => {
  //       if (j === i) {

  //         firebase
  //           .firestore()
  //           .collection("messages")
  //           .doc(item.groupChatId)
  //           .onSnapshot((doc) => {
  //             const res = doc.data().user1;
  //             const groupChatId = docSnap.id;
  //             let inboxData = {
  //               peer: res,
  //               groupChatId: groupChatId,
  //             };
  //             // console.log("TORRES",inboxData);
  //             users.push(inboxData);
  //             console.log(users);
  //           });

  //       } else {
  //         return item;
  //       }
  //     });

  //     return {
  //       list,
  //     };
  //   });
  // };

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
                    peerprofilePic: doco.data().profilePic
                      ? doco.data().profilePic
                      : require("assets/img/icons/user/user1.png"),
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
          this.setState({ inboxData: this.listInbox });
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
      //       alert(err.toString());
      //     }
      //   );
    });
  };
  // getFollowedUsersData = () => {
  //   let followedUsersDataArr = [];
  //   let avatar = require("assets/img/icons/user/user1.png");
  //   let content;
  //   this.state.followedUsers.forEach((userId) => {
  //     //  avatar =  this.getUserPic(userId);
  //     firestoreUsersRef
  //       .doc(userId)

  //     // .orderBy("time", "desc")
  //         // let article = {
  //       // .get()
  //       .orderBy("timestamp", "desc")
  //       .limit(1)
  //     .onSnapshot((snapshot) => {
  //       snapshot.forEach((doc) => {
  //         content = doc.data().content;
  //         let followedUsersData = {
  //           userId: userId,
  //           content: content,
  //         };

  //         followedUsersDataArr.push(followedUsersData);
  //         this.setState({ followedUsersData: followedUsersDataArr });
  //         console.log(this.state.followedUsersData);
  //       })})
  //       .catch((err) => {
  //         alert(err);
  //       });
  //   });
  // };

  // getUserPic = (friendId) => {
  //   // const firebaseProfilePic = firebase
  //   //   .storage()
  //   //   .ref()
  //   //   .child("profilePics/(" + friendId + ")ProfilePic");
  //   // let url = "";
  //   // firebaseProfilePic
  //   //   .getDownloadURL()
  //   //   .then((url) => {
  //   //     // Inserting into an State and local storage incase new device:
  //   //     // this.setState({ peerPic: url });
  //   //     url = url;
  //   //     // console.log("dsbdashbfhasfb" + url);
  //   //     return url;
  //   //   })
  //   //   .catch((error) => {
  //   //     // Handle any errors
  //   //     switch (error.code) {
  //   //       case "storage/object-not-found":
  //   //         // File doesn't exist
  //   //         url = require("assets/img/icons/user/user1.png");
  //   //         // this.setState({
  //   //         //   peerPic:            require('assets/img/icons/user/user1.png'),
  //   //         //   });
  //   //         return url;
  //   //         break;
  //   //       default:
  //   //     }
  //   //     //   alert(error);
  //   //   });
  // };

  // getProfilePic = (friendId) => {
  //   // const firebaseProfilePic = firebase
  //   //   .storage()
  //   //   .ref()
  //   //   .child("profilePics/(" + this.currentPeerUserId + ")ProfilePic");
  //   // let url = "";
  //   // firebaseProfilePic
  //   //   .getDownloadURL()
  //   //   .then((url) => {
  //   //     // Inserting into an State and local storage incase new device:
  //   //     this.setState({ peerPic: url });
  //   //     // url = url;
  //   //   })
  //   //   .catch((error) => {
  //   //     // Handle any errors
  //   //     switch (error.code) {
  //   //       case "storage/object-not-found":
  //   //         // File doesn't exist
  //   //         // url =              require('assets/img/icons/user/user1.png');
  //   //         this.setState({
  //   //           peerPic: require("assets/img/icons/user/user1.png"),
  //   //         });
  //   //         break;
  //   //       default:
  //   //     }
  //   //     //   alert(error);
  //   //   });
  //   // // return url;
  // };

  componentWillMount = () => {
    // this.getFollowedUsers();
    this.getInboxUsersData();
    // this.getProfilePic();

    firestoreUsersRef.doc(this.currentUserId).onSnapshot((doc) => {
      const res = doc.data();
      if (res != null) {
        this.setState({
          username: res.username,
          name: res.name,
        });
      }
    });

    firestoreUsersRef.doc(this.currentPeerUserId).onSnapshot((doc) => {
      const res = doc.data();
      if (res != null) {
        this.setState({
          peerUserName: res.username,
          peerName: res.name,
          peerPic: res.profilePic
            ? res.profilePic
            : require("assets/img/icons/user/user1.png"),
        });
      }
    });

    // // profile pic
    // const firebaseProfilePic = firebase
    //   .storage()
    //   .ref()
    //   .child("profilePics/(" + this.currentUserId + ")ProfilePic");
    // firebaseProfilePic
    //   .getDownloadURL()
    //   .then((url) => {
    //     // Inserting into an State and local storage incase new device:
    //     this.setState({ profilePic: url });
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
    //       default:
    //     }
    //     // alert(error);
    //   });
  };

  componentWillUnmount() {
    if (this.removeListener) {
      this.removeListener();
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.currentPeerUser) {
      this.currentPeerUser = newProps.currentPeerUser;
      this.getListHistory();
    }
  }

  getListHistory = () => {
    if (this.removeListener) {
      this.removeListener();
    }
    this.listMessage.length = 0;
    this.setState({ isLoading: true });
    if (this.currentUserId <= this.currentPeerUserId) {
      this.groupChatId = `${this.currentUserId}-${this.currentPeerUserId}`;
    } else {
      this.groupChatId = `${this.currentPeerUserId}-${this.currentUserId}`;
    }

    // Get history and listen new data added
    this.removeListener = firebase
      .firestore()
      .collection("messages")
      .doc(this.groupChatId)
      .collection("msg")
      .onSnapshot(
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              this.listMessage.push(change.doc.data());
            }
          });
          this.setState({ isLoading: false });
        },
        (err) => {
          alert(err.toString());
        }
      );

    console.log("listmesg:", this.listMessage);
  };

  onSendMessage = (content, type) => {
    if (this.state.isShowSticker && type === 2) {
      this.setState({ isShowSticker: false });
    }

    if (content.trim() === "") {
      return;
    }

    const timestamp = moment().valueOf().toString();

    const itemMessage = {
      idFrom: this.currentUserId,
      idTo: this.currentPeerUserId,
      timestamp: timestamp,
      content: content.trim(),
      type: type,
      // messageId:""
    };

    firebase
      .firestore()
      .collection("messages")
      .doc(this.groupChatId)
      .collection("msg")
      .doc(timestamp)
      .set(itemMessage)
      .then(() => {
        this.setState({ inputValue: "" });
      })
      .catch((err) => {
        alert(err.toString());
      });

    if (itemMessage.content.length > 10) {
      itemMessage.content = itemMessage.content.substring(0, 11) + "..";
    }

    if (this.currentUserId <= this.currentPeerUserId) {
      firebase
        .firestore()
        .collection("messages")
        .doc(this.groupChatId)
        .set({
          members: [this.currentUserId, this.currentPeerUserId],
          timestamp: timestamp,
          latestMessage: itemMessage.content,
          messageSender: itemMessage.idFrom,
        });
    } else {
      firebase
        .firestore()
        .collection("messages")
        .doc(this.groupChatId)
        .set({
          members: [this.currentUserId, this.currentPeerUserId],
          timestamp: timestamp,
          latestMessage: itemMessage.content,
          messageSender: itemMessage.idFrom,
        });
    }
    this.getInboxUsers();
  };
  getGifImage = (value) => {
    return " https://i.giphy.com/media/" + value + "/giphy.webp";
  };

  onChoosePhoto = (event) => {
    if (event.target.files && event.target.files[0]) {
      this.setState({ isLoading: true });
      this.currentPhotoFile = event.target.files[0];
      // Check this file is an image?
      const prefixFiletype = event.target.files[0].type.toString();

      if (this.currentPhotoFile.size > 10e6) {
        alert("Please upload a file smaller than 10 MB");
        return false;
      } else {
        // if (prefixFiletype.indexOf("image/") === 0) {
        //   this.uploadPhoto();
        // } else
        
        if (prefixFiletype.indexOf("video/") === 0) {
          this.uploadVideo();
        } else {
          this.setState({ isLoading: false });

          alert("Invalid format");
        }
      }
    } else {
      this.setState({ isLoading: false });
    }
  };

  uploadPhoto = (file) => {
    if (file) {
      const timestamp = moment().valueOf().toString();

      const uploadTask = firebase
        .storage()
        .ref()
        .child("chatPics/" + timestamp)
        .put(file);

      uploadTask.on(
        "state_changed",
        // null,
        (snapshot) => {
          const getProgress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          this.setState({ progress: getProgress });
        },
        (err) => {
          this.setState({ isLoading: false });
          alert(err.message);
        },

        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.setState({ isLoading: false });
            this.onSendMessage(downloadURL, 1);
          });
        }
      );
    } else {
      this.setState({ isLoading: false });
      alert("File is null");
    }
  };

  uploadVideo = () => {
    if (this.currentPhotoFile) {
      const timestamp = moment().valueOf().toString();

      const uploadTask = firebase
        .storage()
        .ref()
        .child("chatVids/" + timestamp)
        .put(this.currentPhotoFile);

      uploadTask.on(
        "state_changed",
        // null,
        (snapshot) => {
          const getProgress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          this.setState({ progress: getProgress });
        },
        (err) => {
          this.setState({ isLoading: false });
          alert(err.message);
        },

        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.setState({ isLoading: false });
            this.onSendMessage(downloadURL, 3);
          });
        }
      );
    } else {
      this.setState({ isLoading: false });
      alert("File is null");
    }
  };

  onKeyboardPress = (event) => {
    if (event.key === "Enter") {
      this.onSendMessage(this.state.inputValue, 0);
    }
  };

  scrollToBottom = () => {
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Get all the users the current user3 is following
  // getFollowedUsers = async () => {
  //   let users = [];
  //   await firebase
  //   .firestore()
  //   .collection("messages")
  //   .where("user2","==",this.currentUserId  )
  //   .get()
  //   .then((querySnapshot) => {
  //     querySnapshot.forEach((docSnap) => {
  //       users.push(docSnap.id);
  //     });
  //   });
  //   await firebase
  //   .firestore()
  //   .collection("messages")
  //   .where("user1","==",this.currentUserId  )
  //   .get()
  //   .then((querySnapshot) => {
  //     querySnapshot.forEach((docSnap) => {
  //       users.push(docSnap.id);
  //     });
  //   });

  //   this.setState({ followedUsers: users });
  //   console.log("FRIENDS LIST1: " , this.state.followedUsers);
  //   this.getFollowedUsersData();
  // };

  // getChat = async () => {
  //   let users = [];
  //   await firebase
  //     .firestore()
  //     .collection("messages")
  //     .where(
  //       "user1",
  //       "==",
  //       this.currentUserId || "user2",
  //       "==",
  //       this.currentUserId
  //     )
  //     .get()
  //     .then((querySnapshot) => {
  //       querySnapshot.forEach((docSnap) => {
  //         users.push(docSnap.id);
  //       });
  //     });
  //   this.setState({ followedUsers: users });
  //   console.log("FRIENDS LIST2: ", this.state.followedUsers);
  //   // this.getFollowedUsersData();
  // };


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

      await this.uploadPhoto(compressedFile);
      // console.log(compressedFile)
      // uploadToServer(compressedFile); // write your own logic
    } catch (error) {
      console.log(error);
    }

  }


  renderListMessage = () => {
    const { t } = this.props;
    if (this.listMessage.length > 0) {
      let viewListMessage = [];

      this.listMessage.forEach((item, index) => {
        if (item.idFrom === this.currentUserId) {
          // Item right (my message)
          if (item.type === 0) {
            viewListMessage.push(
              <div
                className="row justify-content-end text-right"
                key={item.timestamp}
              >
                <div className="col-auto">
                  {/* <ReactShadowScroll> */}
                  <div
                    className="card bg-gradient-muted text-primary shadow"
                    style={{ borderRadius: "10px", marginBottom: "10px" }}
                  >
                    <div
                      className="card-body p-2"
                      key={item.timestamp}
                      style={{ overflowWrap: "anywhere", maxWidth: "400px" }}
                    >
                      <p className="mb-1 font-weight-bold">
                        {/* <span class="textarea" role="textbox"  contentEditable>              */}

                        {item.content}
                        {/* </span> */}
                        <br />
                      </p>
                      <div>
                        <small className="opacity-60">
                          {moment(Number(item.timestamp)).format("lll")}
                        </small>
                        <i className="ni ni-check-bold"></i>
                      </div>
                    </div>
                  </div>
                  {/* </ReactShadowScroll> */}
                </div>
              </div>
            );
          } else if (item.type === 1) {
            viewListMessage.push(
              <div className="row justify-content-end text-right">
                <div
                  className="col-auto"
                  style={{ height: "45%", width: "45%" }}
                >
                  {/* <ReactShadowScroll> */}
                  <div
                    className="card bg-gradient-muted text-primary shadow"
                    style={{ borderRadius: "10px", marginBottom: "10px" }}
                  >
                    <div className="card-body p-2 ml-auto" key={item.timestamp}>
                      <p className="mb-1 font-weight-bold">
                        {/* <Card className="viewItemRight2 ml-auto"  key={item.timestamp}
              style={{  height: "15%", width : "20%" }}
              > */}
                        <img
                          className="img-fluid rounded"
                          src={item.content}
                          alt="Image placeholder"
                        />
                        {/* </Card>  */}
                        <br />
                      </p>
                      <div>
                        <small className="opacity-60">
                          {moment(Number(item.timestamp)).format("lll")}
                        </small>
                        <i className="ni ni-check-bold"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else if (item.type === 3) {
            viewListMessage.push(
              <div className="row justify-content-end text-right">
                <div className="col-auto">
                  {/* <ReactShadowScroll> */}
                  <div
                    className="card bg-gradient-muted text-primary shadow"
                    style={{ borderRadius: "10px", marginBottom: "10px" }}
                  >
                    <div
                      className="card-body p-2 "
                      key={item.timestamp}
                      style={{
                        width: "420px",
                        //  height:"300px"
                      }}
                    >
                      <ReactPlayer
                        url={item.content}
                        light={require("assets/img/icons/images/download.png")}
                        controls={true}
                        width="100%"
                        height="100%"
                      />
                      <div>
                        <small className="opacity-60">
                          {moment(Number(item.timestamp)).format("lll")}
                        </small>
                        <i className="ni ni-check-bold"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else {
            viewListMessage.push(
              <div className="row justify-content-end text-right">
                <div className="col-auto">
                  {/* <ReactShadowScroll> */}
                  {/* <div className="card bg-gradient-muted text-primary shadow" style={{ borderRadius:"10px", marginBottom:"10px"}} > */}
                  <div className="card-body p-2" key={item.timestamp}>
                    <div
                      className="viewItemRight3"
                      key={item.timestamp}
                      style={{
                        height: "-webkit-fill-available",
                        width: "inherit",
                        paddingBottom: "20px",
                        marginRight: "0px",
                      }}
                    >
                      <img
                        className="imgItemRight"
                        style={{ height: "200px", width: "270px" }}
                        src={
                          "https://i.giphy.com/media/" +
                          item.content +
                          "/giphy.webp"
                        }
                        alt="content message"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        } else {
          // Item left (peer message)
          if (item.type === 0) {
            viewListMessage.push(
              <div key={item.timestamp}>
                <div
                  // className="viewWrapItemLeft3"
                  style={{ display: "flex", flexDirection: "left" }}
                >
                  {/* {this.isLastMessageLeft(index) ? (
                                        <img
                                            src={this.state.peerPic}
                                            alt="avatar"
                                            className="avatar shadow left peerAvatarLeft" 
                                        />
                                    ) : (
                                        <div className="viewPaddingLeft"/>
                                    )} */}
                  <div className="col-auto">
                    <div
                      className="card bg-gradient-muted text-black shadow"
                      style={{
                        borderRadius: "10px",
                        marginBottom: "10px",
                        marginTop: "10px",
                      }}
                    >
                      <div
                        className="card-body p-2"
                        key={item.timestamp}
                        style={{ overflowWrap: "anywhere", maxWidth: "400px" }}
                      >
                        <p className="mb-1 font-weight-bold">
                          {item.content}
                          <br />
                        </p>
                        <div>
                          <small className="opacity-60">
                            {moment(Number(item.timestamp)).format("lll")}
                          </small>
                          <i className="ni ni-check-bold"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {this.isLastMessageLeft(index) ? (
                  <span className="textTimeLeft">
                    {moment(Number(item.timestamp)).format("ll")}
                  </span>
                ) : null}
              </div>
            );
          } else if (item.type === 1) {
            viewListMessage.push(
              <div className="viewWrapItemLeft2" key={item.timestamp}>
                <div className="viewWrapItemLeft3">
                  {/* <div className="viewPaddingLeft" /> */}

                  {/* {this.isLastMessageLeft(index) ? (
                                        <img
                                            src={this.state.peerPic}
                                            alt="avatar"
                                            className="avatar shadow left peerAvatarLeft" 
                                        />
                                    ) : (
                                        <div className="viewPaddingLeft"/>
                                    )} */}
                  <div
                    // className="col-auto"
                    style={{ height: "45%", width: "100%" }}
                  >
                    <div
                      className="card bg-gradient-muted text-black shadow"
                      style={{ borderRadius: "10px", marginBottom: "10px" }}
                    >
                      {/* {this.isLastMessageLeft(index) ? (
                        <img
                          src={this.state.peerPic}
                          alt="avatar"
                          className="avatar shadow left peerAvatarLeft"
                        />
                      ) : (
                        <div className="viewPaddingLeft" />
                      )} */}
                      <div className="card-body p-2" key={item.timestamp}>
                        <p className="mb-1 font-weight-bold">
                          <img
                            className="img-fluid rounded"
                            src={item.content}
                            alt="Image placeholder"
                          />
                          <br />
                        </p>
                        <div>
                          <small className="opacity-60">
                            {moment(Number(item.timestamp)).format("lll")}
                          </small>
                          <i className="ni ni-check-bold"></i>
                        </div>
                      </div>
                    </div>
                    <br />
                  </div>
                </div>
              </div>
            );
          } else if (item.type === 3) {
            viewListMessage.push(
              <div className="viewWrapItemLeft2" key={item.timestamp}>
                <div className="viewWrapItemLeft3">
                  {/* <div className="viewPaddingLeft" /> */}

                  {/* {this.isLastMessageLeft(index) ? (
                                        <img
                                            src={this.state.peerPic}
                                            alt="avatar"
                                            className="avatar shadow left peerAvatarLeft" 
                                        />
                                    ) : (
                                        <div className="viewPaddingLeft"/>
                                    )} */}
                  <div
                  // className="col-auto"
                  // style={{ height: "45%", width: "100%" }}
                  >
                    <div
                      className="card bg-gradient-muted text-black shadow"
                      style={{ borderRadius: "10px", marginBottom: "10px" }}
                    >
                      {/* {this.isLastMessageLeft(index) ? (
                        <img
                          src={this.state.peerPic}
                          alt="avatar"
                          className="avatar shadow left peerAvatarLeft"
                        />
                      ) : (
                        <div className="viewPaddingLeft" />
                      )} */}
                      <div
                        className="card-body p-2"
                        key={item.timestamp}
                        style={{
                          width: "420px",
                          //  height:"300px"
                        }}
                      >
                        {/* <p className="mb-1 font-weight-bold"> */}
                        {/* <div className="player-wrapper"> */}
                        <ReactPlayer
                          // className="react-player"
                          controls={true}
                          light={require("assets/img/icons/images/download.png")}
                          url={item.content}
                          width="100%"
                          height="100%"
                        />
                        {/* </div> */}

                        {/* <br /> */}
                        {/* </p> */}
                        <div>
                          <small className="opacity-60">
                            {moment(Number(item.timestamp)).format("lll")}
                          </small>
                          <i className="ni ni-check-bold"></i>
                        </div>
                      </div>
                    </div>
                    <br />
                  </div>
                </div>
              </div>
            );
          } else {
            viewListMessage.push(
              <div className="viewWrapItemLeft2" key={item.timestamp}>
                <div className="viewWrapItemLeft3">
                  {/* {this.isLastMessageLeft(index) ? (
                    <img
                      src={this.state.peerPic}
                      alt="avatar"
                      className="peerAvatarLeft"
                    />
                  ) : (
                    <div className="viewPaddingLeft" />
                  )} */}
                  <div style={{ borderRadius: "10px", marginBottom: "15px" }}>
                    <div
                      className="viewItemLeft3"
                      key={item.timestamp}
                      style={{
                        height: "-webkit-fill-available",
                        width: "inherit",
                        paddingBottom: "20px",
                        marginLeft: "0px",
                      }}
                    >
                      <img
                        className="imgItemLeft"
                        style={{ height: "200px", width: "270px" }}
                        src={
                          "https://i.giphy.com/media/" +
                          item.content +
                          "/giphy.webp"
                        }
                        alt="content message"
                      />
                    </div>
                  </div>
                </div>
                {this.isLastMessageLeft(index) ? (
                  <span className="textTimeLeft">
                    {moment(Number(item.timestamp)).format("ll")}
                  </span>
                ) : null}
              </div>
            );
          }
        }
      });
      return viewListMessage;
    } else {
      return (
        <div className="viewWrapSayHi">
          {/* <img
            className="avatar"
            src={this.state.peerPic}
            alt="wave hand"
          /> */}
          <span className="textSayHi">{t(" Say hi to new friend ")}</span>

          <img
            className="imgWaveHand"
            // style={{ width: "40px",
            //     height: "40px",
            //     marginLeft: "10px"}}
            src={images.ic_wave_hand}
            alt="wave hand"
          />

          {/* <img
            // className="imgWaveHand"
            className="avatar"
            src={this.state.profilePic}
          /> */}
        </div>
      );
    }
  };

  openListSticker = () => {
    this.setState({ isShowSticker: !this.state.isShowSticker });
  };

  getUserDetails = (uid, type) => {
    if (uid.trim() === "") {
      return;
    }

    firestoreUsersRef.doc(uid).onSnapshot((doc) => {
      const res = doc.data();
      if (res != null) {
        // if (item.type === 0) {
        if (type.trim() === "user") {
          this.setState({
            userName: res.username,
            name: res.name,
            profilePic: res.profilePic
              ? res.profilePic
              : require("assets/img/icons/user/user1.png"),
          });
        } else if (type.trim() === "peer") {
          this.setState({
            peerUserName: res.username,
            peerName: res.name,
            peerPic: res.profilePic,
          });
        } else if (type.trim() === "friend") {
          this.setState({
            friendUserName: res.username,
            friendName: res.name,
            friendPic: res.profilePic
              ? res.profilePic
              : require("assets/img/icons/user/user1.png"),
          });
        }
      }
    });
  };

  hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash += Math.pow(str.charCodeAt(i) * 31, str.length - i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };

  isLastMessageLeft(index) {
    if (
      (index + 1 < this.listMessage.length &&
        this.listMessage[index + 1].idFrom === this.currentUserId) ||
      index === this.listMessage.length - 1
    ) {
      return true;
    } else {
      return false;
    }
  }

  isLastMessageRight(index) {
    if (
      (index + 1 < this.listMessage.length &&
        this.listMessage[index + 1].idFrom !== this.currentUserId) ||
      index === this.listMessage.length - 1
    ) {
      return true;
    } else {
      return false;
    }
  }

  // scrollToBottom = () => {
  //   if (this.messagesEnd) {
  //     this.messagesEnd.scrollIntoView({});
  //   }
  // };

  // componentDidUpdate() {
  //   this.scrollToBottom();
  // }

  // onHover = (userId) => {
  //   localStorage.setItem("Fuid", JSON.stringify(userId));
  // };

  clearChat = async () => {
    // await firebase
    // .firestore()
    // .collection("messages")
    // .doc(this.groupChatId)
    // .collection("msg")
    // .doc()
    // .delete()
    // .then(() => {
    //   alert("Chat Deleted!");
    //   this.setState({ chatDeleted: true });
    // })
    // .catch(err => {
    //   alert(err);
    // });
  };

  fetchGifs = (offset) =>
    this.state.inputValue.length > 1
      ? gf.search(this.state.inputValue, {
          offset,
          limit: 5,
        })
      : gf.trending({ offset, limit: 10 });

  render() {
    const { t } = this.props;

    return (
      <>
        <UserNavbar />
        <main
          className="profile-page"
          ref="main"
          style={{
            backgroundImage:
              "radial-gradient(circle, #e4efe9, #c4e0dd, #a7cfd9, #94bcd6, #93a5cf)",
          }}
        >
          <section
            className="section section-blog-info"
            style={{ marginTop: "30px" }}
          >
            <div
              className="mb-5"
              style={{
                zoom: "80%",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
            >
              <div className="row flex-row chat justify-content-center">
                <div className="col-lg-3" style={{ borderBottom: "22px" }}>
                  {/* ADD INBOX COMPONENT */}

                  {/* <Inbox /> */}

                  <div
                    className="card bg-secondary"
                    style={{
                      overflow: "auto",
                      borderRadius: "20px",
                      // paddingBottom: "22px",
                      marginBottom: "22px",
                    }}
                    // style={{ zoom: "85%",  }}
                  >
                    <form className="card-header mb-3 text-center bg-gradient-muted">
                      <span className="text-black font-weight-bold">
                        {/* {this.state.groupChats.length} Friends online */}
                        {t("Recent Chats")}

                        {/* {"!"} */}
                      </span>
                    </form>
                    {this.state.inboxUsersData.map((item, index) => (
                      <div
                        className="list-group list-group-chat list-group-flush"
                        key={index}
                      >
                        <p
                          className="list-group-item bg-gradient-white"
                          // onMouseOver={() => this.onHover(user.idFrom)}
                        >
                          <Link to={`/chat/${item.peerid}`}>
                            <div className="media">
                              <Link to={`/friend/${item.peerid}`}>
                                <img
                                  alt="Image"
                                  src={item.peerprofilePic}
                                  className="avatar"
                                />
                              </Link>
                              <div className="media-body ml-2">
                                <div className="justify-content-between align-items-center">
                                  <h6 className="mb-0 text-black font-weight-bold">
                                    {item.peername}
                                    <span className="badge badge-success"></span>
                                  </h6>
                                  <div>
                                    <small className="text-muted">
                                      {item.name == this.state.name
                                        ? "You"
                                        : item.name}
                                      {/* {item.name} */}: {item.content}
                                      <small
                                        className="col-md-1 col-3"
                                        style={{ right: "0px" }}
                                      >
                                        {moment(Number(item.timestamp)).format(
                                          "ll"
                                        )}
                                      </small>
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* <div
                    className="card bg-secondary"
                    style={{ overflow: "auto" }}
                  >
                    <form className="card-header mb-3 text-center bg-gradient-muted">
                      <span className="text-black font-weight-bold">
                        {this.state.followedUsers.length} Friends online
                        {t("Say Hi")}
                        {"!"}
                      </span>
                    </form>
                    {this.state.followedUsersData.map((user) => (
                      <div className="list-group list-group-chat list-group-flush">
                        <a
                          href="javascript:;"
                          className="list-group-item bg-gradient-white"
                          onMouseOver={() => this.onHover(user.userId)}
                        >
                          <div className="media">
                            <Link to="/friend">
                              <img
                                alt="Image"
                                src={user.avatar}
                                className="avatar"
                              />
                            </Link>
                            <div className="media-body ml-2">
                              <div className="justify-content-between align-items-center">
                                <h6 className="mb-0 text-black font-weight-bold">
                                  {user.username}
                                  <span className="badge badge-success"></span>
                                </h6>
                                <div>
                                  <small className="text-muted">
                                    {user.name}
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
              */}
                </div>
                <div className="col-lg-8">
                  <div className="card" style={{ borderRadius: "20px" }}>
                    <div
                      className="card-header d-inline-block"
                      style={{ borderRadius: "20px" }}
                    >
                      <div className="row">
                        <div className="col-md-10">
                          <div className="media align-items-center">
                            <img
                              alt="Image"
                              src={this.state.peerPic}
                              className="avatar shadow img-responsive"
                              style={{
                                width: "44px",
                                height: "44px",
                                display: "block",
                                objectFit: "cover",
                                margin: "5px",
                              }}
                            />
                            <div className="media-body">
                              <h6 className="mb-0 d-block">
                                {this.state.peerName}
                              </h6>
                              <span className="text-muted text-small">
                                {" "}
                                {this.state.peerUserName}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-1 col-3"></div>

                        <div className="col-md-1 col-3">
                          <UncontrolledDropdown nav>
                            <DropdownToggle nav className="nav-link-icon">
                              <i className="ni ni-settings-gear-65" />
                              <span className="nav-link-inner--text d-lg-none">
                                {t("Settings")}
                              </span>
                            </DropdownToggle>
                            <DropdownMenu
                              aria-labelledby="navbar-success_dropdown_1"
                              right
                            >
                              <DropdownItem
                                to="/friendspage"
                                tag={Link}
                                // onClick={this.logOut}
                              >
                                <p
                                  className="dropdown-item"
                                  // href="javascript:;"
                                >
                                  <i className="ni ni-single-02"></i>{" "}
                                  {t("Profile")}
                                </p>
                              </DropdownItem>
                              <DropdownItem onClick={this.clearChat}>
                                <p
                                  className="dropdown-item"
                                  // href="javascript:;"
                                >
                                  <i className="ni ni-fat-remove"></i>{" "}
                                  {t("Delete chat")}
                                </p>
                              </DropdownItem>
                              <DropdownItem>
                                <DeleteOutline onClick={this.clearChat} />
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>
                      </div>
                    </div>
                    <div
                      className="card-body"
                      style={{ overflow: "auto", height: "450px" }}
                    >
                      {this.renderListMessage()}

                      <div
                        style={{ float: "left", clear: "both" }}
                        ref={(el) => {
                          this.messagesEnd = el;
                        }}
                      />
                      {/* </div> */}

                      {/* 
          <div className="row justify-content-start">
            <div className="col-auto">
              <div className="card">
                <div className="card-body p-2">
                  <p className="mb-1">
                    It contains a lot of good lessons about effective practices
                  </p>
                  <div>
                    <small className="opacity-60"><i className="far fa-clock"></i> 3:14am</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row justify-content-end text-right">
            <div className="col-auto">
              <div className="card bg-gradient-primary text-white">
                <div className="card-body p-2">
                  <p className="mb-1">
                    Can it generate daily design links that include essays and data visualizations ?<br />
                  </p>
                  <div>
                    <small className="opacity-60">3:30am</small>
                    <i className="ni ni-check-bold"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-12 text-center">
              <span className="badge text-default">Wed, 3:27pm</span>
            </div>
          </div>
        
        
          <div className="row justify-content-start">
            <div className="col-auto">
              <div className="card ">
                <div className="card-body p-2">
                  <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                  </div>
                  <p className="d-inline-block mr-2 mb-2">
                    Typing...
                  </p>
                </div>
              </div>
            </div>
          </div> */}
                    </div>

                    {/* Stickers */}
                    {this.state.isShowSticker ? (
                      //   this.renderStickers()

                      <Carousel
                        gifHeight={100}
                        gutter={6}
                        fetchGifs={this.fetchGifs}
                        onGifClick={(gif, e) => {
                          // console.log("gif", gif);
                          this.onSendMessage(gif.id, 2);
                          e.preventDefault();
                          // setModalGif(gif);
                        }}
                      />
                    ) : null}

                    {/* View bottom */}
                    <div className="viewBottom">
                      <img
                        className="icOpenGallery"
                        // src={images.ic_photo}
                        src={require("assets/img/icons/images/icon8_img.png")}
                        alt="icon open gallery"
                        onClick={() => this.refInput.click()}
                      />
                      <input
                        ref={(el) => {
                          this.refInput = el;
                        }}
                        accept="image/*"
                        className="viewInputGallery"
                        type="file"
                        // onChange={this.onChoosePhoto}
                        onChange={event => this.handleImageUpload(event)}
                      />
                      <img
                        className="icOpenGallery"
                        src={require("assets/img/icons/images/icon8_vid.png")}
                        alt="icon open gallery"
                        onClick={() => this.refInput.click()}
                      />
                      <input
                        ref={(el) => {
                          this.refInput = el;
                        }}
                        accept="video/*"
                        className="viewInputGallery"
                        type="file"
                        onChange={this.onChoosePhoto}
                      />

                      <img
                        className="icOpenSticker"
                        // src={images.ic_sticker}
                        src={require("assets/img/icons/images/icon8_gif.png")}
                        alt="icon open sticker"
                        onClick={this.openListSticker}
                      />

                      <input
                        className="viewInput"
                        placeholder="Type your message..."
                        value={this.state.inputValue}
                        onChange={(event) => {
                          this.setState({ inputValue: event.target.value });
                        }}
                        onKeyPress={this.onKeyboardPress}
                      />
                      <img
                        className="icSend"
                        src={images.ic_send}
                        alt="icon send"
                        onClick={() =>
                          this.onSendMessage(this.state.inputValue, 0)
                        }
                      />
                    </div>

                    {/* </div> */}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <SimpleFooter />
        </main>
        {/* <Update /> */}
      </>
    );
  }
}

export default withTranslation()(chat);

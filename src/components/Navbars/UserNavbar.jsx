import React from "react";
import moment from "moment";
import { Link, Redirect } from "react-router-dom";
// JavaScript plugin that hides or shows a component based on your scroll
import Headroom from "headroom.js";
// reactstrap components
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";

import NotificationsIcon from "@material-ui/icons/Notifications";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Inbox from "components/inbox";
import {
  // Button,
  Alert,
  UncontrolledCollapse,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  // Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  // TabContent,
  // TabPane,
  // UncontrolledTooltip,
  Card,
  UncontrolledAlert,
  CardBody,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormGroup,
  Label,
  UncontrolledTooltip,
  Modal,
  Button,
} from "reactstrap";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
// import firebase from "firebase/app";
// import { firebase } from "../../services/firebase";
import * as firebase from "firebase";
import { logOutUser } from "../../services/authServices";
import Friendreq from "../../pages/FriendReq";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { ActionsCreator } from "../../redux/actions";
// import classnames from "classnames";
// import { Route, Redirect } from "react-router-dom";

class UserNavbar extends React.Component {
  firestoreUsersRef = firebase.firestore().collection("users");
  constructor(props) {
    super(props);
    this.state = {
      user3: JSON.parse(localStorage.getItem("uid")),
      user: {},
      searchWord: "",
      searchResults: [],
      profilePic: require("assets/img/brand/logo.png"),
      username: undefined,
      name: undefined,
      friendReq: [],
      notifications: [],
      alert: [],

      currentName: undefined,
      userProfilePic: require("assets/img/icons/user/user1.png"),

      // "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg",
      foundUser: "",
      found: false,
      userChecked: false,
      reqNotify: false,
      value: localStorage.getItem("lang") ? localStorage.getItem("lang") : "en",

      collapseClasses: "",
      collapseOpen: false,

      currentUserUid: JSON.parse(localStorage.getItem("uid")),
      currentUsername: undefined,
      unseenChats: 0,
    };
  }

  handleChange = (event) => {
    console.log("selected val is ", event.target.value);
    let newlang = event.target.value;
    this.setState((prevState) => ({ value: newlang }));
    localStorage.setItem("lang", JSON.stringify(newlang));
    console.log("state value is", newlang, this.props.i18n.changeLanguage);
    this.props.i18n.changeLanguage(newlang);
  };
  // let citiesRef = db.collection('cities');
  // let query = citiesRef.where('capital', '==', true).get()
  //   .then(snapshot => {
  //     if (snapshot.empty) {
  //       console.log('No matching documents.');
  //       return;
  //     }

  //     snapshot.forEach(doc => {
  //       console.log(doc.id, '=>', doc.data());
  //     });
  //   })
  //   .catch(err => {
  //     console.log('Error getting documents', err);
  //   });

  // checkReqNotification = () => {
  //   firebase
  //     .firestore()
  //     .collection("users")
  //     .doc(this.state.user3)
  //     .collection("received")
  //     .limit(1)
  //     .get()
  //     .then((querySnapshot) => {
  //       if (querySnapshot.length > 0) this.setState({ reqNotify: true });
  //     });
  // };

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };

  searchUser(word) {
    let userCollectionRef = firebase.firestore().collection("users");
    console.log(word);
    if (word.length > 2) this.setState({ userChecked: true });
    let users = [];
    if (word.length > 2) {
      userCollectionRef
        // .where("username", "==", word.toLowerCase())
        // .where("username", "==", word)
        .where("usernameKeywords", "array-contains", word)
        // .orderByChild("usernameKeywords").equalTo(word)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((documentSnapshot) => {
            console.log(documentSnapshot.data());
            // let f = documentSnapshot.id +""+ documentSnapshot.data();
            users.push(documentSnapshot);

            //   console.log(documentSnapshot.id);
            this.setState({
              foundUser: documentSnapshot.id,
              found: true,
              username: documentSnapshot.data().username,
              name: documentSnapshot.data().name,
              profilePic: documentSnapshot.data().profilePic
                ? documentSnapshot.data().profilePic
                : require("assets/img/icons/user/user1.png"),
            });
            // console.log(this.state.foundUser)
            // console.log(users);
          });
          // console.log(this.state.searchResults);
          // console.log(this.state.foundUser);

          if (users.length == 0) {
            this.setState({
              profilePic: require("assets/img/icons/user/user1.png"),
              searchResults: [],
              foundUser: "",
              found: false,
            });
            // console.log(this.state.found);
          } else {
            // let profilePic = firebase
            //   .storage()
            //   .ref()
            //   .child("profilePics/(" + this.state.foundUser + ")ProfilePic");
            // profilePic.getDownloadURL().then((url) => {
            //   this.setState({ profilePic: url });
            // });
            this.setState({
              searchResults: users,
            });
            console.log(this.state.searchResults);
          }
        });
    }
    // this.setState({
    //   found: false,
    // });
  }

  // renderAvatar() {
  //   // const {
  //   //   //  avatar, styles,
  //   //   item
  //   // } = this.props;

  //   // if (!item.avatar) return null;
  //   return (
  //     <Link to={`/friend/${this.state.foundUser}`}>
  //       <img
  //         // className="rounded-circle"
  //         className="avatar"
  //         width="45"
  //         src={this.state.profilePic}
  //         alt=""
  //         // onClick={localStorage.setItem('Fuid', JSON.stringify(this.state.userId))}
  //       />
  //     </Link>
  //   );
  // }

  // renderAvatar() {
  //   const { avatar, styles, item } = this.props;

  //   // if (!item.avatar) return null;
  //   return (
  //     <Link to="/friend">
  //       <img
  //         className="rounded-circle"
  //         width="45"
  //         src={item.avatar}
  //         alt=""
  //         // onClick={localStorage.setItem('Fuid', JSON.stringify(this.state.userId))}
  //       />
  //     </Link>
  //   );
  // }

  // togglePage = () => {
  //   // document.body.style.color = "red";
  //   const frndId = this.state.userId;
  //   const { item } = this.props;
  //   // if (!this.state.ifLiked) {
  //   this.firestorePostRef
  //     .doc(item.postId)
  //     .collection("likes")
  //     .doc(this.state.newLikeDocId)
  //     .set({
  //       userId: this.user.uid
  //     })
  //     .then(() => {
  //       {
  //         localStorage.setItem("Fuid", JSON.stringify(this.state.userId));
  //       }
  //     });
  // };
  onHover = () => {
    // localStorage.setItem("Fuid", JSON.stringify(this.state.foundUser));
    // this.setState({fuid:})
  };

  handleAccept = (uId, username, avatar) => {
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
        .doc(this.state.currentUserUid)
        .collection("userNotifications")
        .doc(uId)
        .delete() &&
      firebase
        .firestore()
        .collection("notifications")
        .doc(uId)
        .collection("userNotifications")
        .doc("(" + this.state.currentUserUid + ")requestAccepted")
        .set({
          userId: this.state.currentUserUid,

          source: this.state.currentUserUid,
          content: "accepted your follow request",
          type: "requestAccepted",
          time: moment().valueOf().toString(),
        }) &&
      firebase
        .firestore()
        .collection("notifications")
        .doc(this.state.currentUserUid)
        .collection("userNotifications")
        .doc(uId)
        .set({
          userId: uId,
          source: uId,
          content: "started following you",
          type: "follow",
          time: moment().valueOf().toString(),
        });

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

  // renderUserItem = () => {
  //   // const { item } = this.props;
  //   // if (this.state.found) {
  //   return (
  //     <Link to={`/friend/${this.state.foundUser}`}>
  //       <div className="d-flex align-items-center">
  //         <img
  //           // className="rounded-circle"
  //           className="avatar"
  //           width="45"
  //           src={user.profilePic}
  //           alt=""
  //           // onClick={localStorage.setItem('Fuid', JSON.stringify(this.state.userId))}
  //         />
  //         <div className="mx-3">
  //           <h6 className="mb-0 text-black font-weight-bold">{user.name} </h6>

  //           <small className="text-muted">@{user.username} </small>
  //         </div>
  //       </div>
  //     </Link>
  //   );
  //   // } else return null;
  // };

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };

  textInput = (word) => {
    // word.preventDefault();
    this.setState({ searchWord: word });
    this.searchUser(word.target.value);
    // console.log("textinput+   " + word);
  };

  // handleChange(e) {
  //       // Variable to hold the original version of the list
  //   let currentList = [];
  //       // Variable to hold the filtered list before putting into state
  //   let newList = [];

  //       // If the search bar isn't empty
  //   if (e.target.value !== "") {
  //           // Assign the original list to currentList
  //     currentList = this.props.items;

  //           // Use .filter() to determine which items should be displayed
  //           // based on the search terms
  //     newList = currentList.filter(item => {
  //               // change current item to lowercase
  //       const lc = item.toLowerCase();
  //               // change search term to lowercase
  //       const filter = e.target.value.toLowerCase();
  //               // check to see if the current list item includes the search term
  //               // If it does, it will be added to newList. Using lowercase eliminates
  //               // issues with capitalization in search terms and search content
  //       return lc.includes(filter);
  //     });
  //   } else {
  //           // If the search bar is empty, set newList to original task list
  //     newList = this.props.items;
  //   }
  //       // Set the filtered state based on what our rules added to newList
  //   this.setState({
  //     filtered: newList
  //   });
  // }

  // renderSearchBar = () => {
  //   const { navigation } = this.props;
  //   return (
  //     <Input
  //       right
  //       color="black"
  //       // style={styles.search}
  //       placeholder="Search"
  //       placeholderTextColor={"#8898AA"}
  //       // onFocus={() => navigation.navigate('Pro')}
  //       onChangeText={word => this.textInput(word)}
  //       value={this.state.searchWord}
  //       // iconContent={<Icon size={16} color={theme.COLORS.MUTED} name="search" family="EvilIcons" />}
  //     />
  //   );
  // };

  // renderDropdown(array) {
  //   if (this.state.searchResults.length) {
  //     let searchResults = this.state.searchResults;
  //     searchResults.map(user => {
  //       return <li>user.username;</li>;
  //     });
  //   }
  // }

  // toggleDropdown(){
  //   if (this.state.searchResults.length) {
  //     let searchResults = this.state.searchResults;
  //     searchResults.map(user => {
  //       return <option>user.username;</option>;
  //     });
  //   }
  // }

  renderSearchBar = () => {
    const { t } = this.props;
    return (
      <>
        <InputGroup className="input-group-alternative">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>@</InputGroupText>
          </InputGroupAddon>
          <input
            className="form-control-alternative"
            placeholder={t("Search")}
            type="text"
            // onChange={this.textInput}
            // value={this.state.searchWord}
            onChange={(word) => this.textInput(word)}
            onKeyDown={(e) => {
              if (e.keyCode === 8) this.setState({ userChecked: false });
            }}
            // value={this.state.searchWord}
          />
        </InputGroup>
      </>
    );
  };

  logOut() {
    logOutUser();
  }

  noUserFound = () => {
    if (this.state.userChecked) {
      return (
        <DropdownMenu
          style={{
            position: "absolute",
            willChange: " transform",
            top: "0px",
            left: "0px",
            transform: " translate3d(15px, 51px, 0px)",
            width: "222px",
          }}
          aria-labelledby="navbar-success_dropdown_1"
          right
        >
          {/* {" "} */}
          <DropdownItem>sssound!</DropdownItem>
        </DropdownMenu>
      );
    }
  };

  componentDidMount() {
    localStorage.setItem("lang", "en");

    this.props.i18n.changeLanguage(this.state.value);

    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user: user });

      firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            alert("User does not exist");
            logOutUser();
            // localStorage.clear();
          } else {
            const res = doc.data().profilePic;
            if (res != null) {
              this.setState({
                userProfilePic: res,
              });
            }
            this.setState({
              currentName: doc.data().name,
            });
          }
        });
    });
    let headroom = new Headroom(document.getElementById("navbar-main"));
    // initialise
    headroom.init();
    // this.checkReqNotification();
    // this.renderUserItem();
    this.renderSearchBar();
    this.getFriendReq();

    this.getNotifications();
    this.firestoreUsersRef
      .doc(this.state.currentUserUid)
      .get()
      .then((document) => {
        this.setState({ currentUsername: document.data().username });
      });
  }

  //       componentDidUpdate(prevProps, prevState) {
  //   if(prevProps.notificationsArray!==this.props.notificationsArray){
  // console.log("ASDSIDM",this.props.notificationsArray)
  // console.log(this.props.notificationsArray.length)
  // // alert(this.props.notifications.length)
  //   }
  //   // alert(this.props.notificationsArray.length)
  //       }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.notificationsArray !== nextProps.notificationsArray) {
  //     return true;
  //   }
  //   return false;
  // }

  getNotifications = () => {
    // this.setState({ notifications: this.props.notificationsArray });

    this.props
      .getNotificationsRedux(this.state.user3)
      .then(() => {
        this.setState({ notifications: this.props.notificationsArray });
        this.setState({ unseenChats: this.props.chatCounter });
        // alert(this.props.chatCounter)
        console.log(this.props.notificationsArray);
        console.log(this.props.notificationsArray.length);
        console.log(this.props);
        console.log(this.props.getNotificationsRedux.length);
      })
      .catch((err) => {
        console.warn(err);

        //setState({ error: err.message });
      });
    // let chatCounter = 0;
    // firebase
    //   .firestore()
    //   .collection("notifications")
    //   .doc(this.state.user3)
    //   .collection("userNotifications")
    //   .orderBy("time", "desc")
    //   .onSnapshot((snapshot) => {
    //     const notificationsArray = [];

    //     // snapshot.docChanges().forEach((change) => {
    //     //   if (change.type === "added") {
    //     //  this.state.alert.push(change.doc.data());

    //     // }
    //     // });
    //     snapshot.forEach((doc) => {
    //       firebase
    //         .firestore()
    //         .collection("users")
    //         .doc(doc.data().userId)
    //         .get()
    //         .then((doco) => {
    //           let pp = {
    //             avatar: doco.data().profilePic,
    //             content: doc.data().content,
    //             source: doc.data().source,
    //             time: doc.data().time,
    //             type: doc.data().type,
    //             userId: doc.data().userId,
    //             username: doco.data().username,
    //           };
    //           notificationsArray.push(pp);
    //           this.setState({ notifications: notificationsArray });
    //           if (doc.data().type == "chat") {
    //             chatCounter = chatCounter + 1;
    //           }
    //           this.setState({ unseenChats: chatCounter });
    //           // console.log(this.state.unseenChats)
    //         });
    //     });
    //   });
  };

  getFriendReq = async () => {
    let users = [];
    await this.firestoreUsersRef
      .doc(this.state.user3)
      .collection("received")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((docSnap) => {
          users.push(docSnap.id);
        });
      });
    this.setState({ friendReq: users });
  };

  onExiting = () => {
    this.setState({
      collapseClasses: "collapsing-out",
    });
  };

  onExited = () => {
    this.setState({
      collapseClasses: "",
    });
  };

  render() {
    const { t } = this.props;
    return (
      <>
        <Navbar
          className="navbar-main navbar-transparent navbar-light headroom"
          expand="lg"
          id="navbar-main"
          style={
            {
              // padding: "0px",
              // borderBottom: "0.001rem solid black",
              // backgroundColor: "#f0f3f4",
            }
          }
        >
          <Container>
            <NavbarBrand className="mr-lg-5" to="/home" tag={Link}>
              <img
                style={{ height: "45px" }}
                alt="..."
                src={require("assets/img/brand/logo.png")}
              />
            </NavbarBrand>
            <button className="navbar-toggler" id="navbar_global">
              <span className="navbar-toggler-icon" />
            </button>
            <UncontrolledCollapse
              toggler="#navbar_global"
              navbar
              className={this.state.collapseClasses}
              onExiting={this.onExiting}
              onExited={this.onExited}
            >
              <div className="navbar-collapse-header">
                <Row>
                  <Col className="collapse-brand" xs="6">
                    <Link to="/home">
                      <img
                        alt="..."
                        src={require("assets/img/brand/logo.png")}
                      />
                    </Link>
                  </Col>
                  <Col className="collapse-close" xs="6">
                    <button className="navbar-toggler" id="navbar_global">
                      <span />
                      <span />
                    </button>
                  </Col>
                </Row>
              </div>

              {/* <Nav className="navbar-nav-hover align-items-lg-center" navbar>
        
        </Nav> */}

              <UncontrolledDropdown>
                <DropdownToggle
                  nav
                  className="nav-link-icon"
                  // style={{ textShadow: "3px 2px 0px rgba(0, 0, 0, 0.23)" }}
                >
                  {this.renderSearchBar()}
                </DropdownToggle>
                {this.state.found &&
                this.state.searchResults &&
                this.state.userChecked ? (
                  <DropdownMenu
                    style={{
                      position: "absolute",
                      willChange: " transform",
                      top: "0px",
                      left: "0px",
                      transform: " translate3d(15px, 51px, 0px)",
                      width: "222px",
                    }}
                    aria-labelledby="navbar-success_dropdown_1"
                    right
                  >
                    {this.state.searchResults.map((user, index) => (
                      // return;
                      <>
                        <DropdownItem>
                          {/* {this.renderUserItem(user)} */}
                          <Link to={`/friend/${user.id}`}>
                            <div className="d-flex align-items-center">
                              <img
                                // className="rounded-circle"
                                className="avatar"
                                width="45"
                                src={user.data().profilePic}
                                alt=""
                                // onClick={localStorage.setItem('Fuid', JSON.stringify(this.state.userId))}
                              />
                              <div className="mx-3">
                                <h6 className="mb-0 text-black font-weight-bold">
                                  {user.data().name}{" "}
                                </h6>

                                <small className="text-muted">
                                  @{user.data().username}{" "}
                                </small>
                              </div>
                            </div>
                          </Link>
                        </DropdownItem>
                      </>
                    ))}
                    {/* </> */}
                  </DropdownMenu>
                ) : this.state.userChecked ? (
                  <DropdownMenu
                    style={{
                      position: "absolute",
                      willChange: " transform",
                      top: "0px",
                      left: "0px",
                      transform: " translate3d(15px, 51px, 0px)",
                      width: "222px",
                    }}
                    aria-labelledby="navbar-success_dropdown_22"
                    right
                  >
                    <DropdownItem>No user found!</DropdownItem>
                  </DropdownMenu>
                ) : (
                  ""
                )}
              </UncontrolledDropdown>

              <Nav
                className="navbar-nav-hover align-items-lg-center ml-lg-auto"
                navbar
              >
                {/* {this.state.alert.map((item, index) => (
      <UncontrolledAlert color="info">
      {item.content}
      
    </UncontrolledAlert>
      ))} */}
              </Nav>

              {/* <NavItem> */}

              <div style={{ display: "block" }}>
                <NavLink
                  className="nav-link-icon"
                  to="/home"
                  tag={Link}
                  id="tooltip333589074"
                  style={{ padding: "10px 10px" }}
                >
                  {/* <i
                        className="ni ni-world"
                      /> */}

                  <IconButton aria-label="show feed" color="inherit">
                    <img
                      src={require("assets/img/icons/48px/world.svg")}
                      width="21px"
                      height="21px"
                    />
                  </IconButton>

                  <span className="nav-link-inner--text d-lg-none ml-2 description">
                    {t("Wall")}
                    <UncontrolledTooltip delay={0} target="tooltip333589074">
                      {t("Wall")}
                    </UncontrolledTooltip>
                  </span>
                </NavLink>
              </div>

              {/* messages */}
              <div style={{ display: "block" }}>
                <UncontrolledDropdown nav id="tooltip233583072">
                  <DropdownToggle nav style={{ padding: "10px 8px" }}>
                    <IconButton aria-label="follow requests" color="inherit">
                      {this.state.unseenChats > 0 ? (
                        <Badge
                          badgeContent={this.props.chatCounter}
                          // badgeContent={this.state.unseenChats}

                          color="secondary"
                        >
                          {/* <i className="ni ni-bell-55" /> */}
                          <img
                            src={require("assets/img/icons/48px/chat-46.svg")}
                            width="20px"
                            height="20px"
                          />
                        </Badge>
                      ) : (
                        // <i className="ni ni-bell-55" />
                        <img
                          src={require("assets/img/icons/48px/chat-46.svg")}
                          width="20px"
                          height="20px"
                        />
                      )}
                    </IconButton>
                    <span className="nav-link-inner--text d-lg-none ml-2 description">
                      {t("Chat")}
                      <UncontrolledTooltip delay={0} target="tooltip233583072">
                        {t("Chat")}
                      </UncontrolledTooltip>
                    </span>
                    {/* <span
                    className="nav-link-inner--text description"
                    style={{ textShadow: "3px 2px 5px rgba(0, 5, 9, 1)" }}
                    >
                    {" "}
                    {t("Follow Requests")}
                  </span> */}
                  </DropdownToggle>
                  <DropdownMenu
                    aria-labelledby="navbar-success_dropdown_1"
                    right
                  >
                    {/* <DropdownItem to="/profile" tag={Link}> */}

                    <div
                      style={{
                        padding: "2px",
                        maxHeight: "350px",
                        overflowY: "auto",
                        width: "263px",
                      }}
                    >
                      <Inbox />
                    </div>
                    {/* </DropdownItem> */}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>

              {/* notifications */}
              <div style={{ display: "block" }}>
                <UncontrolledDropdown nav id="tooltip333583072">
                  <DropdownToggle nav style={{ padding: "10px 8px" }}>
                    <IconButton aria-label="notifications" color="inherit">
                      {this.state.notifications.length > 0 ? (
                        <Badge
                          // badgeContent={this.state.notifications.length}
                          // badgeContent={this.props.notificationsArray.length}
                          badgeContent={this.props.totalNotifications}
                          color="secondary"
                        >
                          {/* <i className="ni ni-bell-55" /> */}
                          <img
                            src={require("assets/img/icons/48px/bell-53.svg")}
                            width="20px"
                            height="20px"
                          />
                        </Badge>
                      ) : (
                        // <i className="ni ni-bell-55" />
                        <img
                          src={require("assets/img/icons/48px/bell-53.svg")}
                          width="20px"
                          height="20px"
                        />
                      )}
                    </IconButton>
                    <span className="nav-link-inner--text d-lg-none ml-2 description">
                      {t("Notifications")}
                      <UncontrolledTooltip delay={0} target="tooltip333583072">
                        {t("Notifications")}
                      </UncontrolledTooltip>
                    </span>
                    {/* <span
                    className="nav-link-inner--text description"
                    style={{ textShadow: "3px 2px 5px rgba(0, 5, 9, 1)" }}
                    >
                    {" "}
                    {t("Follow Requests")}
                  </span> */}
                  </DropdownToggle>
                  <div
                  //   style={{ maxHeight: "350px",
                  // // position:"absolute",
                  // // top:"0px",
                  // // left:"0px",
                  // // transform:"translate3d(-203px, 64px, 0px)"  ,
                  //   // overflowY: "auto"

                  // }}
                  >
                    <DropdownMenu
                      style={{
                        maxHeight: "350px",
                        overflowY: "auto",
                        position: "absolute",
                        willChange: "transform",
                        top: "75px",
                        left: "0px",
                        transform: "translate3d(-290px, -11px, 0px)",
                        zoom: "80%",
                      }}
                      // aria-labelledby="navbar-success_dropdown_1"
                      right
                    >
                      {this.state.notifications.length < 1 ? (
                        <DropdownItem>No notifications</DropdownItem>
                      ) : (
                        <>
                          {/* // <DropdownItem> */}
                          {this.props.notificationsArray &&
                            this.props.notificationsArray.map((item, index) => (
                              <>
                                <DropdownItem
                                  to={
                                    item.type == "request" ||
                                    item.type == "follow" ||
                                    item.type == "requestAccepted"
                                      ? `/friend/${item.source}`
                                      : item.type == "chat"
                                      ? `/chat/${item.source}`
                                      : `/post/${item.source}`
                                  }
                                  tag={Link}
                                >
                                  <div className="d-flex align-items-center">
                                    <Badge
                                      // overlap="circle"
                                      anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "right",
                                      }}
                                      badgeContent={
                                        <img
                                          src={
                                            item.type == "like"
                                              ? require("assets/img/icons/bnw/like.png")
                                              : item.type == "comment"
                                              ? require("assets/img/icons/bnw/comment.png")
                                              : item.type == "chat"
                                              ? require("assets/img/icons/bnw/chat.png")
                                              : require("assets/img/icons/bnw/friend.png")
                                          }
                                          width="16px"
                                          height="16px"
                                          // className="avatar"
                                        />
                                      }
                                      //  color="primary"
                                    >
                                      <img
                                        className="avatar"
                                        width="45"
                                        src={item.avatar}
                                        alt=""
                                      />
                                    </Badge>
                                    <div className="mx-3">
                                      <h6 className="mb-0 text-black">
                                        {"@"}
                                        {item.username} {item.content}
                                      </h6>

                                      <small className="text-muted">
                                        {" "}
                                        {moment(Number(item.time)).format(
                                          "lll"
                                        )}{" "}
                                      </small>
                                    </div>

                                    {item.type == "chat" ? (
                                      <IconButton
                                        aria-label="chat"
                                        color="inherit"
                                      >
                                        <img
                                          src={require("assets/img/icons/48px/chat-46.svg")}
                                          // src={require("assets/img/icons/bnw/chat.png")}
                                          width="30px"
                                          height="30px"
                                          // className="avatar"
                                        />
                                      </IconButton>
                                    ) : null}

                                    {item.type == "request" ? (
                                      <>
                                        <Button
                                          color="info"
                                          size="sm"
                                          onClick={() =>
                                            this.handleAccept(
                                              item.userId,
                                              item.username,
                                              item.avatar
                                            )
                                          }
                                        >
                                          {" "}
                                          {t("accept")}{" "}
                                        </Button>
                                        <Button
                                          // className="mr-4"
                                          color="danger"
                                          size="sm"
                                          onClick={() =>
                                            this.handleReject(item.userId)
                                          }
                                        >
                                          {t("reject")}
                                        </Button>
                                      </>
                                    ) : null}
                                  </div>
                                </DropdownItem>
                              </>
                            ))}
                          {/* </DropdownItem> */}
                        </>
                      )}
                    </DropdownMenu>
                  </div>
                </UncontrolledDropdown>
              </div>

              {/* </NavItem> */}

              <div style={{ display: "block" }}>
                <UncontrolledDropdown nav id="tooltip333589070">
                  <DropdownToggle nav style={{ padding: "10px 10px" }}>
                    <IconButton aria-label="user profile" color="inherit">
                      <img
                        style={{
                          // display: "block",
                          objectFit: "cover",
                        }}
                        width="21"
                        height="21"
                        className="rounded-circle img-responsive"
                        src={
                          this.state.userProfilePic
                            ? this.state.userProfilePic
                            : require("assets/img/icons/user/user1.png")
                        }
                      />
                    </IconButton>
                    <span className="nav-link-inner--text d-lg-none ml-2 description">
                      {t("My Profile")}
                      <UncontrolledTooltip delay={0} target="tooltip333589070">
                        {t("My profile")}
                      </UncontrolledTooltip>
                    </span>
                  </DropdownToggle>

                  <DropdownMenu
                    aria-labelledby="navbar-success_dropdown_1"
                    right
                  >
                    <DropdownItem to="/profile" tag={Link}>
                      <div className="d-flex align-items-center">
                        <img
                          className="avatar"
                          width="45"
                          src={
                            this.state.userProfilePic
                              ? this.state.userProfilePic
                              : require("assets/img/icons/user/user1.png")
                          }
                          alt=""
                        />
                        <div className="mx-3">
                          <h6 className="mb-0 text-black font-weight-bold">
                            {this.state.currentName
                              ? this.state.currentName
                              : "Name"}
                          </h6>

                          <small className="text-muted">My Profile </small>
                        </div>
                      </div>
                    </DropdownItem>

                    <DropdownItem
                      onClick={() => this.toggleModal("languageModal")}
                    >
                      <i className="fa fa-language" aria-hidden="true"></i>
                      {t("Language")}
                    </DropdownItem>

                    <DropdownItem to="/edit-profile" tag={Link}>
                      <i className="ni ni-settings" />
                      {t("Edit Profile")}
                    </DropdownItem>

                    <DropdownItem to="/login" tag={Link} onClick={this.logOut}>
                      <i className="ni ni-button-power" />
                      {t("Log Out")}
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </UncontrolledCollapse>
          </Container>
        </Navbar>
        <Modal
          size="sm"
          isOpen={this.state.languageModal}
          toggle={() => this.toggleModal("languageModal")}
          className="fluid"
        >
          <Row>
            <Col>
              <Card
                style={{
                  padding: "20px",
                  fontFamily: "system-ui",
                  fontWeight: "normal",
                }}
              >
                <h4>Change Language</h4>

                <FormGroup tag="fieldset">
                  {/* <legend>Radio Buttons</legend> */}
                  <FormGroup check onClick={this.handleChange}>
                    <Label check>
                      <Input type="radio" name="lang" value="en" /> English
                    </Label>
                  </FormGroup>
                  <FormGroup check onClick={this.handleChange}>
                    <Label check>
                      <Input type="radio" name="lang" value="esp" /> Spanish
                    </Label>
                  </FormGroup>
                  <FormGroup check onClick={this.handleChange}>
                    <Label check>
                      <Input type="radio" name="lang" value="fre" /> French
                    </Label>
                  </FormGroup>
                  <FormGroup check onClick={this.handleChange}>
                    <Label check>
                      <Input type="radio" name="lang" value="ger" /> German
                    </Label>
                  </FormGroup>
                  <FormGroup check onClick={this.handleChange}>
                    <Label check>
                      <Input type="radio" name="lang" value="jap" /> Japanese
                    </Label>
                  </FormGroup>
                </FormGroup>
              </Card>
            </Col>
          </Row>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    notificationsArray: state.NotificationsReducer.notificationsArray,
    chatCounter: state.NotificationsReducer.chatCounter,
    totalNotifications: state.NotificationsReducer.totalNotifications,
  };
};
const mapDispatchToProps = (dispatch) => ({
  getNotificationsRedux: (uid) =>
    dispatch(ActionsCreator.getNotificationsRedux(uid)),
});

// export default withTranslation()(UserNavbar);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(UserNavbar));

import React from "react";
import { Link, Redirect } from "react-router-dom";
// JavaScript plugin that hides or shows a component based on your scroll
import Headroom from "headroom.js";
// reactstrap components
import {
  // Button,
  UncontrolledCollapse,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  // Media,
  Badge,
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
  CardBody,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormGroup,
  Label,
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
// import classnames from "classnames";
// import { Route, Redirect } from "react-router-dom";

class UserNavbar extends React.Component {
  state = {
    user3: JSON.parse(localStorage.getItem("uid")),
    user: {},
    searchWord: "",
    searchResults: [],
    profilePic:require('assets/img/brand/logo.png'),
 

    userProfilePic:
    require('assets/img/icons/user/user1.png'),

    // "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg",
    foundUser: "",
    found: false,
    reqNotify: false,
    value: JSON.parse(localStorage.getItem("lang")),
  };

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

  searchUser(word) {
    let userCollectionRef = firebase.firestore().collection("users");
    console.log(word);
    let users = [];
    userCollectionRef
      .where("username", "==", word)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          users.push(documentSnapshot.data());
          //   console.log(documentSnapshot.id);
          this.setState({ foundUser: documentSnapshot.id, found: true });
          // console.log(this.state.foundUser)
          // console.log(users);
        });
        // console.log(this.state.searchResults);
        // console.log(this.state.foundUser);

        if (users.length == 0) {
          this.setState({
            profilePic:
            require('assets/img/icons/user/user1.png'),
              // "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg",
            searchResults: [],
            foundUser: "",
            found: false,
          });
          console.log(this.state.found);
        } else {
          let profilePic = firebase
            .storage()
            .ref()
            .child("profilePics/(" + this.state.foundUser + ")ProfilePic");
          profilePic.getDownloadURL().then((url) => {
            this.setState({ profilePic: url });
          });
          this.setState({ searchResults: users });
          console.log(this.state.searchResults);
        }
      });
  }

  renderAvatar() {
    // const {
    //   //  avatar, styles,
    //   item
    // } = this.props;

    // if (!item.avatar) return null;
    return (
      <Link to={`/friend/${this.state.foundUser}`}>
        <img
          // className="rounded-circle"
          className="avatar"
          width="45"
          src={this.state.profilePic}
          alt=""
          // onClick={localStorage.setItem('Fuid', JSON.stringify(this.state.userId))}
        />
      </Link>
    );
  }

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

  renderUserItem = () => {
    // const { item } = this.props;
    if (this.state.found) {
      return (
        <div onMouseOver={() => this.onHover()} 
        // href="javascript:;"
        >
          {this.renderAvatar()}

          {/* {this.state.searchWord} */}
        </div>
      );
    } else return null;
  };

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
      <InputGroup className="input-group-alternative">
        <InputGroupAddon addonType="prepend">
          <InputGroupText>
            <i className="ni ni-zoom-split-in" />
          </InputGroupText>
        </InputGroupAddon>
        <input
          className="form-control-alternative"
          placeholder={t("Search")}
          type="text"
          // onChange={this.textInput}
          // value={this.state.searchWord}
          onChange={(word) => this.textInput(word)}
          // value={this.state.searchWord}
        />
      </InputGroup>
    );
  };

  logOut() {
    logOutUser();
  }

  componentDidMount() {
    this.props.i18n.changeLanguage(this.state.value);

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
              userProfilePic: res.profilePic,
            });
          }
          // console.log(res);
        });
    });
    // let headroom = new Headroom(document.getElementById("navbar-main"));
    // // initialise
    // headroom.init();
    // this.checkReqNotification();
    this.renderUserItem();
    this.renderSearchBar();
  }
  render() {
    const { t } = this.props;
    return (
      <>
        <Navbar
          className="navbar-main navbar-transparent navbar-light headroom"
          expand="lg"
          id="navbar-main"
          style={{
            padding: "0px",
            // borderBottom: "0.001rem solid black",
            // backgroundColor: "#f0f3f4",
          }}
        >
          <Container>
            <NavbarBrand className="mr-lg-5" to="/home" tag={Link}>
              <img alt="..." src={require("assets/img/brand/logo.png")} />
            </NavbarBrand>
            <button className="navbar-toggler" id="navbar_global">
              <span className="navbar-toggler-icon" />
            </button>
            <UncontrolledCollapse navbar toggler="#navbar_global">
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

              <Nav className="navbar-nav-hover justify-content-center" navbar>
                {/* <form> */}
                {this.renderSearchBar()}
                {this.renderUserItem()}
                {/* {this.renderDropdown()} */}
                {/* </form> */}
              </Nav>

              {/* <Nav>
                <FormGroup>
        <Label for="exampleSelect">Select</Label>
        <Input type="select" name="select" id="exampleSelect">

           {this.toggleDropdown}
          
        </Input>
      </FormGroup>
                </Nav> */}

              <Nav
                className="navbar-nav-hover align-items-lg-center ml-lg-auto"
                navbar
              >
                <NavItem>
                  <NavLink
                    className="nav-link-icon"
                    to="/home"
                    tag={Link}
                    // href="#pablo"
                    // onClick={(e) => e.preventDefault()}
                  >
                    <i
                      className="ni ni-world"
                      // style={{ textShadow: "3px 2px 5px rgba(0, 5, 9, 1)" }}
                      style={{ textShadow: "3px 2px 0px rgba(0, 0, 0, 0.23)" }}
                    />
                    <span
                      className="nav-link-inner--text description"
                      style={{ textShadow: "3px 2px 5px rgba(0, 5, 9, 1)" }}
                    >
                      {t("Wall")}
                    </span>
                  </NavLink>
                </NavItem>

                {/* <NavItem>
                  <NavLink
                    className="nav-link-icon"
                    to="/profile"
                    tag={Link}
                    // href="#pablo"
                    // onClick={(e) => e.preventDefault()}
                  >
                    <i
                      className="ni ni-circle-08"
                      style={{ textShadow: "3px 2px 5px rgba(0, 5, 9, 1)" }}
                    />
                    <span
                      className="nav-link-inner--text description"
                      style={{ textShadow: "3px 2px 5px rgba(0, 5, 9, 1)" }}
                    >
                      {t("Profile")}
                    </span>
                  </NavLink>
                </NavItem> */}

                {/* <NavItem>
                  <NavLink className="nav-link-icon" to="/group" tag={Link}>
                    <i
                      className="ni ni-planet"
                      style={{ textShadow: "3px 2px 5px rgba(0, 5, 9, 1)" }}
                    />
                    <span
                      className="nav-link-inner--text description"
                      style={{ textShadow: "3px 2px 5px rgba(0, 5, 9, 1)" }}
                    >
                      {t("Groups")}
                    </span>
                  </NavLink>
                </NavItem> */}
                {/* <NavItem className="nav-link-icon">
                  <NavLink
                    // style={{ color: "red" }}
                    className="nav-link-icon"
                    onClick={() => this.toggleModal("notificationModal")}
                  >
                    <i
                      className="ni ni-bell-55"
                      style={{ textShadow: "3px 2px 5px rgba(0, 5, 9, 1)" }}
                    />

                    <span
                      className="nav-link-inner--text description"
                      style={{ textShadow: "3px 2px 5px rgba(0, 5, 9, 1)" }}
                    >
                      {" "}
                      {t("Follow Requests")}
                    </span>

                    <Modal
                      className="modal-dialog-centered modal-danger"
                      contentClassName="bg-gradient-danger"
                      isOpen={this.state.notificationModal}
                      toggle={() => this.toggleModal("notificationModal")}
                      size="lg"
                    >
                      <div className="modal-header"></div>
                      <Friendreq />

                  

                      <div className="modal-footer">
                        <Button
                          className="text-white ml-auto"
                          color="link"
                          data-dismiss="modal"
                          type="button"
                          onClick={() => this.toggleModal("notificationModal")}
                        >
                          {t("Close")}
                        </Button>
                      </div>
                    </Modal>
                  </NavLink>
                </NavItem> */}

                <UncontrolledDropdown nav>
                  <DropdownToggle nav className="nav-link-icon">
                    <i
                      className="ni ni-bell-55"
                      style={{ textShadow: "3px 2px 0px rgba(0, 0, 0, 0.23)" }}
                    />

                    <span
                      className="nav-link-inner--text description"
                      style={{ textShadow: "3px 2px 5px rgba(0, 5, 9, 1)" }}
                    >
                      {" "}
                      {t("Follow Requests")}
                    </span>
                  </DropdownToggle>
                  <DropdownMenu
                    aria-labelledby="navbar-success_dropdown_1"
                    right
                  >
                    <DropdownItem
                      style={{ textShadow: "3px 2px 0px rgba(0, 0, 0, 0.23)" }}
                    >
                      <Friendreq />
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>

                {/* <NavItem>
                    <NavLink className="nav-link-icon" to="/heatmap" tag={Link}>
                      <i className="ni ni-pin-3" />
                      <span className="nav-link-inner--text description">
                        Heatmaps
                      </span>
                    </NavLink>
                  </NavItem> */}

                {/* <NavItem className="nav-link-icon" style={{ color: "white" }}>
                  <FormControl style={{ color: "white" }}>

                    <Select
                      labelId="demo-controlled-open-select-label"
                      id="demo-simple-open-select"
                      value={this.state.value}
                      onChange={this.handleChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      style={{ color: "white" }}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="esp">Spanish</MenuItem>
                      <MenuItem value="fre">French</MenuItem>
                      <MenuItem value="ger">German</MenuItem>
                      <MenuItem value="jap">Japanese</MenuItem>
                    </Select>
                  </FormControl>
                </NavItem> */}

                <UncontrolledDropdown nav>
                  <DropdownToggle
                    nav
                    className="nav-link-icon"
                    style={{ textShadow: "3px 2px 0px rgba(0, 0, 0, 0.23)" }}>
                   <i className="fa fa-language" aria-hidden="true"></i>
                  </DropdownToggle>
                  <DropdownMenu
                    aria-labelledby="navbar-success_dropdown_1"
                    right
                  >
                    {" "}
                    <DropdownItem onClick={this.handleChange} value="en">
                      English
                    </DropdownItem>
                    <DropdownItem onClick={this.handleChange} value="esp">
                      Spanish
                    </DropdownItem>
                    <DropdownItem onClick={this.handleChange} value="fre">
                      French
                    </DropdownItem>
                    <DropdownItem onClick={this.handleChange} value="ger">
                      German
                    </DropdownItem>
                    <DropdownItem onClick={this.handleChange} value="jap">
                      Japanese
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>

                <UncontrolledDropdown nav>
                  <DropdownToggle
                    nav
                    className="nav-link-icon"
                    to="/profile"
                    tag={Link}
                  >
                    <img
                      style={{
                        width: "20px",
                        height: "20px",
                        display: "block",
                        objectFit: "cover",
                        border: "1",
                      }}
                      className="rounded-circle img-responsive"
                      src={
                        this.state.userProfilePic
                          ? this.state.userProfilePic
                          : 
                          
                          require('assets/img/icons/user/user1.png')

                          // "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg"
                      }
                    />
                  </DropdownToggle>
                  <DropdownMenu
                    aria-labelledby="navbar-success_dropdown_1"
                    right
                  >
                    {/* <DropdownItem
                        to="/group"
                        tag={Link}
                        // onClick={this.logOut}
                      >
                        <i className="ni ni-planet" />
                        Groups
                      </DropdownItem> */}

                    <DropdownItem
                      to="/edit-profile"
                      tag={Link}
                      style={{ textShadow: "3px 2px 0px rgba(0, 0, 0, 0.23)" }}
                    >
                      <i className="ni ni-settings" />
                      {t("Edit Profile")}
                    </DropdownItem>

                    <DropdownItem
                      to="/login"
                      tag={Link}
                      onClick={this.logOut}
                      style={{ textShadow: "3px 2px 0px rgba(0, 0, 0, 0.23)" }}
                    >
                      <i className="ni ni-button-power" />
                      {t("Log Out")}
                    </DropdownItem>

                    {/* <DropdownItem
                        //   to="/timeline"
                        onClick={this.logOut}
                      >
                       <Button
                      className="btn-neutral btn-icon"
                      color="default"
                      href="https://www.creative-tim.com/product/argon-design-system-react?ref=adsr-navbar"
                      target="_blank"
                    >
                      <span className="btn-inner--icon">
                      <i className="ni ni-fat-remove" />
                      </span>
                      <span className="nav-link-inner--text ml-1">Log Out</span>
                    </Button>
                      </DropdownItem> */}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </UncontrolledCollapse>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default withTranslation()(UserNavbar);

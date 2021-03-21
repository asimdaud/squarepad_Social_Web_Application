/*global google*/

import React from "react";
import Post from "../components/post.jsx";
import PostAd from "../components/postAd.jsx";

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
  Table,
  Button,
  // CardHeader,
  UncontrolledCarousel,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  // CardBody,
  // NavItem,
  // NavLink,
  // Nav,
  // Progress,
  // Table,
  Modal,
  Container,
  Jumbotron,
  Col,
} from "reactstrap";
//  import * as firebase from 'firebase';
import { firebase } from "../services/firebase";
import SmoothImage from "react-smooth-image";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import moment from "moment";
import Update from "./Update";

import { Redirect, Link } from "react-router-dom";
import UserNavbar from "components/Navbars/UserNavbar.jsx";
import PubNavbar from "components/Navbars/PubNavbar.jsx";
import { withTranslation } from "react-i18next";
import EditAdForm from "components/EditAdForm.jsx";

class Admin extends React.Component {
  ismounted = false;
  firestoreUsersRef = firebase.firestore().collection("users");
  firestorePostRef = firebase.firestore().collection("posts");

  state = {
    title: "",
    caption: "",
    image: "",
    link: "",
    user: JSON.parse(localStorage.getItem("uid")),
    customAds: [],
    activeAdsOnly: [],
    avatar: "",
    isLoading: true,
    publicProfile: true,
    loading: true,
    value: "en",
    defaultModal: false,
    allAdsCheck: false,
    active: false,
    editModal: false,
    editModalItem: undefined,
    admin: false,
  };

  //TODO
  //   Coll: All Ads
  //          Coll: Active Ads

  //          Create an ad -> open modal -> Proceed -> Ad is saved -> Show Ad Preview

  //          View All ads -> Make this ad Actice

  //   handleChange = (event) => {
  //     let newlang = event.target.value;
  //     this.setState((prevState) => ({ value: newlang }));
  //     this.props.i18n.changeLanguage(newlang);
  //     this.setState({ ...this.state, [event.target.name]: event.target.checked });
  //   };

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };

  handleChangeData = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  //   componentDidUpdate(prevProps, prevState) {}

  toggleChangeAlert = (e) => {
    this.setState({
      [e]: !this.state[e],
      //   allAdsCheck: !this.state.allAdsCheck, // flip boolean value
    });
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .onSnapshot((doc) => {
          const admin = doc.data().admin;

          if (admin != null) {
            this.getCustomAd();
            this.setState({admin:true});
          } else return <Redirect to="/profile" />;
        });
    });
  }

  makeAnAdd = () => {
    const timestamp = moment().valueOf().toString();

    const itemAd = {
      //   avatar: this.state.profilePic,
      //   userId: this.state.user,
      //   username: this.state.username,
      title: this.state.title,
      adId: timestamp,
      caption: this.state.caption,
      image: this.state.image,
      timestamp: timestamp,
      link: this.state.link,
      active: this.state.active,
    };

    firebase
      .firestore()
      .collection("customAd")
      .doc(timestamp)
      .set(itemAd)
      .then(() => {
        this.setState({ defaultModal: false });
      })
      .catch((err) => {
        alert(err.toString());
      });
  };


  editAnAdd = () => {
    const timestamp = moment().valueOf().toString();

    const itemAd = {
      //   avatar: this.state.profilePic,
      //   userId: this.state.user,
      //   username: this.state.username,
      title: this.state.editModalItem.title,
      adId: this.state.editModalItem.adId,
      caption: this.state.editModalItem.caption,
      image: this.state.editModalItem.image,
      timestamp: timestamp,
      link: this.state.editModalItem.link,
      active: this.state.editModalItem.active,
    };

    firebase
      .firestore()
      .collection("customAd")
      .doc(this.state.editModalItem.adId)
      .update(itemAd)
      .then(() => {
        this.setState({ editModal: false });
      })
      .catch((err) => {
        alert(err.toString());
      });
  };

  getCustomAd = () => {
    firebase
      .firestore()
      .collection("customAd")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        const cloudImages = [];
        snapshot.forEach((doc) => {
          let article = {
            //   avatar: this.state.profilePic,
            //   userId: this.state.user,
            //   username: this.state.username,
            title: doc.data().title,
            adId: doc.data().adId,
            caption: doc.data().caption,
            image: doc.data().image,
            timestamp: doc.data().timestamp,
            link: doc.data().link,
            active: doc.data().active,
          };
          cloudImages.push(article);
        });
        this.setState({ customAds: cloudImages });
      });

    firebase
      .firestore()
      .collection("customAd")
      .where("active", "==", true)
      //   .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        const cloudImages2 = [];
        snapshot.forEach((doc) => {
          let article = {
            //   avatar: this.state.profilePic,
            //   userId: this.state.user,
            //   username: this.state.username,
            title: doc.data().title,
            adId: doc.data().adId,
            caption: doc.data().caption,
            image: doc.data().image,
            timestamp: doc.data().timestamp,
            link: doc.data().link,
            active: doc.data().active,
          };
          cloudImages2.push(article);
        });
        this.setState({ activeAdsOnly: cloudImages2 });
      });
  };

  openAdForm = () => {
    const { t } = this.props;
    return (
      <>
        <div style={{ padding: "10px" }}>
          <Form role="form" onSubmit={this.handleSubmit}>
            <FormGroup>
              <InputGroup className="input-group-alternative mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-hat-3" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder={t("Ad Title")}
                  type="text"
                  id="title"
                  onChange={this.handleChangeData}
                />
              </InputGroup>

              <InputGroup className="input-group-alternative mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-hat-3" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder={t("Caption")}
                  type="text"
                  id="caption"
                  onChange={this.handleChangeData}
                />
              </InputGroup>

              <InputGroup className="input-group-alternative mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-hat-3" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder={t("Image link")}
                  type="text"
                  id="image"
                  onChange={this.handleChangeData}
                />
              </InputGroup>

              <InputGroup className="input-group-alternative mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-hat-3" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder={t("Ad link")}
                  type="text"
                  id="link"
                  onChange={this.handleChangeData}
                />
              </InputGroup>

              <div className="custom-control custom-checkbox mb-3">
                <input
                  className="custom-control-input"
                  id="active"
                  type="checkbox"
                  checked={this.state.active}
                  onChange={() => this.toggleChangeAlert("active")}
                />
                <label className="custom-control-label" htmlFor="active">
                  <p className="description">{t("Active ad")}</p>
                </label>
              </div>
            </FormGroup>
            <div className="text-center">
              <Button
                className="mt-4"
                color="primary"
                type="submit"
                onClick={this.handleSubmit}
              >
                {t("Proceed")}
              </Button>
            </div>
          </Form>
        </div>
      </>
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { caption, image, link } = this.state;
    if (caption == "" || image == "" || link == "") {
      alert("Please fill in the fields");
    } else {
      this.makeAnAdd();
    }
  };


  handleEdit = (e) => {
    e.preventDefault();
    const { caption, image, link } = this.state.editModalItem;
    if (caption == "" || image == "" || link == "") {
      alert("Please fill in the fields");
    } else {
console.log(this.state.editModalItem)
// console.log(this.state)
console.log(this.state)
      this.editAnAdd();
    }
  };


  //   noFriendsTimeline = () => {
  //     const { t } = this.props;
  //     if (this.state.posts.length > 0 && !this.state.checkedA) {
  //       return (
  //         <>
  //           {this.state.posts.map((post, postindex) => (
  //             <Post item={post} key={postindex} />
  //           ))}
  //         </>

  //       );
  //     } else if (this.state.closeFriendsPosts.length > 0 && this.state.checkedA) {
  //       return (
  //         <>
  //           {this.state.closeFriendsPosts.map((post2, postindex2) => (
  //             <Post item={post2} key={postindex2} />
  //           ))}
  //         </>
  //       );
  //     } else if (this.state.posts.length < 1) {
  //       return (
  //         <Card
  //           className="container justify-content-center"
  //           style={{
  //             marginBottom: "500px",
  //             borderRadius: "50px",
  //             borderRadius: "50px",
  //           }}
  //         >
  //           <h3 className="display-3 lead">
  //             {t("Nothing to Show")}{" "}
  //             <i className="fa fa-lock" aria-hidden="true"></i>
  //           </h3>
  //           <p className="lead description">
  //             {t("Follow more accounts to see their posts")}
  //           </p>
  //         </Card>
  //       );
  //     } else {
  //       return (
  //         <Card
  //           className="container justify-content-center"
  //           style={{
  //             borderRadius: "50px",
  //           }}
  //         >
  //           <h3 className="display-3 lead">
  //             {t("You aren't following any users")}{" "}
  //             <i className="fa fa-lock" aria-hidden="true"></i>
  //             {/* <HttpsOutlinedIcon fontSize="small" color="lead"/> */}
  //           </h3>
  //           <p className="lead description">
  //             {t("Follow accounts to see their posts")}
  //           </p>
  //         </Card>
  //       );
  //     }
  //   };

  render() {
    const { t } = this.props;

 
    return (
      <>
        {/* <UserNavbar /> */}
        {/* <PubNavbar /> */}
        <main
          className="profile-page"
          ref="main"
          style={{
            backgroundImage:
              "linear-gradient(to right bottom, #e4efe9, #d9ede8, #cfeae9, #c6e6ed, #c0e2f1, #bcdef2, #badaf3, #bad5f4, #b7d1f2, #b5ccf1, #b3c8ef, #b1c3ed)",
          }}
        >
          <section
            className="section section-blog-info"
            style={{ marginTop: "20px" }}
          >
            <Row
              style={{ padding: "20px" }}
              className="d-flex justify-content-center"
            >
              <Col
                sm="8"
                md="8"
                lg="8"
                // className="order-md-1"
                className="d-flex justify-content-center"
                style={{
                  zoom: "75%",
                //   paddingBottom: "22px",
                }}
              >
                <Table dark striped style={{ borderRadius:"2px"}}>
                  <thead> 
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Caption</th>
                      <th>Image link</th>
                      <th>Redirect URL</th>
                      <th>Created on</th>
                      <th>Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.customAds.map((ad, adindex) => (
                      <tr onClick={() => {
                        this.setState({ editModal: true ,
                        editModalItem: ad});
                      }}
                      
                      
                      >
                        <th scope="row">{adindex + 1}</th>
                        {/* <td>{adindex + 1}</td> */}
                        <td>{ad.title}</td>
                        <td>{ad.caption}</td>
                        <td>
                          <img
                            alt="Image"
                            src={ad.image}
                            style={{
                              width: "90px",
                              height: "90px",
                              display: "block",
                              objectFit: "cover",
                              borderRadius: "10px",
                              margin: "5px",
                            }}
                          />
                        </td>
                        <td>
                          <a href={ad.link}>
                            <p>{ad.link.length>30?ad.link.substring(0,29)+"...":
                            ad.link}</p>
                          </a>
                        </td>
                        <td>{moment(Number(ad.timestamp)).format("ll")}</td>
                        <td>
                          <div className="custom-control custom-checkbox mb-3">
                            <input
                              className="custom-control-input"
                              id={ad.active}
                              type="checkbox"
                              checked={ad.active}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor={ad.active}
                            ></label>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Row
              style={{ padding: "20px" }}
              // className="d-flex justify-content-center"
            >
              <Col
                sm="3"
                md="3"
                lg="3"
                className="order-md-1"
                style={{ zoom: "85%", paddingBottom: "22px" }}
              >
                <div
                  className="card "
                  style={{
                    overflow: "auto",
                    borderRadius: "15px",
                    marginBottom: "50px",
                  }}
                >
                  <Card className="card-header text-center">
                    <span
                      className="text-black"
                      onClick={() => {
                        // this.setState({ defaultModal: true });
                      }}
                    >
                      <div className="custom-control custom-checkbox mb-3">
                        <input
                          className="custom-control-input"
                          id="allAdsCheck"
                          type="checkbox"
                          checked={this.state.allAdsCheck}
                          onChange={() => this.toggleChangeAlert("allAdsCheck")}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="allAdsCheck"
                        >
                          <p className="description">{t("Show All Ads")}</p>
                        </label>
                      </div>
                      {this.state.allAdsCheck
                        ? "Showing all ads"
                        : "Showing active ads only"}
                    </span>
                  </Card>
                </div>

                <div
                  className="card bg-secondary"
                  style={{
                    overflow: "auto",
                    borderRadius: "35px",
                  }}
                >
                  <Card className="card-header text-center bg-gradient-muted">
                    <span
                      className="text-black font-weight-bold"
                      onClick={() => {
                        this.setState({ defaultModal: true });
                      }}
                    >
                      {"+ "} {t("Create an Ad")}
                    </span>
                  </Card>
                </div>
              </Col>

              <Col
                sm="6"
                md="6"
                lg="6"
                className="order-md-2"
                style={{ zoom: "85%" }}
              >
                {/* {this.noFriendsTimeline()} */}

                {this.state.allAdsCheck
                  ? this.state.customAds.map((ad, adindex) => (
                      <PostAd item={ad} key={adindex} />
                    ))
                  : this.state.activeAdsOnly.map((ad, adindex) => (
                      <PostAd item={ad} key={adindex} />
                    ))}

                {/* {this.state.customAds.map((ad, adindex) => (
                  <PostAd item={ad} key={adindex} />
                ))} */}
              </Col>
              <Col
                sm="3"
                md="3"
                lg="3"
                className="order-md-3"
                style={{ zoom: "85%" }}
              ></Col>
            </Row>
          </section>
          <SimpleFooter />
        </main>

        <Modal
          size="sm"
          isOpen={this.state.defaultModal}
          toggle={() => this.toggleModal("defaultModal")}
          className="fluid"
          // style={{overflowWrap:"anywhere"}}
        >
          {this.openAdForm()}
        </Modal>



        <Modal
          size="sm"
          isOpen={this.state.editModal}
          toggle={() => this.toggleModal("editModal")}
          className="fluid"
          // style={{overflowWrap:"anywhere"}}
        >

<div style={{ padding: "10px" }}>   
<h3 className="mb-0 text-dark">Edit Ad</h3>
      
      {this.state.editModalItem && 
   
   <EditAdForm item={this.state.editModalItem} />
   }
      </div>
  

        </Modal>
      </>
    );
    
  }
}

export default withTranslation()(Admin);

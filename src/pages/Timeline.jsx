/*global google*/

import React from "react";
import LoaderSpinner from "react-loader-spinner";
import Post from "../components/post.jsx";
import Ad from "../components/ad.jsx";
import Switch from "@material-ui/core/Switch";
import PostsPagination from "../components/PostsPagination.jsx"; 
import { Carousel } from "react-responsive-carousel";
import Loader from 'react-loader-advanced';

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
  UncontrolledCarousel,
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
// import {
//   CardImg, CardText,  CardTitle, CardSubtitle
// } from 'reactstrap';
import UserNavbar from "components/Navbars/UserNavbar.jsx";
import { withTranslation } from "react-i18next";
import GoogleAd from "components/GoogleAd.jsx";
import AdSense from "react-adsense";
import Inbox from "components/inbox.jsx";

const user3 = JSON.parse(localStorage.getItem("uid"));
const userId = JSON.parse(localStorage.getItem("uid"));

class Timeline extends React.Component {
  ismounted = false;
  firestoreUsersRef = firebase.firestore().collection("users");
  firestorePostRef = firebase.firestore().collection("posts");
  firestoreUserRecommendationsRef = firebase
    .firestore()
    .collection("userRecommendations");

  state = {
    user3: JSON.parse(localStorage.getItem("uid")),
    posts: [],
    closeFriendsPosts: [],
    userData: {},
    closeUserData: {},
    followedUsers: [],
    closeFriends: [],
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
    value: "en",
    checkedA: false,
    stories: [],
    storiesUserData: {},
    storiesUserDataArr: [],
    defaultModal: false,
    modalItem: undefined,
    itemState: [],
    lol: [],
    loading: false,
    currentPage:1,
    postsPerPage:4,
    currentPosts:[],
    noPosts:true,
    loaderPosts:true,


  };

  renderNewCarousel = (story) => {
    return (
      <>
        <Carousel autoPlay showStatus={false} showThumbs={false}>
          {story.map((s, i) => {
            return (
              <div>
                <img
                  alt=""
                  src={s.content}
                  key={i}
                  style={{ justifyContent: "center" }}
                />
                <p className="legend">{s.uploaded}</p>
              </div>
            );
            console.log(s);
          })}
        </Carousel>
      </>
    );
  };

  handleChange = (event) => {
    // console.log("selected val is ", event.target.value);
    let newlang = event.target.value;
    this.setState((prevState) => ({ value: newlang }));
    // console.log("state value is", newlang, this.props.i18n.changeLanguage);
    this.props.i18n.changeLanguage(newlang);
    this.setState({ ...this.state, [event.target.name]: event.target.checked });
  };

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };

  componentWillUnmount() {
    this.ismounted = false;
    clearInterval(Post);
    clearInterval(Ad);
    clearInterval(this.getFriendId());
    clearInterval(this.getFollowedUsers());
    clearInterval(this.getCloseFriends());
    clearInterval(this.getFollowingPosts());
    clearInterval(this.getCloseFriendsPosts());

    // this.getFriendId();
    // this.getFollowedUsers();
    // this.getCloseFriends();
    // this.getFollowingPosts();
    // this.getCloseFriendsPosts();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.checkedA !== this.state.checkedA) {
      this.getCloseFriends();
      this.getCloseFriendsPosts();
    }


    if (prevState.currentPage !== this.state.currentPage) {
      console.log(this.state.currentPosts);
 
      const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
      const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
      let currentPosts = this.state.posts.slice(indexOfFirstPost, indexOfLastPost);
      
      this.setState({currentPosts: currentPosts});
      console.log("allpost: " ,this.state.posts.length)
      console.log("crrentpost: ",this.state.currentPosts.length)
  console.log(indexOfFirstPost,indexOfLastPost)
  
      this.renderPosts();
 
     }

  }


  renderPosts=()=>{
    return(
      
      this.state.currentPosts.map((post, postindex) => (
        <Post item={post} key={postindex} />
      ))

    );
  }

  // Change page
  paginate = (pageNumber) =>{
  
    this.setState({currentPage:pageNumber});
    // console.log(this.state.currentPage,"and",pageNumber);
  
    // console.log("pagination")
      } 

  getFriendId = async () => {
    // this.state.friendId = JSON.parse(localStorage.getItem("Fuid"));
  };

  componentDidMount() {
    this.ismounted = true;
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;

    this.getFriendId().then(() => {
      // this.getProfilePic();
      this.getFollowedUsers();
      this.getFollowingPosts();
      // this.getFollowingStories();
      // this.getFriendsStories();
      // this.renderCarousel();
      // this.getCloseFriends();
      // this.getCloseFriendsPosts();
    });

    // this.getCloseFriends();
    // this.getCloseFriendsPosts();
  }

  getFollowedUsers = async () => {
    let users = [];
    await this.firestoreUsersRef
      .doc(this.state.user3)
      .collection("following")
      .get()
      .then((querySnapshot) => {
        this.getFollowingStories();
        querySnapshot.forEach((docSnap) => {
          users.push(docSnap.id);
        });
        // this.setState({followedUsers: users});
      });
    this.setState({ followedUsers: users });
  };

  getCloseFriends = async () => {
    let closeFriends = [];
    await this.firestoreUsersRef
      .doc(this.state.user3)
      .collection("closeFriends")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((docSnap) => {
          closeFriends.push(docSnap.id);
        });
      });
    this.setState({ closeFriends: closeFriends });
  };

  // Get all posts of each user3 and push them in a same array
  getFollowingPosts = async () => {
    // 1. Get all the users the current user3 is following
    let allPosts = [];
    await this.getFollowedUsers().then(async () => {
      // console.log(this.state.followedUsers);

      let users = this.state.followedUsers;
      // let allTimes = [];

      // 2. Get posts of each user3 seperately and putting them in one array.
      //  users.forEach(async (user3) => {
      for (const eachUser of users) {
        // await this.getProfilePic(eachUser).then(async () => {
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
                    // cta: "cta",
                    caption: doc.data().caption,
                    // location: doc.data().location.coordinates,
                    // locName: doc.data().location.locationName,
                    postId: doc.data().postId,
                    timeStamp: doc.data().time,
                    // likes:0,
                    // locLatLng: "Address",
                  };
                  allPosts.push(article);
                  this.setState({noPosts:false});
                });
              });
          });
        // allTimes.push(article.timeStamp.seconds);
        // });
        // allPosts.sort(function(a,b){
        //   // Turn your strings into dates, and then subtract them
        //   // to get a value that is either negative, positive, or zero.
        //   return new Date(b.timeStamp) - new Date(a.timeStamp) ;
        // });

        // this.setState({posts: allPosts});
        // console.log(this.state.posts);
      }
    });
    let sortedPosts = [];
    allPosts
      .sort((a, b) => (a.timeStamp.seconds < b.timeStamp.seconds ? 1 : -1))
      .map((item, i) => {
        sortedPosts.push(item);
      });

    this.setState({ posts: sortedPosts });



    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    let currentPosts = this.state.posts.slice(indexOfFirstPost, indexOfLastPost);
    
    this.setState({currentPosts: currentPosts});

    this.setState({loaderPosts:false});


  };

  getCloseFriendsPosts = async () => {
    await this.getCloseFriends().then(async () => {
      let usersClose = this.state.closeFriends;
      let thePosts = [];
      for (const eachUser of usersClose) {
        await this.firestoreUsersRef
          .doc(eachUser)
          .get()
          .then(async (document) => {
            this.setState({ closeUserData: document.data() });
            await this.firestorePostRef
              .doc(eachUser)
              .collection("userPosts")
              .orderBy("time", "desc")
              // .limit(9)
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc) => {
                  let article = {
                    username: this.state.closeUserData.username,
                    userId: eachUser,
                    title: "post",
                    profilePic: this.state.closeUserData.profilePic,
                    image: doc.data().image,
                    caption: doc.data().caption,
                    // location: doc.data().location.coordinates,
                    // locName: doc.data().location.locationName,
                    postId: doc.data().postId,
                    timeStamp: doc.data().time,
                    // locLatLng: "Address",
                  };
                  thePosts.push(article);
                });
              });
            this.setState({ closeFriendsPosts: thePosts });
          });
      }
    });
  };

  getFollowingStories = async () => {
    let users = this.state.followedUsers;
    let stories = [];
    for (const user of users) {
      let userObj = new Object();
      userObj.user = user;
      // console.log("Avatar:" +this.state.avatar)
      await this.firestoreUsersRef
        .doc(user)
        .get()
        .then(async (document) => {
          let userData = document.data();
          let fetchTimestamp = new Date().getTime();
          let storiesArr = [];
          this.firestoreUsersRef
            .doc(user)
            .collection("stories")
            .where("expireTimestamp", ">=", fetchTimestamp)
            .orderBy("expireTimestamp", "desc")
            .get()
            .then((docs) => {
              if (docs.size > 0) {
                let userStoryObj = {
                  userId: user,
                  username: userData.username,
                  userAvatar: userData.profilePic,
                };
                docs.forEach((doc) => {
                  let story = doc.data();
                  let uploadTime = story.currentTimestamp;
                  let timestampDiff = fetchTimestamp - uploadTime;
                  timestampDiff = timestampDiff / 3600000;
                  timestampDiff = Math.round(timestampDiff);
                  let storyObj = {
                    content: story.downloadURL,
                    uploaded: timestampDiff + " hours ago",
                  };
                  storiesArr.push(storyObj);
                  userStoryObj.stories = storiesArr;
                });
                stories.push(userStoryObj);
              }
            });
        });
    }
    this.setState({ stories: stories });
    console.log("asim", this.state.stories);
  };

  getFriendsStories = async () => {
    await this.getFollowedUsers().then(async () => {
      let users = this.state.followedUsers;
      let allStories = [];
      let allUsersWS = [];
      for (const eachUser of users) {
        await this.firestoreUsersRef
          .doc(eachUser)
          .collection("stories")
          .get()
          .then(async (snapshot) => {
            // console.log(snapshot.size, " xxx ");
            if (snapshot.size > 0) {
              await this.firestoreUsersRef
                .doc(eachUser)
                .get()
                .then((document) => {
                  this.setState({ storiesUserData: document.data() });
                  let article2 = {
                    userId: document.id,
                    username: document.data().username,
                    profilePic: document.data().profilePic,
                  };
                  allUsersWS.push(article2);
                  this.setState({ storiesUserDataArr: allUsersWS });

                  // console.log(snapshot.size, " xxx ", document.data().username);
                  snapshot.forEach((doc) => {
                    let article = {
                      userId: eachUser,
                      username: this.state.storiesUserData.username,
                      profilePic: this.state.storiesUserData.profilePic,
                      image: doc.data().downloadURL,
                      timeStamp: doc.data().currentTimestamp,
                      expireTimeStamp: doc.data().expireTimestamp,
                    };
                    allStories.push(article);
                  });
                });
              // this.setState({ stories: allStories });
              console.log(this.state.storiesUserData.username);
              console.log(this.state.stories);
              console.log(this.state.storiesUserDataArr);
            }
          });
      }
    });
  };

  // getProfilePic = async (user) => {
  //   const firebaseProfilePic = await firebase
  //     .storage()
  //     .ref()
  //     .child("profilePics/(" + user + ")ProfilePic");
  //   firebaseProfilePic
  //     .getDownloadURL()
  //     .then((url) => {
  //       // console.log("got profile pic of" +user3 + url);
  //       this.setState({ avatar: url });
  //       console.log(this.state.avatar);

  //       return url;
  //     })
  //     .catch((error) => {
  //       // Handle any errors
  //       switch (error.code) {
  //         case "storage/object-not-found":
  //           // File doesn't exist
  //           this.setState({
  //             avatar:
  //               "https://clinicforspecialchildren.org/wp-content/uploads/2016/08/avatar-placeholder.gif",
  //           });
  //           return "https://clinicforspecialchildren.org/wp-content/uploads/2016/08/avatar-placeholder.gif";
  //         // break;
  //       }
  //       console.log(error);
  //     });
  // };

  noFriendsTimeline = () => {
    const { t } = this.props;
    if (this.state.posts.length > 0 && !this.state.checkedA) {

      return (
        <>
        
{        this.renderPosts()}

        <PostsPagination
        postsPerPage={this.state.postsPerPage}
        totalPosts={this.state.posts.length}
        paginate={this.paginate}
      />
           {/* {this.state.posts.map((post, postindex) => (
            <Post item={post} key={postindex} />
          ))} */}
        </>
      );
    } else if (this.state.closeFriendsPosts.length > 0 && this.state.checkedA) {
      return (
        <>
          {this.state.closeFriendsPosts.map((post2, postindex2) => (
            <Post item={post2} key={postindex2} />
          ))}
        </>
      );
    } else if (this.state.noPosts) {
      return (
        <Card
          className="container justify-content-center"
          style={{
            marginBottom: "500px",
            borderRadius: "50px",
            borderRadius: "50px",
          }}
        >
          <h3 className="display-3 lead">
            {t("Nothing to Show")}{" "}
            <i className="fa fa-lock" aria-hidden="true"></i>
          </h3>
          <p className="lead description">
            {t("Follow more accounts to see their posts")}
          </p>
        </Card>
      );
    } else if(this.state.followedUsers.length<1) {
      return (
        <Card
          className="container justify-content-center"
          style={{
            borderRadius: "50px",
          }}
        >
          <h3 className="display-3 lead">
            {t("You aren't following any users")}{" "}
            <i className="fa fa-lock" aria-hidden="true"></i>
            {/* <HttpsOutlinedIcon fontSize="small" color="lead"/> */}
          </h3>
          <p className="lead description">
            {t("Follow accounts to see their posts")}
          </p>
        </Card>
      );
    }
  };

  renderCarousel = (story) => {
    // let photos = [];

    // if (this.state.storiesUserData.image) {
    // this.state.storiesUserData.image.map((element, index) => {
    //   let sources = {};
    //   sources = this.renderImage(element);
    //   let key = index;

    //   photos.push(sources);
    // });

    let items = [];
    let pics = {};

    items = story.map((s, i) => ({
      src: s.content,

      header: s.uploaded,
      // caption: s.uploaded,
      // altText: "",
      // header: (
      //   <div className="align-items-center shadow">
      //   <img
      //     className="media-comment-avatar avatar rounded-circle"
      //     style={{
      //       display: "block",
      //       objectFit: "cover",
      //       padding: "2px",
      //       margin: "5px",
      //     }}
      //     src={data.profilePic}
      //   />
      //   </div>
      // ),
    }));
    this.setState({ itemState: items, carousel: true });
    console.log(this.state.itemState);
    // }
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
                {/* <Card>Say helleyo!</Card> */}

                <Inbox />
              </Col>

              <Col
                sm="6"
                md="6"
                lg="6"
                className="order-md-2"
                style={{ zoom: "85%" }}
              >

<Loader

// foregroundStyle={{color: 'white'}}
  backgroundStyle={{ backgroundColor:"white",borderRadius:"10px"}}

show={this.state.loaderPosts} 
 message={
   
  
  <LoaderSpinner
  type="Grid"
  color="#00BFFF"
  height={50}
  width={50}
  timeout={3000} //3 secs
/>

 } 
 timeout={3000}
 contentBlur={200} 
 hideContentOnLoad={true}

>

                {/* Stories */}

                <div
                  className="card-header d-flex align-items-center shadow"
                  style={{ borderRadius: "85px", marginBottom: "25px" }}
                >
                  <div className="d-flex align-items-center"></div>

                  {/* <Link to={`/friend/d99NLeMfDYd7SYbcJtTYkLSiPKp1`}> */}

                  {this.state.stories.map((story, index) => (
                    <img
                      onClick={() => {
                        this.setState({ modalItem: story, lol: story.stories });
                        this.setState({ defaultModal: true });
                        console.log("story-only", story);
                        console.log("story-stories", story.stories);
                        // // console.log("story-index", story.stories[index].content);
                        // console.log("index", index);
                        // console.log("index-index", story.stories.index);
                        this.renderCarousel(story.stories);
                        this.renderNewCarousel(story.stories);
                        {
                          story.stories.map((s, i) => {
                            console.log(s);
                          });
                        }

                        // console.log("misa", story.stories[index].content);
                      }}
                      key={index}
                      src={story.userAvatar}
                      className="rounded-circle img-responsive border border-danger"
                      style={{
                        width: "75px",
                        height: "75px",
                        display: "block",
                        objectFit: "cover",
                        padding: "2px",
                        margin: "3px",
                      }}
                      alt=""
                    />
                  ))}

                  {/* {this.state.stories.map((story, index) => (
                    <img
                      onClick={() => {
                        this.setState({ modalItem: story });
                        this.setState({ defaultModal: true });
                      }}
                      key={index}
                      src={story.profilePic}
                      className="rounded-circle img-responsive"
                      style={{
                        width: "55px",
                        height: "55px",
                        display: "block",
                        objectFit: "cover",
                      }}
                      alt=""
                    />
                  ))} */}

                  <h6 className="mb-0 text-muted font-weight-bold">
                    {/* <small className="text-muted"> */}
                    {/* Hassan */}
                    {/* </small> */}
                  </h6>
                  {/* </Link> */}
                  <div
                    className="text-right ml-auto"
                    style={{ color: "black" }}
                  >
                    <label>Show Posts from Close Friends only</label>

                    <Switch
                      checked={this.state.checkedA}
                      onChange={this.handleChange}
                      name="checkedA"
                      color="primary"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                  </div>
                </div>

                {/* See posts from friends only                
                <div
                  className="card-header d-flex align-items-center shadow"
                  style={{ borderRadius: "25px", marginBottom: "25px" }}
                >
                  <div className="d-flex align-items-center">
                    {this.state.storiesUserDataArr.map((story, index) => (
                      <img
                        onClick={() => {
                          this.setState({ modalItem: story });
                          this.setState({ defaultModal: true });
                          this.renderCarousel();
                        }}
                        key={index}
                        src={story.profilePic}
                        className="rounded-circle img-responsive border border-danger"
                        style={{
                          width: "75px",
                          height: "75px",
                          display: "block",
                          objectFit: "cover",
                          padding: "2px",
                          margin: "3px",
                        }}
                        alt=""
                      />
                    ))}
                  </div>
                  <div
                    className="text-right ml-auto"
                    style={{ color: "black" }}
                  >
                    <label>Show Posts from Close Friends only</label>

                    <Switch
                      checked={this.state.checkedA}
                      onChange={this.handleChange}
                      name="checkedA"
                      color="primary"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                  </div>
                </div> */}

                {this.noFriendsTimeline()}
        
</Loader>
              </Col>


              <Col
                sm="3"
                md="3"
                lg="3"
                className="order-md-3"
                style={{ zoom: "85%" }}
              >
                {/* <Card> */}
                {/* <AdSense.Google
                  client="ca-pub-3206659815873877"
                  slot="1742211567"
                /> */}

                {/* </Card> */}
              </Col>
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
          {" "}
          <Row>
            <Col>
              {this.state.carousel && (
                <div>
                  <div
                    className="card-header d-flex align-items-center "
                    style={{ zoom: "60%" }}
                  >
                    <div
                      className="d-flex align-items-center"
                      // style={{
                      //   position: "absolute",
                      //   top: "200px",
                      //   left: "0",
                      //   width: "100%",
                      // }}
                    >
                      <Link to={`/friend/${this.state.modalItem.userId}`}>
                        <img
                          style={{
                            width: "55px",
                            height: "55px",
                            display: "block",
                            objectFit: "cover",
                          }}
                          className="rounded-circle img-responsive"
                          src={this.state.modalItem.userAvatar}
                        />
                      </Link>
                      <div className="mx-3">
                        <h6 className="mb-0 text-black font-weight-bold">
                          {this.state.modalItem.username}{" "}
                        </h6>
                        <small className="text-muted">
                          {/* {"on"}
                    {moment(Number(this.state.itemState.header)).format("lll")} */}
                          {/* {this.state.itemState.header} */}
                        </small>
                        <small className="opacity-60">
                          <small className="d-block text-muted">
                            {/* {moment(
                              Number(this.state.modalItem.timeStamp)
                            ).format("lll")} */}

                            {/* {this.state.modalItem.stories.uploaded} */}
                          </small>
                        </small>
                      </div>
                    </div>
                    {/* Islamabad */}
                  </div>

                  <div
                    className="rounded shadow-lg overflow-hidden"
                    // style={{
                    //   maxHeight: "600px",
                    //   objectFit: "scale-down",
                    // }}
                  >
                    {/* <img

src={this.state.modalItem.stories}

/> */}
                    {this.renderNewCarousel(this.state.lol)}

                    {/* <UncontrolledCarousel
                      indicators={false}
                      controls={true}
                      autoPlay={true}
                      items={this.state.itemState}
                    /> */}
                  </div>
                </div>
              )}
            </Col>
          </Row>
          {/* {this.state.modalItem && (
                        <div
                          className="card  shadow"
                          style={{
                            zoom: "80%",
                            backgroundColor: "#333",
                            borderColor: "#333",
                          }}
                          fluid
                          body
                          inverse
                        >
                          <div
                            className="card-body"
                            style={{ backgroundColor: "#F7F7F7" }}
                          >
                            <img
                              src={this.state.modalItem.profilePic}
                              className="rounded-circle img-responsive"
                              style={{
                                width: "25px",
                                height: "25px",
                                display: "block",
                                objectFit: "cover",
                              }}
                              alt=""
                            />
                            <p>
                              From:
                              {moment(Number(this.state.modalItem.timeStamp)).format(
                                "lll"
                              )}
                              To:
                              {moment(
                                Number(this.state.modalItem.expireTimeStamp)
                              ).format("lll")}
                            </p>
                            <p>{this.state.modalItem.userId}</p>
                            <SmoothImage
                              alt="Image placeholder"
                              src={this.state.modalItem.image}
                              className="img-fluid rounded"
                            />
                          </div>
                        </div>
                      )} */}
        </Modal>
        {/* <Update/> */}
      </>
    );
  }
}

export default withTranslation()(Timeline);

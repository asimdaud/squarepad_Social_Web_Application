import React from "react";
import moment from "moment";

import AdSense from "react-adsense";
import Post from "../components/post.jsx";
import PostsPagination from "../components/PostsPagination.jsx";
// nodejs library that concatenates classes
import classnames from "classnames";
// reactstrap components
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Modal,
  CardBody,
  Alert,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  // UncontrolledAlert ,
  Badge,
  UncontrolledAlert,
} from "reactstrap";
import SmoothImage from "react-smooth-image";
// core components
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import * as firebase from "firebase";
import { Redirect, Link } from "react-router-dom";
import UserNavbar from "components/Navbars/UserNavbar";

import InfiniteScroll from "react-infinite-scroll-component";

import GoogleAd from "components/GoogleAd.jsx";

class Group extends React.Component {
  firestoreUsersRef = firebase.firestore().collection("users");
  firestorePostRef = firebase.firestore().collection("posts");

  constructor(props) {
    super(props);

    this.state = {
      user3: JSON.parse(localStorage.getItem("uid")),
      posts: [],
      userData: {},
      followedUsers: [],
      loading: false,
      currentPage:1,
      postsPerPage:3,
      currentPosts:[],
      iPosts:[]
    };
  }

  renderPosts=()=>{
    // return(

    //   <InfiniteScroll
    //   dataLength={this.state.posts.length}
    //   next={this.fetchMoreData}
    //   hasMore={!this.state.iPosts.length==this.state.posts.length} //this.state.iPosts.length==this.state.posts.length
    //   loader={<h4>Loading...</h4>}
    // >
    //   {
      
    //     this.state.iPosts.map((post, postindex) => (
    //       <Post item={post} key={postindex} />
    //     ))
    
    //   }
    // </InfiniteScroll>




      

    // );
  }

  componentDidUpdate(prevProps, prevState) {
   

    if (prevState.currentPage != this.state.currentPage) {
     console.log(this.state.currentPosts);

     const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
     const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
     let currentPosts = this.state.posts.slice(indexOfFirstPost, indexOfLastPost);
     
     this.setState({currentPosts: currentPosts,
    
    
      iPosts: this.state.iPosts.concat(this.state.currentPosts),
    });
    console.log("indexes",indexOfLastPost,"-", indexOfFirstPost);
    console.log("di update current post",this.state.currentPosts);
    console.log("ipost",this.state.iPosts);
    console.log("allpost",this.state.posts);
//      console.log("allpost: " ,this.state.posts.length)
//      console.log("crrentpost: ",this.state.currentPosts.length)
//  console.log(indexOfFirstPost,indexOfLastPost)
 
    //  this.renderPosts();

    }


  }
  
  // Change page
   paginate = (pageNumber) =>{
  
  // this.setState({currentPage:pageNumber});
  // console.log(this.state.currentPage,"and",pageNumber);

  // console.log("pagination")
  //   } 
     
  //   fetchMoreData = () => {
  //     // a fake async api call like which sends
  //     // 20 more records in 1.5 secs
  //     // setTimeout(() => {
  //       this.setState({

  //         // iPosts: this.state.iPosts.concat(this.state.currentPosts),
  //         // items: this.state.items.concat(Array.from({ length: 3})),
  //         postsPerPage:3,
          
  //         currentPage:this.state.currentPage+1
  //       });
  //       console.log("fetchchdchdcdic", this.state.currentPage)
  //       console.log("ipost",this.state.iPosts);
  //     // }, 1500);
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
              // .orderBy("time", "desc")
              // .limit(5)
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
    // let sortedPosts = [];
    // allPosts
    //   .sort((a, b) => (a.timeStamp.seconds < b.timeStamp.seconds ? 1 : -1))
    //   .map((item, i) => {
    //     sortedPosts.push(item);
    //   });

    // this.setState({ posts: sortedPosts });

    this.setState({ posts: allPosts });

    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    let currentPosts = this.state.posts.slice(indexOfFirstPost, indexOfLastPost);
    
    this.setState({currentPosts: currentPosts});
    this.setState({iPosts: currentPosts});
    
    console.log("allpost: " ,this.state.posts.length)
    console.log("crrentpost: ",this.state.currentPosts.length)
console.log(indexOfFirstPost,indexOfLastPost)
  };

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
  };

  componentDidMount() {

    
    
    // this.ismounted = true;
    // document.documentElement.scrollTop = 0;
    // document.scrollingElement.scrollTop = 0;
    // this.refs.main.scrollTop = 0;
    
    // this.getProfilePic();
    // this.getFollowedUsers();
    // this.getFollowingPosts();
    // this.getFollowingStories();
    
    // this.getCloseFriends();
    // this.getCloseFriendsPosts();
    // Get current posts

  }

  render() {
    return (
      <>
        <UserNavbar />
        <main
          className="profile-page"
          ref="main"
          style={{
            backgroundImage:
              "linear-gradient(to right, #e4efe9, #d9ede8, #cfeae9, #c6e6ed, #c0e2f1, #bcdef2, #badaf3, #bad5f4, #b7d1f2, #b5ccf1, #b3c8ef, #b1c3ed)",
          }}
        >
          <section
            className="section section-blog-info"
            style={{ marginTop: "160px" }}
          >
            <Container>
              <Row>
                <Col>
                <PostsPagination
        postsPerPage={this.state.postsPerPage}
        totalPosts={this.state.posts.length}
        paginate={this.paginate}
      />
      </Col>
                <Col
                  sm="6"
                  md="6"
                  lg="6"
                  // className="order-md-2"
                  style={{ zoom: "85%" }}
                >

{this.renderPosts()}

                </Col>

              </Row>

              <div>
                <AdSense.Google
                  client="ca-pub-3206659815873877"
                  slot="1742211567"
                  // style={{ display: "block" }}
                  format="auto"
                  responsive="true"
                  // layout="display:block"
                  // layoutKey='-gw-1+2a-9x+5c'
                />

                <AdSense.Google
                  client="ca-pub-3206659815873877"
                  slot="2961288843"
                  // style={{ display: "block" }}
                  format="auto"
                  responsive="true"
                  // layout="display:block"
                  // layoutKey='-gw-1+2a-9x+5c'
                />
              </div>

              <div>
                {/*   
    <ins class="adsbygoogle"
    //  style="display:inline-bl  ock;width:728px;height:90px"
     data-ad-client="ca-pub-3206659815873877"
     data-ad-slot="1742211567"></ins>
    */}
{/* 
                <ins
                  class="adsbygoogle"
                  // style="display:block"
                  // data-ad-format="fluid"
                  // data-ad-layout-key="-i2-7+2w-11-86"
                  data-ad-client="ca-pub-3206659815873877"
                  data-ad-slot="2961288843"
                ></ins> */}

<div>
      <Alert color="primary">
        This is a primary alert — check it out!
      </Alert>
      <Alert color="secondary">
        This is a secondary alert — check it out!
      </Alert>
      <Alert color="success">
        This is a success alert — check it out!
      </Alert>
      <Alert color="danger">
        This is a danger alert — check it out!
      </Alert>
      <Alert color="warning">
        This is a warning alert — check it out!
      </Alert>
      <Alert color="info">
        This is a info alert — check it out!
      </Alert>
      <Alert color="light">
        This is a light alert — check it out!
      </Alert>
      <Alert color="dark">
        This is a dark alert — check it out!
      </Alert>
    </div>

        <UncontrolledAlert color="info">
      I am an alert and I can be dismissed!
    </UncontrolledAlert>  
              </div>

              {/* <GoogleAd slot="1742211567" classNames="page-top" /> */}
            </Container>

            {/* 
<ins 
class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-3206659815873877"
     data-ad-slot="6411675194"
     data-ad-format="auto"
     data-full-width-responsive="true"
     ></ins> */}

            {/* <AdSense.Google
              client="ca-pub-3206659815873877"
              slot="6411675194"
              style={{ display: "block" }}
              format="auto"
              responsive="true"
              // layout="display:block"
              // layoutKey='-gw-1+2a-9x+5c'
            /> */}
          </section>
          <SimpleFooter />
        </main>
      </>
    );
  }
}

export default Group;

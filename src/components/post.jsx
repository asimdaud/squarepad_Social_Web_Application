/*global google*/

import React from "react";
import moment from "moment";
import "../assets/css/img-hover.css";

import { Favorite, FavoriteBorder, Comment } from "@material-ui/icons";
import FadeIn from "react-fade-in";
import ReactPlayer from "react-player/lazy";

import SmoothImage from "react-smooth-image";
import images from "../components/Themes/images";

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
import * as firebase from "firebase";
// import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import CommentItem from "../components/CommentItem";

// const user3 = JSON.parse(localStorage.getItem('uid'));
// const firestorePostRef =  firebase.firestore().collection("posts").doc(user3).collection("userPosts");
// const user = JSON.parse(localStorage.getItem("user"));

class Post extends React.Component {
  user = firebase.auth().currentUser;
  // ismounted = false;

  state = {
    user: firebase.auth().currentUser,
    likes: 0,
    comments: [],
    ifLiked: false,
    newLikeDocId: "(" + this.user.uid + ")like",
    userId: this.props.item.userId,
    commentsArray: [],
    getComments: false,
    // openCommentInput: false,
    profilePic: require("assets/img/icons/user/user1.png"),
    childData: null,
    // "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg",
    commentInput: "",
    currentUsername: "",
    defaultModal: false,
    modalItem: "",
    locLatLng: "",
    comment: "",
  };

  firestorePostRef = firebase
    .firestore()
    .collection("posts")
    .doc(this.state.userId)
    .collection("userPosts");

  firestoreUsersRef = firebase.firestore().collection("users");

  componentWillUnmount = () => {
    // this.ismounted = false;
    clearInterval(CommentItem);
    // clearInterval(this.getCommentData());
    this.getProfilePic();
    // console.warn("ASIM UNMOINT POST");
  };

  componentDidMount = () => {
    // this.ismounted = true;
    this.renderAvatar();
    this.getProfilePic();
    const { item } = this.props;

    // this.setState({userId: item.userId});

    // console.log("state userId: " + this.state.userId);
    this.firestorePostRef
      .doc(item.postId)
      .collection("likes")
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.size > 0) {
          this.setState({ likes: querySnapshot.size });
        }
      });
    // this.renderComments();
    this.getCommentData();
    this.getCurrentUsername();

    // const { item2 } = this.props;
    //     console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    // // console.log(new Date())
    // console.log(props.post)
    // console.log("hahahaha" + item.image);

    this.firestorePostRef
      .doc(item.postId)
      .collection("likes")
      .doc(this.state.newLikeDocId)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          this.setState({ ifLiked: true });
        } else {
          this.setState({ ifLiked: false });
        }
      });
  };

  componentDidUpdate(prevProps, prevState) {
    // this.ismounted = true;
    const { item } = this.props;

    if (this.state.childData) {
      this.getCommentData();
    }

    if (prevProps.item.postId !== item.postId) {
      this.getCommentData();
      this.toggleLike();
      this.firestorePostRef
        .doc(item.postId)
        .collection("likes")
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size > 0) {
            this.setState({ likes: querySnapshot.size });
          }
        });

      this.firestorePostRef
        .doc(item.postId)
        .collection("likes")
        .doc(this.state.newLikeDocId)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            this.setState({ ifLiked: true });
          } else {
            this.setState({ ifLiked: false });
          }
        });
    }

    //re-renders
    // if (prevState.commentsArray !== this.state.commentsArray) {
    //   this.getCommentData();
    // }

    // this.renderAvatar();
    // this.getProfilePic();
    // const { item } = this.props;

    // // this.setState({userId: item.userId});

    // // console.log("state userId: " + this.state.userId);
    // this.firestorePostRef
    //   .doc(item.postId)
    //   .collection("likes")
    //   .get()
    //   .then((querySnapshot) => {
    //     if (querySnapshot.size > 0) {
    //       this.setState({ likes: querySnapshot.size });
    //     }
    //   });
    // // this.renderComments();
    // this.getCommentData();

    // // const { item2 } = this.props;
    // //     console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    // // // console.log(new Date())
    // // console.log(props.post)
    // // console.log("hahahaha" + item.image);

    // this.firestorePostRef
    //   .doc(item.postId)
    //   .collection("likes")
    //   .doc(this.state.newLikeDocId)
    //   .get()
    //   .then((snapshot) => {
    //     if (snapshot.exists) {
    //       this.setState({ ifLiked: true });
    //     } else {
    //       this.setState({ ifLiked: false });
    //     }
    //   });
    // // if(prevState.userId!==this.state.userId){
    // //   this.getCommentData();
    // // }
    // // if(prevProps.item !== this.props){
    // //   this.renderAvatar();
    // //   this.getProfilePic();
    // //   const { item } = this.props;
    // //   // this.setState({userId: item.userId});
    // //   // console.log("state userId: " + this.state.userId);
    // //   this.firestorePostRef
    // //     .doc(item.postId)
    // //     .collection("likes")
    // //     .get()
    // //     .then((querySnapshot) => {
    // //       if (querySnapshot.size > 0) {
    // //         this.setState({ likes: querySnapshot.size });
    // //       }
    // //     });
    // //   // this.renderComments();
    // //   this.getCommentData();
    // //   // const { item2 } = this.props;
    // //   //     console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    // //   // // console.log(new Date())
    // //   // console.log(props.post)
    // //   // console.log("hahahaha" + item.image);
    // //   this.firestorePostRef
    // //     .doc(item.postId)
    // //     .collection("likes")
    // //     .doc(this.state.newLikeDocId)
    // //     .get()
    // //     .then((snapshot) => {
    // //       if (snapshot.exists) {
    // //         this.setState({ ifLiked: true });
    // //       } else {
    // //         this.setState({ ifLiked: false });
    // //       }
    // //     });
    // }
  }

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };

  componentWillMount = () => {
    // this.getProfilePic();
    // this.mOver();
    // const { item } = this.props;
    // //     console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    // // // console.log(new Date())
    // // console.log(props.post)
    // // console.log("hahahaha" + item.image);
    // this.firestorePostRef
    //   .doc(item.postId)
    //   .collection("likes")
    //   .doc(this.state.newLikeDocId)
    //   .get()
    //   .then((snapshot) => {
    //     if (snapshot.exists) {
    //       this.setState({ ifLiked: true });
    //     } else {
    //       this.setState({ ifLiked: false });
    //     }
    //   });
  };

  getProfilePic = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(this.user.uid)
      .get()
      .then((doc) => {
        const res = doc.data().profilePic;

        if (res != null) {
          this.setState({
            profilePic: res ? res : require("assets/img/icons/user/user1.png"),
          });
        }
      });
  };

  toggleLike = () => {
    // document.body.style.color = "red";
    const noOfLikes = this.state.likes;
    const { item } = this.props;
    if (!this.state.ifLiked) {
      // this.firestoreUsersRef
      // .doc(this.user.uid)
      // .get()
      // .then((document) => {
      //   this.setState({ currentUsername: document.data().username });
      //   console.log(this.state.currentUsername)
      // });

      this.firestorePostRef
        .doc(item.postId)
        .collection("likes")
        .doc(this.state.newLikeDocId)
        .set({
          userId: this.user.uid,
        }) &&
        firebase
          .firestore()
          .collection("notifications")
          .doc(this.state.userId)
          .collection("userNotifications")
          .doc("(" + item.postId + ")like+(" + this.user.uid + ")")
          .set({
            userId: this.user.uid,

            source: item.postId,
            content: "liked your post",
            type: "like",
            time: moment().valueOf().toString(),
          })
          .then(() => {
            this.state.likes = noOfLikes + 1;
            this.setState({ ifLiked: true });
          });
    } else {
      this.firestorePostRef
        .doc(item.postId)
        .collection("likes")
        .doc(this.state.newLikeDocId)
        .delete() &&
        firebase
          .firestore()
          .collection("notifications")
          .doc(this.state.userId)
          .collection("userNotifications")
          .doc("(" + item.postId + ")like+(" + this.user.uid + ")")
          .delete()
          .then(() => {
            if (noOfLikes === 0) this.state.likes = 0;
            this.state.likes = noOfLikes - 1;
            this.setState({ ifLiked: false });
          });
    }
  };

  getCurrentUsername() {
    this.firestoreUsersRef
      .doc(this.user.uid)
      .get()
      .then((document) => {
        this.setState({ currentUsername: document.data().username });
      });
  }

  postComment = (e) => {
    // e.preventDefault();
    const { item } = this.props;
    const timestamp = moment().valueOf().toString();
    let myComment = this.state.commentInput;
    let myusername = this.state.currentUsername;
    let myuserId = this.user.uid;

    if (myComment.trim() != "") {
      // firebase
      //   .firestore()
      //   .collection("comments")
      //   .doc(item.postId)
      //   .collection("userComments")
      //   .doc(timestamp)
      //   .set({
      //     commentId: timestamp,
      //     username: myusername,
      //     userId: myuserId,
      //     comment: myComment,
      //     timestamp: timestamp,
      //   })

      firebase
        .firestore()
        .collection("posts")
        .doc(item.userId)
        .collection("userPosts")
        .doc(item.postId)
        .collection("comments")
        .doc(timestamp)
        .set({
          commentId: timestamp,
          username: myusername,
          userId: myuserId,
          comment: myComment,
          timestamp: timestamp,
        }) &&
        firebase
          .firestore()
          .collection("notifications")
          .doc(this.state.userId)
          .collection("userNotifications")
          .doc(timestamp)
          .set({
            userId: this.user.uid,

            source: item.postId,
            content: "commented on your post",
            type: "comment",
            time: moment().valueOf().toString(),
          })
          .then(() => {
            this.setState({ commentInput: "" });

            this.getCommentData();
          })
          .catch((err) => {
            console.log(err);
          });
    }
  };

  getCommentData = () => {
    let commArray = [];
    const { item } = this.props;

    // firebase
    //   .firestore()
    //   .collection("comments")
    //   .doc(item.postId)
    //   .collection("userComments")
    // this.setState({ commentsArray: [] });

    firebase
      .firestore()
      .collection("posts")
      .doc(item.userId)
      .collection("userPosts")
      .doc(item.postId)
      .collection("comments")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let article = {
            commentData: doc.data(),
            postId: item.postId,
            authorId: item.userId,
          };

          commArray.push(article);
        });
        this.setState({ commentsArray: commArray });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderAvatar() {
    const { item } = this.props;
    return (
      <Link to={`/friend/${item.userId}`}>
        <img
          style={{
            width: "55px",
            height: "55px",
            display: "block",
            objectFit: "cover",
          }}
          className="rounded-circle img-responsive"
          src={item.profilePic}
        />
      </Link>
    );
  }

  togglePage = () => {
    // document.body.style.color = "red";
    const { item } = this.props;
    this.firestorePostRef
      .doc(item.postId)
      .collection("likes")
      .doc(this.state.newLikeDocId)
      .set({
        userId: this.user.uid,
      })
      .then(() => {
        {
          // localStorage.setItem("Fuid", JSON.stringify(this.state.userId));
        }
      });
  };

  handleChange = (e) => {
    this.setState({ commentInput: e.target.value });
    this.setState({ username: this.getCurrentUsername() });
  };

  handleCallback = (childData) => {
    this.setState({ childData: childData });
  };

  returnPostId() {
    const { item } = this.props;
    return item.postId;
  }

  onKeyboardPress = (event) => {
    if (event.key === "Enter") {
      this.postComment();
    }
  };

  // mOver = () => {
  //   const { item } = this.props;

  //   var geocoder = new google.maps.Geocoder();

  //   // var latlng = {lat: this.state.locLat, lng: this.state.locLng};
  //   var latlng = {
  //     lat: parseFloat(item.location.lat),
  //     lng: parseFloat(item.location.lng),
  //   };
  //   geocoder.geocode({ location: latlng }, function (results, status) {
  //     if (status === "OK") {
  //       if (results[0]) {
  //         // console.log(results[0].formatted_address);
  //         // this.state.locLatLng=results[0].formatted_address;
  //         item.locLatLng = results[0].formatted_address;
  //         console.log(item.locLatLng);
  //         // this.setState({ locLatLng:results[0].formatted_address });
  //         // map.setZoom(11);
  //         // var marker = new google.maps.Marker({
  //         //   position: latlng,
  //         //   map: map
  //         // });
  //         // infowindow.setContent(results[0].formatted_address);
  //         // infowindow.open(map, marker);
  //       } else {
  //         console.log("No address found");
  //       }
  //     }
  //   });
  //   return;
  // };

  render() {
    const { item } = this.props;
    // console.log("SRKKK")
    // console.log(item)
    return (
      <>
        <div
          style={{
            // padding: "16px",
            borderRadius: "20px",
            paddingBottom: "25px",
            // marginBottom: "25px",
          }}
          // key={item.time}
        >
          <div
            // className="shadow"
            // style={{
            //   // padding: "16px",
            //   borderRadius: "20px",
            // }}
            style={{
              borderTopLeftRadius: "50px",
              borderTopRightRadius: "50px",
            }}
            // key={item.time}
          >
            {/* <div className="card-header">
                <h5 className="h3 mb-0">Timeline</h5>
              </div> */}
            <div
              className="card-header d-flex align-items-center "
              // style={{  MozBorderRadiusTopleft:"20px",MozBorderRadiusTopright:"20px"  }}
              style={{
                borderTopLeftRadius: "50px",
                borderTopRightRadius: "50px",
              }}
              // onClick={this.togglePage()}
              // key={item.time}
            >
              <div
                className="d-flex align-items-center"
                // onClick={() => {this.togglePage();}}
                // onClick={() => {this.togglePage();}}
                // onMouseOver={() => this.onHover()}
                // key={item.time}
                // href="javascript:;"
              >
                {/* <i
                        href="javascript:;"
                        onClick={this.togglePage()}
                        // onMouseOver={this.mOver()}
                        // id={this.returnPostId()}
                      > */}
                {this.renderAvatar()}
                {/* {this.togglePage()} */}

                {/* </a> */}

                {/* <UncontrolledPopover
                        trigger="focus"
                        placement="right"
                        target={this.returnPostId()}
                      >

                       <PopoverBody>
    
<a href="javascript:;">
<Link to="friendspage">View profile</Link>
                          
</a>
                        </PopoverBody>
                      </UncontrolledPopover> */}

                <div className="mx-3">
                  <h6 className="mb-0 text-black font-weight-bold">
                    {item.username}{" "}
                  </h6>

                  <small className="text-muted">
                    {/* {"     @"} {item.username} */}
                    {"on "}
                    {moment(Number(item.timeStamp)).format("dddd")}
                    {/* {moment(Number(item.timeStamp)).format("ll")} */}
                  </small>
                  <small className="opacity-60">
                    <small className="d-block text-muted">
                      {moment(Number(item.timeStamp.toDate())).format("ll")}
                      {/* {item.timeStamp} */}
                    </small>
                  </small>
                </div>
              </div>
              {item.locName ? (
                <div className="text-right ml-auto" style={{ color: "black" }}>
                  <span className="btn-inner--icon icon-big">
                    <i className="fa fa-map-marker" id="tooltip556394744"></i>
                    {"  "}
                  </span>
                  {/* <span className="btn-inner--text">{item.locLatLng}</span> */}
                  <span className="btn-inner--text"> {item.locName}</span>
                </div>
              ) : (
                ""
              )}
            </div>
            <div
              // className="mb-0 text-black font-weight-bold"
              // className="justify-content-between align-items-center"
              style={{
                // textAlignLast:"center",
                // backgroundColor: "#F7F7F7",
                backgroundColor: "rgba(var(--b3f,250,250,250),1)",
                //  MozBorderRadiusBottomleft:"20px",MozBorderRadiusBottomright:"20px"
                //    borderBottomLeftRadius: "50px",
                // borderBottomRightRadius: "50px",
              }}
            >
              <h6
                className="display-5 font-italic text-black"
                style={{ paddingLeft: "10px", paddingTop: "8px" }}
              >
                {item.caption}
              </h6>
              {/* <SmoothImage
                alt="Image placeholder"
                src={item.image}
                className="img-fluid rounded"
              /> */}
              <div
                style={{
                  textAlignLast: "center",
                  width: "100%",
                }}
              >
                {item.type == "video" ? (
                  <>
                    <ReactPlayer
                      url={item.video}
                      // light={true}
                      light={item.image}
                      controls={true}
                      playing={true}
                      width="100%"
                      height="360px"
                    />

                    {/* <video poster={item.image} loop={true} controls>
              <source src={item.video} type="video/mp4"/>
            </video> */}
                  </>
                ) : (
                  // <SmoothImage

                  // loading="lazy"
                  // onLoad={console.log("Fully loaded")}
                  // onError={console.log("Error on image")}
                  // alt="Image placeholder"
                  // src={item.image}
                  // className="img-fluid rounded"
                  // style={{
                  //   width:"inherit"
                  // }}
                  // />
                  <FadeIn transitionDuration={2100} delay={80}>
                    <img
                      loading="lazy"
                      // onLoad={console.log("Fully loaded")}
                      // onError={console.log("Error on image")}
                      alt="Image placeholder"
                      src={item.image}
                      className="img-fluid rounded"
                      style={{
                        // width: "100%",
                        // height: "620px",
                        // display: "block",
                        // // objectFit: "cover",
                        // objectFit: "contain",
                        // // background: "black",
                        // zoom: "90%",
                        // background: "#f6f9fc",

                        // maxHeight: "450px",
                        // // maxWidth: "606px",
                        // height:"auto",
                        // width:"auto"

                        // transitionProperty:"opacity",
                        // transitionDuration:"0.3s",
                        // transitionTimingFunction:"ease-in",
                        // opacity:"1",
                        // backgroundSize: "cover",
                        // position:"relative",
                        // overflow:"hidden",

                        width: "inherit",
                      }}
                    />
                  </FadeIn>
                )}
              </div>
              <div className="row align-items-center  ">
                <div className="col-sm-12 ">
                  {/* <div class="container-imgHover">
                  <img
                    src={post.image}
                    alt="Avatar"
                    className="image-imgHover"
                    style={{ height: "255px", objectFit: "cover" }}
                  />
                    <div className="middle-icon-imgHover">
                      <img
                        className="icSend img-shake"
                        src={images.play1}
                        alt="icon send"
                      />
                    </div>
</div> */}

                  <div className="icon-actions my-3 pb-3 border-bottom  ">
                    {this.state.ifLiked === true ? (
                      <Favorite
                        color="error"
                        onClick={this.toggleLike}
                        className="heartbeat"
                      />
                    ) : (
                      <FavoriteBorder
                        className="heartbeat"
                        color="secondary"
                        onClick={this.toggleLike}
                      />
                    )}
                    <span className="text-muted">
                      {this.state.likes === 0
                        ? " Like "
                        : "   " + this.state.likes + " likes "}

                      {/* {" "}
                      {" " + this.state.likes}
                      {" likes "} */}
                    </span>

                    <Comment color="primary" />

                    <span className="text-muted">
                      {this.state.commentsArray.length === 0
                        ? " Comment "
                        : "   " +
                          this.state.commentsArray.length +
                          " comments "}

                      {/* d-none d-lg-block{" "}
                      {" " + this.state.commentsArray.length}
                      {" comments"} */}
                    </span>

                    {/* {this.commentFunc()} */}
                  </div>
                </div>
              </div>

              {/* <!-- Comments --> */}
              <div
                //  className="mb-1"
                style={{ zoom: "95%" }}
              >
                <div
                  style={{
                    maxHeight: "350px",
                    overflowY: "scroll",
                    overflowX: "hidden",
                  }}
                >
                  {this.state.commentsArray.map((comment, postindex) => (
                    <CommentItem
                      item={comment}
                      key={postindex}
                      parentCallback={this.handleCallback}
                    />
                  ))}
                </div>

                <div className="media align-items-center mt-1">
                  {/* <img
                    style={{
                      width: "44px",
                      height: "44px",
                      display: "block",
                      objectFit: "cover",
                    }}
                    className="rounded  img-responsive"
                    // alt="Image placeholder"
                    // className="avatar"
                    src={this.state.profilePic}
                  /> */}
                  <div className="media-body">
                    {/* <Form
                      id="formComment"
                      role="form"
                      onSubmit={this.postComment}
                    > */}
                    {/* <Input
                        className="form-control"
                        id="commentInput"
                        placeholder="Write your comment"
                        onChange={this.handleChange}
                        value={this.state.commentInput}
                        rows="1"
                      ></Input>
                          */}

                    <div className="viewBottom">
                      <img
                        style={{
                          width: "44px",
                          height: "44px",
                          display: "block",
                          objectFit: "cover",
                        }}
                        className="rounded  img-responsive"
                        // alt="Image placeholder"
                        // className="avatar"
                        src={this.state.profilePic}
                      />
                      <input
                        className="viewInput"
                        placeholder="Write your comment..."
                        id="commentInput"
                        onChange={this.handleChange}
                        value={this.state.commentInput}
                        rows="1"
                        onKeyPress={this.onKeyboardPress}
                      />
                      <img
                        className="icSend"
                        src={images.ic_send}
                        alt="icon send"
                        onClick={() => this.postComment()}
                      />
                    </div>
                    {/* </Form> */}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="card-header d-flex align-items-center "
              // style={{  MozBorderRadiusTopleft:"20px",MozBorderRadiusTopright:"20px"  }}
              style={{
                borderBottomLeftRadius: "50px",
                borderBottomRightRadius: "50px",
              }}
            ></div>
          </div>
        </div>

        <Modal
          isOpen={this.state.defaultModal}
          toggle={() => this.toggleModal("defaultModal")}
        >
          {/* <div className="modal-header">
      <h6 className="modal-title" id="modal-title-default">
        Type your modal title
      </h6>
      <button
        aria-label="Close"
        className="close"
        data-dismiss="modal"
        type="button"
        onClick={() => this.toggleModal("defaultModal")}
      >
        <span aria-hidden={true}>×</span>
      </button>
    </div> */}
          <div>
            {/* {this.state.posts((post, postindex) => ( */}
            {this.state.modalItem && <a>this.state.modalItem</a>}

            {/* </Container>   */}
          </div>
          <div className="modal-footer">
            {/* <Button color="primary" type="button">
        Save changes
      </Button> */}
            <Button
              className="ml-auto"
              color="link"
              data-dismiss="modal"
              type="button"
              onClick={() => this.toggleModal("defaultModal")}
            >
              Close
            </Button>
          </div>
        </Modal>
      </>
    );
  }
}

export default Post;

/*global google*/

import React from "react";
import moment from "moment";
import { Favorite, FavoriteBorder, Comment } from "@material-ui/icons";
import SmoothImage from "react-smooth-image";
import FadeIn from "react-fade-in";
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
import { Link } from "react-router-dom";
import CommentItem from "../components/CommentItem";

class PostPicOnly extends React.Component {
  user = firebase.auth().currentUser;

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

  componentDidMount = () => {
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

  componentWillUnmount = () => {
    // this.getProfilePic();
  };
  // this.renderComments();
  //   this.getCommentData();

  //   // const { item2 } = this.props;
  //   //     console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
  //   // // console.log(new Date())
  //   // console.log(props.post)
  //   // console.log("hahahaha" + item.image);

  //   this.firestorePostRef
  //     .doc(item.postId)
  //     .collection("likes")
  //     .doc(this.state.newLikeDocId)
  //     .get()
  //     .then((snapshot) => {
  //       if (snapshot.exists) {
  //         this.setState({ ifLiked: true });
  //       } else {
  //         this.setState({ ifLiked: false });
  //       }
  //     });

  // }

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

  getProfilePic = (friendId) => {
    const firebaseProfilePic = firebase
      .storage()
      .ref()
      .child("profilePics/(" + this.user.uid + ")ProfilePic");
    firebaseProfilePic
      .getDownloadURL()
      .then((url) => {
        // Inserting into an State and local storage incase new device:
        this.setState({ profilePic: url });
      })
      .catch((error) => {
        // Handle any errors
        switch (error.code) {
          case "storage/object-not-found":
            // File doesn't exist
            this.setState({
              profilePic: require("assets/img/icons/user/user1.png"),
            });
            break;
          default:
        }
        //   alert(error);
      });
  };

  toggleLike = () => {
    // document.body.style.color = "red";
    const noOfLikes = this.state.likes;
    const { item } = this.props;
    if (!this.state.ifLiked) {
      this.firestorePostRef
        .doc(item.postId)
        .collection("likes")
        .doc(this.state.newLikeDocId)
        .set({
          userId: this.user.uid,
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
    e.preventDefault();
    const { item } = this.props;
    const timestamp = moment().valueOf().toString();
    let myComment = this.state.commentInput;
    let myusername = this.state.currentUsername;
    let myuserId = this.user.uid;

    if (myComment != "") {
      firebase
        .firestore()
        .collection("comments")
        .doc(item.postId)
        .collection("userComments")
        .doc(timestamp)
        .set({
          commentId: timestamp,
          username: myusername,
          userId: myuserId,
          comment: myComment,
          timestamp: timestamp,
        })
        .then(() => {
          this.setState({ commentInput: "" });

          this.getCommentData();
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // if (myComment != "") {
    //   firebase
    //     .firestore()
    //     .collection("comments")
    //     .doc(item.postId)
    //     .collection("userComments")
    //     .add({})
    //     .then((comment) => {
    //       firebase
    //         .firestore()
    //         .collection("comments")
    //         .doc(item.postId)
    //         .collection("userComments")
    //         .doc(comment.id)
    //         .set({
    //           commentId: comment.id,
    //           username: myusername,
    //           userId: myuserId,
    //           comment: myComment,
    //           timestamp: timestamp
    //         })
    //         .then(() => {
    //           this.setState({ commentInput: "" });

    //           this.getCommentData();
    //         });
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }
  };

  getCommentData() {
    let commArray = [];
    const { item } = this.props;
    // this.firestorePostRef.doc(this.state.userId).collection("userPosts").doc(this.props.item.postId).collection("comments").
    //POST K hisab sa lao
    firebase
      .firestore()
      .collection("comments")
      .doc(item.postId)
      .collection("userComments")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let article = {
            commentData: doc.data(),
            postId: item.postId,
          };

          commArray.push(article);

          // console.log(doc.data()+commArray);
        });
        this.setState({ commentsArray: commArray });
        // console.log(this.state.commentsArray)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  renderAvatar() {
    const { item } = this.props;

    // if (!item.avatar) return null;
    return (
      <Link to="/friend">
        <img
          style={{
            width: "55px",
            height: "55px",
            display: "block",
            objectFit: "cover",
          }}
          className="rounded-circle img-responsive"
          // className="avatar"
          src={item.avatar}
        />
      </Link>
    );
  }

  togglePage = () => {
    // document.body.style.color = "red";
    // const frndId = this.state.userId;
    const { item } = this.props;
    // if (!this.state.ifLiked) {
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
    // this.setState({
    //   [e.target.id]: e.target.value
    // });
    this.setState({ commentInput: e.target.value });
    this.setState({ username: this.getCurrentUsername() });
  };

  // commentFunc = () => (
  //   <>
  //     {/* <Button   color="outline-info"
  //           size="sm"
  //           className="mr-4"
  //          id="toggler" style={{ marginBottom: '1rem' }}>
  //       Comment
  //     </Button> */}
  //     <UncontrolledCollapse toggler="#toggler">
  //       <Card>
  //         <Input
  //           // className="form-control-alternative"
  //           // defaultValue=""
  //           id="commentInput"
  //           placeholder="Add a comment!"
  //           type="text"
  //           onChange={this.handleChange}
  //           // onChange={word => this.setState({commentInput: word})}
  //           value={this.state.commentInput}
  //         />
  //         <Button type="submit" onClick={this.postComment}>
  //           Comment
  //         </Button>
  //       </Card>
  //     </UncontrolledCollapse>
  //   </>
  // );

  //   renderComments = () =>{

  //     // const {navigation} = this.props;
  //     {this.state.commentsArray.map((comment, postindex) => (
  //       <CommentItem item={comment} key={postindex} />

  //     ))}

  //     if(this.state.commentsArray.length){
  //       console.log(this.state.commentsArray);

  //     return (
  //       <div>

  // {this.state.commentsArray.map((comment, postindex) => (
  //                   <CommentItem item={comment} key={postindex} />

  //                 ))}

  //         {/* <FlatList
  //         data={this.state.commentsArray}
  //         renderItem={({ item}) => (
  //           <CommentItem
  //             updateComments={this.getCommentData}
  //             comment = {item}
  //             postId = {this.props.item.postId}
  //             userId = {this.state.userId}
  //             // navigation = {navigation}
  //             />
  //             )}
  //             keyExtractor={item => item.commentId}
  //         /> */}
  //       </div>

  //     )
  //   }
  //   }

  returnPostId() {
    const { item } = this.props;
    return item.postId;
  }

  onHover = () => {
    localStorage.setItem("Fuid", JSON.stringify(this.state.userId));
  };

  mOver = () => {
    const { item } = this.props;

    var geocoder = new google.maps.Geocoder();

    // var latlng = {lat: this.state.locLat, lng: this.state.locLng};
    var latlng = {
      lat: parseFloat(item.location.lat),
      lng: parseFloat(item.location.lng),
    };
    geocoder.geocode({ location: latlng }, function (results, status) {
      if (status === "OK") {
        if (results[0]) {
          // console.log(results[0].formatted_address);
          // this.state.locLatLng=results[0].formatted_address;
          item.locLatLng = results[0].formatted_address;
          console.log(item.locLatLng);
          // this.setState({ locLatLng:results[0].formatted_address });
          // map.setZoom(11);
          // var marker = new google.maps.Marker({
          //   position: latlng,
          //   map: map
          // });
          // infowindow.setContent(results[0].formatted_address);
          // infowindow.open(map, marker);
        } else {
          console.log("No address found");
        }
      }
    });
    return;
  };

  render() {
    const { item } = this.props;
    return (
      <div
        className="card  shadow"
        style={{
          zoom: "80%",
          //   , backgroundColor: '#333', borderColor: '#333'
        }}
        //   fluid body inverse
      >
        <div className="card-body" style={{ backgroundColor: "#F7F7F7" }}>
          <p className="mb-4">{item.caption}</p>

          <FadeIn transitionDuration={2100} delay={80}>
            <img
              loading="lazy"
              onLoad={console.log("Fully loaded")}
              onError={console.log("Error on image")}
              alt="Image placeholder"
              src={item.image}
              className="img-fluid rounded"
              style={{
                width: "inherit",
              }}
            />
          </FadeIn>

          <div className="row align-items-center my-3 pb-3 border-bottom">
            <div className="col-sm-12">
              <div className="icon-actions">
                {this.state.ifLiked === true ? (
                  <Favorite color="error" onClick={this.toggleLike} />
                ) : (
                  <FavoriteBorder color="secondary" onClick={this.toggleLike} />
                )}

                <span className="text-muted">
                  {" "}
                  {" " + this.state.likes}
                  {" likes "}
                </span>

                <Comment color="primary" />

                <span className="text-muted">
                  {/* d-none d-lg-block */}{" "}
                  {" " + this.state.commentsArray.length}
                  {" comments"}
                </span>
              </div>
            </div>
          </div>

          {/* <!-- Comments --> */}
          <div className="mb-1">
            {this.state.commentsArray.map((comment, postindex) => (
              <CommentItem item={comment} key={postindex} />
            ))}

            <div className="media align-items-center mt-1">
              <img
                style={{
                  width: "44px",
                  height: "44px",
                  display: "block",
                  objectFit: "cover",
                }}
                className="rounded  img-responsive"
                src={this.state.profilePic}
              />
              <div className="media-body">
                <Form id="formComment" role="form" onSubmit={this.postComment}>
                  <Input
                    className="form-control"
                    id="commentInput"
                    placeholder="Write your comment"
                    onChange={this.handleChange}
                    value={this.state.commentInput}
                    rows="1"
                  ></Input>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PostPicOnly;

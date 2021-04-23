import React from "react";
import * as firebase from "firebase";
import moment from "moment";

import "../assets/css/comments.css";
import "../assets/css/img-hover.css";

import { Link } from "react-router-dom";

import {
  Card,
  Col,
  UncontrolledTooltip,
  UncontrolledPopover,
  Modal,
  PopoverBody,
  Button,
  PopoverHeader,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Badge,
  Media,
} from "reactstrap";
import { Alert } from "reactstrap";
import Snackbar from "@material-ui/core/Snackbar";

import { DeleteOutline } from "@material-ui/icons";
import ModalFooter from "reactstrap/lib/ModalFooter";
import ModalHeader from "reactstrap/lib/ModalHeader";

class CommentItem extends React.Component {
  ismounted = false;
  state = {
    currentUserId: JSON.parse(localStorage.getItem("uid")),
    username: "",
    profilePic: require("assets/img/icons/user/user1.png"),

    // "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg",
    commentDeleted: false,
  };

  // componentWillMount = () => {
  //   this.ismounted = false;
  //   // this.getProfilePic();
  // };

  // componentWillUnmount = () => {
  //   this.ismounted = false;
  //   clearInterval(this.getUserId());
  // };

  componentDidMount = () => {
    // this.ismounted = true;
    // this.getProfilePic();
    this.getUserId();
  };

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };

  //   componentDidUpdate(prevProps, prevState) {
  //     this.ismounted = true;
  //     const { item } = this.props;

  //       if (prevState.commentDeleted !== this.state.commentDeleted) {
  //         this.getUserId();

  //   }
  // }

  // getProfilePic = (friendId) => {
  //   const { item } = this.props;

  //   const firebaseProfilePic = firebase
  //     .storage()
  //     .ref()
  //     .child("profilePics/(" + item.commentData.userId + ")ProfilePic");
  //   firebaseProfilePic
  //     .getDownloadURL()
  //     .then((url) => {
  //       this.setState({ profilePic: url });
  //     })
  //     .catch((error) => {
  //       console.log("No picture found for: " + item.commentData.userId);
  //     });
  // };

  getUserId = async () => {
    const { item } = this.props;
    await firebase
      .firestore()
      .collection("users")
      .doc(item.commentData.userId)
      .get()
      .then((doc) => {
        const res = doc.data();

        if (res != null) {
          this.setState({
            username: res.username,
            profilePic: res.profilePic ? res.profilePic : this.state.profilePic,
          });
        }
      });
  };

  deleteComment = () => {
    const { item } = this.props;

    // if (item.userId == this.state.currentUserId) {
    // console.log(item);
    firebase
      .firestore()
      .collection("posts")
      .doc(item.authorId)
      .collection("userPosts")
      .doc(item.postId)
      .collection("comments")
      .doc(item.commentData.timestamp)
      // .doc(item.commentData.commentId)
      .delete()
      //  &&
      // firebase
      // .firestore()
      // .collection("notifications")
      // .doc(item.userId)
      // .collection("userNotifications")
      // .doc(item.commentData.timestamp)
      // .delete()
      .then(() => {
        // &&
        firebase
          .firestore()
          .collection("notifications")
          .doc(item.authorId)
          .collection("userNotifications")
          .doc(item.commentData.timestamp)
          .delete();
        console.log("Comment Deleted!");
        this.setState({ commentDeleted: true });
        this.toggleModal("deleteConfirmation");

        this.onTrigger();
      })
      .catch((err) => {
        alert(err);
      });

    // }
  };

  onDismiss = () => {
    this.setState({ commentDeleted: false });
  };

  onTrigger = () => {
    this.props.parentCallback("deleted");
    // event.preventDefault();
  };

  render() {
    const { item } = this.props;
    return (
      <div className="media-list" key={item.timestamp}>
        <div
          className="media media-comment"
          key={item.timestamp}
          style={{
            paddingBottom: "4px",
            // borderBottom: "0.0625rem solid #e9ecef",
            // paddingTop: "12px",
            // justifyContent: "flex-end",
            // filter:"drop-shadow(1px 3px 5px black)"
          }}
        >
          <Link to={`/friend/${item.commentData.userId}`}>
            <img
              alt="Image placeholder"
              className="media-comment-avatar avatar rounded-circle"
              style={{
                // width: "200px",
                // height: "200px",
                display: "block",
                objectFit: "cover",
                marginLeft: "5px",
              }}
              // src={this.state.profilePic}
              // className="rounded-circle img-responsive"

              src={this.state.profilePic}
            />
          </Link>
          {/* <div
            //  className="media-body"
            style={{
              padding: "12px",
              borderRadius: "20px",
              background: "lavender",
              margin: "5px",
            }}
          >
            <div className="media-comment-text">
              <h5>
                {this.state.username}
              </h5>

              <p>
                <span
                  className="textarea"
                  role="textbox"
                  style={{
                    //  WebkitTextStroke:'medium',
                    overflowWrap: "anywhere",
                  }}
                >
                  {item.commentData.comment}
                </span>
              </p>

         
            </div>
          </div> */}

          <div
            className="result_comment shadow
          "
            // col-md-11
            style={{
              padding: "12px",
              borderRadius: "20px",
              background: "lavender",
              margin: "5px",

              // display:"flex-inline"
            }}
          >
            <h6 style={{ color: "#4657b7" }}> {this.state.username}</h6>
            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: "400",
                lineHeight: "1.4",
              }}
            >
              {item.commentData.comment}
            </div>

            <span style={{ fontSize: "9px", fontStyle: "oblique" }}>
              {moment(Number(item.commentData.timestamp)).fromNow()}
            </span>

            {item.commentData.userId == this.state.currentUserId ? (
              <>
                <span
                  aria-hidden="true"
                  style={{
                    verticalAlign: "middle",
                    // ,color: "red"
                  }}
                  // className="delete"
                >
                  {" "}
                  ·{" "}
                </span>

                <span
                  // className="tools_comment delete-overlay"
                  className="delete"
                  // href="#"
                  // style={{ color: "red" }}

                  // onClick={this.deleteComment}
                  onClick={() => this.toggleModal("deleteConfirmation")}
                  style={{ fontSize: "9px", fontStyle: "oblique" }}
                >
                  delete
                </span>

                {/* <span aria-hidden="true"style={{color:"red"}} className="delete"> · </span> */}
              </>
            ) : null}
            {/* <span
              style={{ fontSize: "8px", fontStyle: "oblique" }}
              aria-hidden="true"
            >
              {" "}
              ·{" "}
            </span> */}
            {/* <div className="tools_comment delete-overlay">
              <a className="like" href="#">Like</a>
												<span aria-hidden="true"> · </span>
												<a className="replay" href="#">Reply</a>
												<span aria-hidden="true"> · </span>
												<i className="fa fa-thumbs-o-up"></i> <span className="count">1</span> 
              <span>
                {moment(Number(item.commentData.timestamp)).fromNow()}
              </span>
              <span aria-hidden="true"> · </span>

              
            </div> */}

            {this.state.commentDeleted ? (
              <>
                <Snackbar
                  open={this.state.commentDeleted}
                  autoHideDuration={2000}
                  onClose={this.onDismiss}
                  message="Comment deleted!"
                  // style={{ width: "100%" }}
                >
                  {/* <Alert severity="error"
                                // autoHideDuration={1000}

                >
                  
                  Comment deleted!
                </Alert> */}
                </Snackbar>
              </>
            ) : null}
          </div>
        </div>
        <Modal
          size="sm"
          isOpen={this.state.deleteConfirmation}
          modalClassName="modal-light"
          toggle={() => this.toggleModal("deleteConfirmation")}
          // className="fluid"
          //  backdrop={false}
          // fade={false}
          style={{
            // zoom:"70%",
            // width:"260px",
            height: "112px",
            borderRadius: "12px",
            // placeItems:"center",
            top: "35%",
            textAlignLast: "center",
          }}
        >
          {/* <h6>

       Are you sure?
</h6> */}

          {/* <ModalHeader>Modal title</ModalHeader> */}
          <div style={{ padding: "12px", paddingBottom: "0px" }}>
            <h6>Are you sure?</h6>
          </div>
          {/* <span>
  <Button
   className="float-right"
   color="danger
"
   size="sm"
  >
    Delete
  </Button>
  <Button
     className="float-right"
     color="primary
  "
     size="sm"
  
  onClick={() => this.toggleModal("deleteConfirmation")}
  >
    Cancel
  </Button>
</span> */}
          <ModalFooter style={{ justifyContent: "center" }}>
            <Button color="danger" size="sm" onClick={this.deleteComment}>
              Delete
            </Button>{" "}
            <Button
              color="secondary"
              size="sm"
              onClick={() => this.toggleModal("deleteConfirmation")}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default CommentItem;

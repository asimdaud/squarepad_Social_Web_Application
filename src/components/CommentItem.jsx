import React from "react";
import * as firebase from "firebase";
import {
  Card,
  Col,
  UncontrolledTooltip,
  UncontrolledPopover,
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
import { DeleteOutline } from "@material-ui/icons";

class CommentItem extends React.Component {
  ismounted = false;
  state = {
    currentUserId: JSON.parse(localStorage.getItem("uid")),
    username: "",
    profilePic: require("assets/img/icons/user/user1.png"),

    // "https://image.shutterstock.com/image-vector/vector-man-profile-icon-avatar-260nw-1473553328.jpg",
    commentDeleted: false,
  };

  componentWillMount = () => {
    this.ismounted = false;
    // this.getProfilePic();
  };

  componentWillUnmount = () => {
    this.ismounted = false;
    clearInterval(this.getUserId());
  };

  componentDidMount = () => {
    this.ismounted = true;
    // this.getProfilePic();
    this.getUserId();
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
      .onSnapshot((doc) => {
        const res = doc.data();

        if (res != null) {
          this.setState({
            username: res.username,
            profilePic: res.profilePic ? res.profilePic : this.state.profilePic,
          });
        }
      });
  };

  deleteComment = async () => {
    const { item } = this.props;

    // if (item.userId == this.state.currentUserId) {

    await firebase
      .firestore()
      .collection("posts")
      .doc(item.commentData.userId)
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
        .delete()
        console.log("Comment Deleted!");
        this.setState({ commentDeleted: true });
        // console.log(item)
      })
      .catch((err) => {
        alert(err);
      });

    // }
  };
  render() {
    const { item } = this.props;
    return (
      <div className="media-list" key={item.timestamp}>
        <div className="media media-comment" key={item.timestamp}>
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
          <div
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
                {/* <Badge color="secondary"> */}
                {this.state.username}
                {/* </Badge> */}
              </h5>

              <p>
                <span
                  className="textarea"
                  role="textbox"
                  style={{
                    //  WebkitTextStroke:'medium',
                    overflowWrap: "anywhere",
                  }}
                  // contentEditable
                >
                  {item.commentData.comment}
                </span>
              </p>

              {/* <p
                className="text-sm lh-160"
            //     style={{resize:'vertical',
            //   overflowX:'hidden',
            // textOverflow:''}}
                >
                {item.commentData.comment}
              </p> */}
            </div>
          </div>
          {item.commentData.userId == this.state.currentUserId ? (
            <UncontrolledDropdown style={{ alignSelf: "center" }}>
              <DropdownToggle nav className="nav-link-icon">
                <DeleteOutline
                  // style={{ flex: "1", border: "dashed" }}
                  onClick={this.deleteComment}
                  fontSize="small"
                />

                {/* <i className="ni ni-settings-gear-65" /> */}
              </DropdownToggle>
              {/* <DropdownMenu aria-labelledby="navbar-success_dropdown_1" right>
            <DropdownItem onClick={this.deleteComment}>
            <DeleteOutline style={{flex:"1", border:"dashed"}} onClick={this.deleteComment} fontSize="small" />
              Location
            </DropdownItem>
          </DropdownMenu> */}
            </UncontrolledDropdown>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default CommentItem;

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
  };

  componentDidMount = () => {
    this.ismounted = true;
    this.getProfilePic();
    this.getUserId();
  };

  getProfilePic = (friendId) => {
    const { item } = this.props;

    const firebaseProfilePic = firebase
      .storage()
      .ref()
      .child("profilePics/(" + item.commentData.userId + ")ProfilePic");
    firebaseProfilePic
      .getDownloadURL()
      .then((url) => {
        this.setState({ profilePic: url });
      })
      .catch((error) => {
        console.log("No picture found for: " + item.commentData.userId);
      });
  };

  getUserId = () => {
    const { item } = this.props;
    firebase
      .firestore()
      .collection("users")
      .doc(item.commentData.userId)
      .onSnapshot((doc) => {
        const res = doc.data();

        if (res != null) {
          this.setState({
            username: res.username,
          });
        }
      });
  };

  deleteComment = async () => {
    const { item } = this.props;

    // if (item.userId == this.state.currentUserId) {
    await firebase
      .firestore()
      .collection("comments")
      .doc(item.postId)
      .collection("userComments")
      .doc(item.commentData.timestamp)
      // .doc(item.commentData.commentId)
      .delete()
      .then(() => {
        console.log("Comment Deleted!");
        this.setState({ commentDeleted: true });
      })
      .catch((err) => {
        alert(err);
      });

    // }
  };
  render() {
    const { item } = this.props;
    return (
      <div className="media-list">
        <div className="media media-comment">
          <img
            alt="Image placeholder"
            className="media-comment-avatar avatar rounded-circle"
            style={{
              // width: "200px",
              // height: "200px",
              display: "block",
              objectFit: "cover",
            }}
            // src={this.state.profilePic}
            // className="rounded-circle img-responsive"

            src={this.state.profilePic}
          />
          <div className="media-body">
            <div className="media-comment-text">
              <h4>
                <Badge color="secondary">{this.state.username}</Badge>
              </h4>

              <p>
               <span class="textarea" role="textbox" style={{WebkitTextStroke:'medium', overflowWrap:'anywhere'}} contenteditable>             
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
            <DeleteOutline onClick={this.deleteComment} fontSize="small" />
          ) : (
            ""
          )}

          {/* <UncontrolledDropdown>
            <DropdownToggle nav className="nav-link-icon">
              <i className="ni ni-settings-gear-65" />
            </DropdownToggle>
            <DropdownMenu aria-labelledby="navbar-success_dropdown_1" right>
              <DropdownItem onClick={this.deleteComment}>
                <i className="ni ni-fat-remove" />
                Location
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown> */}
        </div>
      </div>
    );
  }
}

export default CommentItem;

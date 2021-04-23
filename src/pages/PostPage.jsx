import React from "react";
import moment from "moment";

import Loader from "react-loader-advanced";
import LoaderSpinner from "react-loader-spinner";
import FadeIn from "react-fade-in";
// reactstrap components
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Modal,
  Badge,
  DropdownMenu,
  Spinner,
  DropdownItem,
  DropdownToggle,
  ButtonDropdown,
} from "reactstrap";
// import HttpsOutlinedIcon from '@material-ui/icons/HttpsOutlined';
// core components
// import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import SimpleFooter from "components/Footers/SimpleFooter.jsx";

// import UserHeader from "components/Headers/UserHeader.jsx";
import { isUserSignedIn } from "../services/authServices";

import * as firebase from "firebase";
// import PostModal from "components/Modal/postModal";
import Post from "../components/post";
import { Redirect, Link } from "react-router-dom";

import UserNavbar from "components/Navbars/UserNavbar";
import { withTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { updateAwait } from "typescript";
// import Post from "../components/post";

class PostPage extends React.Component {
  firestoreUsersRef = firebase.firestore().collection("users");
  firestorePostRef = firebase.firestore().collection("posts");
  user = firebase.auth().currentUser;

  constructor(props) {
    super(props);

    this.state = {
      currentUserUid: JSON.parse(localStorage.getItem("uid")),
      userData: {},
      postId: this.props.match.params.pId ? this.props.match.params.pId : "",
      postData: {},
      showPost: false,
    };
  }

  UNSAFE_componentWillMount = () => {
    this.setState({ postId: this.props.match.params.pId });
    // this.getPost();
  };

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;

    this.setState({ postId: this.props.match.params.pId });
    this.getPost();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.pId !== this.props.match.params.pId) {
      // this.setState({ loaderAdv: true });

      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.main.scrollTop = 0;

      this.setState({ postId: this.props.match.params.pId });
      this.getPost();
      this.showPost();
    }
  }

  getPost = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(this.state.currentUserUid)
      .get()
      .then((doc) => {
        const res = doc.data();

        this.setState({
          userData: res,
        });
      });
    this.firestorePostRef
      .doc(this.state.currentUserUid)
      .collection("userPosts")
      .doc(this.state.postId)
      .get()
      .then((doc) => {
        let article = {
          username: this.state.userData.username,
          userId: this.state.currentUserUid,
          title: "post",
          profilePic: this.state.userData.profilePic,
          caption: doc.data().caption,
          postId: doc.data().postId,
          timeStamp: doc.data().time,
          type: doc.data().type ? doc.data().type : null,
          video: doc.data().video ? doc.data().video : null,
          image: doc.data().image,
        };

        this.setState({ postData: article, showPost: true });
      });
  };

  showPost = () => {
    return <Post item={this.state.postData} key={this.state.currentUserUid} />;
  };

  render() {
    const { t } = this.props;
    return (
      <>
        {/* <UserNavbar /> */}
        <main
          className="profile-page"
          ref="main"
          // style={{
          //   // backgroundColor:"black",
          //   height:"100%",
          //   backgroundImage:
          //     "radial-gradient(circle, #e4efe9, #c4e0dd, #a7cfd9, #94bcd6, #93a5cf)",
          // }}
          style={{
            // backgroundColor:"black",
            paddingTop: "2rem",
            // overflow: "auto",
            width: "-webkit-fill-available",
            display: "table",
            position: "absolute",
            height: "-webkit-fill-available",
            backgroundImage:
              "radial-gradient(circle, #e4efe9, #c4e0dd, #a7cfd9, #94bcd6, #93a5cf)",
          }}
        >
          <section
            className="section section-blog-info"
            style={{ marginTop: "30px" }}
          >
            <Container>
              <>
                <FadeIn transitionDuration={1100} delay={80}>
                  {this.state.showPost ? (
                    <Row className="justify-content-center">
                      <Col
                        sm="6"
                        md="6"
                        lg="6"
                        className="order-md-2"
                        style={{ zoom: "70%", padding: "20px" }}
                      >
                        {this.showPost()}
                      </Col>
                    </Row>
                  ) : (
                    ""
                  )}
                </FadeIn>
              </>
            </Container>
          </section>
          <SimpleFooter />
        </main>
      </>
    );
  }
}

export default withTranslation()(PostPage);

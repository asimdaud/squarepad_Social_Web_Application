import React from "react";
import moment from "moment";

import AdSense from "react-adsense";
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
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Badge,
  UncontrolledAlert,
} from "reactstrap";
import SmoothImage from "react-smooth-image";
// core components
import SimpleFooter from "components/Footers/SimpleFooter.jsx";
import * as firebase from "firebase";
import { Redirect, Link } from "react-router-dom";
import UserNavbar from "components/Navbars/UserNavbar";
import GoogleAd from "components/GoogleAd.jsx";

class Group extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user3: JSON.parse(localStorage.getItem("uid")),
    };
  }

  render() {
    return (
      <>
        <UserNavbar />
        <main
          className="profile-page"
          ref="main"
          // style={{
          //   backgroundImage:
          //     "linear-gradient(to right, #e4efe9, #d9ede8, #cfeae9, #c6e6ed, #c0e2f1, #bcdef2, #badaf3, #bad5f4, #b7d1f2, #b5ccf1, #b3c8ef, #b1c3ed)",
          // }}
        >
          <section
            className="section section-blog-info"
            style={{ marginTop: "160px" }}
          >
            <Container>
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
              </div>{" "}
              <GoogleAd slot="1742211567" classNames="page-top" />
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

            <AdSense.Google
              client="ca-pub-3206659815873877"
              slot="6411675194"
              style={{ display: "block" }}
              format="auto"
              responsive="true"
              // layout="display:block"
              // layoutKey='-gw-1+2a-9x+5c'
            />
          </section>
          <SimpleFooter />
        </main>
      </>
    );
  }
}

export default Group;

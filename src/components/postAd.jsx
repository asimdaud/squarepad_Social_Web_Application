/*global google*/

import React from "react";
import moment from "moment";
import { Favorite, FavoriteBorder, Comment } from "@material-ui/icons";
import SmoothImage from "react-smooth-image";
import { withTranslation } from "react-i18next";

// reactstrap components
import {
  // UncontrolledCollapse,
  // NavbarBrand,
  // Navbar,
  // NavItem,
  // NavLink,
  // Nav,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
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

class PostAd extends React.Component {
  state = {
    user: firebase.auth().currentUser,
    userId: this.props.item.userId,
    profilePic: require("assets/img/icons/user/user1.png"),
    defaultModal: false,
    modalItem: "",
  };

  componentDidMount = () => {
    const { item } = this.props;
  };

  toggleModal = (state) => {
    this.setState({
      [state]: !this.state[state],
    });
  };

  deleteAd = (x) => {
    firebase
      .firestore()
      .collection("customAd")
      .doc(x)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  };

  activate = (adId) => {
    const itemAd = {
      active: true,
    };
    firebase
      .firestore()
      .collection("customAd")
      .doc(adId)
      .update(itemAd)
      .then(() => {
        console.log("activated");
      })
      .catch((err) => {
        alert(err.toString());
      });
  };

  deactivate = (adId) => {
    const itemAd = {
      active: false,
    };
    firebase
      .firestore()
      .collection("customAd")
      .doc(adId)
      .update(itemAd)
      .then(() => {
        console.log("Deactivated");
      })
      .catch((err) => {
        alert(err.toString());
      });
  };

  render() {
    const { t } = this.props;
    const { item } = this.props;
    return (
      <>
        <div style={{ borderRadius: "20px", marginBottom: "25px" }}>
          <div
            className="shadow"
            style={{
              //   borderTopLeftRadius: "50px",
              //   borderTopRightRadius: "50px",
              borderRadius: "50px",
            }}
          >
            <div
              className="card-header d-flex align-items-center "
              style={{
                borderTopLeftRadius: "50px",
                borderTopRightRadius: "50px",
              }}
            >
              <div className="d-flex align-items-center">
                <div className="mx-3">
                  <h6 className="mb-0 text-black font-weight-bold">
                    {/* {item.username}{" "} */}
                    {item.title}
                  </h6>

                  <small className="text-muted">
                    {/* {"     @"} {item.username} */}
                    {/* {moment(Number(item.timeStamp)).format("dddd")} */}
                    {/* {moment(Number(item.timeStamp)).format("ll")} */}
                  </small>
                  <small className="opacity-60">
                    <small className="d-block text-muted">
                      {"on "}
                      {moment(Number(item.timestamp)).format("lll")}
                      {/* {item.timeStamp} */}
                    </small>
                  </small>
                </div>
              </div>
              {/* <div className="col-md-1 col-3"> */}
              <div className="text-right ml-auto" style={{ color: "black" }}>
                <UncontrolledDropdown nav>
                  <DropdownToggle nav className="nav-link-icon">
                    <i className="ni ni-settings-gear-65" />
                  </DropdownToggle>
                  <DropdownMenu
                    aria-labelledby="navbar-success_dropdown_1"
                    right
                  >
                    <DropdownItem onClick={() => this.deleteAd(item.adId)}>
                      {/* <i className="ni ni-single-02"></i> */}
                      {t("Delete this Ad")}
                    </DropdownItem>

                    {item.active ? (
                      <DropdownItem onClick={() => this.deactivate(item.adId)}>
                        {t("Take this ad down")}
                      </DropdownItem>
                    ) : (
                      <DropdownItem onClick={() => this.activate(item.adId)}>
                        {t("Make this ad live")}
                      </DropdownItem>
                    )}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </div>

            <div
              // className="mb-0 text-black font-weight-bold"
              className="justify-content-between align-items-center"
              style={{
                // backgroundColor: "#F7F7F7",
                borderBottomLeftRadius: "50px",
                borderBottomRightRadius: "50px",

                backgroundColor: "rgba(var(--b3f,250,250,250),1)",
                //  MozBorderRadiusBottomleft:"20px",MozBorderRadiusBottomright:"20px"
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
              <img
                alt="Image placeholder"
                src={item.image}
                className="img-fluid rounded"
                style={{
                  width: "100%",
                  height: "620px",
                  display: "block",
                  objectFit: "cover",
                  zoom: "90%",
                }}
              />
              <div
                //      className="row align-items-center  "

                className="justify-content-between align-items-center"
              >
                <a href={item.link}>
                  <p
                    style={{
                      fontSize: "20px",
                      padding: "20px",
                      fontStyle: "bold",
                    }}
                  >
                    Visit Ad
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default withTranslation()(PostAd);

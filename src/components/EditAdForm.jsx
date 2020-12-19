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
  FormGroup,
  Form,
  InputGroupAddon,
  InputGroupText,
  InputGroup,  Container,
  UncontrolledCollapse,
  Collapse,
  Modal,
} from "reactstrap";
import * as firebase from "firebase";
// import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import CommentItem from "./CommentItem";

class EditAdForm extends React.Component {
  state = {
    title: "",
    caption: "",
    image: "",
    link: "",
    adId: "",
    timestamp: "",
    active: "",
  };


  componentDidMount = () => {
    const { item } = this.props;
    this.setState({

        title: item.title,
        caption: item.caption,
        image: item.image,
        link: item.link,
        adId: item.adId,
        timestamp: item.timestamp,
        active: item.active,        
    })
  };


  editAnAdd = (ad) => {
      const {item } = this.props;
    const timestamp = moment().valueOf().toString();

    const itemAd = {
      //   avatar: this.state.profilePic,
      //   userId: this.state.user,
      //   username: this.state.username,
      adId: item.adId,
      title: this.state.title,
      caption: this.state.caption,
      image: this.state.image,
      timestamp: timestamp,
      link: this.state.link,
      active: this.state.active,
    };

    firebase
      .firestore()
      .collection("customAd")
      .doc(item.adId)
      .update(itemAd)
      .then(() => {
        // this.setState({ editModal: false });
        // console.log("updated")
        console.log("i[dated",itemAd)
      })
      .catch((err) => {
        alert(err.toString());
      });
  };

  handleChangeData = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  //   componentDidUpdate(prevProps, prevState) {}

  toggleChangeAlert = (e) => {
    this.setState({
      [e]: !this.state[e],
      //   allAdsCheck: !this.state.allAdsCheck, // flip boolean value
    });
  };

  handleEdit = (e) => {
      const {item } = this.props;
    e.preventDefault();
    const { caption, image, link } = item;
    if (caption == "" || image == "" || link == "") {
      alert("Please fill in the fields");
    } else {
      console.log(item);
      // console.log(this.state)
      console.log(this.state);
      this.editAnAdd(item);
    }
  };

  render() {
    const { t } = this.props;
    const { item } = this.props;
    return (
      <>


        <Form role="form" onSubmit={this.handleEdit}>
          <FormGroup>
            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                Title
                  {/* <i className="ni ni-hat-3" /> */}
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder={item.title}
                type="text"
                id="title"
                onChange={this.handleChangeData}
              />
            </InputGroup>

            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                Caption
                  {/* <i className="ni ni-hat-3" /> */}
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder={item.caption}
                type="text"
                id="caption"
                onChange={this.handleChangeData}
              />
            </InputGroup>

            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                Image link
                  {/* <i className="ni ni-hat-3" /> */}
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder={item.image}
                type="text"
                id="image"
                onChange={this.handleChangeData}
              />
            </InputGroup>

            <InputGroup className="input-group-alternative mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                Website
                  {/* <i className="ni ni-hat-3" /> */}
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder={item.link}
                type="text"
                id="link"
                onChange={this.handleChangeData}
              />
            </InputGroup>

            <div className="custom-control custom-checkbox mb-3">
              <input
                className="custom-control-input"
                id="active"
                type="checkbox"
                checked={this.state.active}
                onChange={() => this.toggleChangeAlert("active")}
                        
              />
              <label className="custom-control-label" htmlFor="active">
                <p className="description">{t("Active ad")}</p>
              </label>
            </div>
          </FormGroup>
          <div className="text-center">
            <Button
              className="mt-4"
              color="primary"
              type="submit"
              onClick={this.handleEdit}
            >
              {t("Update Ad")}
            </Button>
          </div>
        </Form>
      </>
    );
  }
}
export default withTranslation()(EditAdForm);

import React from "react";
import { Link } from "react-router-dom";
// JavaScript plugin that hides or shows a component based on your scroll
import Headroom from "headroom.js";
// reactstrap components
import {
  // Button,
  UncontrolledCollapse,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  // Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  // TabContent,
  // TabPane,
  // UncontrolledTooltip,
  // Card,
  // CardBody,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormGroup,
  Label,
} from "reactstrap";
import { withTranslation } from "react-i18next";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

class UserNavbar extends React.Component {
  state = {
    value: localStorage.getItem("lang"),
  };

  handleChange = (event) => {
    console.log("selected val is ", event.target.value);
    let newlang = event.target.value;
    this.setState((prevState) => ({ value: newlang }));
    localStorage.setItem("lang", JSON.stringify(newlang));
    console.log("state value is", newlang, this.props.i18n.changeLanguage);
    this.props.i18n.changeLanguage(newlang);
  };

  componentDidMount() {
    localStorage.setItem("lang", "en");

    this.props.i18n.changeLanguage(this.state.value);
    let headroom = new Headroom(document.getElementById("navbar-main"));
    // initialise
    headroom.init();
  }
  render() {
    const { t } = this.props;
    return (
      <>
        <header className="header-global">
          <Navbar
            className="navbar-main navbar-transparent navbar-light headroom"
            expand="lg"
            id="navbar-main"
          >
            <Container>
              <NavbarBrand className="mr-lg-5" to="/timeline" tag={Link}>
                <img alt="..." src={require("assets/img/brand/logo.png")} />
              </NavbarBrand>
              <button className="navbar-toggler" id="navbar_global">
                <span className="navbar-toggler-icon" />
              </button>
              <UncontrolledCollapse navbar toggler="#navbar_global">
                <div className="navbar-collapse-header">
                  <Row>
                    <Col className="collapse-brand" xs="6">
                      <Link to="/">
                        <img
                          alt="..."
                          src={require("assets/img/brand/logo.png")}
                        />
                      </Link>
                    </Col>
                    <Col className="collapse-close" xs="6">
                      <button className="navbar-toggler" id="navbar_global">
                        <span />
                        <span />
                      </button>
                    </Col>
                  </Row>
                </div>

                <Nav
                  className="navbar-nav-hover align-items-lg-center ml-lg-auto"
                  navbar
                >
                  <NavItem className="nav-link-icon">
                    <NavLink to="/register" tag={Link}>
                      <i className="ni ni-world" />
                      <span className="nav-link-inner--text">
                        {t("Register")}
                      </span>
                    </NavLink>
                  </NavItem>

                  <NavItem className="nav-link-icon">
                    <NavLink to="/login" tag={Link}>
                      <i className="ni ni-circle-08" />
                      <span className="nav-link-inner--text">{t("Login")}</span>
                    </NavLink>
                  </NavItem>

                  <NavItem className="nav-link-icon" style={{ color: "white" }}>
                    {/* <i className="ni ni-circle-08" /> */}
                    {/* <span className="nav-link-inner--text">Login</span> */}
                    <FormControl style={{ color: "white" }}>
                      {/* <InputLabel id="demo-simple-select-outlined-label" style={{color:"white"}}>Language</InputLabel> */}

                      <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-simple-open-select"
                        value={this.state.value}
                        onChange={this.handleChange}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        style={{ color: "white" }}
                      >
                        <MenuItem value="" disabled>
                          Language
                        </MenuItem>
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="esp">Spanish</MenuItem>
                        <MenuItem value="fre">French</MenuItem>
                        <MenuItem value="ger">German</MenuItem>
                        <MenuItem value="jap">Japanese</MenuItem>
                        
                      </Select>
                      {/* <FormHelperText>Placeholder</FormHelperText> */}
                    </FormControl>
                  </NavItem>
                </Nav>
              </UncontrolledCollapse>
            </Container>
          </Navbar>
        </header>
      </>
    );
  }
}

export default withTranslation()(UserNavbar);

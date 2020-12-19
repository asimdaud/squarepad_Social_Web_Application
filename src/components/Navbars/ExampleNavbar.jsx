import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Container,
} from "reactstrap";

const ExampleNavbar = (props) => {
  //   const [isOpen, setIsOpen] = useState(false);

  //   const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
       <Navbar
          className="navbar-main navbar-transparent navbar-light headroom"
          expand="lg"
          id="navbar-main"
          style={{
            padding: "0px",
            // borderBottom: "0.001rem solid black",
            // backgroundColor: "#f0f3f4",
          }}
        >
                <Container>

        <UncontrolledDropdown nav>
        <DropdownToggle
                    nav
                    className="nav-link-icon"
                    style={{ textShadow: "3px 2px 0px rgba(0, 0, 0, 0.23)" }}
                  >
                    <i className="fa fa-language" aria-hidden="true"></i>
                  </DropdownToggle>
          <DropdownMenu 
            aria-labelledby="navbar-success_dropdown_1"
            right
          >
              
            <DropdownItem>Option 1</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
          </Container>
      </Navbar>
    </div>
  );
};

export default ExampleNavbar;

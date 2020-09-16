import React from "react";
// reactstrap components
import {
  Button,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  FormControl,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";

class SimpleFooter extends React.Component {
  state = {
    value: "en",
  };

  handleChange = (event) => {
    console.log("selected val is ", event.target.value);
    let newlang = event.target.value;
    this.setState((prevState) => ({ value: newlang }));
    console.log("state value is", newlang, this.props.i18n.changeLanguage);
    this.props.i18n.changeLanguage(newlang);
  };
  render() {
    return (
      <>
        <Container>
          <div
            className="copyright"
            style={{
              backgroundColor: "transparent",
              color: "white",
              width: "100%",
              textShadow: "3px 2px 5px rgba(0, 5, 9, 1)",
              flexDirection: "row",
              // display: "flex",
            }}
          >
            © {new Date().getFullYear()}{" "}
            <Link
              to="/timeline"
              style={{ color: "white", justifyContent: "left" }}
            >
              Square Pad
            </Link>
            {/* <FormControl component="fieldset">
              <RadioGroup
                aria-label="Gender"
                name="gender1"
                // className={classes.group}
                style={{ flexDirection: "row" }}
                value={this.state.value}
                onChange={this.handleChange}
              >
                <FormControlLabel
                  value="en"
                  control={<Radio />}
                  label="English"
                />
                <FormControlLabel
                  value="jap"
                  control={<Radio />}
                  label="Japanese"
                />

                <FormControlLabel
                  value="esp"
                  control={<Radio />}
                  label="Spanish"
                />
                <FormControlLabel
                  value="fre"
                  control={<Radio />}
                  label="French"
                />
                <FormControlLabel
                  value="ger"
                  control={<Radio />}
                  label="German"
                />
              </RadioGroup>
            </FormControl> */}

          </div>
       
          <br />
        </Container>
      </>
    );
  }
}

export default withTranslation()(SimpleFooter);

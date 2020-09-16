/*global google*/
import React, {useEffect} from "react";
// reactstrap components
import {
  Button,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardLink,
  CardTitle,
  CardSubtitle,
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


class Ad extends React.Component {

  
//     constructor() {

//     super();
//     this.state = {
//       user: JSON.parse(localStorage.getItem("uid")),
//     };
//   }

  shouldComponentUpdate(nextProps) {
    return this.props.currentPath !== nextProps.currentPath;
  }

  componentDidUpdate() {
    // .push({})
    const { currentPath } = this.props;

    useEffect(() => {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    }, [currentPath]);


}

  render() {
    const { currentPath } = this.props;
    return (
      <div style={{ padding: "5px" }}>
        <Card
          // body inverse
          style={{
            backgroundColor: "#F2F2F2",
            borderColor: "#F2F2F2",
            borderBottomLeftRadius: "35px",
            borderBottomRightRadius: "35px",
          }}
        >
          <div key={currentPath}>
            <ins
              className="adsbygoogle"
              data-ad-client="ca-pub-3206659815873877"
              data-ad-slot="6411675194"
            //   format="auto"
            //   responsive="true"
              //   style="display:inline-block;width:728px;height:90px"
            />
          </div>
        </Card>
      </div>
    );
  }
}

export default Ad;

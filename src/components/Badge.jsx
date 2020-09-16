import React from "react";
import { Badge, Col } from "reactstrap";

class BadgeLabel extends React.Component {


    state={
data:"",
index:""
    };


    render() {
      const {item} = this.props;
    return (
      <>
          <Badge className="text-uppercase" color="primary" pill>
            {item}
          </Badge>
       
       
       </>
    );
  }
}

export default BadgeLabel;

import React, { useState, useEffect } from "react";
import moment from "moment";
import FadeIn from "react-fade-in";
import SmoothImage from "react-smooth-image";
import Loader from "react-loader-advanced";
import LoaderSpinner from "react-loader-spinner";
import { Carousel } from "react-responsive-carousel";
// reactstrap components
import {
  // UncontrolledCollapse,
  // NavbarBrand,
  // Navbar,
  // NavItem,
  // NavLink,
  // Nav,
  Button,
  Card,
  // CardHeader,
  CardBody,
  // FormGroup,
  Badge as Badged,
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

import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import PostAd from "../components/postAd.jsx";
import * as firebase from "firebase";

function TimelineShowAds() {
  const [activeAdsOnly, setActiveAdsOnly] = useState([{}]);

  //   const [activeAdsOnly, setActiveAdsOnly] =
  //   useState([
  //      { avatar: "", content: "", time: "", username: "" },
  //    ]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("customAd")
      .where("active", "==", true)
      //   .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        const cloudImages = [];
        snapshot.forEach((doc) => {
          let article = {
            title: doc.data().title,
            adId: doc.data().adId,
            caption: doc.data().caption,
            image: doc.data().image,
            timestamp: doc.data().timestamp,
            link: doc.data().link,
            active: doc.data().active,
          };
          cloudImages.push(article);
        });
        //   this.setState({ activeAdsOnly: cloudImages });
        setActiveAdsOnly(cloudImages);
        // console.log(activeAdsOnly)
      });
  }, []);

  const renderNewCarousel = (ads) => {
    return (
      <>
        <Carousel
          autoPlay={true}
          showStatus={false}
          showThumbs={false}
          dynamicHeight={true}
          infiniteLoop={true}
          // centerMode={true}
          // style={{alignSelf:'center'}}
        >
          {ads.map((ad, adIndex) => {
            // return <PostAd item={ad} key={adIndex} />;
            return(
                <>
{/* <div> */}
<a style={{display:'block'}} href={ad.link} target="_blank">
    

    <img src={ad.image} />
    </a>
{/* </div> */}
</>

            );
          })}
        </Carousel>
      </>
    );
  };

  return renderNewCarousel(activeAdsOnly);

  //   <>
  // <Loader
  //   // foregroundStyle={{color: 'white'}}
  //   backgroundStyle={{
  //     display: "content",
  //     backgroundColor: "transparent",
  //     borderRadius: "10px",
  //   }}
  //   show={loaderInbox}
  //   message={
  //     <LoaderSpinner
  //       visible={loaderInbox}
  //       type="Rings"
  //       color="#00BFFF"
  //       height={50}
  //       width={50}
  //       timeout={1000} //1 sec
  //     />
  //   }
  //   contentBlur={225}
  //   hideContentOnLoad={true}
  // >
  //   <FadeIn>
  //       renderNewCarousel(activeAdsOnly)

  //   </FadeIn>
  // </Loader>
  //   </>
}

export default TimelineShowAds;

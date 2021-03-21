import React from "react";

export default class GoogleAdsense2021 extends React.Component {
  componentDidMount() {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

  render() { 
    return (
      <ins
      className="adsbygoogle"
      data-ad-client="ca-pub-8770436966829700"
      data-ad-slot="4640466102"
      style={{ display: "inline-block",
      //  height: 250, width: 300
     }}
    />
        // <div className='ad'>
        //   <ins className='adsbygoogle'
        //     style={{ display: 'block' }}
        //     data-ad-client='ca-pub-4591861188995436'
        //     data-ad-slot='4640466102'
        //     data-ad-format='auto' />
        //  </div>
    );
  }
}

{
  /* <ins
        className="adsbygoogle"
        data-ad-client="ca-pub-4591861188995436"
        data-ad-slot="4640466102"
        style={{ display: "inline-block", height: 250, width: 300 }}
      /> */
}

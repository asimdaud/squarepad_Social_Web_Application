import React from "react";
import { Bling as GPT } from "react-gpt";

GPT.enableSingleRequest();

export default class gpt extends React.Component {
  render() {
    return (
      <div id="div-gpt-ad-1536172937182-0">
        <GPT adUnitPath="/164808479/Leaderboard" slotSize={[728, 90]}
         />
      </div>
    );
  }
}

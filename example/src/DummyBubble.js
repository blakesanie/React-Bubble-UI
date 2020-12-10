import React from "react";

export default function CompanyBubble(props) {
  // console.log(props);
  return (
    <div
      style={{
        backgroundColor: props.color,
      }}
      className={"dummyBubble"}
    >
      {props.bubbleSize ? (
        <p className="dummyBubbleText">
          Size:
          <br />
          {Math.round(props.bubbleSize)}
        </p>
      ) : null}
    </div>
  );
}

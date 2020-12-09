import React from "react";

export default function CompanyBubble(props) {
  // console.log(props);
  return (
    <div
      style={{
        backgroundColor: props.backgroundColor + "d0",
        borderRadius: `50%`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        width: `100%`,
        height: `100%`,
        // transform: `scale(${props.maxSize / 200})`
      }}
    >
      {props.bubbleSize > 50 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            opacity: true ? 1 : 0,
          }}
        >
          <img
            src={`/companyLogos/${props.symbol}.svg`}
            alt=""
            style={{
              width: 40,
              borderRadius: `50%`,
              marginBottom: 8,
            }}
          ></img>
          <p
            style={{
              color: props.textColor,
              fontSize: 18,
              marginBottom: 4,
              fontWeight: 1000,
            }}
          >
            {props.distanceToCenter}
          </p>
          <p
            style={{
              color: props.textColor,
              fontSize: 12,
              marginBottom: 10,
              maxWidth: 100,
              textAlign: "center",
              opacity: 0.5,
            }}
          >
            {props.name}
          </p>
        </div>
      ) : null}
    </div>
  );
}

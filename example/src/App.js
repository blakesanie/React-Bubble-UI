import React, { useState, useLayoutEffect } from "react";

import BubbleUI from "bubble-ui";
import "bubble-ui/dist/index.css";
import companyData from "./companies";
import CompanyBubble from "./CompanyBubble";

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const colors = [];
for (var i = 0; i < 200; i++) {
  colors.push(getRandomColor());
}

export default function App(props) {
  const getStockBubbles = () => {
    return companyData.slice(0, 27).map((company, i) => {
      return <CompanyBubble {...company} key={i} />;
    });
  };
  const stockBubbles = getStockBubbles();

  const [pageWidth, setPageWidth] = useState(window.innerWidth);

  const handleResize = (e) => {
    setPageWidth(window.innerWidth);
  };

  useLayoutEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <React.Fragment>
      <h1>React-Bubble-Layout</h1>
      <h2>First seen on Apple Watch, now avaible for your Web App</h2>
      <BubbleUI
        className="bubbleUI"
        options={{
          showGuides: true,
          provideProps: true,
          gravitation: 5,
          compact: true,
          size: 160,
          yRadius: 200,
          xRadius: Math.min((pageWidth - 300) / 2, 400),
          fringeWidth: 80,
          numCols: 6,
        }}
      >
        {stockBubbles}
      </BubbleUI>
    </React.Fragment>
  );
}

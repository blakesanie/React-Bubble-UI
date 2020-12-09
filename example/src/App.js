import React from "react";

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
  return (
    <React.Fragment>
      <h1>React-Bubble-Layout</h1>
      <h2>First seen on Apple Watch, now avaible for your Web App</h2>
      <BubbleUI
        className="bubbleUI"
        options={{ showGuides: true, provideProps: true, size: 100 }}
        resize
        shouldTranslate
        roundCorners={false}
        gutter={8}
        width={Math.floor(Math.sqrt(stockBubbles.length) * 1.2)}
        size={20}
        minSize={20}
        innerRadius={150}
        outerRadius={300}
        translationFactor={0.42}
        provideProps={true}
      >
        {stockBubbles}
      </BubbleUI>
    </React.Fragment>
  );
}

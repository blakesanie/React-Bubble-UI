import React, { useState, useLayoutEffect } from "react";

import BubbleUI from "bubble-ui";
import "bubble-ui/dist/index.css";
import companyData from "./companies";
import CompanyBubble from "./CompanyBubble";

const controls = [
  {
    type: "range",
    optionKey: "size",
    min: 50,
    max: 300,
    step: 1,
    unit: "px",
  },
  {
    type: "range",
    optionKey: "minSize",
    min: 5,
    max: 50,
    step: 1,
    unit: "px",
  },
  {
    type: "range",
    optionKey: "gutter",
    min: 0,
    max: 50,
    step: 1,
    unit: "px",
  },
  {
    type: "range",
    optionKey: "numCols",
    min: 1,
    max: 10,
    step: 1,
  },
  {
    type: "range",
    optionKey: "xRadius",
    min: 50,
    max: 400,
    step: 1,
    unit: "px",
  },
  {
    type: "range",
    optionKey: "yRadius",
    min: 50,
    max: 400,
    step: 1,
    unit: "px",
  },
  {
    type: "range",
    optionKey: "cornerRadius",
    min: 0,
    max: 400,
    step: 1,
    unit: "px",
  },
  {
    type: "range",
    optionKey: "fringeWidth",
    min: 20,
    max: 200,
    step: 1,
    unit: "px",
  },
  {
    type: "range",
    optionKey: "gravitation",
    min: 0,
    max: 10,
    step: 1,
  },
  {
    type: "checkbox",
    optionKey: "showGuides",
  },
  {
    type: "checkbox",
    optionKey: "compact",
  },
  {
    type: "checkbox",
    optionKey: "provideProps",
  },
];

export default function App(props) {
  const getStockBubbles = () => {
    return companyData.slice(0, 20).map((company, i) => {
      return <CompanyBubble {...company} key={i} />;
    });
  };
  const stockBubbles = getStockBubbles();

  const [pageWidth, setPageWidth] = useState(window.innerWidth);

  const handleResize = (e) => {
    setPageWidth(window.innerWidth);
  };

  const [options, setOptions] = useState({
    size: 200,
    minSize: 20,
    gutter: 16.5,
    provideProps: false,
    numCols: 6,
    fringeWidth: 100,
    yRadius: 200,
    xRadius: 200,
    cornerRadius: 100,
    showGuides: true,
    compact: false,
    gravitation: 0,
  });

  useLayoutEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleInputChange = (key, value) => {
    console.log(key, value);
    let newOptions = {};
    Object.assign(newOptions, options);
    newOptions[key] = value;
    console.log(newOptions);
    setOptions(newOptions);
  };

  return (
    <React.Fragment>
      <h1>React-Bubble-Layout</h1>
      <h2>First seen on Apple Watch, now avaible for your Web App</h2>
      <h3>Interactive Demo</h3>
      <BubbleUI className="bubbleUI" options={options}>
        {stockBubbles}
      </BubbleUI>
      <h3>Options</h3>
      <div className="controlBar">
        <div className="control">
          <div className="top">
            <p className="controlTitle">Sample Component</p>
          </div>
          <div className="bottom">
            <select defaultValue="companies">
              <option value="companies">Companies</option>
              <option value="authors">Authors</option>
              <option value="foods">Foods</option>
            </select>
          </div>
        </div>
        {controls.map((control) => {
          return (
            <div className="control" key={control.optionKey}>
              <div className="top">
                <p className="controlTitle">{control.optionKey}:</p>
                <p
                  className="controlValue"
                  style={{
                    width: control.type == "range" ? 50 : 0,
                  }}
                >{`${
                  control.type == "range" ? options[control.optionKey] : ""
                }${control.unit || ""}`}</p>
                <img
                  src="https://www.svgrepo.com/show/24584/info-icon.svg"
                  alt=""
                ></img>
              </div>
              <div className="bottom">
                <input
                  type={control.type}
                  value={options[control.optionKey]}
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  onChange={(event) => {
                    handleInputChange(
                      control.optionKey,
                      control.type == "checkbox"
                        ? !options[control.optionKey]
                        : parseInt(event.target.value)
                    );
                  }}
                  defaultChecked={options[control.optionKey]}
                />
              </div>
            </div>
          );
        })}
      </div>
      <pre>{JSON.stringify(options, null, 4).replaceAll(`"`, "")}</pre>
    </React.Fragment>
  );
}

/*
size: 200,
    minSize: 20,
    gutter: 16.5,
    provideProps: false,
    numCols: 6,
    fringeWidth: 100,
    yRadius: 200,
    xRadius: 200,
    cornerRadius: 100,
    showGuides: false,
    compact: false,
    gravitation: 0,
*/

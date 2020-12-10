import React, { useState, useRef } from "react";
import { CopyBlock, hybrid } from "react-code-blocks";
import BubbleUI, { defaultOptions } from "bubble-ui";
import "bubble-ui/dist/index.css";
import companyData from "./companies";
import CompanyBubble from "./CompanyBubble";
import DummyBubble from "./DummyBubble";

const dummyBubbleLayoutOptions = {
  size: 80,
  minSize: 10,
  gutter: 8,
  provideProps: false,
  numCols: 5,
  fringeWidth: 80,
  yRadius: 100,
  xRadius: 100,
  cornerRadius: 50,
  showGuides: false,
  compact: true,
  gravitation: 5,
};

const dummyColors = [
  "#F79256",
  "#FBD1A2",
  "#7DCFB6",
  "#00B2CA",
  "#1D4E89",
  "#F79256",
  "#FBD1A2",
  "#7DCFB6",
  "#00B2CA",
  "#1D4E89",
  "#F79256",
  "#FBD1A2",
  "#7DCFB6",
  "#00B2CA",
  "#1D4E89",
  "#F79256",
  "#FBD1A2",
  "#7DCFB6",
  "#00B2CA",
  "#1D4E89",
  "#F79256",
  "#FBD1A2",
  "#7DCFB6",
  "#00B2CA",
  "#1D4E89",
  "#F79256",
  "#FBD1A2",
  "#7DCFB6",
  "#00B2CA",
  "#1D4E89",
  "#F79256",
  "#FBD1A2",
  "#7DCFB6",
  "#00B2CA",
  "#1D4E89",
  "#F79256",
  "#FBD1A2",
  "#7DCFB6",
  "#00B2CA",
  "#1D4E89",
];

export default function App(props) {
  const controls = [
    {
      type: "range",
      optionKey: "size",
      min: 50,
      max: 300,
      step: 1,
      unit: "px",
      desc: "The maximum diameter of a bubble, in pixels",
      options1: {
        size: 50,
      },
      options2: {
        size: 100,
      },
      ref: useRef(null),
    },
    {
      type: "range",
      optionKey: "minSize",
      min: 5,
      max: 50,
      step: 1,
      unit: "px",
      desc: "The minimum diameter of a bubble, in pixels",
      options1: {
        minSize: 5,
      },
      options2: {
        minSize: 20,
      },
      ref: useRef(null),
    },
    {
      type: "range",
      optionKey: "gutter",
      min: 0,
      max: 50,
      step: 1,
      unit: "px",
      desc: "The distance between individual bubbles, in pixels",
      options1: {
        gutter: 0,
      },
      options2: {
        gutter: 30,
      },
      ref: useRef(null),
    },
    {
      type: "range",
      optionKey: "numCols",
      min: 1,
      max: 10,
      step: 1,
      desc:
        "The number of columns into which bubbles are organized. Rows are composed accordingly",
      options1: {
        numCols: 3,
      },
      options2: {
        numCols: 10,
      },
      ref: useRef(null),
    },
    {
      type: "range",
      optionKey: "xRadius",
      min: 50,
      max: 400,
      step: 1,
      unit: "px",
      desc:
        "The horizontal radius of the region where bubbles are at their maximum size, in pixels",
      options1: {
        xRadius: 50,
      },
      options2: {
        xRadius: 120,
      },
      ref: useRef(null),
    },
    {
      type: "range",
      optionKey: "yRadius",
      min: 50,
      max: 400,
      step: 1,
      unit: "px",
      desc:
        "The vertical radius of the region where bubbles are at their maximum size, in pixels",
      options1: {
        yRadius: 50,
      },
      options2: {
        yRadius: 120,
      },
      ref: useRef(null),
    },
    {
      type: "range",
      optionKey: "cornerRadius",
      min: 0,
      max: 400,
      step: 1,
      unit: "px",
      desc:
        "The amount by which the corners of the region where bubbles are at their maximum size are rounded, in pixels. If this value is equal to xRadius and yRadius, a circle inscribes the region",
      options1: {
        cornerRadius: 0,
      },
      options2: {
        cornerRadius: 100,
      },
      ref: useRef(null),
    },
    {
      type: "range",
      optionKey: "fringeWidth",
      min: 20,
      max: 200,
      step: 1,
      unit: "px",
      desc:
        "The width of the fringe, or region just outside the center where bubbles grow from their minimum to maximum size, in pixels",
      options1: {
        fringeWidth: 40,
      },
      options2: {
        fringeWidth: 130,
      },
      ref: useRef(null),
    },
    {
      type: "range",
      optionKey: "gravitation",
      min: 0,
      max: 10,
      step: 1,
      desc:
        "The amount, scaled 0 to 10, by which exterior bubbles are attracted to the center region",
      options1: {
        gravitation: 0,
      },
      options2: {
        gravitation: 9,
      },
      ref: useRef(null),
    },
    {
      type: "checkbox",
      optionKey: "showGuides",
      desc:
        "Whether or not the visual guides, including center region and fringe, are show over the bubbles. Useful when designing the bubble layout",
      options1: {
        showGuides: false,
      },
      options2: {
        showGuides: true,
      },
      ref: useRef(null),
    },
    {
      type: "checkbox",
      optionKey: "compact",
      desc:
        "Whether or not bubbles near the center region should fill in space wherever possible",
      options1: {
        compact: false,
      },
      options2: {
        compact: true,
      },
      ref: useRef(null),
    },
    {
      type: "checkbox",
      optionKey: "provideProps",
      desc:
        "Whether or not bubbleSize, distanceToCenter, maxSize, and minSize values are passed to corresponding children as props",
      options1: {
        provideProps: false,
      },
      options2: {
        provideProps: true,
      },
      ref: useRef(null),
    },
  ];

  const getDummyBubbles = () => {
    let out = [];
    for (var i = 0; i < 30; i++) {
      out.push(<DummyBubble color={dummyColors[i]} key={i} />);
    }
    return out;
  };

  const dummyBubbles = getDummyBubbles();

  const getStockBubbles = () => {
    return companyData.slice(0, 20).map((company, i) => {
      return <CompanyBubble {...company} key={i} />;
    });
  };
  const stockBubbles = getStockBubbles();

  const [options, setOptions] = useState({
    size: 180,
    minSize: 20,
    gutter: 8,
    provideProps: true,
    numCols: 6,
    fringeWidth: 160,
    yRadius: 130,
    xRadius: 220,
    cornerRadius: 50,
    showGuides: false,
    compact: true,
    gravitation: 5,
  });

  const handleInputChange = (key, value) => {
    console.log(key, value);
    let newOptions = {};
    Object.assign(newOptions, options);
    newOptions[key] = value;
    console.log(newOptions);
    setOptions(newOptions);
  };

  const actions = [
    {
      text: "Download from",
      url: "https://blakesanie.com",
      fileName: "npm.png",
    },
    {
      text: "Contribute on",
      url: "https://github.com/blakesanie/bubble-ui",
      fileName: "github.png",
    },
    {
      text: "Say thanks with",
      url: "https://paypal.me/blakesanie?locale.x=en_US",
      fileName: "paypal.png",
    },
  ];

  return (
    <React.Fragment>
      <h1>React-Bubble-Layout</h1>
      <h2>
        First showcased on Apple Watch, now available for your React web app
      </h2>
      <div className="install">
        <CopyBlock
          text="npm install react-bubble-layout"
          language="text"
          showLineNumbers={false}
          theme={hybrid}
          codeBlock
        />
      </div>
      <div className="actionContainer">
        {actions.map((action, i) => {
          return (
            <a
              key={i}
              href={action.url}
              target="_blank"
              rel="noopener noreferrer"
              className="action"
            >
              {action.text}
              <img src={`/images/${action.fileName}`} alt=""></img>
            </a>
          );
        })}
      </div>
      <h3>Interactive Demo</h3>
      <BubbleUI className="bubbleUI" options={options}>
        {stockBubbles}
      </BubbleUI>
      <h3>Realtime Options</h3>
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
                    width: control.type === "range" ? 50 : 0,
                  }}
                >{`${
                  control.type === "range" ? options[control.optionKey] : ""
                }${control.unit || ""}`}</p>
                <img
                  src="https://www.svgrepo.com/show/24584/info-icon.svg"
                  alt=""
                  onClick={() => {
                    control.ref.current.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }}
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
                      control.type === "checkbox"
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
      <h3>Resulting React.js Code</h3>
      <div className="codeBlock">
        <CopyBlock
          text={`export default function myComponent(props) {\n\tconst options = ${JSON.stringify(
            options,
            null,
            "\t\t"
          )
            .replaceAll(`"`, "")
            .replace(
              "}",
              "\t}"
            )}\n\n\treturn (<BubbleLayout options={options}>\n\t\t{/* children */}\n\t</BubbleLayout>)\n};`}
          language="javascript"
          showLineNumbers={true}
          theme={hybrid}
          codeBlock
        />
      </div>
      <h4>Options Prop Documentation</h4>
      <p className="propDesc">
        The React-Bubble-Layout component takes one prop, options, which is an
        object specifying any or all of the following:
      </p>
      {controls.map((control, i) => {
        let dummyOptions1 = {};
        let dummyOptions2 = {};
        Object.assign(dummyOptions1, dummyBubbleLayoutOptions);
        Object.assign(dummyOptions1, control.options1);
        Object.assign(dummyOptions2, dummyOptions1);
        Object.assign(dummyOptions2, control.options2);

        let beforeText = "";
        let afterText = "";
        for (let key in control.options1) {
          if (beforeText.length > 0) {
            beforeText += ", ";
          }
          beforeText += `${key}: ${control.options1[key]}`;
        }
        for (let key in control.options2) {
          if (afterText.length > 0) {
            afterText += ", ";
          }
          afterText += `${key}: ${control.options2[key]}`;
        }
        return (
          <div className="optionContainer" key={i} ref={control.ref}>
            <p className="optionName">
              {control.optionKey}
              <span>, {control.type === "range" ? "Number" : "boolean"}</span>
            </p>
            <p className="optionDefault">
              {defaultOptions[control.optionKey]} by default
            </p>
            <p className="optionDesc">{control.desc}</p>
            <div className="comparisonContainer">
              <div className="beforeContainer">
                <p className="comparisonText">{beforeText}</p>
                <BubbleUI
                  className="comparisonBubbleUI"
                  options={dummyOptions1}
                >
                  {dummyBubbles}
                </BubbleUI>
              </div>
              <div className="afterContainer">
                <p className="comparisonText">{afterText}</p>
                <BubbleUI
                  className="comparisonBubbleUI"
                  options={dummyOptions2}
                >
                  {dummyBubbles}
                </BubbleUI>
              </div>
            </div>
          </div>
        );
      })}
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

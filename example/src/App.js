import React, { useState, useRef, useLayoutEffect } from "react";
import { CopyBlock, hybrid } from "react-code-blocks";
import BubbleUI, { defaultOptions } from "react-bubble-ui";
import "react-bubble-ui/dist/index.css";
import companyData from "./companies";
import CompanyBubble from "./CompanyBubble";
import DummyBubble from "./DummyBubble";

const dummyBubbleLayoutOptions = {
  size: 80,
  minsize: 10,
  gutter: 8,
  provideprops: false,
  numcols: 5,
  fringewidth: 80,
  yradius: 100,
  xradius: 100,
  cornerradius: 50,
  showguides: false,
  compact: true,
  gravitation: 5,
};

const dimensionsExampleOptions = {
  size: 120,
  minsize: 14,
  gutter: 8,
  provideprops: false,
  numcols: 6,
  fringewidth: 100,
  yradius: 120,
  xradius: 160,
  cornerradius: 60,
  showguides: true,
  compact: false,
  gravitation: 0,
};

const dummyColors = ["#F79256", "#FBD1A2", "#7DCFB6", "#00B2CA", "#1D4E89"];

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
      range: {
        start: "minsize",
        end: "Infinity",
      },
    },
    {
      type: "range",
      optionKey: "minsize",
      min: 5,
      max: 50,
      step: 1,
      unit: "px",
      desc: "The minimum diameter of a bubble, in pixels",
      options1: {
        minsize: 5,
      },
      options2: {
        minsize: 20,
      },
      ref: useRef(null),
      range: {
        start: "0",
        end: "size",
      },
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
      range: {
        start: "0",
        end: "Infinity",
      },
    },
    {
      type: "range",
      optionKey: "numcols",
      min: 1,
      max: 10,
      step: 1,
      desc:
        "The number of columns into which bubbles are organized. Rows are composed accordingly",
      options1: {
        numcols: 3,
      },
      options2: {
        numcols: 10,
      },
      ref: useRef(null),
      range: {
        start: "2",
        end: "len(children components)",
      },
    },
    {
      type: "range",
      optionKey: "xradius",
      min: 50,
      max: 400,
      step: 1,
      unit: "px",
      desc:
        "The horizontal radius of the region where bubbles are at their maximum size, in pixels",
      options1: {
        xradius: 50,
      },
      options2: {
        xradius: 120,
      },
      ref: useRef(null),
      range: {
        start: "0",
        end: "Infinity",
      },
    },
    {
      type: "range",
      optionKey: "yradius",
      min: 50,
      max: 400,
      step: 1,
      unit: "px",
      desc:
        "The vertical radius of the region where bubbles are at their maximum size, in pixels",
      options1: {
        yradius: 50,
      },
      options2: {
        yradius: 120,
      },
      ref: useRef(null),
      range: {
        start: "0",
        end: "Infinity",
      },
    },
    {
      type: "range",
      optionKey: "cornerradius",
      min: 0,
      max: 400,
      step: 1,
      unit: "px",
      desc:
        "The amount by which the corners of the region where bubbles are at their maximum size are rounded, in pixels. If this value is equal to xradius and yradius, a circle inscribes the region",
      options1: {
        cornerradius: 0,
      },
      options2: {
        cornerradius: 100,
      },
      ref: useRef(null),
      range: {
        start: "0",
        end: "min(xradius, yradius)",
      },
    },
    {
      type: "range",
      optionKey: "fringewidth",
      min: 20,
      max: 200,
      step: 1,
      unit: "px",
      desc:
        "The width of the fringe, or region just outside the center where bubbles grow from their minimum to maximum size, in pixels",
      options1: {
        fringewidth: 40,
      },
      options2: {
        fringewidth: 130,
      },
      ref: useRef(null),
      range: {
        start: "0",
        end: "Infinity",
      },
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
      range: {
        start: "0",
        end: "10",
      },
    },
    {
      type: "checkbox",
      optionKey: "showguides",
      desc:
        "Whether or not the visual guides, including center region and fringe, are show over the bubbles. Useful when designing the bubble layout",
      options1: {
        showguides: false,
      },
      options2: {
        showguides: true,
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
      optionKey: "provideprops",
      desc:
        "Whether or not bubbleSize, distanceToCenter, maxSize, and minsize values are passed to corresponding children as props",
      options1: {
        provideprops: false,
      },
      options2: {
        provideprops: true,
      },
      ref: useRef(null),
    },
  ];

  const getDummyBubbles = () => {
    let out = [];
    for (var i = 0; i < 30; i++) {
      out.push(
        <DummyBubble color={dummyColors[i % dummyColors.length]} key={i} />
      );
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
    minsize: 20,
    gutter: 8,
    provideprops: true,
    numcols: 6,
    fringewidth: 160,
    yradius: 130,
    xradius: 220,
    cornerradius: 50,
    showguides: false,
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
      url: "https://www.npmjs.com/package/react-bubble-ui",
      fileName: "npm.png",
    },
    {
      text: "Contribute on",
      url: "https://github.com/blakesanie/React-Bubble-UI",
      fileName: "github.png",
    },
    {
      text: "Say thanks with",
      url: "https://paypal.me/blakesanie?locale.x=en_US",
      fileName: "paypal.png",
    },
  ];

  const scrollToRef = (ref) => {
    if (ref) {
      const y = ref.current.offsetTop - 50;
      window.scrollTo(0, y);
    } else {
      window.scrollTo(0, 0);
    }
  };

  useLayoutEffect(() => {
    const hash = window.location.hash.split("#/")[1];
    if (hash == "demo") {
      scrollToRef(demoRef);
    } else if (hash == "docs") {
      scrollToRef(docsRef);
    } else if (hash == "code") {
      scrollToRef(codeRef);
    } else if (hash == "layout") {
      scrollToRef(layoutRef);
    } else if (hash == "style") {
      scrollToRef(styleRef);
    }
  }, []);

  const demoRef = useRef(null);
  const docsRef = useRef(null);
  const codeRef = useRef(null);
  const layoutRef = useRef(null);
  const styleRef = useRef(null);

  return (
    <React.Fragment>
      <div className="headerBar">
        <p
          className="headerButton"
          onClick={() => {
            scrollToRef(undefined);
          }}
        >
          Top
        </p>
        <p
          className="headerButton"
          onClick={() => {
            scrollToRef(demoRef);
          }}
        >
          Demo
        </p>
        <p
          className="headerButton"
          onClick={() => {
            scrollToRef(codeRef);
          }}
        >
          Code
        </p>
        <p
          className="headerButton"
          onClick={() => {
            scrollToRef(layoutRef);
          }}
        >
          Layout
        </p>
        <p
          className="headerButton"
          onClick={() => {
            scrollToRef(docsRef);
          }}
        >
          Docs
        </p>
        <p
          className="headerButton"
          onClick={() => {
            scrollToRef(styleRef);
          }}
        >
          Styles
        </p>
      </div>
      <h1>React-Bubble-UI</h1>
      <h2>
        A highly configurable Bubble UI React.js component, similar to the
        iconic Apple Watch app layout.
      </h2>
      <div className="install">
        <CopyBlock
          text="npm install react-bubble-ui"
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
              <img src={`./images/${action.fileName}`} alt=""></img>
            </a>
          );
        })}
      </div>
      <h3 ref={demoRef}>Interactive Demo</h3>
      <BubbleUI className="bubbleUI" options={options}>
        {stockBubbles}
      </BubbleUI>
      <h3>Realtime Options</h3>
      <div className="controlBar">
        {/* <div className="control">
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
        </div> */}
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
      <h3 ref={codeRef}>Resulting React.js Code</h3>
      <div className="codeBlock">
        <CopyBlock
          text={`// myComponent.js\n\nimport BubbleUI from "react-bubble-ui";\nimport "react-bubble-ui/dist/index.css";\nimport Child from "./ChildComponent";\nimport "./myComponent.css";\n\nexport default function myComponent(props) {\n\tconst options = ${JSON.stringify(
            options,
            null,
            "\t\t"
          )
            .replaceAll(`"`, "")
            .replace(
              "}",
              "\t}"
            )}\n\n\tconst children = props.data.map((data, i) => {\n\t\t return <Child data={data} className="child" key={i}>\n\t});\n\n\treturn (<BubbleUI options={options} className="myBubbleUI">\n\t\t{children}\n\t</BubbleUI>)\n};`}
          language="javascript"
          showLineNumbers={true}
          theme={hybrid}
          codeBlock
        />
        <div
          style={{
            height: 12,
          }}
        ></div>
        <CopyBlock
          text={`/* myComponent.css */\n\n.myBubbleUI {\n\twidth: 100%;\n\tmax-width: 1000px;\n\theight: 500px\n\tborder-radius: 50px\n}\n\n.child {\n\twidth: 100%;\n\theight: 100%;\n\tborder-radius: 50%;\n}`}
          language="css"
          showLineNumbers={true}
          theme={hybrid}
          codeBlock
        />
      </div>
      <h4 ref={layoutRef}>Understanding Layout Dimensions</h4>
      <div className="dimensionsBubbleUI">
        <BubbleUI
          className="dimensionsBubbleUI"
          options={dimensionsExampleOptions}
        >
          {dummyBubbles}
        </BubbleUI>
        <p
          className="dimensionLabel"
          style={{
            bottom: `50%`,
            left: `50%`,
            width: dimensionsExampleOptions.xradius,
            borderBottom: `2px solid white`,
          }}
        >
          xradius
        </p>
        <p
          className="dimensionLabel"
          style={{
            bottom: `50%`,
            left: `50%`,
            width: dimensionsExampleOptions.yradius,
            borderBottom: `2px solid white`,
            transformOrigin: `center bottom`,
            transform: `translate(-50%, -${
              dimensionsExampleOptions.yradius / 2
            }px) rotate(90deg)`,
          }}
        >
          yradius
        </p>
        <p
          className="dimensionLabel"
          style={{
            bottom: `50%`,
            right: `50%`,
            boxSizing: "border-box",
            transform: `translate(${dimensionsExampleOptions.xradius}px, ${
              dimensionsExampleOptions.yradius -
              dimensionsExampleOptions.cornerradius
            }px)`,
            paddingRight: 5,
          }}
        >
          cornerradius
        </p>
        <p
          className="dimensionLabel"
          style={{
            top: `50%`,
            right: `50%`,
            borderTop: `2px solid white`,
            borderLeft: `2px dashed rgba(255,255,255,0.5)`,
            boxSizing: "border-box",
            width: dimensionsExampleOptions.cornerradius,
            height: dimensionsExampleOptions.cornerradius,
            transform: `translate(${dimensionsExampleOptions.xradius}px, ${
              dimensionsExampleOptions.yradius -
              dimensionsExampleOptions.cornerradius
            }px)`,
          }}
        ></p>
        <p
          className="dimensionLabel"
          style={{
            bottom: `50%`,
            left: `50%`,
            height: dimensionsExampleOptions.fringewidth,
            borderLeft: `2px solid white`,
            paddingLeft: 5,
            marginBottom: dimensionsExampleOptions.yradius,
            transform: `translateX(-50%)`,
            paddingTop: dimensionsExampleOptions.fringewidth - 60,
            boxSizing: "border-box",
          }}
        >
          fringewidth
        </p>
        <p
          className="dimensionRegion"
          style={{
            top: `50%`,
            left: `calc(50% - ${dimensionsExampleOptions.xradius / 2 - 10}px`,
            transform: `translate(-50%, -50%)`,
          }}
        >
          Center
          <br />
          Region
        </p>
        <p
          className="dimensionRegion"
          style={{
            top: `calc(50% + ${
              dimensionsExampleOptions.yradius +
              dimensionsExampleOptions.fringewidth / 2
            }px)`,
            left: `50%`,
            transform: `translate(-50%, -50%)`,
          }}
        >
          Fringe Region
        </p>
      </div>
      <p className="dimensionsDesc">
        Each bubble's size is defined by its position relative to the center and
        fringe regions.
        <br />
        <br />
        If a bubble's center is{" "}
        <span
          style={{
            fontWeight: 1000,
          }}
        >
          within the center region
        </span>
        , it has{" "}
        <span
          style={{
            fontWeight: 1000,
          }}
        >
          maximum size
        </span>
        .
        <br />
        <br />
        If a bubble's center is{" "}
        <span
          style={{
            fontWeight: 1000,
          }}
        >
          outside the fringe region
        </span>
        , it has{" "}
        <span
          style={{
            fontWeight: 1000,
          }}
        >
          minimum size
        </span>
        .
        <br />
        <br />
        If a bubble's center is{" "}
        <span
          style={{
            fontWeight: 1000,
          }}
        >
          within the fringe region
        </span>
        , its{" "}
        <span
          style={{
            fontWeight: 1000,
          }}
        >
          size is interpolated between its min and max
        </span>{" "}
        values, depending on its current progression through the fringe.
      </p>
      <h4 ref={docsRef}>Options Prop Documentation</h4>
      <p className="optionsDesc">
        The React-Bubble-UI component takes one prop, options, which is an
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
              {`${defaultOptions[control.optionKey]} by default ${
                control.range
                  ? `, range [${control.range.start}, ${control.range.end}${
                      control.range.end == "Infinity" ? ")" : "]"
                    }`
                  : ""
              }`}
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
      <h4 ref={styleRef}>Styling BubbleUI and its Children</h4>
      <p className="optionDesc">
        The styling of the outer container and child components is kept open to
        the user.
        <br />
        <br />
        The outer container of{" "}
        <span style={{ fontWeight: 1000 }}>
          BubbleUI requires height and width dimensions
        </span>{" "}
        to be rendered. Feel free to also add borders, a background color,
        rounded corners, or any other styles to your liking.
        <br />
        <br />
        <span style={{ fontWeight: 1000 }}>
          Children components are rendered into a fixed-dimension container.
        </span>{" "}
        This means adequate styles are necessary fit your component to for this
        container. Bubbles are also not rounded, by default.
        <br />
        <br />
        We recommend these minimum styles for your BubbleUI and children
        components:
      </p>
      <div className="codeBlock">
        <CopyBlock
          text={`.bubbleUI {\n\twidth: 600px; /* width of BubbleUI container */\n\theight: 400px; /* height of BubbleUI container */\n}\n\n.childComponent {\n\twidth: 100%; /* width expands to fit bubble */\n\theight: 100%; /* width expands to fit bubble */\n\tborder-radius: 50%; /* rounded border forms a circle */\n}`}
          language="css"
          showLineNumbers={true}
          theme={hybrid}
          codeBlock
        />
      </div>
    </React.Fragment>
  );
}

/*
size: 200,
    minsize: 20,
    gutter: 16.5,
    provideprops: false,
    numcols: 6,
    fringewidth: 100,
    yradius: 200,
    xradius: 200,
    cornerradius: 100,
    showguides: false,
    compact: false,
    gravitation: 0,
*/

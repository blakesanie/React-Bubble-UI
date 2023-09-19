import React, { useState, useLayoutEffect, useRef } from "react";
import styles from "./styles.module.css";

export const defaultOptions = {
  size: 200,
  minsize: 20,
  gutter: 16,
  provideprops: false,
  numcols: 6,
  fringewidth: 100,
  yradius: 200,
  xradius: 200,
  cornerradius: 100,
  showguides: false,
  compact: false,
  gravitation: 0,
};

export default function BubbleElement(props) {
  if (!props.children) {
    return null;
  }
  let options = {};
  Object.assign(options, defaultOptions);
  Object.assign(options, props.options);
  options.numcols = Math.min(options.numcols, props.children.length);
  // console.log(options);

  const minProportion = options.minsize / options.size;

  const verticalPadding = `calc(50% - ${
    options.yradius +
    options.size / 2 -
    (options.cornerradius * (1.414 - 1)) / 1.414
  }px)`;
  const horizontalPadding = `calc(50% - ${
    options.xradius +
    options.size / 2 -
    (options.cornerradius * (1.414 - 1)) / 1.414
  }px)`;

  const scrollable = useRef(null);

  let rows = [];
  var colsRemaining = 0;
  var evenRow = true;
  for (var i = 0; i < props.children.length; i++) {
    if (colsRemaining == 0) {
      colsRemaining = evenRow ? options.numcols - 1 : options.numcols;
      evenRow = !evenRow;
      rows.push([]);
    }
    rows[rows.length - 1].push(props.children[i]);
    colsRemaining--;
  }
  if (rows.length > 1) {
    if (rows[rows.length - 1].length % 2 == rows[rows.length - 2].length % 2) {
      rows[rows.length - 1].push(<div></div>); // dummy bubble
    }
  }

  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleScroll = (e) => {
    if (e.target.className) {
      setScrollTop(e.target.scrollTop);
      setScrollLeft(e.target.scrollLeft);
    }
  };

  // const handleResize = (e) => {
  //   console.log('resize', e)
  //   setElementHeight(container.current.clientHeight)
  // }

  useLayoutEffect(() => {
    window.addEventListener("scroll", handleScroll);

    scrollable.current.scrollTo(
      (scrollable.current.scrollWidth - scrollable.current.clientWidth) / 2,
      (scrollable.current.scrollHeight - scrollable.current.clientHeight) / 2
    );
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const interpolate = (actualMin, actualMax, val, targetMin, targetMax) => {
    return (
      ((val - actualMin) / (actualMax - actualMin)) * (targetMax - targetMin) +
      targetMin
    );
  };

  const getBubbleSize = (row, col) => {
    const yOffset =
      (options.size + options.gutter) * 0.866 * row -
      options.size +
      (options.cornerradius * (1.414 - 1)) / 1.414 -
      (options.yradius - options.size);
    //  - options.cornerradius / 1.414;
    const xOffset =
      (options.size + options.gutter) * col +
      ((options.numcols - rows[row].length) * (options.size + options.gutter)) /
        2 -
      options.size +
      (options.cornerradius * (1.414 - 1)) / 1.414 -
      (options.xradius - options.size);
    // - options.cornerradius / 1.414;
    const dy = yOffset - scrollTop;
    const dx = xOffset - scrollLeft;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // let theta = Math.atan(dy / dx);
    // if (dx < 0) theta += Math.PI;
    let out = {
      bubblesize: 1,
      translatex: 0,
      translatey: 0,
      distance: distance,
    };
    let distanceFromEdge = 0;
    let isInCornerRegion = false;
    if (Math.abs(dx) <= options.xradius && Math.abs(dy) <= options.yradius) {
      // inner square
      if (
        Math.abs(dy) > options.yradius - options.cornerradius &&
        Math.abs(dx) > options.xradius - options.cornerradius
      ) {
        // in corner region
        const distToInnerCorner = Math.sqrt(
          Math.pow(Math.abs(dy) - options.yradius + options.cornerradius, 2) +
            Math.pow(Math.abs(dx) - options.xradius + options.cornerradius, 2)
        );
        if (distToInnerCorner > options.cornerradius) {
          // outside inner radius
          distanceFromEdge = distToInnerCorner - options.cornerradius;
          isInCornerRegion = true;
        }
      }
    } else if (
      Math.abs(dx) <= options.xradius + options.fringewidth &&
      Math.abs(dy) <= options.yradius + options.fringewidth
    ) {
      // outer square
      if (
        Math.abs(dy) > options.yradius - options.cornerradius &&
        Math.abs(dx) > options.xradius - options.cornerradius
      ) {
        // in corner region
        isInCornerRegion = true;
        const distToInnerCorner = Math.sqrt(
          Math.pow(Math.abs(dy) - options.yradius + options.cornerradius, 2) +
            Math.pow(Math.abs(dx) - options.xradius + options.cornerradius, 2)
        );
        distanceFromEdge = distToInnerCorner - options.cornerradius;
        // distanceFromEdge = Math.min(
        //   distToInnerCorner - options.cornerradius,
        //   options.fringewidth
        // );
      } else {
        distanceFromEdge = Math.max(
          Math.abs(dx) - options.xradius,
          Math.abs(dy) - options.yradius
        );
      }
    } else {
      // outside outer square
      isInCornerRegion =
        Math.abs(dy) > options.yradius - options.cornerradius &&
        Math.abs(dx) > options.xradius - options.cornerradius;
      if (isInCornerRegion) {
        const distToInnerCorner = Math.sqrt(
          Math.pow(Math.abs(dy) - options.yradius + options.cornerradius, 2) +
            Math.pow(Math.abs(dx) - options.xradius + options.cornerradius, 2)
        );
        distanceFromEdge = distToInnerCorner - options.cornerradius;
      } else {
        distanceFromEdge = Math.max(
          Math.abs(dx) - options.xradius,
          Math.abs(dy) - options.yradius
        );
      }
    }

    out.bubblesize = interpolate(
      0,
      options.fringewidth,
      Math.min(distanceFromEdge, options.fringewidth),
      1,
      minProportion
    );

    //handle magnitudes

    const translationMag = options.compact
      ? (options.size - options.minsize) / 2
      : 0;
    const interpolatedTranslationMag = interpolate(
      0,
      options.fringewidth,
      distanceFromEdge,
      0,
      translationMag
    );

    if (distanceFromEdge > 0 && distanceFromEdge <= options.fringewidth) {
      out.translatex = interpolatedTranslationMag;
      out.translatey = interpolatedTranslationMag;
    } else if (distanceFromEdge - options.fringewidth > 0) {
      const extra =
        (Math.max(
          0,
          distanceFromEdge - options.fringewidth - options.size / 2
        ) *
          options.gravitation) /
        10;
      out.translatex = translationMag + extra;
      out.translatey = translationMag + extra;
    }

    if (isInCornerRegion) {
      const cornerDx = Math.abs(dx) - options.xradius + options.cornerradius;
      const cornerDy = Math.abs(dy) - options.yradius + options.cornerradius;
      let theta = Math.atan(-cornerDy / cornerDx);
      if (dx > 0) {
        if (dy > 0) {
          theta *= -1;
        }
      } else {
        if (dy > 0) {
          theta += Math.PI;
        } else {
          theta += Math.PI - 2 * theta;
        }
      }
      out.translatex *= -Math.cos(theta);
      out.translatey *= -Math.sin(theta);
    } else if (
      Math.abs(dx) > options.xradius ||
      Math.abs(dy) > options.yradius
    ) {
      if (Math.abs(dx) > options.xradius) {
        out.translatex *= -Math.sign(dx);
        out.translatey = 0;
      } else {
        out.translatey *= -Math.sign(dy);
        out.translatex = 0;
      }
    }

    return out;
  };

  return (
    <div
      className={props.className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...props.style,
      }}
    >
      <div className={styles.container}>
        {/* <p>{`scrollTop: ${scrollTop}`}</p>
        <p>{`scrollLeft: ${scrollLeft}`}</p> */}
        <div
          className={styles.scrollable}
          ref={scrollable}
          onScroll={handleScroll}
        >
          <div
            className={styles.horizontalSpacer}
            style={{
              height: verticalPadding,
            }}
          ></div>
          <div
            className={styles.rowContainer}
            style={{
              width:
                options.size * options.numcols +
                options.gutter * (options.numcols - 1),
              paddingLeft: horizontalPadding,
              paddingRight: horizontalPadding,
            }}
          >
            {rows.map((row, i) => {
              return (
                <div
                  className={styles.row}
                  key={i}
                  style={{
                    marginTop:
                      i > 0
                        ? options.size * -0.134 + options.gutter * 0.866 // .134 is sqrt(3) - 1
                        : 0,
                  }}
                >
                  {row.map((comp, j) => {
                    const {
                      bubblesize,
                      translatex,
                      translatey,
                      distance,
                    } = getBubbleSize(i, j);
                    return (
                      <div
                        key={j}
                        className={styles.bubbleContainer}
                        style={{
                          width: options.size,
                          height: options.size,
                          marginRight: options.gutter / 2,
                          marginLeft: options.gutter / 2,
                          transform: `translatex(${translatex}px) translatey(${translatey}px) scale(${bubblesize})`,
                        }}
                      >
                        {options.provideprops
                          ? React.cloneElement(comp, {
                              bubblesize: bubblesize * options.size,
                              distanceToCenter: distance,
                              maxSize: options.size,
                              minsize: options.minsize,
                            })
                          : comp}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div
            className={styles.horizontalSpacer}
            style={{
              height: verticalPadding,
            }}
          ></div>
        </div>

        {options.showguides ? (
          <div className={styles.guideContainer}>
            <div
              className={styles.guide}
              style={{
                height: options.yradius * 2,
                width: options.xradius * 2,
                borderRadius:
                  options.shape == "ellipse" ? "50%" : options.cornerradius,
              }}
            ></div>
            <div
              className={styles.guide}
              style={{
                height: (options.yradius + options.fringewidth) * 2,
                width: (options.xradius + options.fringewidth) * 2,
                borderRadius:
                  options.shape == "ellipse"
                    ? "50%"
                    : options.cornerradius + options.fringewidth,
              }}
            ></div>
            {/* <div
              style={{
                position: "absolute",
                height: `100%`,
                width: 1,
                backgroundColor: "#000",
                left: `50%`,
                top: 0,
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                width: `100%`,
                height: 1,
                backgroundColor: "#000",
                top: `50%`,
                left: 0,
              }}
            ></div> */}
          </div>
        ) : null}
      </div>
    </div>
  );
}

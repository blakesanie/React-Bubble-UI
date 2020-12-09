import React, { useState, useLayoutEffect, useRef } from "react";
import styles from "./styles.module.css";

export default function BubbleElement(props) {
  let options = {
    size: 200,
    minSize: 10,
    translationFactor: 0,
    gutter: 10,
    provideProps: false,
    numCols: 5,
    fringeWidth: 100,
    shape: {
      type: "ellipse",
      yRadius: 200,
      xRadius: 200,
      cornerRadius: 100,
    },
    showGuides: false,
  };
  Object.assign(options, props.options);
  options.numCols = Math.min(options.numCols, props.children.length);

  const minProportion = options.minSize / options.size;
  const shapeFactor =
    options.shape.type == "ellipse" ? (options.size + options.gutter) * 0.3 : 0;
  const cornerFactor =
    options.shape.type == "ellispe" ? 0 : options.shape.cornerRadius / 3;

  let verticalPadding, horizontalPadding;

  if (options.shape.type == "ellipse") {
    verticalPadding = `calc(50% - ${
      options.shape.yRadius +
      options.size / 2 -
      (options.shape.yRadius * (1.414 - 1)) / 1.414
    }px)`;
    horizontalPadding = `calc(50% - ${
      options.shape.xRadius +
      options.size / 2 -
      (options.shape.xRadius * (1.414 - 1)) / 1.414
    }px)`;
  } else {
    verticalPadding = `calc(50% - ${
      options.shape.yRadius +
      options.size / 2 -
      (options.shape.cornerRadius * (1.414 - 1)) / 1.414
    }px)`;
    horizontalPadding = `calc(50% - ${
      options.shape.xRadius +
      options.size / 2 -
      (options.shape.cornerRadius * (1.414 - 1)) / 1.414
    }px)`;
  }

  const container = useRef(null);

  let rows = [];
  var colsRemaining = 0;
  var evenRow = true;
  for (var i = 0; i < props.children.length; i++) {
    if (colsRemaining == 0) {
      colsRemaining = evenRow ? options.numCols - 1 : options.numCols;
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
    // console.log(e)
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
    window.addEventListener("scroll", handleScroll, true);
    // window.addEventListener('resize', handleResize, true)
    // container.current.scrollTo(
    //   container.current.offsetWidth / 2 +
    //     (size * numCols +
    //       gutter * (numCols - 1) -
    //       container.current.offsetWidth) /
    //       2 -
    //     innerRadius / 1.414 -
    //     size / 2,
    //   container.current.offsetHeight / 2 +
    //     (size * 0.866 * rows.length +
    //       gutter * (rows.length - 1) -
    //       container.current.offsetHeight) /
    //       2 -
    //     innerRadius / 1.414 -
    //     size / 2 +
    //     gutter
    // )
  }, []);

  const getBubbleSize = (row, col) => {
    let xOffset, yOffset;
    if (options.shape.type == "ellipse") {
      yOffset =
        (options.size + options.gutter) * 0.866 * row -
        options.shape.yRadius / 1.414;
      xOffset =
        (options.size + options.gutter) * col +
        ((options.numCols - rows[row].length) * options.size) / 2 -
        options.shape.xRadius / 1.414;
    } else {
    }
    const dy = yOffset - scrollTop;
    const dx = xOffset - scrollLeft;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return {
      bubbleSize: 1,
      translateX: 0,
      translateY: 0,
      distance: `${Math.round(dx)}, ${Math.round(dy)}`,
    };
    // const yOffset = (options.size * 0.866 + options.gutter) * row - innerRadius / 1.414
    // const xOffset =
    //   (size + gutter) * col +
    //   ((numCols - rows[row].length) * size) / 2 -
    //   innerRadius / 1.414

    // const dy = yOffset - scrollTop
    // const dx = xOffset - scrollLeft
    // const distance = Math.sqrt(dx * dx + dy * dy)
    // if (distance < innerRadius) {
    //   return {
    //     bubbleSize: 1,
    //     translateX: 0,
    //     translateY: 0,
    //     distance: distance
    //   }
    // }
    // let theta = Math.atan(dy / dx)
    // if (dx < 0) theta += Math.PI
    // return {
    //   bubbleSize:
    //     distance < outerRadius
    //       ? 1 -
    //         ((distance - innerRadius) / (outerRadius - innerRadius)) *
    //           (1 - minProportion)
    //       : minProportion,
    //   translateX:
    //     -(distance - innerRadius) * Math.cos(theta) * translationFactor,
    //   translateY:
    //     -(distance - innerRadius) * Math.sin(theta) * translationFactor,
    //   distance: distance
    // }
  };

  return (
    <div
      className={props.className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      style={props.style}
    >
      <div className={styles.container} onScroll={handleScroll} ref={container}>
        <p>{`scrollTop: ${scrollTop}`}</p>
        <p>{`scrollLeft: ${scrollLeft}`}</p>
        <div className={styles.scrollable}>
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
                options.size * options.numCols +
                options.gutter * (options.numCols - 1),
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
                      i > 0 ? -options.size * 0.135 + options.gutter : 0,
                  }}
                >
                  {row.map((comp, j) => {
                    const {
                      bubbleSize,
                      translateX,
                      translateY,
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
                          transform: `translateX(${translateX}px) translateY(${translateY}px)`,
                        }}
                      >
                        <div
                          className={styles.bubble}
                          style={{
                            width: `100%`,
                            height: `100%`,
                            transform: `scale(${bubbleSize})`,
                            borderRadius: `50%`,
                          }}
                        >
                          {options.provideProps
                            ? React.cloneElement(comp, {
                                bubbleSize: bubbleSize * options.size,
                                distanceToCenter: distance,
                                maxSize: options.size,
                                minSize: options.minSize,
                              })
                            : comp}
                        </div>
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

        {options.showGuides ? (
          <div className={styles.guideContainer}>
            <div
              className={styles.guide}
              style={{
                height: options.shape.yRadius * 2,
                width: options.shape.xRadius * 2,
                borderRadius:
                  options.shape.type == "ellipse"
                    ? "50%"
                    : options.shape.cornerRadius,
              }}
            ></div>
            <div
              className={styles.guide}
              style={{
                height: (options.shape.yRadius + options.fringeWidth) * 2,
                width: (options.shape.xRadius + options.fringeWidth) * 2,
                borderRadius:
                  options.shape.type == "ellipse"
                    ? "50%"
                    : options.shape.cornerRadius + options.fringeWidth,
              }}
            ></div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

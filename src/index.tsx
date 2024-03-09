"use client";

import React, { ReactElement, useLayoutEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

interface BubbleOptions {
  size: number;
  minSize: number;
  gutter: number;
  provideProps: boolean;
  numCols: number;
  fringeWidth: number;
  yRadius: number;
  xRadius: number;
  cornerRadius: number;
  showGuides: boolean;
  compact: boolean;
  gravitation: number;
  shape?: "ellipse" | "rectangle";
}

interface BubbleSizeOutput {
  bubbleSize: number;
  translateX: number;
  translateY: number;
  distance: number;
}

export const defaultOptions: BubbleOptions = {
  size: 200,
  minSize: 20,
  gutter: 16,
  provideProps: false,
  numCols: 6,
  fringeWidth: 100,
  yRadius: 200,
  xRadius: 200,
  cornerRadius: 100,
  showGuides: false,
  compact: false,
  gravitation: 0,
};

interface BubbleElementProps {
  children: React.ReactNode;
  options?: Partial<BubbleOptions>;
  className?: string;
  style?: React.CSSProperties;
}

interface BubbleWrapperProps {
  bubbleSize?: number;
  distanceToCenter?: number;
  maxSize?: number;
  minSize?: number;
  children: React.ReactNode;
}

const BubbleWrapper: React.FC<BubbleWrapperProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // You can use the props here as needed, or just render the children directly
  // For demonstration, we're ignoring the props and just rendering children
  return <>{children}</>;
};

const round = (number: number, decimalPlaces: number) => {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(number * factor) / factor;
};

const BubbleElement: React.FC<BubbleElementProps> = ({
  children,
  options: userOptions,
  className,
  style,
}) => {
  const options: BubbleOptions = { ...defaultOptions, ...userOptions };

  options.numCols = Math.min(options.numCols, React.Children.count(children));

  const minProportion = options.minSize / options.size;

  const verticalPadding = `calc(50% - ${
    options.yRadius +
    options.size / 2 -
    (options.cornerRadius * (1.414 - 1)) / 1.414
  }px)`;
  const horizontalPadding = `calc(50% - ${
    options.xRadius +
    options.size / 2 -
    (options.cornerRadius * (1.414 - 1)) / 1.414
  }px)`;

  const scrollable = useRef<HTMLDivElement>(null);

  const rows: ReactElement[][] = [];
  let colsRemaining = 0;
  let evenRow = true;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (colsRemaining === 0) {
        colsRemaining = evenRow ? options.numCols - 1 : options.numCols;
        evenRow = !evenRow;
        rows.push([]);
      }
      rows[rows.length - 1].push(child);
      colsRemaining--;
    }
  });
  if (rows.length > 1) {
    if (rows[rows.length - 1].length % 2 == rows[rows.length - 2].length % 2) {
      rows[rows.length - 1].push(<div></div>); // dummy bubble
    }
  }

  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget; // Use currentTarget instead of target
    if (target.className) {
      setScrollTop(target.scrollTop);
      setScrollLeft(target.scrollLeft);
    }
  };

  // const handleResize = (e) => {
  //   console.log('resize', e)
  //   setElementHeight(container.current.clientHeight)
  // }

  // useLayoutEffect(() => {
  //   window.addEventListener("scroll", handleScroll);

  //   scrollable.current.scrollTo(
  //     (scrollable.current.scrollWidth - scrollable.current.clientWidth) / 2,
  //     (scrollable.current.scrollHeight - scrollable.current.clientHeight) / 2,
  //   );
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  useLayoutEffect(() => {
    window.addEventListener("scroll", handleScroll as unknown as EventListener);
    if (scrollable.current) {
      scrollable.current.scrollTo(
        (scrollable.current.scrollWidth - scrollable.current.clientWidth) / 2,
        (scrollable.current.scrollHeight - scrollable.current.clientHeight) / 2
      );
    }
    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll as unknown as EventListener
      );
  }, []);

  const interpolate = (
    actualMin: number,
    actualMax: number,
    val: number,
    targetMin: number,
    targetMax: number
  ) => {
    return (
      ((val - actualMin) / (actualMax - actualMin)) * (targetMax - targetMin) +
      targetMin
    );
  };

  const getBubbleSize = (row: number, col: number): BubbleSizeOutput => {
    const yOffset =
      (options.size + options.gutter) * 0.866 * row -
      options.size +
      (options.cornerRadius * (1.414 - 1)) / 1.414 -
      (options.yRadius - options.size);
    //  - options.cornerRadius / 1.414;
    const xOffset =
      (options.size + options.gutter) * col +
      ((options.numCols - rows[row].length) * (options.size + options.gutter)) /
        2 -
      options.size +
      (options.cornerRadius * (1.414 - 1)) / 1.414 -
      (options.xRadius - options.size);
    // - options.cornerRadius / 1.414;
    const dy = yOffset - scrollTop;
    const dx = xOffset - scrollLeft;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // let theta = Math.atan(dy / dx);
    // if (dx < 0) theta += Math.PI;
    const out = {
      bubbleSize: 1,
      translateX: 0,
      translateY: 0,
      distance: distance,
    };
    let distanceFromEdge = 0;
    let isInCornerRegion = false;
    if (Math.abs(dx) <= options.xRadius && Math.abs(dy) <= options.yRadius) {
      // inner square
      if (
        Math.abs(dy) > options.yRadius - options.cornerRadius &&
        Math.abs(dx) > options.xRadius - options.cornerRadius
      ) {
        // in corner region
        const distToInnerCorner = Math.sqrt(
          Math.pow(Math.abs(dy) - options.yRadius + options.cornerRadius, 2) +
            Math.pow(Math.abs(dx) - options.xRadius + options.cornerRadius, 2)
        );
        if (distToInnerCorner > options.cornerRadius) {
          // outside inner radius
          distanceFromEdge = distToInnerCorner - options.cornerRadius;
          isInCornerRegion = true;
        }
      }
    } else if (
      Math.abs(dx) <= options.xRadius + options.fringeWidth &&
      Math.abs(dy) <= options.yRadius + options.fringeWidth
    ) {
      // outer square
      if (
        Math.abs(dy) > options.yRadius - options.cornerRadius &&
        Math.abs(dx) > options.xRadius - options.cornerRadius
      ) {
        // in corner region
        isInCornerRegion = true;
        const distToInnerCorner = Math.sqrt(
          Math.pow(Math.abs(dy) - options.yRadius + options.cornerRadius, 2) +
            Math.pow(Math.abs(dx) - options.xRadius + options.cornerRadius, 2)
        );
        distanceFromEdge = distToInnerCorner - options.cornerRadius;
        // distanceFromEdge = Math.min(
        //   distToInnerCorner - options.cornerRadius,
        //   options.fringeWidth
        // );
      } else {
        distanceFromEdge = Math.max(
          Math.abs(dx) - options.xRadius,
          Math.abs(dy) - options.yRadius
        );
      }
    } else {
      // outside outer square
      isInCornerRegion =
        Math.abs(dy) > options.yRadius - options.cornerRadius &&
        Math.abs(dx) > options.xRadius - options.cornerRadius;
      if (isInCornerRegion) {
        const distToInnerCorner = Math.sqrt(
          Math.pow(Math.abs(dy) - options.yRadius + options.cornerRadius, 2) +
            Math.pow(Math.abs(dx) - options.xRadius + options.cornerRadius, 2)
        );
        distanceFromEdge = distToInnerCorner - options.cornerRadius;
      } else {
        distanceFromEdge = Math.max(
          Math.abs(dx) - options.xRadius,
          Math.abs(dy) - options.yRadius
        );
      }
    }

    out.bubbleSize = interpolate(
      0,
      options.fringeWidth,
      Math.min(distanceFromEdge, options.fringeWidth),
      1,
      minProportion
    );

    //handle magnitudes

    const translationMag = options.compact
      ? (options.size - options.minSize) / 2
      : 0;
    const interpolatedTranslationMag = interpolate(
      0,
      options.fringeWidth,
      distanceFromEdge,
      0,
      translationMag
    );

    if (distanceFromEdge > 0 && distanceFromEdge <= options.fringeWidth) {
      out.translateX = interpolatedTranslationMag;
      out.translateY = interpolatedTranslationMag;
    } else if (distanceFromEdge - options.fringeWidth > 0) {
      const extra =
        (Math.max(
          0,
          distanceFromEdge - options.fringeWidth - options.size / 2
        ) *
          options.gravitation) /
        10;
      out.translateX = translationMag + extra;
      out.translateY = translationMag + extra;
    }

    if (isInCornerRegion) {
      const cornerDx = Math.abs(dx) - options.xRadius + options.cornerRadius;
      const cornerDy = Math.abs(dy) - options.yRadius + options.cornerRadius;
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
      out.translateX *= -Math.cos(theta);
      out.translateY *= -Math.sin(theta);
    } else if (
      Math.abs(dx) > options.xRadius ||
      Math.abs(dy) > options.yRadius
    ) {
      if (Math.abs(dx) > options.xRadius) {
        out.translateX *= -Math.sign(dx);
        out.translateY = 0;
      } else {
        out.translateY *= -Math.sign(dy);
        out.translateX = 0;
      }
    }

    return out;
  };

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...style,
      }}
    >
      <div className={styles.container}>
        <div
          className={styles.scrollable}
          ref={scrollable}
          onScroll={(e) => handleScroll(e)}
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
                      i > 0
                        ? options.size * -0.134 + options.gutter * 0.866 // .134 is sqrt(3) - 1
                        : 0,
                  }}
                >
                  {row.map((comp, j) => {
                    const { bubbleSize, translateX, translateY, distance } =
                      getBubbleSize(i, j);

                    const style = {
                      width: `${options.size}px`,
                      height: `${options.size}px`,
                      marginRight: `${options.gutter / 2}px`,
                      marginLeft: `${options.gutter / 2}px`,
                      transform: `translateX(${round(
                        translateX,
                        2
                      )}px) translateY(${round(translateY, 2)}px) scale(${round(
                        bubbleSize,
                        2
                      )})`,
                    };
                    return (
                      <div
                        key={j}
                        className={styles.bubbleContainer}
                        style={style}
                      >
                        {options.provideProps ? (
                          <BubbleWrapper
                            bubbleSize={bubbleSize * options.size}
                            distanceToCenter={distance}
                            maxSize={options.size}
                            minSize={options.minSize}
                          >
                            {comp}
                          </BubbleWrapper>
                        ) : (
                          comp
                        )}
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
                height: options.yRadius * 2,
                width: options.xRadius * 2,
                borderRadius:
                  options.shape == "ellipse" ? "50%" : options.cornerRadius,
              }}
            ></div>
            <div
              className={styles.guide}
              style={{
                height: (options.yRadius + options.fringeWidth) * 2,
                width: (options.xRadius + options.fringeWidth) * 2,
                borderRadius:
                  options.shape == "ellipse"
                    ? "50%"
                    : options.cornerRadius + options.fringeWidth,
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
};
export default BubbleElement;

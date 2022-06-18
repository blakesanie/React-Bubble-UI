import React, { useState, useLayoutEffect, useRef, Children } from 'react';
import {
  Container,
  Scrollable,
  HorizontalSpacer,
  RowContainer,
  Row,
  BubbleContainer,
  Guide,
  GuideContainer,
} from './styles';

interface OptionsProps {
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
  shape?: string;
}

interface Props {
  options: OptionsProps;
  children: React.ReactElement[];
  className?: string;
}

export const defaultOptions = {
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

export function Bubble(props: Props) {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollable = useRef<null | HTMLDivElement>(null);

  const handleScroll = (e: any) => {
    if (e.target.className) {
      setScrollTop(e.target.scrollTop);
      setScrollLeft(e.target.scrollLeft);
    }
  };

  useLayoutEffect(() => {
    window.addEventListener('scroll', handleScroll);
    if (scrollable.current) {
      window.scrollTo(
        (scrollable.current.scrollWidth - scrollable.current.clientWidth) / 2,
        (scrollable.current.scrollHeight - scrollable.current.clientHeight) / 2
      );
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  let options: OptionsProps = {
    ...defaultOptions,
  };

  Object.assign(options, defaultOptions);
  Object.assign(options, props.options);
  options.numCols = Math.min(
    options.numCols,
    Children.toArray(props.children).length
  );

  const minProportion = options.minSize / options.size;

  const verticalPadding = `calc(50% - ${options.yRadius +
    options.size / 2 -
    (options.cornerRadius * (1.414 - 1)) / 1.414}px)`;
  const horizontalPadding = `calc(50% - ${options.xRadius +
    options.size / 2 -
    (options.cornerRadius * (1.414 - 1)) / 1.414}px)`;

  let rows: React.ReactElement[][] = [];
  let colsRemaining = 0;
  let evenRow = true;

  for (let i = 0; i < Children.toArray(props.children).length; i++) {
    if (colsRemaining === 0) {
      colsRemaining = evenRow ? options.numCols - 1 : options.numCols;
      evenRow = !evenRow;
      rows.push([]);
    }
    rows[rows.length - 1].push(props?.children?.[i]);
    colsRemaining--;
  }

  if (rows.length > 1) {
    if (rows[rows.length - 1].length % 2 === rows[rows.length - 2].length % 2) {
      rows[rows.length - 1].push(<div></div>); // dummy bubble
    }
  }

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

  const getBubbleSize = (row: number, col: number) => {
    const yOffset =
      (options.size + options.gutter) * 0.866 * row -
      options.size +
      (options.cornerRadius * (1.414 - 1)) / 1.414 -
      (options.yRadius - options.size);

    const xOffset =
      (options.size + options.gutter) * col +
      ((options.numCols - rows[row].length) * (options.size + options.gutter)) /
        2 -
      options.size +
      (options.cornerRadius * (1.414 - 1)) / 1.414 -
      (options.xRadius - options.size);

    const dy = yOffset - scrollTop;
    const dx = xOffset - scrollLeft;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let out = {
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
      className={props.className}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container>
        {/* <p>{`scrollTop: ${scrollTop}`}</p>
        <p>{`scrollLeft: ${scrollLeft}`}</p> */}
        <Scrollable ref={scrollable} onScroll={handleScroll}>
          <HorizontalSpacer
            style={{
              height: verticalPadding,
            }}
          ></HorizontalSpacer>
          <RowContainer
            style={{
              width:
                options.size * options.numCols +
                options.gutter * (options.numCols - 1),
              paddingLeft: horizontalPadding,
              paddingRight: horizontalPadding,
            }}
          >
            {rows.map((row, i: number) => {
              return (
                <Row
                  key={`${row}-${i}`}
                  style={{
                    marginTop:
                      i > 0
                        ? options.size * -0.134 + options.gutter * 0.866 // .134 is sqrt(3) - 1
                        : 0,
                  }}
                >
                  {row.map((comp, j: number) => {
                    const {
                      bubbleSize,
                      translateX,
                      translateY,
                      distance,
                    } = getBubbleSize(i, j);
                    return (
                      <BubbleContainer
                        key={`${comp}-${j}`}
                        style={{
                          width: options.size,
                          height: options.size,
                          marginRight: options.gutter / 2,
                          marginLeft: options.gutter / 2,
                          transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${bubbleSize})`,
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
                      </BubbleContainer>
                    );
                  })}
                </Row>
              );
            })}
          </RowContainer>
          <HorizontalSpacer
            style={{
              height: verticalPadding,
            }}
          ></HorizontalSpacer>
        </Scrollable>

        {options.showGuides ? (
          <GuideContainer>
            <Guide
              style={{
                height: options.yRadius * 2,
                width: options.xRadius * 2,
                borderRadius:
                  options.shape === 'ellipse' ? '50%' : options.cornerRadius,
              }}
            ></Guide>
            <Guide
              style={{
                height: (options.yRadius + options.fringeWidth) * 2,
                width: (options.xRadius + options.fringeWidth) * 2,
                borderRadius:
                  options.shape === 'ellipse'
                    ? '50%'
                    : options.cornerRadius + options.fringeWidth,
              }}
            ></Guide>
          </GuideContainer>
        ) : null}
      </Container>
    </div>
  );
}

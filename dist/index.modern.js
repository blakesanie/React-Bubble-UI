import React, { useRef, useState, useLayoutEffect } from 'react';

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

var styles = {"container":"_1Lxpd","scrollable":"_2MD0k","horizontalSpacer":"_376IX","rowContainer":"_3bAl3","row":"_1iLpS","bubbleContainer":"_2gu6r","bubble":"_3cleF","guideContainer":"_2SNHQ","guide":"_2pju2"};

var defaultOptions = {
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
  gravitation: 0
};
function BubbleElement(props) {
  if (!props.children) {
    return null;
  }
  var options = {};
  Object.assign(options, defaultOptions);
  Object.assign(options, props.options);
  options.numcols = Math.min(options.numcols, props.children.length);
  var minProportion = options.minsize / options.size;
  var verticalPadding = "calc(50% - " + (options.yradius + options.size / 2 - options.cornerradius * (1.414 - 1) / 1.414) + "px)";
  var horizontalPadding = "calc(50% - " + (options.xradius + options.size / 2 - options.cornerradius * (1.414 - 1) / 1.414) + "px)";
  var scrollable = useRef(null);
  var rows = [];
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
      rows[rows.length - 1].push( /*#__PURE__*/React.createElement("div", null));
    }
  }
  var _useState = useState(0),
    scrollTop = _useState[0],
    setScrollTop = _useState[1];
  var _useState2 = useState(0),
    scrollLeft = _useState2[0],
    setScrollLeft = _useState2[1];
  var handleScroll = function handleScroll(e) {
    if (e.target.className) {
      setScrollTop(e.target.scrollTop);
      setScrollLeft(e.target.scrollLeft);
    }
  };
  useLayoutEffect(function () {
    window.addEventListener("scroll", handleScroll);
    scrollable.current.scrollTo((scrollable.current.scrollWidth - scrollable.current.clientWidth) / 2, (scrollable.current.scrollHeight - scrollable.current.clientHeight) / 2);
    return function () {
      return window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  var interpolate = function interpolate(actualMin, actualMax, val, targetMin, targetMax) {
    return (val - actualMin) / (actualMax - actualMin) * (targetMax - targetMin) + targetMin;
  };
  var getBubbleSize = function getBubbleSize(row, col) {
    var yOffset = (options.size + options.gutter) * 0.866 * row - options.size + options.cornerradius * (1.414 - 1) / 1.414 - (options.yradius - options.size);
    var xOffset = (options.size + options.gutter) * col + (options.numcols - rows[row].length) * (options.size + options.gutter) / 2 - options.size + options.cornerradius * (1.414 - 1) / 1.414 - (options.xradius - options.size);
    var dy = yOffset - scrollTop;
    var dx = xOffset - scrollLeft;
    var distance = Math.sqrt(dx * dx + dy * dy);
    var out = {
      bubblesize: 1,
      translatex: 0,
      translatey: 0,
      distance: distance
    };
    var distanceFromEdge = 0;
    var isInCornerRegion = false;
    if (Math.abs(dx) <= options.xradius && Math.abs(dy) <= options.yradius) {
      if (Math.abs(dy) > options.yradius - options.cornerradius && Math.abs(dx) > options.xradius - options.cornerradius) {
        var distToInnerCorner = Math.sqrt(Math.pow(Math.abs(dy) - options.yradius + options.cornerradius, 2) + Math.pow(Math.abs(dx) - options.xradius + options.cornerradius, 2));
        if (distToInnerCorner > options.cornerradius) {
          distanceFromEdge = distToInnerCorner - options.cornerradius;
          isInCornerRegion = true;
        }
      }
    } else if (Math.abs(dx) <= options.xradius + options.fringewidth && Math.abs(dy) <= options.yradius + options.fringewidth) {
      if (Math.abs(dy) > options.yradius - options.cornerradius && Math.abs(dx) > options.xradius - options.cornerradius) {
        isInCornerRegion = true;
        var _distToInnerCorner = Math.sqrt(Math.pow(Math.abs(dy) - options.yradius + options.cornerradius, 2) + Math.pow(Math.abs(dx) - options.xradius + options.cornerradius, 2));
        distanceFromEdge = _distToInnerCorner - options.cornerradius;
      } else {
        distanceFromEdge = Math.max(Math.abs(dx) - options.xradius, Math.abs(dy) - options.yradius);
      }
    } else {
      isInCornerRegion = Math.abs(dy) > options.yradius - options.cornerradius && Math.abs(dx) > options.xradius - options.cornerradius;
      if (isInCornerRegion) {
        var _distToInnerCorner2 = Math.sqrt(Math.pow(Math.abs(dy) - options.yradius + options.cornerradius, 2) + Math.pow(Math.abs(dx) - options.xradius + options.cornerradius, 2));
        distanceFromEdge = _distToInnerCorner2 - options.cornerradius;
      } else {
        distanceFromEdge = Math.max(Math.abs(dx) - options.xradius, Math.abs(dy) - options.yradius);
      }
    }
    out.bubblesize = interpolate(0, options.fringewidth, Math.min(distanceFromEdge, options.fringewidth), 1, minProportion);
    var translationMag = options.compact ? (options.size - options.minsize) / 2 : 0;
    var interpolatedTranslationMag = interpolate(0, options.fringewidth, distanceFromEdge, 0, translationMag);
    if (distanceFromEdge > 0 && distanceFromEdge <= options.fringewidth) {
      out.translatex = interpolatedTranslationMag;
      out.translatey = interpolatedTranslationMag;
    } else if (distanceFromEdge - options.fringewidth > 0) {
      var extra = Math.max(0, distanceFromEdge - options.fringewidth - options.size / 2) * options.gravitation / 10;
      out.translatex = translationMag + extra;
      out.translatey = translationMag + extra;
    }
    if (isInCornerRegion) {
      var cornerDx = Math.abs(dx) - options.xradius + options.cornerradius;
      var cornerDy = Math.abs(dy) - options.yradius + options.cornerradius;
      var theta = Math.atan(-cornerDy / cornerDx);
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
    } else if (Math.abs(dx) > options.xradius || Math.abs(dy) > options.yradius) {
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
  return /*#__PURE__*/React.createElement("div", {
    className: props.className,
    style: _extends({
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }, props.style)
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.container
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.scrollable,
    ref: scrollable,
    onScroll: handleScroll
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.horizontalSpacer,
    style: {
      height: verticalPadding
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: styles.rowContainer,
    style: {
      width: options.size * options.numcols + options.gutter * (options.numcols - 1),
      paddingLeft: horizontalPadding,
      paddingRight: horizontalPadding
    }
  }, rows.map(function (row, i) {
    return /*#__PURE__*/React.createElement("div", {
      className: styles.row,
      key: i,
      style: {
        marginTop: i > 0 ? options.size * -0.134 + options.gutter * 0.866 : 0
      }
    }, row.map(function (comp, j) {
      var _getBubbleSize = getBubbleSize(i, j),
        bubblesize = _getBubbleSize.bubblesize,
        translatex = _getBubbleSize.translatex,
        translatey = _getBubbleSize.translatey,
        distance = _getBubbleSize.distance;
      return /*#__PURE__*/React.createElement("div", {
        key: j,
        className: styles.bubbleContainer,
        style: {
          width: options.size,
          height: options.size,
          marginRight: options.gutter / 2,
          marginLeft: options.gutter / 2,
          transform: "translatex(" + translatex + "px) translatey(" + translatey + "px) scale(" + bubblesize + ")"
        }
      }, options.provideprops ? React.cloneElement(comp, {
        bubblesize: bubblesize * options.size,
        distanceToCenter: distance,
        maxSize: options.size,
        minsize: options.minsize
      }) : comp);
    }));
  })), /*#__PURE__*/React.createElement("div", {
    className: styles.horizontalSpacer,
    style: {
      height: verticalPadding
    }
  })), options.showguides ? /*#__PURE__*/React.createElement("div", {
    className: styles.guideContainer
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.guide,
    style: {
      height: options.yradius * 2,
      width: options.xradius * 2,
      borderRadius: options.shape == "ellipse" ? "50%" : options.cornerradius
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: styles.guide,
    style: {
      height: (options.yradius + options.fringewidth) * 2,
      width: (options.xradius + options.fringewidth) * 2,
      borderRadius: options.shape == "ellipse" ? "50%" : options.cornerradius + options.fringewidth
    }
  })) : null));
}

export default BubbleElement;
export { defaultOptions };
//# sourceMappingURL=index.modern.js.map

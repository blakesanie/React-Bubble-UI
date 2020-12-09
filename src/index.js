import React, { useState, useLayoutEffect, useRef } from 'react'
import styles from './styles.module.css'

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
      type: 'ellipse',
      yRadius: 100,
      xRadius: 100,
      cornerRadius: 30
    }
  }
  const size = props.size || 200
  const minSize = props.minSize || 10
  const minProportion = minSize / size
  console.log('minProportion', minProportion)
  const gutter = props.gutter || 10
  const translationFactor = props.translationFactor || 0
  const provideProps = props.provideProps || false
  const numCols = Math.min(
    props.width || 12,
    props.children ? props.children.length : Infinity
  )

  const innerRadius = props.innerRadius || 250
  const outerRadius = props.outerRadius || 450

  const paddingCalc = `calc(50% - ${size / 2}px - ${innerRadius / 1.414}px)`

  const container = useRef(null)

  const resize = props.resize || false

  let rows = []
  var colsRemaining = 0
  var evenRow = true
  for (var i = 0; i < props.children.length; i++) {
    if (colsRemaining == 0) {
      colsRemaining = evenRow ? numCols - 1 : numCols
      evenRow = !evenRow
      rows.push([])
    }
    rows[rows.length - 1].push(props.children[i])
    colsRemaining--
  }
  if (rows.length > 1) {
    if (rows[rows.length - 1].length % 2 == rows[rows.length - 2].length % 2) {
      rows[rows.length - 1].push(<div></div>) // dummy bubble
    }
  }

  const [scrollTop, setScrollTop] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleScroll = (e) => {
    // console.log(e)
    if (e.target.className) {
      setScrollTop(e.target.scrollTop)
      setScrollLeft(e.target.scrollLeft)
    }
  }

  // const handleResize = (e) => {
  //   console.log('resize', e)
  //   setElementHeight(container.current.clientHeight)
  // }

  useLayoutEffect(() => {
    window.addEventListener('scroll', handleScroll, true)
    // window.addEventListener('resize', handleResize, true)
    container.current.scrollTo(
      container.current.offsetWidth / 2 +
        (size * numCols +
          gutter * (numCols - 1) -
          container.current.offsetWidth) /
          2 -
        innerRadius / 1.414 -
        size / 2,
      container.current.offsetHeight / 2 +
        (size * 0.866 * rows.length +
          gutter * (rows.length - 1) -
          container.current.offsetHeight) /
          2 -
        innerRadius / 1.414 -
        size / 2 +
        gutter
    )
  }, [])

  const getBubbleSize = (row, col) => {
    const yOffset = (size * 0.866 + gutter) * row - innerRadius / 1.414
    const xOffset =
      (size + gutter) * col +
      ((numCols - rows[row].length) * size) / 2 -
      innerRadius / 1.414

    const dy = yOffset - scrollTop
    const dx = xOffset - scrollLeft
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance < innerRadius) {
      return {
        bubbleSize: 1,
        translateX: 0,
        translateY: 0,
        distance: distance
      }
    }
    let theta = Math.atan(dy / dx)
    if (dx < 0) theta += Math.PI
    return {
      bubbleSize:
        distance < outerRadius
          ? 1 -
            ((distance - innerRadius) / (outerRadius - innerRadius)) *
              (1 - minProportion)
          : minProportion,
      translateX:
        -(distance - innerRadius) * Math.cos(theta) * translationFactor,
      translateY:
        -(distance - innerRadius) * Math.sin(theta) * translationFactor,
      distance: distance
    }
  }

  return (
    <div
      className={props.className}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      style={props.style}
    >
      <div className={styles.container} onScroll={handleScroll} ref={container}>
        <div
          className={styles.horizontalSpacer}
          style={{
            height: paddingCalc
          }}
        ></div>
        <div
          className={styles.rowContainer}
          style={{
            width: size * numCols + gutter * (numCols - 1),
            paddingLeft: paddingCalc,
            paddingRight: paddingCalc
          }}
        >
          {rows.map((row, i) => {
            return (
              <div
                className={styles.row}
                key={i}
                style={{
                  marginTop: i > 0 ? -size * 0.135 + gutter : 0
                }}
              >
                {row.map((comp, j) => {
                  const {
                    bubbleSize,
                    translateX,
                    translateY,
                    distance
                  } = getBubbleSize(i, j)
                  return (
                    <div
                      key={j}
                      className={styles.bubbleContainer}
                      style={{
                        width: size,
                        height: size,
                        marginRight: gutter / 2,
                        marginLeft: gutter / 2,
                        transform: `translateX(${translateX}px) translateY(${translateY}px)`
                      }}
                    >
                      <div
                        className={styles.bubble}
                        style={{
                          width: `100%`,
                          height: `100%`,
                          transform: `scale(${bubbleSize})`,
                          borderRadius: `50%`
                        }}
                      >
                        {provideProps
                          ? React.cloneElement(comp, {
                              bubbleSize: bubbleSize * size,
                              distanceToCenter: distance,
                              maxSize: size,
                              minSize: minSize
                            })
                          : comp}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
        <div
          className={styles.horizontalSpacer}
          style={{
            height: paddingCalc
          }}
        ></div>
      </div>
    </div>
  )
}

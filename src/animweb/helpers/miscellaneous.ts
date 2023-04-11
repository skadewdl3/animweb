// @ts-nocheck

import Constants from "./Constants";

export const wait = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const roundOff = (num, scale) => {
  if (!('' + num).includes('e')) {
    return +(Math.round(num + 'e+' + scale) + 'e-' + scale)
  } else {
    var arr = ('' + num).split('e')
    var sig = ''
    if (+arr[1] + scale > 0) {
      sig = '+'
    }
    return +(Math.round(+arr[0] + 'e' + sig + (+arr[1] + scale)) + 'e-' + scale)
  }
}

export const degToRad = (deg) => {
  return (deg * Math.PI) / 180
}

export const radToDeg = (rad) => {
  return (rad * 180) / Math.PI
}

export const rangePerFrame = (range, duration) => {
  let fps = Constants.FrameRate
  let rangePerSecond = range / duration
  let rangePerFrame = rangePerSecond / fps
  return rangePerFrame
}

export const getQuadrant = (config: number | { x: number; y: number }) => {
  let angle = null,
    x = null,
    y = null
  if (typeof config == 'number') angle = config
  else {
    x = config.x
    y = config.y
  }
  if (angle) {
    // find quadrant from angle
    console.log('this ran')
    if (angle == 0) return -3
    if (angle == 90) return -1
    if (angle == 180 || angle == -180) return -4
    if (angle == -90) return -2

    if (angle > 0 && angle < 90) return 1
    if (angle > 90 && angle < 180) return 2
    if (angle < -90 && angle > -180) return 3
    if (angle < 0 && angle > -90) return 4
  } else {
    if (x == 0 && y > 0) return -1
    if (x == 0 && y < 0) return -2
    if (y == 0 && x > 0) return -3
    if (y == 0 && x < 0) return -4

    if (x > 0) {
      if (y > 0) return 1
      if (y < 0) return 4
    }
    if (x < 0) {
      if (y > 0) return 2
      if (y < 0) return 3
    }
  }
}
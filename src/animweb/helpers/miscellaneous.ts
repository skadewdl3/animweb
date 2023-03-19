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

export const rangePerFrame = (range, duration) => {
  let fps = Constants.FrameRate
  let rangePerSecond = range / duration
  let rangePerFrame = rangePerSecond / fps
  return rangePerFrame
}
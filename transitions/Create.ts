import { v4 as uuid } from 'uuid'
import AnimObject from '@core/AnimObject2D.ts'
import Curve from '@AnimObjects2D/Curve.ts'
import Line from '@AnimObjects2D/Line.ts'
import NumberPlane from '@AnimObjects2D/NumberPlane.ts'
import Point from '@AnimObjects2D/Point.ts'
import Constants from '@helpers/Constants.ts'
import { rangePerFrame, roundOff, wait } from '@helpers/miscellaneous.ts'
import { TransitionProgressProps } from '@interfaces/transitions.ts'
import { TransitionTypes } from '@enums/transitions.ts'
import { createTransition } from '@core/Transition.ts'
import Text from '@AnimObjects2D/Text.ts'
import anime from 'animejs'
import LaTeX from '@AnimObjects2D/LaTeX.ts'
import ImplicitCurve from '@AnimObjects2D/ImplicitCurve.ts'
import Color from '@auxiliary/Color.ts'
import AnimObject2D from '@core/AnimObject2D.ts'

const hideObject = (object: AnimObject, shouldHide: boolean) => {
  object.color.setAlpha(shouldHide ? 0 : object.maxAlpha)
}

const hideObjects = (arr: Array<AnimObject>, shouldHide: boolean) => {
  arr.forEach((obj) => hideObject(obj, shouldHide))
}

const createLineTransition = (
  object: Line,
  config: any,
  transitionData: {
    type: TransitionTypes
    isFirst?: boolean
    isLast?: boolean
    id?: string
  } = {
    type: TransitionTypes.single,
    isFirst: false,
    isLast: false,
    id: '',
  },
  overrideDuration?: number
) => {
  let transitionQueueItem = {
    id: transitionData.id ? transitionData.id : uuid(),
    object,
  }
  let queued = false
  let duration = overrideDuration
    ? overrideDuration
    : config.duration
    ? config.duration
    : Constants.createLineDuration
  let domain = object.domain
  let range = object.range
  let slope = object.slope

  let lowerBound = domain[0]
  let midpoint = (domain[0] + domain[1]) / 2
  let upperBound = domain[1]
  if (slope > 1 || slope < -1) {
    lowerBound = range[0]
    midpoint = (range[0] + range[1]) / 2
    upperBound = range[1]
    object.range = [midpoint, midpoint]
  } else {
    object.domain = [midpoint, midpoint]
  }

  let speed = rangePerFrame(upperBound - lowerBound, duration)

  return () => {
    if (!queued && transitionData.type == TransitionTypes.single) {
      object.scene.enqueueTransition(transitionQueueItem)
      queued = true
    }
    if (
      !queued &&
      transitionData.type == TransitionTypes.group &&
      transitionData.isFirst
    ) {
      object.scene.enqueueTransition(transitionQueueItem)
      queued = true
    }
    if (slope > 1 || slope < -1) {
      if (object.range[0] <= lowerBound && object.range[1] >= upperBound) {
        object.transition = null
        object.range = [lowerBound, upperBound]
        if (queued && transitionData.type == TransitionTypes.single) {
          object.scene.dequeueTransition(transitionQueueItem)
        }
        if (
          !queued &&
          transitionData.type == TransitionTypes.group &&
          transitionData.isLast
        ) {
          object.scene.dequeueTransition(transitionQueueItem)
          queued = true
        }
      } else {
        object.range[0] -= speed
        object.range[1] += speed
      }
    } else {
      if (object.domain[0] <= lowerBound && object.domain[1] >= upperBound) {
        object.transition = null
        object.domain = [lowerBound, upperBound]
        if (queued && transitionData.type == TransitionTypes.single) {
          object.scene.dequeueTransition(transitionQueueItem)
        }
        if (
          !queued &&
          transitionData.type == TransitionTypes.group &&
          transitionData.isLast
        ) {
          object.scene.dequeueTransition(transitionQueueItem)
          queued = true
        }
      } else {
        object.domain[0] -= speed
        object.domain[1] += speed
      }
    }
  }
}

const createLineTransitionNew = (
  line: Line,
  duration: number = 1,
  onEndCallback: Function = () => {}
) => {
  let lowerBound =
    line.slope > 1 || line.slope < -1 ? line.range[0] : line.domain[0]
  let upperBound =
    line.slope > 1 || line.slope < -1 ? line.range[1] : line.domain[1]
  let modify = line.slope > 1 || line.slope < -1 ? 'range' : 'domain'
  let speed = rangePerFrame(upperBound - lowerBound, duration)

  // @ts-ignore
  line[modify][1] = lowerBound

  return createTransition(
    {
      onStart() {
        line.color.setAlpha(1)
      },
      onProgress({ end }: TransitionProgressProps) {
        // console.log('this ran')
        // @ts-ignore
        line[modify][1] += speed
      },
      onEnd() {
        onEndCallback()
      },
      endCondition() {
        // @ts-ignore
        return line[modify][1] >= upperBound
      },
    },
    line
  )
}

const createLineTransitions = (
  arr: Array<Line>,
  config: any,
  totalDuration: number
) => {
  let duration = totalDuration
  let id = uuid()
  arr.forEach((line, i) => {
    hideObject(line, false)
    line.transition = createLineTransition(
      line,
      config,
      {
        type: TransitionTypes.group,
        isFirst: i == 0,
        isLast: i == arr.length - 1,
        id,
      },
      duration
    )
  })
}

const createStaggeredLineTransitions = async (
  arr: Array<Line>,
  config: any,
  totalDuration: number
) => {
  let id = uuid()
  let durationPerLine = totalDuration / arr.length
  for (let i = 0; i < arr.length; i++) {
    let line = arr[i]
    hideObject(line, false)
    line.transition = createLineTransition(
      line,
      config,
      {
        type: TransitionTypes.group,
        isFirst: i == 0,
        isLast: i == arr.length - 1,
        id,
      },
      durationPerLine
    )
    await wait(10)
  }
}

const createPointTransition = (
  object: Point,
  config: any,
  transitionData: {
    type: TransitionTypes
    isFirst?: boolean
    isLast?: boolean
    id?: string
  } = {
    type: TransitionTypes.single,
    isFirst: false,
    isLast: false,
    id: '',
  },
  overrideDuration?: number
) => {
  let transitionQueueItem = {
    id: transitionData.id ? transitionData.id : uuid(),
    object,
  }
  let queued = false
  let size = object.size
  let duration = overrideDuration
    ? overrideDuration
    : config.duration
    ? config.duration
    : Constants.createPointDuration
  let speed = rangePerFrame(size - 0, duration)
  object.size = 0
  if (transitionData.type == TransitionTypes.single && !queued) {
    object.scene.enqueueTransition(transitionQueueItem)
  }
  if (
    transitionData.type == TransitionTypes.group &&
    transitionData.isFirst &&
    !queued
  ) {
    object.scene.dequeueTransition(transitionQueueItem)
  }
  return () => {
    if (object.size >= size) {
      object.transition = null
      object.size = size
      if (transitionData.type == TransitionTypes.single) {
        object.scene.dequeueTransition(transitionQueueItem)
      }
      if (
        transitionData.type == TransitionTypes.group &&
        transitionData.isLast
      ) {
        object.scene.dequeueTransition(transitionQueueItem)
      }
    } else {
      object.size += speed
    }
  }
}

const createPointTransitions = async (
  arr: Array<Point>,
  config: any,
  totalDuration: number
) => {
  let id = uuid()
  for (let i = 0; i < arr.length; i++) {
    let point = arr[i]
    hideObject(point, false)
    point.transition = createPointTransition(
      arr[i],
      config,
      {
        type: TransitionTypes.group,
        isFirst: i == 0,
        isLast: i == arr.length - 1,
        id,
      },
      totalDuration / arr.length
    )
  }
}

const Create = <Object extends AnimObject2D>(
  object: Object,
  config: any = {}
): Object => {
  if (object instanceof Line) {
    object.transition = createLineTransition(object, config)
  }
  if (object instanceof Point) {
    object.transition = createPointTransition(object, config)
  }
  if (object instanceof NumberPlane) {
    let totalDuration = config.duration
      ? config.duration
      : Constants.createNumberPlaneDuration

    hideObjects(object.axes, true)
    hideObjects(object.xGrid, true)
    hideObjects(object.yGrid, true)
    hideObjects(object.xTicks, true)
    hideObjects(object.yTicks, true)
    hideObjects(object.points, true)
    hideObjects(object.curves, true)

    object.curves.forEach(curve => {
      if (curve instanceof Curve) hideObjects(curve.lines, true)
    })

    hideObjects(object.axes, false)
    createLineTransitions(object.axes, config, totalDuration / 4)
    wait((totalDuration / 6) * 1000).then(() => {
      createPointTransitions(object.xTicks, config, totalDuration / 4)
      createPointTransitions(object.yTicks, config, totalDuration / 4)
      createLineTransitions(object.xGrid, config, totalDuration / 4)
      createLineTransitions(object.yGrid, config, totalDuration / 4)
      wait((totalDuration / 6) * 1000).then(() => {
        createPointTransitions(object.points, config, totalDuration / 4)
        object.curves.forEach(curve => {
          if (curve instanceof Curve)
            createStaggeredLineTransitions(
              curve.lines,
              config,
              totalDuration / 4
            )
        })
      })
    })
  } else if (object instanceof Curve) {
    let duration = config.duration
      ? config.duration
      : Constants.createLineDuration
    hideObjects(object.lines, true)
    // createStaggeredLineTransitions(object.lines, config, duration)
    let prevLine = -1
    let currentLine = 0
    object.transition = createTransition(
      {
        onProgress({ end }: TransitionProgressProps) {
          if (currentLine != prevLine) {
            prevLine = currentLine
            let line = object.lines[currentLine]
            line.transition = createLineTransitionNew(
              line,
              duration / object.lines.length,
              () => {
                currentLine++
                console.log('line ended')
              }
            )
          }
        },
        endCondition() {
          if (currentLine >= object.lines.length) console.log('this ran')
          return currentLine >= object.lines.length
        },
      },
      object
    )
  } else if (object instanceof ImplicitCurve) {
    let executeTransition = true
    let tx = createTransition(
      {
        onStart() {
          object.redraw = false
          object.animating = true
          anime({
            targets: `#${object.id}`,
            opacity: [0, 1],
          })
        },
        onEnd() {
          anime({
            targets: `#${object.id}`,
            opacity: [1, 0],
          })
          object.show = true
          object.redraw = true
          object.animating = false
        },
        onProgress: ({ end }: TransitionProgressProps) => {
          if (object.svgEl && executeTransition) {
            anime({
              targets: `#${object.id} path`,
              strokeDashoffset: [anime.setDashoffset, 0],
              easing: 'easeInOutSine',
              stroke: object.color.rgba,
              duration: config.duration || 150,
              direction: 'normal',
              delay: function (el, i) {
                return (
                  i * (((config.duration || 150) * 10) / object.contours.length)
                )
              },
              loop: false,
              complete() {
                end()
                object.show = true
              },
            })
            executeTransition = false
          }
        },
        endCondition: () => false,
      },
      object
    )
    object.transition = tx
  } else if (object instanceof Text) {
    let executeTransition = true
    object.animating = true
    let tx = createTransition(
      {
        onProgress: ({ end }: TransitionProgressProps) => {
          if (object.svgEl && executeTransition) {
            anime({
              targets: `#${object.id} path`,
              strokeDashoffset: [anime.setDashoffset, 0],
              stroke: object.color.rgba,
              easing: 'easeInOutSine',
              duration: (3 * config.duration) / 4 || 1500,
              direction: 'alternate',
              translateY: [0, object.size < 20 ? 0 : 2],
              loop: false,
              complete() {
                ;(object.svgEl as SVGElement).style.transformOrigin = '50% 50%'

                anime({
                  targets: `#${object.id} path`,
                  fill: object.color.rgba,
                  easing: 'easeInOutSine',
                  duration: config.duration / 4 || 500,
                  direction: 'alternate',
                  loop: false,
                  complete() {
                    end()
                  },
                })
                if (object.size < 20) {
                  end()
                  return
                }
                anime({
                  targets: `#${object.id}`,
                  scale: [1, 0.974],
                  easing: 'easeInOutSine',
                  duration: config.duration / 5 || 500,
                  loop: false,
                  complete() {
                    object.animating = false
                    anime({
                      targets: `#${object.id}`,
                      opacity: [1, 0],
                      easing: 'easeInOutSine',
                      duration: config.duration / 5 || 500,
                      loop: false,
                    })
                  },
                })
              },
            })
            executeTransition = false
          }
        },
        endCondition: () => false,
      },
      object
    )
    object.transition = tx
  } else if (object instanceof LaTeX) {
    let executeTransition = true
    let tx = createTransition(
      {
        onProgress: ({ end }: TransitionProgressProps) => {
          if (object.svgEl && executeTransition) {
            anime({
              targets: `#${object.id} path`,
              strokeDashoffset: [anime.setDashoffset, 0],
              stroke: '#ff0000',
              easing: 'easeInOutSine',
              duration: (3 * config.duration) / 4 || 1500,
              direction: 'alternate',
              loop: false,
              complete() {
                anime({
                  targets: `#${object.id} path`,
                  fill: '#ff0000',
                  easing: 'easeInOutSine',
                  duration: config.duration / 4 || 1500,
                  direction: 'alternate',
                  loop: false,
                  complete() {
                    end()
                  },
                })
              },
            })
            executeTransition = false
          }
        },
        endCondition: () => false,
      },
      object
    )
    object.transition = tx

    // console.log(object)
  }
  return object
}

export default Create

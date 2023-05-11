import { v4 as uuid } from 'uuid'
import AnimObject from '@/core/AnimObject2D'
import Curve from '@AnimObjects2D/Curve'
import Line from '@AnimObjects2D/Line'
import NumberPlane from '@AnimObjects2D/NumberPlane'
import Point from '@AnimObjects2D/Point'
import Constants from '@helpers/Constants'
import { rangePerFrame, wait } from '@helpers/miscellaneous'
import { TransitionProgressProps } from '@interfaces/transitions'
import { TransitionTypes } from '@/enums/transitions'
import { createTransition } from '@core/Transition'
import Text from '@AnimObjects2D/Text'
import anime from 'animejs'
import LaTeX from '@AnimObjects2D/LaTeX'
import ImplicitCurve from '@/AnimObjects2D/ImplicitCurve'

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

const Create = <Object extends AnimObject>(
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

    object.curves.forEach((curve) => {
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
        object.curves.forEach((curve) => {
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
    createStaggeredLineTransitions(object.lines, config, duration)
  } else if (object instanceof ImplicitCurve) {
    let executeTransition = true
    let tx = createTransition({
      onProgress: ({ end }: TransitionProgressProps) => {
        if (object.svgEl && executeTransition) {
          // @ts-ignore
          object.svgEl.querySelector('path').style.stroke = 'black'
          anime({
            targets: `#${object.id} path`,
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'easeInOutSine',
            duration: config.duration || 1500,
            direction: 'alternate',
            loop: false,
            complete() {
              end()
            },
          })
          executeTransition = false
        }
      },
      endCondition: () => false,
      object,
    })
    object.transition = tx
  } else if (object instanceof Text) {
    let executeTransition = true
    let tx = createTransition({
      onProgress: ({ end }: TransitionProgressProps) => {
        if (object.svgEl && executeTransition) {
          anime({
            targets: `#${object.id} path`,
            strokeDashoffset: [anime.setDashoffset, 0],
            stroke: '#ff0000',
            easing: 'easeInOutSine',
            duration: (3 * config.duration) / 4 || 1500,
            direction: 'alternate',
            // delay: anime.stagger(100, { direction: 'reverse' }),
            loop: false,
            complete() {
              anime({
                targets: `#${object.id} path`,
                fill: '#ff0000',
                easing: 'easeInOutSine',
                duration: config.duration / 4 || 500,
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
      object,
    })
    object.transition = tx
  } else if (object instanceof LaTeX) {
    let executeTransition = true
    let tx = createTransition({
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
      object,
    })
    object.transition = tx

    // console.log(object)
  }
  return object
}

export default Create

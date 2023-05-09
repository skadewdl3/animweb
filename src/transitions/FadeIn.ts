import { v4 as uuid } from 'uuid'
import AnimObject from '@/core/AnimObject2D'
import Curve from '@AnimObjects2D/Curve'
import Line from '@AnimObjects2D/Line'
import NumberPlane from '@AnimObjects2D/NumberPlane'
import Point from '@AnimObjects2D/Point'
import Constants from '@helpers/Constants'
import { wait, roundOff, rangePerFrame } from '@helpers/miscellaneous'
import { TransitionProgressProps } from '@interfaces/transitions'
import { TransitionTypes } from '@/enums/transitions'
import { createTransition } from '@core/Transition'
import ImplicitCurve from '@AnimObjects2D/ImplicitCurve'
import Text from '@AnimObjects2D/Text'
import Vector from '@AnimObjects2D/Vector'
import anime from 'animejs'
import LaTeX from '@AnimObjects2D/LaTeX'

const resetColor = (object: AnimObject) => {
  object.color.setAlpha(0)
  object.color.refresh()
}

const resetColors = (arr: Array<AnimObject>) => {
  arr.forEach((object) => resetColor(object))
}

const fadeInTransition = (
  object: AnimObject,
  config: any,
  transitionData: {
    type?: TransitionTypes
    isFirst?: boolean
    isLast?: boolean
    id?: string
  } = {
    type: TransitionTypes.single,
    isFirst: false,
    isLast: false,
    id: uuid(),
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
    : Constants.fadeInLineDuration
  let speed = rangePerFrame(object.maxAlpha, duration)
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
    if (roundOff(object.color.rgbaVals[3], 2) == object.maxAlpha) {
      object.transition = null
      object.color.setAlpha(object.maxAlpha)
      if (transitionData.type == TransitionTypes.single) {
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
      object.color.setAlpha(object.color.rgbaVals[3] + speed)
    }
  }
}

const fadeInTransitions = (
  arr: Array<AnimObject>,
  config: any,
  overrideDuration?: number
) => {
  let id = uuid()
  let totalDuration = overrideDuration
    ? overrideDuration
    : config.duration
    ? config.duration
    : Constants.fadeInLineDuration

  arr.forEach(
    (object, i) =>
      (object.transition = fadeInTransition(
        object,
        config,
        {
          type: TransitionTypes.group,
          isFirst: i == 0,
          isLast: i == arr.length - 1,
          id,
        },
        totalDuration
      ))
  )
}

const FadeIn = <Object extends AnimObject>(
  object: Object,
  config: any = {}
): Object => {
  if (object instanceof Line) {
    resetColor(object)
    object.transition = fadeInTransition(object, config)
  } else if (object instanceof Point) {
    resetColor(object)
    object.transition = fadeInTransition(object, config)
  } else if (object instanceof NumberPlane) {
    let totalDuration = config.duration
      ? config.duration
      : Constants.fadeInNumberPlaneDuration

    resetColors(object.axes)
    resetColors(object.xTicks)
    resetColors(object.yTicks)
    resetColors(object.xGrid)
    resetColors(object.yGrid)
    resetColors(object.points)
    object.curves.forEach((curve) => {
      if (curve instanceof Curve) resetColors(curve.lines)
    })
    object.implicitCurves.forEach((implicitCurve) => {
      if (implicitCurve instanceof ImplicitCurve) resetColor(implicitCurve)
    })

    fadeInTransitions(object.axes, config, totalDuration / 3)

    fadeInTransitions(object.xTicks, config, totalDuration / 3)
    fadeInTransitions(object.yTicks, config, totalDuration / 3)
    fadeInTransitions(object.xGrid, config, totalDuration / 3)
    fadeInTransitions(object.yGrid, config, totalDuration / 3)

    wait((totalDuration / 3) * 1000).then(() => {
      fadeInTransitions(object.points, config, totalDuration / 3)
      wait((totalDuration / 3) * 1000).then(() => {
        object.curves.forEach((curve) => {
          if (curve instanceof Curve)
            fadeInTransitions(curve.lines, config, totalDuration / 3)
        })
        object.implicitCurves.forEach((implicitCurve) => {
          if (implicitCurve instanceof ImplicitCurve) {
            implicitCurve.transition = fadeInTransition(
              implicitCurve,
              config,
              {},
              totalDuration / 3
            )
          }
        })
      })
    })
  } else if (object instanceof Curve) {
    object.lines.forEach((line) => resetColor(line))
    fadeInTransitions(object.lines, config)
  } else if (object instanceof ImplicitCurve) {
    resetColor(object)
    object.transition = fadeInTransition(object, config)
  } else if (object instanceof Vector) {
    resetColor(object)
    object.transition = fadeInTransition(object, config)
  } else if (object instanceof Text) {
    let executeTransition = true
    let tx = createTransition({
      onProgress: ({ end }: TransitionProgressProps) => {
        if (object.svgEl && executeTransition) {
          anime({
            targets: `#${object.id} path`,
            stroke: '#ff0000',
            fill: '#ff0000',
            easing: 'easeInOutSine',
            duration: 1500,
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
  } else if (object instanceof LaTeX) {
    let executeTransition = true
    let tx = createTransition({
      onProgress: ({ end }: TransitionProgressProps) => {
        if (object.svgEl && executeTransition) {
          anime({
            targets: `#${object.id} path`,
            stroke: '#ff0000',
            fill: '#ff0000',
            easing: 'easeInOutSine',
            duration: 1500,
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

    // console.log(object)
  }
  return object
}

export default FadeIn

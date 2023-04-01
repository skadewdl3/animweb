import { v4 as uuid } from 'uuid'
import AnimObject, { AnimObjects } from '../AnimObject'
import Curve from '../AnimObjects/Curve'
import Line from '../AnimObjects/Line'
import NumberPlane from '../AnimObjects/NumberPlane'
import Point from '../AnimObjects/Point'
import Constants from '../helpers/Constants'
import { wait, roundOff, rangePerFrame } from '../helpers/miscellaneous'
import TransitionProps, { TransitionTypes } from '../Transition'
import { ImplicitCurve } from '../AnimObjects/ImplicitCurve'

interface FadeInTransitionProps extends TransitionProps {}

const resetColor = (object: AnimObject) => {
  object.color.setAlpha(0)
  object.color.refresh()
}

const resetColors = (arr: Array<AnimObject>) => {
  arr.forEach((object) => resetColor(object))
}

const fadeInTransition = (
  object: AnimObject,
  config: FadeInTransitionProps,
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
      object.queueTransition(transitionQueueItem)
      queued = true
    }
    if (
      !queued &&
      transitionData.type == TransitionTypes.group &&
      transitionData.isFirst
    ) {
      object.queueTransition(transitionQueueItem)
      queued = true
    }
    if (roundOff(object.color.rgbaVals[3], 2) == object.maxAlpha) {
      object.transition = null
      object.color.setAlpha(object.maxAlpha)
      if (transitionData.type == TransitionTypes.single) {
        object.unqueueTransition(transitionQueueItem)
      }
      if (
        !queued &&
        transitionData.type == TransitionTypes.group &&
        transitionData.isLast
      ) {
        object.unqueueTransition(transitionQueueItem)
        queued = true
      }
    } else {
      object.color.setAlpha(object.color.rgbaVals[3] + speed)
    }
    // console.log(duration)
  }
}

const fadeInTransitions = (
  arr: Array<AnimObject>,
  config: FadeInTransitionProps,
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

const FadeIn = async (
  object: AnimObject,
  config: FadeInTransitionProps = {}
): Promise<AnimObject> => {
  return new Promise((resolve, reject) => {
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
    }

    resolve(object)
  })
}

export default FadeIn

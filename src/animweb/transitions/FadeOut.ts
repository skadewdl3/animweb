import AnimObject, { AnimObjects } from '../AnimObject'
import Curve from '../AnimObjects/Curve'
import Line from '../AnimObjects/Line'
import NumberPlane from '../AnimObjects/NumberPlane'
import Point from '../AnimObjects/Point'
import Color from '../helpers/Color'
import Constants from '../helpers/Constants'
import { wait, roundOff, rangePerFrame } from '../helpers/miscellaneous'
import TransitionProps, { TransitionTypes } from '../Transition'
import { v4 as uuid } from 'uuid'

interface FadeOutTransitionProps extends TransitionProps {}

const resetColor = (object: AnimObject) => {
  object.color.setAlpha(object.maxAlpha)
  object.color.refresh()
}

const resetColors = (arr: Array<AnimObject>) => {
  arr.forEach(object => resetColor(object))
}

const fadeOutTransition = (
  object: AnimObject,
  config: FadeOutTransitionProps,
  transitionData: {
    type: TransitionTypes
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

    if (object.color.rgbaVals[3] < 0.05) {
      object.color.setAlpha(0)
      object.transition = null
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
      object.color.setAlpha(object.color.rgbaVals[3] - speed)
    }
  }
}

const fadeOutTransitions = (
  arr: Array<AnimObject>,
  config: FadeOutTransitionProps,
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
      (object.transition = fadeOutTransition(
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

const FadeOut = async (
  object: AnimObject,
  config: FadeOutTransitionProps = {}
): Promise<AnimObject> => {
  return new Promise((resolve, reject) => {
    if (object instanceof Line) {
      resetColor(object)
      object.transition = fadeOutTransition(object, config)
    } else if (object instanceof Point) {
      resetColor(object)
      object.transition = fadeOutTransition(object, config)
    } else if (object instanceof NumberPlane) {
      let totalDuration = config.duration
        ? config.duration
        : Constants.fadeInNumberPlaneDuration

      resetColors(object.axes)
      resetColors(object.xTicks)
      resetColors(object.yTicks)
      resetColors(object.yGrid)
      resetColors(object.xGrid)
      resetColors(object.points)
      object.curves.forEach(curve => {
        resetColors(curve.lines)
      })

      fadeOutTransitions(object.points, config, totalDuration / 3)
      object.curves.forEach(curve => {
        fadeOutTransitions(curve.lines, config, totalDuration / 3)
      })
      wait((totalDuration / 3) * 1000).then(() => {
        fadeOutTransitions(object.xTicks, config, totalDuration / 3)
        fadeOutTransitions(object.yTicks, config, totalDuration / 3)
        wait((totalDuration / 3) * 1000).then(() => {
          fadeOutTransitions(object.axes, config, totalDuration / 3)
          fadeOutTransitions(object.xGrid, config, totalDuration / 3)
          fadeOutTransitions(object.yGrid, config, totalDuration / 3)
        })
      })
    } else if (object instanceof Curve) {
      object.lines.forEach(line => resetColor(line))
      fadeOutTransitions(object.lines, config)
    }
    resolve(object)
  })
}

export default FadeOut

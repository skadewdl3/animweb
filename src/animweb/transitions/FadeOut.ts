import AnimObject, { AnimObjects } from '../AnimObject'
import Curve from '../AnimObjects/Curve'
import Point from '../AnimObjects/Point'
import Line from '../AnimObjects/Line'
import NumberPlane from '../AnimObjects/NumberPlane'
import ImplicitCurve from '../AnimObjects/ImplicitCurve'
import Text from '../AnimObjects/Text'
import Constants from '../helpers/Constants'
import { wait, rangePerFrame } from '../helpers/miscellaneous'
import TransitionProps, {
  TransitionProgressProps,
  TransitionTypes,
  createTransition,
} from '../Transition'
import { v4 as uuid } from 'uuid'
import anime from 'animejs'
import LaTeX from '../AnimObjects/LaTeX'
interface FadeOutTransitionProps extends TransitionProps {}

const resetColor = (object: AnimObject) => {
  object.color.setAlpha(object.maxAlpha)
  object.color.refresh()
}

const resetColors = (arr: Array<AnimObject>) => {
  arr.forEach((object) => resetColor(object))
}

const fadeOutTransition = (
  object: AnimObject,
  config: FadeOutTransitionProps,
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

    if (object.color.rgbaVals[3] < 0.05) {
      object.color.setAlpha(0)
      object.transition = null
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

const FadeOut = <Object extends AnimObject>(
  object: Object,
  config: FadeOutTransitionProps = {}
): Object => {
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
    object.curves.forEach((curve) => {
      resetColors(curve.lines)
    })
    object.implicitCurves.forEach((implicitCurve) => {
      resetColor(implicitCurve)
    })

    fadeOutTransitions(object.points, config, totalDuration / 3)
    object.curves.forEach((curve) => {
      fadeOutTransitions(curve.lines, config, totalDuration / 3)
    })
    object.implicitCurves.forEach((implicitCurve) => {
      if (implicitCurve instanceof ImplicitCurve) {
        implicitCurve.transition = fadeOutTransition(
          implicitCurve,
          config,
          {},
          totalDuration / 3
        )
      }
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
    object.lines.forEach((line) => resetColor(line))
    fadeOutTransitions(object.lines, config)
  } else if (object instanceof ImplicitCurve) {
    resetColor(object)
    object.transition = fadeOutTransition(object, config)
  } else if (object instanceof Text) {
    let executeTransition = true
    let tx = createTransition({
      onProgress: ({ end }: TransitionProgressProps) => {
        if (object.svgEl && executeTransition) {
          anime({
            targets: `#${object.id} path`,
            opacity: 0,
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
            opacity: 0,
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

export default FadeOut

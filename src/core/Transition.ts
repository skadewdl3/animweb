import { TransitionProps } from '@/interfaces/transitions'
import { Transitions } from '@/enums/transitions'
import FadeIn from '@/transitions/FadeIn'
import FadeOut from '@/transitions/FadeOut'
import Create from '@/transitions/Create'
import { v4 as uuid } from 'uuid'
import AnimObject2D from './AnimObject2D'

export const Transition = (type: Transitions) => {
  switch (type) {
    case Transitions.FadeIn:
      return (obj: AnimObject2D, config: any) => FadeIn(obj, config)
    case Transitions.FadeOut:
      return (obj: AnimObject2D, config: any) => FadeOut(obj, config)
    case Transitions.Create:
      return (obj: AnimObject2D, config: any) => Create(obj, config)
    default:
      return <AnimObject>(object: AnimObject, config: any): AnimObject => object
  }
}

export const createTransition = ({
  onStart,
  onEnd,
  onProgress,
  endCondition,
  object,
}: TransitionProps) => {
  let started = false
  let transitionQueueItem = {
    id: uuid(),
  }
  const tx = () => {
    const end = () => {
      object.transition = null
      onEnd && onEnd()
      object.scene.dequeueTransition(transitionQueueItem)
      return
    }
    const start = () => {
      onStart && onStart()
      started = true
    }
    if (!started) {
      !started && start()
      object.scene.enqueueTransition(transitionQueueItem)
    }
    if (endCondition ? endCondition() : false) {
      end()
    }
    onProgress({ start, end })
  }
  return tx
}

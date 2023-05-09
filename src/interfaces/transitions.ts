import { AnimObject } from '@/interfaces/core'

export interface TransitionProps {
  duration?: number // how long the transition should last (in seconds)
}

export interface TransitionQueueItem {
  id: string
  object?: AnimObject
}

export interface TransitionProgressProps {
  start: Function
  end: Function
}

export interface TransitionProps {
  onStart?: Function
  onEnd?: Function
  onProgress: Function
  endCondition?: Function
  object: any
}

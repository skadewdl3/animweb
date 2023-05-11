import { AnimObject } from '@/interfaces/core'

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

import { AnimObject } from '@interfaces/core.ts'

export interface TransitionQueueItem {
  id: string
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
}

export type TransitionChain = Array<TransitionProps>

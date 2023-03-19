/*
This interface simply describes what kind of props a Transition Function (FadeIn, Create, etc.) can accept.

The transition has a format similar to: Create(Point, { duration: 1 })
The structure of the second argument is given by this interface
*/

import AnimObject from './AnimObject'
import Create from './transitions/Create'
import FadeIn from './transitions/FadeIn'
import FadeOut from './transitions/FadeOut'

export default interface TransitionProps {
  duration?: number // how long the transition should last (in seconds)
}

// Similar to the lines enum, this enum is used to pass a transition to an AnimObject (if we aren't applying it externally)
export enum Transitions {
  FadeIn = 'FadeIn',
  FadeOut = 'FadeOut',
  Create = 'Create',
  None = 'None',
}

export const Transition = (type: Transitions) => {
  switch (type) {
    case Transitions.FadeIn:
      return FadeIn
    case Transitions.FadeOut:
      return FadeOut
    case Transitions.Create:
      return Create
    default:
      return (object: AnimObject, config: TransitionProps) => object
  }
}

export interface TransitionQueueItem {
  id: string
  object?: AnimObject
}

export enum TransitionTypes {
  single = 'single',
  group = 'group',
}

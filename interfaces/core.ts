import Color from '@auxiliary/Color'
import { TransitionProps } from '@/interfaces/transitions'
import { Transitions } from '@/enums/transitions'
import Scene2D from '@/core/Scene2D'
import Scene3D from '@/core/Scene3D'
import AnimObject2D from '@/core/AnimObject2D'
import AnimObject3D from '@/core/AnimObject3D'
import { Watchables } from '@/enums/mixins'
// Scene
export type Scene = Scene2D | Scene3D
export type AnimObject = AnimObject2D | AnimObject3D

// AnimObject2D
export interface AnimObject2DProps {
  color?: Color
  backgroundColor?: Color
  maxAlpha?: number
  parentData?: {
    origin: { x: number; y: number }
    stepX: number
    stepY: number
  }
  thickness?: number
  size?: number
  transition?: Transitions
  transitionOptions?: TransitionProps
  scene: Scene2D
}

// AnimObject3D
export interface AnimObject3DProps {
  color?: Color
  backgroundColor?: Color
  maxAlpha?: number
  parentData?: {
    origin: { x: number; y: number }
    stepX: number
    stepY: number
  }
  thickness?: number
  size?: number
  transition?: Transitions
  transitionOptions?: TransitionProps
  scene: Scene3D
}
// Transition

export interface Watcher {
  property: Watchables
  handler: Function
}

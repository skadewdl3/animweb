import Color from '@auxiliary/Color.ts'
import { TransitionProps } from '@interfaces/transitions.ts'
import { Transitions } from '@enums/transitions.ts'
import Scene2D from '@core/Scene2D.ts'
import Scene3D from '@core/Scene3D.ts'
import AnimObject2D from '@core/AnimObject2D.ts'
import AnimObject3D from '@core/AnimObject3D.ts'
import { Watchables } from '@enums/mixins.ts'
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

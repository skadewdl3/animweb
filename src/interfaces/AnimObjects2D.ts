import Color from '@/auxiliary/Color'
import { AnimObject2DProps } from './core'
import { TransitionProps } from './transitions'
import { Lines, Vectors, TextStyle } from '@/enums/AnimObjects2D'
import { Transitions } from '@/enums/transitions'
// Point
export interface PointProps extends AnimObject2DProps {
  x: number
  y: number
  size?: number
  definition?: string
}

// Line
interface CommonLineProps extends AnimObject2DProps {
  domain?: [number, number]
  range?: [number, number]
  thickness?: number
  parentData?: {
    origin: { x: number; y: number }
    stepX: number
    stepY: number
  }
  definition?: string
  length?: number
}

interface DoublePointLineProps extends CommonLineProps {
  x1: number
  x2: number
  y1: number
  y2: number
  form: Lines.DoublePoint
}

interface SlopePointLineProps extends CommonLineProps {
  point: { x: number; y: number }
  slope: number
  form: Lines.SlopePoint
}

interface SlopeInterceptForm extends CommonLineProps {
  slope: number
  yIntercept?: number
  xIntercept?: number
  form: Lines.SlopeIntercept
}

interface DoubleInterceptForm extends CommonLineProps {
  xIntercept: number
  yIntercept: number
  form: Lines.DoubleIntercept
}

interface NormalForm extends CommonLineProps {
  distance: number
  alpha: number
  form: Lines.Normal
}

export type LineProps =
  | DoublePointLineProps
  | SlopePointLineProps
  | SlopeInterceptForm
  | DoubleInterceptForm
  | NormalForm

// Curve
export interface CurveAnchorPointProps extends AnimObject2DProps {
  x: number
  size?: number
  color?: Color
}

export interface CurveAnchorLineProps extends AnimObject2DProps {
  x: number
  length?: number
  thickness?: number
  color?: Color
}

export interface CurveProps extends AnimObject2DProps {
  definition: string
  sampleRate: number
  domain: [number, number]
  range: [number, number]
  thickness?: number
}

// ImplicitCurve

export interface ImplicitCurveProps extends AnimObject2DProps {
  definition: string
  sampleRate?: number
  thickness?: number
  color?: Color
}

// Latex
export interface LaTeXProps extends AnimObject2DProps {
  latex: string
  color?: Color
  size?: number
  x: number
  y: number
}

// NumberPlane
export interface NumberPlaneProps extends AnimObject2DProps {
  stepX?: number
  stepY?: number
  step?: number
  width?: number
  height?: number
  x?: number
  y?: number
  origin?: { x: number; y: number }
  showTicks?: boolean
  grid?: boolean
  xGrid?: boolean
  yGrid?: boolean
}
export interface ImplicitCurvePlotProps extends AnimObject2DProps {
  definition: string
  sampleRate?: number
  thickness?: number
  transition?: Transitions
  transitionOptions?: TransitionProps
}

export interface CurvePlotProps extends AnimObject2DProps {
  definition: string
  domain?: [number, number]
  sampleRate?: number
  thickness?: number
  transition?: Transitions
  transitionOptions?: TransitionProps
}

export interface PointPlotProps extends AnimObject2DProps {
  x: number
  y: number
  z?: number
  size?: number
  transition?: Transitions
  transitionOptions?: TransitionProps
}

export interface LinearTransformProps {
  duration: number
}


// ComplexPlane
export interface ComplexPlaneProps extends AnimObject2DProps {
  stepX?: number
  stepY?: number
  step?: number
  width?: number
  height?: number
  x?: number
  y?: number
  origin?: { x: number; y: number }
  showTicks?: boolean
  grid?: boolean
  xGrid?: boolean
  yGrid?: boolean
}

// Vector

export interface VectorProps extends AnimObject2DProps {
  form?: Vectors
  x?: number
  y?: number
  head?: { x: number; y: number }
  tail?: { x: number; y: number }
}

// Text
export interface TextProps extends AnimObject2DProps {
  text?: string | number
  color?: Color
  size?: number
  x: number
  y: number
  style?: TextStyle
  font?: any
}

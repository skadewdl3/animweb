import { AnimObject3DProps } from './core'
import Color from '@/auxiliary/Color'
import { ComplexPlanes, NumberPlanes, Octants } from '@/enums/AnimObjects3D'

// Point
export interface Point3DProps extends AnimObject3DProps {
  x: number
  y: number
  z: number
  color?: Color
}

// Line
export interface Line3DProps extends AnimObject3DProps {
  point?: { x: number; y: number; z: number }
  point1?: { x: number; y: number; z: number }
  point2?: { x: number; y: number; z: number }
  color?: Color
}

// NumberPlane

export interface NumberPlane3DProps extends AnimObject3DProps {
  color?: Color
  form?: NumberPlanes
  octants?: Array<Octants>
}

export interface PointPlotProps {
  x: number
  y: number
  z: number
  color?: Color
}

export interface SurfacePlotProps {
  definition: string
  sampleRate?: number
  color?: Color
  filled?: boolean
  constraints?: {
    x?: number
    y?: number
    z?: number
  }
}

// ComplexPlane

export interface ComplexPlane3DProps extends AnimObject3DProps {
  color?: Color
  form?: ComplexPlanes
  octants?: Array<Octants>
}

// Cube
export interface CubeProps extends AnimObject3DProps {}
// Text
export interface Text3DProps extends AnimObject3DProps {
  text: string
  x?: number
  y?: number
  z?: number
  fixPosition?: boolean
  fixRotation?: boolean
  fixed?: boolean
}

// Surface
export interface MeshData {
  positions: Array<[number, number, number]>
  cells: Array<[number, number, number]>
  triangles: Array<Float32Array>
}

export interface SurfaceProps extends AnimObject3DProps {
  meshData: MeshData
  equation: string
  filled?: boolean
  color?: Color
}

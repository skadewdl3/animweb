import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils'
import AnimObject3D from './../core/AnimObject3D'
import Scene3D from './../core/Scene3D'
import Color from '../auxiliary/Color'
import {
  BufferGeometry as ThreeBufferGeometry,
  BufferAttribute as ThreeBufferAttribute,
  MeshBasicMaterial as ThreeMeshBasicMaterial,
  DoubleSide as ThreeDoubleSide,
  LineBasicMaterial as ThreeLineBasicMaterial,
  LineSegments as ThreeLineSegments,
  EdgesGeometry as ThreeEdgesGeometry,
  Mesh as ThreeMesh,
} from 'three'
import { error } from '../ui/elements'

export interface MeshData {
  positions: Array<[number, number, number]>
  cells: Array<[number, number, number]>
  triangles: Array<Float32Array>
}

interface SurfaceProps {
  scene: Scene3D
  meshData: MeshData
  equation: string
  filled?: boolean
  color?: Color
}

export interface MeshData {
  positions: Array<[number, number, number]>
  cells: Array<[number, number, number]>
  triangles: Array<Float32Array>
}

export default class Surface extends AnimObject3D {
  filled: boolean = false
  meshData: MeshData
  equation: string

  constructor(config: SurfaceProps) {
    super(config.scene)
    this.meshData = config.meshData
    this.equation = config.equation
    config.filled && (this.filled = config.filled)
    config.color && (this.color = config.color)

    if (this.filled) {
      this.createFilledSurface()
    } else {
      this.createWireframeSurface()
    }
  }

  createFilledSurface() {
    let geometries: Array<ThreeBufferGeometry> = []
    for (let triangle of this.meshData.triangles) {
      const geometry = new ThreeBufferGeometry()
      geometry.setAttribute('position', new ThreeBufferAttribute(triangle, 3))
      geometries.push(geometry)
    }
    if (geometries.length == 0) {
      error.show(
        'PlotError',
        `${this.equation} cannot be plot in 3 dimensions. Please check the equation or report this error.`
      )
      return
    }
    const geometry = mergeBufferGeometries(geometries, true)
    const material = new ThreeMeshBasicMaterial({
      color: this.color.hexNumber,
      side: ThreeDoubleSide,
    })
    this.mesh = new ThreeMesh(geometry, material)
  }

  createWireframeSurface() {
    let geometries: Array<ThreeBufferGeometry> = []
    for (let triangle of this.meshData.triangles) {
      const geometry = new ThreeBufferGeometry()
      geometry.setAttribute('position', new ThreeBufferAttribute(triangle, 3))
      geometries.push(geometry)
    }
    console.log(geometries)
    if (geometries.length == 0) {
      error.show(
        'PlotError',
        `${this.equation} cannot be plot in 3 dimensions. Please check the equation or report this error.`
      )
      return
    }
    const geometry = mergeBufferGeometries(geometries, true)
    const material = new ThreeLineBasicMaterial({
      color: this.color.hexNumber,
    })
    const edges = new ThreeEdgesGeometry(geometry, 0)
    this.mesh = new ThreeLineSegments(edges, material)
  }
}

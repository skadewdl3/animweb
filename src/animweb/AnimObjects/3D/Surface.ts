import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils'
import AnimObject3D from '../../AnimObject3D'
import Scene3D from '../../Scene3D'
import Color from '../../helpers/Color'
import * as THREE from 'three'

export interface MeshData {
  positions: Array<[number, number, number]>
  cells: Array<[number, number, number]>
  triangles: Array<Float32Array>
}

interface SurfaceProps {
  scene: Scene3D
  meshData: MeshData
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

  constructor(config: SurfaceProps) {
    super(config.scene)
    this.meshData = config.meshData
    config.filled && (this.filled = config.filled)
    config.color && (this.color = config.color)

    if (this.filled) {
      this.createFilledSurface()
    } else {
      this.createWireframeSurface()
    }
  }

  createFilledSurface() {
    let geometries: Array<THREE.BufferGeometry> = []
    for (let triangle of this.meshData.triangles) {
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(triangle, 3))
      geometries.push(geometry)
    }
    const geometry = mergeBufferGeometries(geometries, true)
    const material = new THREE.MeshBasicMaterial({
      color: this.color.hexNumber,
      side: THREE.DoubleSide,
    })
    this.mesh = new THREE.Mesh(geometry, material)
  }

  createWireframeSurface() {
    let geometries: Array<THREE.BufferGeometry> = []
    for (let triangle of this.meshData.triangles) {
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(triangle, 3))
      geometries.push(geometry)
    }
    const geometry = mergeBufferGeometries(geometries, true)
    const material = new THREE.LineBasicMaterial({
      color: this.color.hexNumber,
    })
    const edges = new THREE.EdgesGeometry(geometry, 0)
    this.mesh = new THREE.LineSegments(edges, material)
  }
}

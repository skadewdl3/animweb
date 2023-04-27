import AnimObject3D from '../../AnimObject3D'
import Scene3D from '../../Scene3D'
import * as THREE from 'three'
import Color from '../../helpers/Color'

export enum Triangles {
  VertexData = 'VertexData',
  Points = 'Points',
}

interface TriangleProps {
  scene: Scene3D
  color?: Color
  form: Triangles
  p1?: { x: number; y: number; z: number }
  p2?: { x: number; y: number; z: number }
  p3?: { x: number; y: number; z: number }
  vertexData?: Float32Array
}

export default class Triangle extends AnimObject3D {
  constructor(config: TriangleProps) {
    super(config.scene)
    config.color && (this.color = config.color)
    let vertices
    if (config.form == Triangles.Points) {
      if (config.p1 && config.p2 && config.p3)
        vertices = new Float32Array([
          config.p1.x,
          config.p1.y,
          config.p1.z,
          config.p2.x,
          config.p2.y,
          config.p2.z,
          config.p3.x,
          config.p3.y,
          config.p3.z,
        ])
    } else if (config.form == Triangles.VertexData) {
      if (config.vertexData) vertices = config.vertexData
    }

    if (vertices) {
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
      const material = new THREE.MeshBasicMaterial({
        color: this.color.hexNumber,
      })
      const edges = new THREE.EdgesGeometry(geometry)
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: this.color.hexNumber })
      )
      this.mesh = line
    }
  }
}

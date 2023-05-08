import AnimObject3D from './../core/AnimObject3D'
import Scene3D from './../core/Scene3D'
import {
  LineBasicMaterial as ThreeLineBasicMaterial,
  Vector3 as ThreeVector3,
  BufferGeometry as ThreeBufferGeometry,
  Line as ThreeLine,
} from 'three'
import Color from '../auxiliary/Color'

interface Line3DProps {
  scene: Scene3D
  point?: { x: number; y: number; z: number }
  point1?: { x: number; y: number; z: number }
  point2?: { x: number; y: number; z: number }
  color?: Color
}

export default class Line3D extends AnimObject3D {
  constructor(config: Line3DProps) {
    super(config.scene)
    config.color && (this.color = config.color)

    const material = new ThreeLineBasicMaterial({
      color: this.color.hexNumber,
    })

    if (this.color.opacity != 1) {
      material.transparent = true
      material.opacity = this.color.opacity
    }

    let points: any

    if (config.point1 && config.point2) {
      points = [
        new ThreeVector3(config.point1.x, config.point1.y, config.point1.z),
        new ThreeVector3(config.point2.x, config.point2.y, config.point2.z),
      ]
    } else if (config.point) {
      points = [
        new ThreeVector3(0, 0, 0),
        new ThreeVector3(config.point.x, config.point.y, config.point.z),
      ]
    }

    const geometry = new ThreeBufferGeometry().setFromPoints(points)
    const line = new ThreeLine(geometry, material)
    this.mesh = line
  }

  draw() {}
}

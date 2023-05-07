import AnimObject3D from '../../AnimObject3D'
import Scene3D from '../../Scene3D'
import Color from '../../helpers/Color'
import {
  SphereGeometry as ThreeSphereGeometry,
  MeshBasicMaterial as ThreeMeshBasicMaterial,
  Mesh as ThreeMesh,
} from 'three'

interface Point3DProps {
  scene: Scene3D
  x: number
  y: number
  z: number
  color?: Color
}

export default class Point3D extends AnimObject3D {
  mesh: any

  constructor(config: Point3DProps) {
    super(config.scene)
    config.color && (this.color = config.color)
    console.log(config.color)

    const sphereGeometry = new ThreeSphereGeometry(0.1, 10)
    const material = new ThreeMeshBasicMaterial({
      color: this.color.hexNumber,
    })
    if (this.color.opacity != 1) {
      material.transparent = true
      material.opacity = this.color.opacity
    }

    const sphere = new ThreeMesh(sphereGeometry, material)
    sphere.position.set(config.x, config.y, config.z)
    this.mesh = sphere
  }
}

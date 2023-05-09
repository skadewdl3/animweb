import AnimObject3D from '@core/AnimObject3D'
import {
  Mesh as ThreeMesh,
  BoxGeometry as ThreeBoxGeometry,
  MeshBasicMaterial as ThreeMeshBasicMaterial,
} from 'three'
import { CubeProps } from '@/interfaces/AnimObjects3D'

export default class Cube extends AnimObject3D {
  constructor(config: CubeProps) {
    super(config.scene)
    const geometry = new ThreeBoxGeometry(1, 1, 1)
    const material = new ThreeMeshBasicMaterial({ color: 0x00ff00 })
    const cube = new ThreeMesh(geometry, material)
    this.mesh = cube
    console.log('this ran')
  }

  draw() {}
}

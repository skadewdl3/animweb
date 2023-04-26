import AnimObject3D from '../../AnimObject3D'
import Scene3D from '../../Scene3D'
import * as THREE from 'three'

interface CubeProps {
  scene: Scene3D
}

export default class Cube extends AnimObject3D {
  constructor(config: CubeProps) {
    super(config.scene)
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    this.mesh = cube
    console.log('this ran')
  }

  draw() {
    // this.mesh.rotation.x += 0.01
    // this.mesh.rotation.y += 0.01
  }
}

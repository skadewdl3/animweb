import AnimObject3D from '../../AnimObject3D'
import Scene3D from '../../Scene3D'
import * as THREE from 'three'

interface Line3DProps {
  scene: Scene3D
  point: { x: number; y: number; z: number }
}

export default class Line3D extends AnimObject3D {
  constructor(config: Line3DProps) {
    super(config.scene)
    const material = new THREE.LineBasicMaterial({ color: 0x0000ff })
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(config.point.x, config.point.y, config.point.z),
    ]
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const line = new THREE.Line(geometry, material)
    this.mesh = line
  }

  draw() {
    // this.mesh.rotation.x += 0.01
    // this.mesh.rotation.y += 0.01
  }
}

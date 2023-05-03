import AnimObject3D from '../../AnimObject3D'
import Scene3D from '../../Scene3D'
// @ts-ignore
import { Text } from 'troika-three-text'

interface Text3DProps {
  scene: Scene3D
  text: string
  x?: number
  y?: number
  z?: number
  fixed: true
}

export default class Text3D extends AnimObject3D {
  text: string
  x: number
  y: number
  z: number
  troikaText: Text
  distanceSquared: number
  fixed: boolean = false

  constructor(config: Text3DProps) {
    super(config.scene)
    this.text = config.text
    this.x = config.x || 0
    this.y = config.y || 0
    this.z = config.z || 0
    this.fixed = config.fixed || false
    this.troikaText = new Text()

    this.troikaText.text = this.text
    this.troikaText.fontSize = 0.2
    this.troikaText.color = 0xff0000
    this.troikaText.position.x = this.x
    this.troikaText.position.y = this.y
    this.troikaText.position.z = this.z
    this.distanceSquared = this.scene.camera.camera.position.distanceToSquared(
      this.troikaText.position
    )

    this.mesh = this.troikaText
    this.troikaText.sync()
  }

  updatePosition(config: { x?: number; y?: number; z?: number }) {
    if (config.x) {
      this.x = config.x
      this.troikaText.position.x = this.x
    }
    if (config.y) {
      this.y = config.y
      this.troikaText.position.y = this.y
    }
    if (config.z) {
      this.z = config.z
      this.troikaText.position.z = this.z
    }
  }

  update() {
    if (this.fixed) {
      let currentDistanceSquared =
        this.scene.camera.camera.position.distanceToSquared(
          this.troikaText.position
        )
      let ratio = (currentDistanceSquared / this.distanceSquared) ** 0.5
      this.troikaText.quaternion.copy(this.scene.camera.camera.quaternion)
      this.troikaText.scale.set(ratio, ratio, 1)
    }
  }
}

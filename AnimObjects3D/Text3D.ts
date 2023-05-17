import AnimObject3D from '@core/AnimObject3D.ts'
// @ts-ignore
import { Text } from 'troika-three-text'
import { Text3DProps } from '@interfaces/AnimObjects3D.ts'

export default class Text3D extends AnimObject3D {
  text: string
  x: number
  y: number
  z: number
  troikaText: Text
  distanceSquared: number
  fixPosition: boolean = false
  fixRotation: boolean = false
  dx: number
  origX: number

  get fixed() {
    return this.fixPosition && this.fixRotation
  }

  set fixed(fixed: boolean) {
    this.fixPosition = fixed
    this.fixRotation = fixed
  }

  constructor(config: Text3DProps) {
    super(config.scene)
    this.text = config.text
    this.x = config.x || 0
    this.y = config.y || 0
    this.z = config.z || 0
    this.fixPosition = config.fixPosition || false
    this.fixRotation = config.fixRotation || false
    if (config.fixed) this.fixed = config.fixed
    this.troikaText = new Text()

    this.troikaText.text = this.text
    this.troikaText.fontSize = 0.2
    this.troikaText.color = this.color.hexNumber
    this.troikaText.position.x = this.x
    this.troikaText.position.y = this.y
    this.troikaText.position.z = this.z
    this.origX = this.x
    this.dx = this.scene.camera.camera.position.x - this.origX
    this.distanceSquared = this.scene.camera.camera.position.distanceToSquared(
      this.troikaText.position
    )

    this.mesh = this.troikaText
    this.troikaText.sync()
  }

  update() {
    if (this.fixPosition) {
      let currentDistanceSquared =
        this.scene.camera.camera.position.distanceToSquared(
          this.troikaText.position
        )
      let ratio = (currentDistanceSquared / this.distanceSquared) ** 0.5
      this.troikaText.scale.set(ratio, ratio, ratio)
    }
    if (this.fixRotation) {
      this.troikaText.quaternion.copy(this.scene.camera.camera.quaternion)
    }
  }
}

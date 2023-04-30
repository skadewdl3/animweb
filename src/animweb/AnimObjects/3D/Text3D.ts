import AnimObject3D from '../../AnimObject3D'
import Scene3D from '../../Scene3D'
// @ts-ignore
import { Text } from 'troika-three-text'

interface Text3DProps {
  scene: Scene3D
  text: string
}

export default class Text3D extends AnimObject3D {
  
  text: string
  troikaText: Text
  
  constructor(config: Text3DProps) {
    super(config.scene)
    this.text = config.text
    this.troikaText = new Text()


    this.troikaText.text = this.text
    this.troikaText.fontSize = 0.2
    this.troikaText.color = 0xff0000
    this.troikaText.position.x = 4
    this.troikaText.position.z = 0
    
    
    this.mesh = this.troikaText
    this.troikaText.sync()
  }
}

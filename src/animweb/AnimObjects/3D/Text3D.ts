import AnimObject3D from '../../AnimObject3D'
import Scene3D from '../../Scene3D'

interface Text3DProps {
  scene: Scene3D
}

export default class Text3D extends AnimObject3D {
  constructor(config: Text3DProps) {
    super(config.scene)
  }
}

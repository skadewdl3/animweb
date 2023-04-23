import p5 from 'p5'
import AnimObject from '../../AnimObject'
import Scene from '../../Scene3D'

interface ThreeDPlaneProps {
  scene: Scene
}

export default class ThreeDPlane extends AnimObject {
  constructor(config: ThreeDPlaneProps) {
    super(config.scene)
  }

  draw(p: p5) {
    console.log('this is running')
    p.push()
    p.fill(255)
    p.noStroke()
    p.plane(100, 100)
    p.pop()
  }
}

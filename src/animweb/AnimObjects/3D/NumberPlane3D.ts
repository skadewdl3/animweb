import p5 from 'p5'
import AnimObject from '../../AnimObject'
import Scene from '../../Scene3D'

interface NumberPlane3DProps {
  scene: Scene
}

export default class NumberPlane3D extends AnimObject {
  constructor(config: NumberPlane3DProps) {
    super(config.scene)
  }

  draw(p: p5) {
    p.push()
    p.fill(0)
    p.noStroke()
    p.stroke(0)
    p.box(100)
    p.pop()
  }
}

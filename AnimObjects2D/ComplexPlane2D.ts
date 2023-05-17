import AnimObject2D from '@/core/AnimObject2D'
import { ComplexPlaneProps } from '@/interfaces/AnimObjects2D'

export default class ComplexPlane2D extends AnimObject2D {
  constructor(config: ComplexPlaneProps) {
    super(config.scene)
  }
}

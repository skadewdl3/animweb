import Point3D from '@/AnimObjects3D/Point3D'
import AnimObject3D from '@/core/AnimObject3D'
import { Vector3 as ThreeVector3 } from 'three'

const FadeIn3D = <Object extends AnimObject3D>(
  object: Object,
  config: any = {}
) => {
  if (object instanceof Point3D) {
  }
  return object
}

export default FadeIn3D

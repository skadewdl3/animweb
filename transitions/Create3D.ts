import Line3D from '@AnimObjects3D/Line3D.ts'
import NumberPlane3D from '@AnimObjects3D/NumberPlane3D.ts'
import Point3D from '@AnimObjects3D/Point3D.ts'
import AnimObject3D from '@core/AnimObject3D.ts'
import { createTransition3D } from '@core/Transition.ts'
import { isNearlyEqual, rangePerFrame } from '@helpers/miscellaneous.ts'
import { TransitionProgressProps } from '@interfaces/transitions.ts'
import { Vector3 } from 'three'

const Create3D = <Object extends AnimObject3D>(
  object: Object,
  config: any = {}
) => {
  if (object instanceof Point3D) {
    let scaleSpeed = rangePerFrame(1, config.duration || 1)
    let scale = 0
    object.transition = createTransition3D(
      {
        onStart() {
          object.mesh.scale.set(scale, scale, scale)
        },
        onEnd() {
          object.mesh.scale.set(1, 1, 1)
        },
        onProgress() {
          scale += scaleSpeed
          object.mesh.scale.set(scale, scale, scale)
        },
        endCondition() {
          return (
            isNearlyEqual(object.mesh.scale.x, 1, 0.01) &&
            isNearlyEqual(object.mesh.scale.y, 1, 0.01) &&
            isNearlyEqual(object.mesh.scale.z, 1, 0.01)
          )
        },
      },
      object
    )
  } else if (object instanceof Line3D) {
    let scaleSpeed = rangePerFrame(1, config.duration || 1)
    let scale = 0
    object.transition = createTransition3D(
      {
        onStart() {
          object.mesh.scale.set(scale, scale, scale)
        },
        onEnd() {
          object.mesh.scale.set(1, 1, 1)
        },
        onProgress() {
          scale += scaleSpeed
          object.mesh.scale.set(scale, scale, scale)
        },
        endCondition() {
          return (
            isNearlyEqual(object.mesh.scale.x, 1, 0.01) &&
            isNearlyEqual(object.mesh.scale.y, 1, 0.01) &&
            isNearlyEqual(object.mesh.scale.z, 1, 0.01)
          )
        },
      },
      object
    )
  } else if (object instanceof NumberPlane3D) {
    let scaleSpeed = rangePerFrame(1, config.duration || 1)
    let scale = 0
    object.transition = createTransition3D(
      [
        // animate the lines (grid and axes)
        {
          onStart() {
            let hide = (obj: AnimObject3D) => {
              obj.iterables.forEach((iterable: string) => {
                ;(obj as any)[iterable].forEach((o: AnimObject3D) => {
                  hide(o)
                })
              })
              obj.mesh.scale.set(scale, scale, scale)
            }
            hide(object)
          },
          onEnd() {
            object.axes.forEach(axis => {
              axis.mesh.scale.set(1, 1, 1)
            })
          },
          onProgress() {
            scale += scaleSpeed
            object.axes.forEach(axis => {
              axis.mesh.scale.set(scale, scale, scale)
            })
          },
          endCondition() {
            return (
              isNearlyEqual(object.axes[0].mesh.scale.x, 1, 0.01) &&
              isNearlyEqual(object.axes[0].mesh.scale.y, 1, 0.01) &&
              isNearlyEqual(object.axes[0].mesh.scale.z, 1, 0.01)
            )
          },
        },
        // animate the points (ticks and plotted points)
        {
          onStart({ end }: { end: Function }) {
            scale = 0
          },
          onEnd() {
            object.points.forEach(point => {
              point.mesh.scale.set(1, 1, 1)
            })
          },
          onProgress() {
            scale += scaleSpeed
            object.points.forEach(point => {
              point.mesh.scale.set(scale, scale, scale)
            })
          },
          endCondition() {
            return (
              object.points.length != 0 &&
              isNearlyEqual(object.points[0].mesh.scale.x, 1, 0.01) &&
              isNearlyEqual(object.points[0].mesh.scale.y, 1, 0.01) &&
              isNearlyEqual(object.points[0].mesh.scale.z, 1, 0.01)
            )
          },
        },
      ],
      object
    )
  }
  return object
}

export default Create3D

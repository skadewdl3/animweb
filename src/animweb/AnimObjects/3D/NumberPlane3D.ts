import AnimObject3D from '../../AnimObject3D'
import Scene3D from '../../Scene3D'
import Color from '../../helpers/Color'
import Line3D from './Line3D'
import Point3D from './Point3D'
// @ts-ignore
import isosurface from 'isosurface'
import Triangle, { Triangles } from './Triangle'
import Colors from '../../helpers/Colors'

interface NumberPlane3DProps {
  scene: Scene3D
  color?: Color
}

interface PointPlotProps {
  x: number
  y: number
  z: number
  color?: Color
}

interface SurfacePlotProps {
  definition: string
  sampleRate?: number
  color?: Color
}

export default class NumberPlane3D extends AnimObject3D {
  axes: Array<Line3D> = []
  points: Array<Point3D> = []
  meshes: Array<any> = ['axes', 'points']
  webWorker: Worker = new Worker(
    new URL('./../../helpers/Isosurface.worker.js', import.meta.url),
    { type: 'module' }
  )

  constructor(config: NumberPlane3DProps) {
    super(config.scene)
    config.color && (this.color = config.color)

    this.axes = [
      new Line3D({
        point: { x: 0, y: 0, z: 5 },
        scene: this.scene,
        color: this.color,
      }),
      new Line3D({
        point: { x: 0, y: 5, z: 0 },
        scene: this.scene,
        color: this.color,
      }),
      new Line3D({
        point: { x: 5, y: 0, z: 0 },
        scene: this.scene,
        color: this.color,
      }),
    ]
  }

  draw() {}

  point(config: PointPlotProps) {
    let point = new Point3D({ ...config, scene: this.scene })
    console.log(point)
    this.scene.add(point)
  }

  plot(config: SurfacePlotProps) {
    let meshData = {
      definition: config.definition,
      detail: config.sampleRate || 800,
      lowerLimit: [-5, -5, -5],
      upperLimit: [5, 5, 5],
    }

    this.webWorker.postMessage(meshData)

    this.webWorker.onmessage = ({ data: mesh }) => {
      for (let vertexData of mesh.triangles) {
        let triangle = new Triangle({
          scene: this.scene,
          form: Triangles.VertexData,
          vertexData,
          color: config.color || this.color,
        })
        this.scene.add(triangle)
      }
    }
  }
}

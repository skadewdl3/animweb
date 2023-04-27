import AnimObject3D from '../../AnimObject3D'
import Scene3D from '../../Scene3D'
import Color from '../../helpers/Color'
import Colors from '../../helpers/Colors'
import Line3D from './Line3D'
import Point3D from './Point3D'
// @ts-ignore
import Triangle, { Triangles } from './Triangle'

export enum NumberPlanes {
  upper = 'Upper',
  full = 'Full',
  lower = 'Lower',
  octants = 'Octants',
}

export enum Octants {
  I = 'I',
  II = 'II',
  III = 'III',
  IV = 'IV',
  V = 'V',
  VI = 'VI',
  VII = 'VII',
  VIII = 'VIII',
}

interface NumberPlane3DProps {
  scene: Scene3D
  color?: Color
  form?: NumberPlanes
  octants?: Array<Octants>
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
  form: NumberPlanes = NumberPlanes.upper
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
    config.form && (this.form = config.form)

    // +y axis
    if (
      this.form == NumberPlanes.full ||
      this.form == NumberPlanes.upper ||
      this.form == NumberPlanes.lower ||
      (this.form == NumberPlanes.octants &&
        (config.octants?.includes(Octants.I) ||
          config.octants?.includes(Octants.V) ||
          config.octants?.includes(Octants.IV) ||
          config.octants?.includes(Octants.VIII)))
    ) {
      this.axes.push(
        new Line3D({
          point: { x: 0, y: 0, z: 5 },
          scene: this.scene,
          color: this.color,
        })
      )
    }

    // -y axis
    if (
      this.form == NumberPlanes.full ||
      this.form == NumberPlanes.upper ||
      this.form == NumberPlanes.lower ||
      (this.form == NumberPlanes.octants &&
        (config.octants?.includes(Octants.II) ||
          config.octants?.includes(Octants.VI) ||
          config.octants?.includes(Octants.VII) ||
          config.octants?.includes(Octants.III)))
    ) {
      this.axes.push(
        new Line3D({
          point: { x: 0, y: 0, z: -5 },
          scene: this.scene,
          color: this.color,
        })
      )
    }

    // +x axis
    if (
      this.form == NumberPlanes.full ||
      this.form == NumberPlanes.upper ||
      this.form == NumberPlanes.lower ||
      (this.form == NumberPlanes.octants &&
        (config.octants?.includes(Octants.I) ||
          config.octants?.includes(Octants.II) ||
          config.octants?.includes(Octants.VI) ||
          config.octants?.includes(Octants.V)))
    ) {
      this.axes.push(
        new Line3D({
          point: { x: 5, y: 0, z: 0 },
          scene: this.scene,
          color: this.color,
        })
      )
    }

    // -x axis
    if (
      this.form == NumberPlanes.full ||
      this.form == NumberPlanes.upper ||
      this.form == NumberPlanes.lower ||
      (this.form == NumberPlanes.octants &&
        (config.octants?.includes(Octants.III) ||
          config.octants?.includes(Octants.IV) ||
          config.octants?.includes(Octants.VII) ||
          config.octants?.includes(Octants.VIII)))
    ) {
      this.axes.push(
        new Line3D({
          point: { x: -5, y: 0, z: 0 },
          scene: this.scene,
          color: this.color,
        })
      )
    }

    // +z axis
    if (
      this.form == NumberPlanes.full ||
      this.form == NumberPlanes.upper ||
      (this.form == NumberPlanes.octants &&
        (config.octants?.includes(Octants.I) ||
          config.octants?.includes(Octants.II) ||
          config.octants?.includes(Octants.III) ||
          config.octants?.includes(Octants.IV)))
    ) {
      this.axes.push(
        new Line3D({
          point: { x: 0, y: 5, z: 0 },
          scene: this.scene,
          color: this.color,
        })
      )
    }

    // -z axis
    if (
      this.form == NumberPlanes.full ||
      this.form == NumberPlanes.lower ||
      (this.form == NumberPlanes.octants &&
        (config.octants?.includes(Octants.V) ||
          config.octants?.includes(Octants.VI) ||
          config.octants?.includes(Octants.VII) ||
          config.octants?.includes(Octants.VIII)))
    ) {
      this.axes.push(
        new Line3D({
          point: { x: 0, y: -5, z: 0 },
          scene: this.scene,
          color: this.color,
        })
      )
    }
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

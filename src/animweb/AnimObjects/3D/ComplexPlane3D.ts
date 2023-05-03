import AnimObject3D from '../../AnimObject3D'
import Scene3D from '../../Scene3D'
import Color from '../../helpers/Color'
import Constants from '../../helpers/Constants'
import Line3D from './Line3D'
import Point3D from './Point3D'
import Surface, { MeshData } from './Surface'

export enum ComplexPlanes {
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

interface ComplexPlane3DProps {
  scene: Scene3D
  color?: Color
  form?: ComplexPlanes
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
  filled?: boolean
  constraints?: {
    x?: number
    y?: number
    z?: number
  }
}

export default class ComplexPlane3D extends AnimObject3D {
  form: ComplexPlanes = ComplexPlanes.upper
  axes: Array<Line3D> = []
  points: Array<Point3D> = []
  surfaces: Array<Surface> = []
  webWorker: Worker = new Worker(
    new URL('./../../helpers/Complex.worker.js', import.meta.url),
    { type: 'module' }
  )

  constructor(config: ComplexPlane3DProps) {
    super(config.scene)
    config.color && (this.color = config.color)
    config.form && (this.form = config.form)

    // +y axis
    if (
      this.form == ComplexPlanes.full ||
      this.form == ComplexPlanes.upper ||
      this.form == ComplexPlanes.lower ||
      (this.form == ComplexPlanes.octants &&
        (config.octants?.includes(Octants.I) ||
          config.octants?.includes(Octants.V) ||
          config.octants?.includes(Octants.IV) ||
          config.octants?.includes(Octants.VIII)))
    ) {
      let line = new Line3D({
        point: { x: 0, y: 0, z: 5 },
        scene: this.scene,
        color: this.color,
      })
      this.axes.push(line)
      this.meshes.push(line)
    }

    // -y axis
    if (
      this.form == ComplexPlanes.full ||
      this.form == ComplexPlanes.upper ||
      this.form == ComplexPlanes.lower ||
      (this.form == ComplexPlanes.octants &&
        (config.octants?.includes(Octants.II) ||
          config.octants?.includes(Octants.VI) ||
          config.octants?.includes(Octants.VII) ||
          config.octants?.includes(Octants.III)))
    ) {
      let line = new Line3D({
        point: { x: 0, y: 0, z: -5 },
        scene: this.scene,
        color: this.color,
      })

      this.axes.push(line)
      this.meshes.push(line)
    }

    // +x axis
    if (
      this.form == ComplexPlanes.full ||
      this.form == ComplexPlanes.upper ||
      this.form == ComplexPlanes.lower ||
      (this.form == ComplexPlanes.octants &&
        (config.octants?.includes(Octants.I) ||
          config.octants?.includes(Octants.II) ||
          config.octants?.includes(Octants.VI) ||
          config.octants?.includes(Octants.V)))
    ) {
      let line = new Line3D({
        point: { x: 5, y: 0, z: 0 },
        scene: this.scene,
        color: this.color,
      })

      this.axes.push(line)
      this.meshes.push(line)
    }

    // -x axis
    if (
      this.form == ComplexPlanes.full ||
      this.form == ComplexPlanes.upper ||
      this.form == ComplexPlanes.lower ||
      (this.form == ComplexPlanes.octants &&
        (config.octants?.includes(Octants.III) ||
          config.octants?.includes(Octants.IV) ||
          config.octants?.includes(Octants.VII) ||
          config.octants?.includes(Octants.VIII)))
    ) {
      let line = new Line3D({
        point: { x: -5, y: 0, z: 0 },
        scene: this.scene,
        color: this.color,
      })

      this.axes.push(line)
      this.meshes.push(line)
    }

    // +z axis
    if (
      this.form == ComplexPlanes.full ||
      this.form == ComplexPlanes.upper ||
      (this.form == ComplexPlanes.octants &&
        (config.octants?.includes(Octants.I) ||
          config.octants?.includes(Octants.II) ||
          config.octants?.includes(Octants.III) ||
          config.octants?.includes(Octants.IV)))
    ) {
      let line = new Line3D({
        point: { x: 0, y: 5, z: 0 },
        scene: this.scene,
        color: this.color,
      })

      this.axes.push(line)
      this.meshes.push(line)
    }

    // -z axis
    if (
      this.form == ComplexPlanes.full ||
      this.form == ComplexPlanes.lower ||
      (this.form == ComplexPlanes.octants &&
        (config.octants?.includes(Octants.V) ||
          config.octants?.includes(Octants.VI) ||
          config.octants?.includes(Octants.VII) ||
          config.octants?.includes(Octants.VIII)))
    ) {
      let line = new Line3D({
        point: { x: 0, y: -5, z: 0 },
        scene: this.scene,
        color: this.color,
      })

      this.axes.push(line)
      this.meshes.push(line)
    }
  }

  draw() {}

  point(config: PointPlotProps) {
    let point = new Point3D({ ...config, scene: this.scene })
    this.points.push(point)
    this.meshes.push(point)
  }

  plot(config: SurfacePlotProps) {
    let definition = config.definition

    if (definition.includes('=')) {
      let parts = definition.split('=')
      console.log(parts)
      definition = parts[0]
      for (let i = 1; i < parts.length; i++) {
        definition = definition.concat(`-(${parts[i]})`)
      }
    }

    let meshData = {
      definition,
      detail: config.sampleRate || Constants.defaultSurfaceSampleRate,
      lowerLimit: [-5, -5, -5],
      upperLimit: [5, 5, 5],
      constraints: config.constraints || {},
    }

    this.webWorker.postMessage(meshData)

    this.webWorker.onmessage = ({ data }: { data: MeshData }) => {
      console.log(meshData)
      let surface = new Surface({
        scene: this.scene,
        meshData: data,
        color: config.color || this.color,
        filled: config.filled || false,
      })
      this.surfaces.push(surface)
      this.meshes.push(surface)
    }
  }
}

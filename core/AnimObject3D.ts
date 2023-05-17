/*
The AnimObject3D class stores general properties for the drawings (points, lines, etc) that we want to create
Point, Line, NumberPlane, etc extend this object and add-on more specific properties related to those objects

The AnimObject3D clas specifies color and backgruondColor properties for all of it's children.
AnimObject3D will never be used directly, but only as a parent to Point, Line, NumberPlane, etc
*/

import { v4 as uuidv4 } from 'uuid'
import { Mesh as ThreeMesh } from 'three'
import Color from '@auxiliary/Color.ts'
import Colors from '@helpers/Colors.ts'
import { Watcher } from '@interfaces/core.ts'
import Scene3D from './Scene3D.ts'


export default class AnimObject3D {
  id: string // A unique identifier created for every AnimObject3D. Used to identify which AnimObject3D to remove when Scene.remove is called
  color: Color = Colors.black // The fill color of the AnimObject3D. subclasses may or may not use this prop
  backgroundColor: Color = Colors.transparent // The fill bg color of the AnimObject3D. subclasses may or may not use this prop
  transition: any = null // A placeholder method that is used to smoothly animate the AnimObject3D
  maxAlpha: number = 1
  watchers: Array<Watcher> = [] // An array containing the AnimObject3Ds that are observing come property of this AnimObject3D
  iterables: Array<string> = []
  scene: Scene3D
  mesh: any = new ThreeMesh()
  meshes: Array<AnimObject3D> = []

  remove?: Function
  parentData: {
    origin: { x: number; y: number }
    stepX: number
    stepY: number
  } = { origin: { x: 0, y: 0 }, stepX: 1, stepY: 1 }
  getRelativePosition: Function = ({
    x,
    y,
  }: {
    x: number
    y: number
  }): { x: number; y: number } => {
    return {
      x: (x - this.parentData.origin.x) / this.parentData.stepX,
      y: (this.parentData.origin.y - y) / this.parentData.stepY,
    }
  }
  getAbsolutePosition: Function = ({
    x,
    y,
  }: {
    x: number
    y: number
  }): { x: number; y: number } => {
    return {
      x: x * this.parentData.stepX,
      y: -y * this.parentData.stepY,
    }
  }
  getAbsoluteRange: Function = ([lowerBound, upperBound]: [number, number]): [
    number,
    number
  ] => {
    return [
      -lowerBound * this.parentData.stepY,
      -upperBound * this.parentData.stepY,
    ]
  }
  getAbsoluteDomain: Function = ([lowerBound, upperBound]: [number, number]): [
    number,
    number
  ] => {
    return [
      lowerBound * this.parentData.stepX,
      upperBound * this.parentData.stepX,
    ]
  }
  draw() {}
  constructor(s: Scene3D) {
    this.scene = s
    this.id = `webAnimObject3D-${uuidv4()}`
  }

  setOpacity(opacity: number) {
    this.color.setAlpha(opacity)
    if (this.iterables.length != 0) {
      this.iterables.forEach((name: string) => {
        // @ts-ignore
        this[name].forEach((o: AnimObject3D) => {
          o.setOpacity(opacity)
        })
      })
    }
  }

  /*
  This is a placeholder method. Since every AnimObject3D (Point, Line, etc) is drawn in a different way
  we use only a placeholder here, since it is common to every AnimObject3D.

  When some class extends AnimObject3D, we overload this method by defining draw method inside that class
  However, before any drawing happens, the modified draw method *must* call the transition method.
  */

  renderMeshes() {
    if (this.meshes.length != 0) {
      while (this.meshes.length != 0) {
        let obj = this.meshes.pop()
        obj && this.scene.add(obj)
      }
    }
  }

  update() {}

  /*
  A placeholder method like draw. This method takes in an Watcher and adds it to the watchers
  array of that specific AnimObject3D. In doing so, it calls the handler once at the start
  to give the present value. Subsequent calls are made when the property being observed changes.
  */
  addWatcher(watcher: Watcher) {}
}

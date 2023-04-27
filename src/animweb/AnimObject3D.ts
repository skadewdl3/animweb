/*
The AnimObject3D class stores general properties for the drawings (points, lines, etc) that we want to create
Point, Line, NumberPlane, etc extend this object and add-on more specific properties related to those objects

The AnimObject3D clas specifies color and backgruondColor properties for all of it's children.
AnimObject3D will never be used directly, but only as a parent to Point, Line, NumberPlane, etc
*/

import p5 from 'p5'
import { v4 as uuidv4 } from 'uuid'
import { Width, Height } from './helpers/Dimensions'
import Color from './helpers/Color'
import Colors from './helpers/Colors'
import { Transitions } from './Transition'
import TransitionProps from './Transition'
import { Scene } from '../main'
import Scene3D from './Scene3D'
import * as THREE from 'three'

/*
Defines what kind of properties/arguments/parameters (aka props)
every subclass of AnimObject3D can accept.
Thus, Point, Line, NumberPlane, etc. - all, can accept these props.
*/
export interface AnimObject3DProps {
  color?: Color
  backgroundColor?: Color
  maxAlpha?: number
  parentData?: {
    origin: { x: number; y: number }
    stepX: number
    stepY: number
  }
  thickness?: number
  size?: number
  transition?: Transitions
  transitionOptions?: TransitionProps
  scene: Scene
}

/*
An enum that lists the kinds of AnimObject3Ds we have rn.
When we create a new AnimObject3D, remember to add it to this enum.
This enum is used to check whether an AnimObject3D is a Point, Line, etc.
*/
export enum AnimObject3Ds {
  Line,
  Point,
  NumberPlane,
  Curve,
}

/*
An enum that lists what kind of properties on an AnimObject3D
can be observed by other AnimObject3Ds. 
*/
export enum Observables {
  color = 'color',
  backgroundColor = 'backgroundColor',
  slope = 'slope',
  x = 'x',
  y = 'y',
}

/*
AnimObject3Ds can observe properties by specifying the type of property
and a handler for the returned value
*/
export interface Observer {
  property: Observables
  handler: Function
}

export default class AnimObject3D {
  id: string // A unique identifier created for every AnimObject3D. Used to identify which AnimObject3D to remove when Scene.remove is called
  color: Color = Colors.black // The fill color of the AnimObject3D. subclasses may or may not use this prop
  backgroundColor: Color = Colors.transparent // The fill bg color of the AnimObject3D. subclasses may or may not use this prop
  transition: any = null // A placeholder method that is used to smoothly animate the AnimObject3D
  maxAlpha: number = 1
  observers: Array<Observer> = [] // An array containing the AnimObject3Ds that are observing come property of this AnimObject3D
  iterables: Array<string> = []
  scene: Scene3D
  mesh: any = new THREE.Mesh()
  meshes: Array<any> = []

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

  /*
  Right now, the transition method is a placeholder method. When we apply a transition like so:
  FadeIn(Line) or Create(NumberPlane), this method gets modified by FadeIn or Create.

  The transition method is called before inside the AnimObject3D.draw method of every AnimObject3D.
  It is called before *anything* is displayed on the screen.
  So, if we want to fade an element out, we increase color transparency by a small amount. This is drawn to the screen.
  On next call of draw method we increase transparency even further. This is drawn to the screen
  This continues till the transparency is 100% (alpha = 0)

  The transition method must check for this condition i.e. when the transition ends.
  When it ends, the transition method sets itself to null and stop being called inside AnimObject3D.draw
  */

  constructor(s: Scene3D) {
    this.scene = s
    this.id = `webAnimObject3D-${uuidv4()}`
  }

  // updateSceneDimensions(width: number, height: number) {
  //   this.scene.height = height
  //   this.scene.width = width
  // }

  // updateTransitionQueueFunctions(
  //   queueTransition: Function,
  //   unqueueTransition: Function,
  //   waitBeforeTransition: Function
  // ) {
  //   this.scene.enqueueTransition = queueTransition
  //   this.scene.dequeueTransition = unqueueTransition
  //   this.waitBeforeTransition = waitBeforeTransition

  //   if (this.iterables.length != 0) {
  //     this.iterables.forEach((name: string) => {
  //       // @ts-ignore
  //       this[name].forEach((o: AnimObject3D) => {
  //         o.updateTransitionQueueFunctions(
  //           this.scene.enqueueTransition,
  //           this.scene.dequeueTransition,
  //           this.waitBeforeTransition
  //         )
  //       })
  //     })
  //   }
  // }

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
  draw() {}

  /*
  A placeholder method like draw. This method takes in an Observer and adds it to the observers
  array of that specific AnimObject3D. In doing so, it calls the handler once at the start
  to give the present value. Subsequent calls are made when the property being observed changes.
  */
  addObserver(observer: Observer) {}
}

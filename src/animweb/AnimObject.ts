/*
The AnimObject class stores general properties for the drawings (points, lines, etc) that we want to create
Point, Line, NumberPlane, etc extend this object and add-on more specific properties related to those objects

The AnimObject clas specifies color and backgruondColor properties for all of it's children.
AnimObject will never be used directly, but only as a parent to Point, Line, NumberPlane, etc
*/

import p5 from 'p5'
import { v4 as uuidv4 } from 'uuid'
import { Width, Height } from './helpers/Dimensions'
import Color from './helpers/Color'
import StandardColors from './helpers/StandardColors'
import Transition from './Transition'
import { number } from 'mathjs'

/*
Defines what kind of properties/arguments/parameters (aka props)
every subclass of AnimObject can accept.
Thus, Point, Line, NumberPlane, etc. - all, can accept these props.
*/
export interface AnimObjectProps {
  color?: Color
  backgroundColor?: Color
  maxAlpha?: number
  parentData?: {
    origin: { x: number; y: number }
    stepX: number
    stepY: number
  }
}

/*
An enum that lists the kinds of AnimObjects we have rn.
When we create a new AnimObject, remember to add it to this enum.
This enum is used to check whether an AnimObject is a Point, Line, etc.
*/
export enum AnimObjects {
  Line,
  Point,
  NumberPlane,
  Curve,
}

/*
An enum that lists what kind of properties on an AnimObject
can be observed by other AnimObjects. 
*/
export enum Observables {
  color = 'color',
  backgroundColor = 'backgroundColor',
  slope = 'slope',
  x = 'x',
  y = 'y',
}

/*
AnimObjects can observe properties by specifying the type of property
and a handler for the returned value
*/
export interface Observer {
  property: Observables
  handler: Function
}

export default class AnimObject {
  sceneHeight: number // This property provides access of the height of the scene to every AnimObject
  sceneWidth: number // This property provides access of the height of the scene to every AnimObject
  id: string // A unique identifier created for every AnimObject. Used to identify which AnimObject to remove when Scene.remove is called
  color: Color = StandardColors.Black() // The fill color of the AnimObject. subclasses may or may not use this prop
  backgroundColor: Color = StandardColors.Transparent() // The fill bg color of the AnimObject. subclasses may or may not use this prop
  transition: any = null // A placeholder method that is used to smoothly animate the AnimObject
  maxAlpha: number = 1
  observers: Array<Observer> = [] // An array containing the AnimObjects that are observing come property of this AnimObject
  iterables: Array<string> = []
  queueTransition: Function = () => {}
  unqueueTransition: Function = () => {}
  waitBeforeTransition: Function = () => {}
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
      y: -1 * y * this.parentData.stepY,
    }
  }
  getAbsoluteRange: Function = ([lowerBound, upperBound]: [number, number]): [
    number,
    number
  ] => {
    return [
      this.parentData.origin.y - lowerBound * this.parentData.stepY,
      this.parentData.origin.y - upperBound * this.parentData.stepY,
    ]
  }
  getAbsoluteDomain: Function = ([lowerBound, upperBound]: [number, number]): [
    number,
    number
  ] => {
    return [
      this.parentData.origin.x + lowerBound * this.parentData.stepX,
      this.parentData.origin.x + upperBound * this.parentData.stepX,
    ]
  }

  /*
  Right now, the transition method is a placeholder method. When we apply a transition like so:
  FadeIn(Line) or Create(NumberPlane), this method gets modified by FadeIn or Create.

  The transition method is called before inside the AnimObject.draw method of every AnimObject.
  It is called before *anything* is displayed on the screen.
  So, if we want to fade an element out, we increase color transparency by a small amount. This is drawn to the screen.
  On next call of draw method we increase transparency even further. This is drawn to the screen
  This continues till the transparency is 100% (alpha = 0)

  The transition method must check for this condition i.e. when the transition ends.
  When it ends, the transition method sets itself to null and stop being called inside AnimObject.draw
  */

  constructor() {
    this.sceneWidth = Width.full // by default, sceneWidth is width of the full screen
    this.sceneHeight = Height.full // by default, sceneHeight is height of the full screen
    this.id = `webanimobject-${uuidv4()}`
  }

  /*
  When the AnimObject is added to any Scene, the Scene calls this method before drawing it.
  This way, the same AnimObject can be used in different scenes.

  The method itself updates the sceneWidth and sceneHeight properties for the AnimObject
  */
  updateSceneDimensions(width: number, height: number) {
    this.sceneHeight = height
    this.sceneWidth = width
  }

  updateTransitionQueueFunctions(
    queueTransition: Function,
    unqueueTransition: Function,
    waitBeforeTransition: Function
  ) {
    this.queueTransition = queueTransition
    this.unqueueTransition = unqueueTransition
    this.waitBeforeTransition = waitBeforeTransition

    if (this.iterables.length != 0) {
      this.iterables.forEach((name: string) => {
        // @ts-ignore
        this[name].forEach((o: AnimObject) => {
          o.updateTransitionQueueFunctions(
            this.queueTransition,
            this.unqueueTransition,
            this.waitBeforeTransition
          )
        })
      })
    }
  }

  /*
  This is a placeholder method. Since every AnimObject (Point, Line, etc) is drawn in a different way
  we use only a placeholder here, since it is common to every AnimObject.

  When some class extends AnimObject, we overload this method by defining draw method inside that class
  However, before any drawing happens, the modified draw method *must* call the transition method.
  */
  draw(p: p5) {}

  /*
  A placeholder method like draw. This method takes in an Observer and adds it to the observers
  array of that specific AnimObject. In doing so, it calls the handler once at the start
  to give the present value. Subsequent calls are made when the property being observed changes.
  */
  addObserver(observer: Observer) {}
}

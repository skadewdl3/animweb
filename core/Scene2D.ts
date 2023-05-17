/*
The Scene Class acts as the root of all other AnimObjects.
An AnimObject is a special class (see AnimObject.ts) on which we add transitions
and functions to draw shapes.

The Scene itself cannot be animated, but every AnimObject can be animated.

P.S - A function declared inside a class is called a method
*/

import p5 from 'p5'
import AnimObject from '@core/AnimObject2D.ts'
import Color from '@auxiliary/Color.ts'
import Colors from '@helpers/Colors.ts'
import Constants from '@helpers/Constants.ts'
import { v4 as uuid } from 'uuid'
import { wait } from '@helpers/miscellaneous.ts'
import { TransitionQueueItem } from '@interfaces/transitions.ts'
import { RenderingModes } from '@enums/miscellaneous.ts'
import { createSketch } from '@helpers/sketch.ts'


export default class Scene2D {
  height: number
  width: number
  sketch: any
  objects: Array<AnimObject>
  backgroundColor: Color
  canvasElement: HTMLElement | null = null
  stopLoop: any = null
  startLoop: any = null
  transitionQueue: Array<TransitionQueueItem> = []
  mode: RenderingModes = RenderingModes._2D
  id: string = uuid()
  hidden: boolean = false
  fonts: {
    [fontName: string]: any
  } = {}

  constructor(width = 800, height = 800, backgroundColor = Colors.gray1) {
    this.width = width // default width of the Scene is 800
    this.height = height // default height of the Scene is 800
    this.objects = [] // the objects property will be an Array containing AnimObject instances
    this.backgroundColor = backgroundColor // default background color is gray
    /*
    Creates a p5js sketch by specifying setup and draw methods
    setup() runs once when scene is initialised
    draw() runs every frame
    */
    this.sketch = createSketch({
      setup: this.setup.bind(this),
      draw: this.draw.bind(this),
      preload: this.preload.bind(this),
    })

    new p5(this.sketch, document.body)
  }

  resetScene() {
    for (let object of this.objects) if (object.remove) object.remove()
    this.objects = []
    this.transitionQueue = []
  }

  updateSceneProps(obj: AnimObject) {
    if (obj.iterables.length != 0) {
      obj.scene = this
      obj.iterables.forEach((name) => {
        // @ts-ignore
        obj[name].forEach((o) => this.updateSceneProps(o))
      })
    } else {
      obj.scene = this
    }
  }

  enqueueTransition(transition: TransitionQueueItem) {
    this.transitionQueue.push(transition)
    // console.log('queued', [...this.transitionQueue])
  }

  dequeueTransition(transition: TransitionQueueItem) {
    // console.log(this.transitionQueue)
    this.transitionQueue = this.transitionQueue.filter(({ id }) => {
      return id != transition.id
    })
    // console.log('unqueued', [...this.transitionQueue])
  }

  // adds an AnimObject to be rendered onto the canvas
  add(obj: AnimObject): AnimObject {
    // updates the sceneHeight anf sceneWidth properties of the AnimObject
    // obj.updateSceneDimensions(this.width, this.height)
    this.updateSceneProps(obj)

    // adds the AnimObject to the array of objects to be rendered
    this.objects.push(obj)
    return obj
  }

  // sets up some initial values i.e. witdth, height, background color, etc.
  setup(p: any) {
    p.frameRate(Constants.FrameRate)
    let canvas = p.createCanvas(this.width, this.height, p.P2D)
    this.canvasElement = canvas.elt
    p.background(this.backgroundColor.rgba)
    p.colorMode(p.RGB)
    this.stopLoop = () => p.noLoop()
    this.startLoop = () => p.loop()
    this.stopLoop()
  }

  /*
  draws each AnimObject onto the canvas
  the actual draw code is included inside the AnimObject.draw method
  Scene.draw just runs AnimObject.draw for every AnimObject in Scene.objects
  */
  draw(p: any) {
    p.clear()
    p.background(this.backgroundColor.rgba)
    this.objects.forEach((obj) => obj.draw(p))
  }

  async hide() {
    if (this.stopLoop) this.stopLoop()
    this.hidden = true
    this.resetScene()
    while (!this.canvasElement) {
      await wait(100)
    }
    this.canvasElement.classList.add('hidden')
  }

  async show() {
    this.hidden = false
    while (!this.canvasElement) {
      await wait(100)
    }
    this.canvasElement.classList.remove('hidden')
    this.startLoop()
  }

  preload(p: any) {}

  async wait(timeout?: number): Promise<void> {
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        while (this.transitionQueue.length != 0) {
          await wait(100)
        }
        if (timeout) {
          setTimeout(() => resolve(), timeout)
        } else resolve()
      }, 500)
    })
  }

  /*
  opposite of Scene.add
  removes the given AnimObject from the canvas
  this is done by remove the AnimObject from Scene.objects
  */
  remove(obj: AnimObject) {
    this.objects = this.objects.filter((o) => o.id != obj.id)
  }
}

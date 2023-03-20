/*
The Scene Class acts as the root of all other AnimObjects.
An AnimObject is a special class (see AnimObject.ts) on which we add transitions
and functions to draw shapes.

The Scene itself cannot be animated, but every AnimObject can be animated.

P.S - A function declared inside a class is called a method
*/

const p5 = window.p5

import { createSketch } from './../p5-util/sketch'
import AnimObject from './AnimObject'
import Color from './helpers/Color'
import Colors from './helpers/StandardColors'
import Constants from './helpers/Constants'
import { v4 as uuidv4 } from 'uuid'
import { wait } from './helpers/miscellaneous'
import { TransitionQueueItem } from './Transition'
import { basicSetup, EditorView } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'

const defaultDoc = `var w = window.WebAnim

var plane = new w.NumberPlane()

w.scene.add(plane)

plane.plotImplicit({ definition: 'x^2 + y^2 - 25' })`

export default class Scene {
  height: number
  width: number
  sketch: any
  objects: Array<AnimObject>
  backgroundColor: Color
  shouldRecord: boolean = false
  canvasElement: HTMLElement | null = null
  recorder: any = null
  loopStopped: boolean = false
  stopLoop: any = null
  startLoop: any = null
  transitionQueue: Array<TransitionQueueItem> = []

  constructor(width = 800, height = 800, backgroundColor = Colors.Gray(0)) {
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
    })

    document.body.insertAdjacentHTML(
      'beforeend',
      `
    <div class="user-controls" style="position: absolute; top: 2rem; right: 1rem; min-width: 40%; max-width: 40%; min-height: 95vh">
        <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 1rem">
          <p style="font-family: sans-serif; font-size:3rem" class="code-title">Code</p>
          <div style="display: flex; align-items: center; justify-content: center">
          
          <button class="btn btn-play">Play</button>
          <button class="btn btn-clear">Clear</button>
           <button class="btn btn-hide-code">Hide Code</button>
           <button  class="btn btn-show-code hidden">Show Code</button>
          </div>
        </div>
        <div class="codemirror-editor-container">
        
        </div>
    </div>
    
    <style>
    .btn-play {
      display: block;
    }
    .btn-hidden {
      display: none;
    }
    
    </style>
    `
    )

    let editor = new EditorView({
      //@ts-ignore
      parent: document.querySelector('.codemirror-editor-container'),
      doc: defaultDoc,
      extensions: [basicSetup, javascript(), EditorView.lineWrapping],
    })

    let prevWindow = window

    document.querySelector('.btn-play')?.addEventListener('click', () => {
      this.resetScene()

      document.querySelector('.user-script')?.remove()
      let userScript = document.createElement('script')
      userScript.className = 'user-script'
      userScript.type = 'module'
      // @ts-ignore
      let inlineCode = document.createTextNode(`try {
        ${editor.state.doc.toString()}
      }
      catch (err) {
        console.log('caught error: ', err)
      }`)
      userScript.appendChild(inlineCode)
      document.body.appendChild(userScript)
      this.startLoop()
    })

    document.querySelector('.btn-clear')?.addEventListener('click', () => {
      this.objects = []
      this.resetScene()
    })
    document.querySelector('.btn-hide-code')?.addEventListener('click', () => {
      document.querySelector('.btn-hide-code')?.classList.add('hidden')
      document.querySelector('.btn-show-code')?.classList.remove('hidden')
      document
        .querySelector('.codemirror-editor-container')
        ?.classList.add('hidden')
      document.querySelector('.code-title')?.classList.add('hidden-text')
    })
    document.querySelector('.btn-show-code')?.addEventListener('click', () => {
      document.querySelector('.btn-hide-code')?.classList.remove('hidden')
      document.querySelector('.btn-show-code')?.classList.add('hidden')
      document
        .querySelector('.codemirror-editor-container')
        ?.classList.remove('hidden')
      document.querySelector('.code-title')?.classList.remove('hidden-text')
    })
    new p5(this.sketch)
  }

  resetScene() {
    this.objects = []
    this.transitionQueue = []
  }

  updateSceneProps(obj: AnimObject) {
    if (obj.iterables.length != 0) {
      obj.updateSceneDimensions(this.width, this.height)
      obj.updateTransitionQueueFunctions(
        this.queueTransition.bind(this),
        this.unqueueTransition.bind(this),
        this.wait.bind(this)
      )
      obj.iterables.forEach((name) => {
        // @ts-ignore
        obj[name].forEach((o) => this.updateSceneProps(o))
      })
    } else {
      obj.updateSceneDimensions(this.width, this.height)
      obj.updateTransitionQueueFunctions(
        this.queueTransition.bind(this),
        this.unqueueTransition.bind(this),
        this.wait.bind(this)
      )
    }
  }

  queueTransition(transition: TransitionQueueItem) {
    this.transitionQueue.push(transition)
    console.log('queued', [...this.transitionQueue])
  }

  unqueueTransition(transition: TransitionQueueItem) {
    this.transitionQueue = this.transitionQueue.filter(({ id }) => {
      return id != transition.id
    })
    console.log('unqueued', [...this.transitionQueue])
  }

  // adds an AnimObject to be rendered onto the canvas
  add(obj: AnimObject) {
    // updates the sceneHeight anf sceneWidth properties of the AnimObject
    // obj.updateSceneDimensions(this.width, this.height)
    this.updateSceneProps(obj)

    // adds the AnimObject to the array of objects to be rendered
    this.objects.push(obj)
  }

  // sets up some initial values i.e. witdth, height, background color, etc.
  setup(p: any) {
    let id = uuidv4()
    p.frameRate(Constants.FrameRate)
    let canvas = p.createCanvas(this.width, this.height)
    canvas.id(id)
    p.background(this.backgroundColor.rgba)
    p.colorMode(p.RGB)
    let el = document.getElementById(id)
    this.canvasElement = el
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
    p.background(this.backgroundColor.rgba)
    this.objects.forEach((obj) => obj.draw(p))
  }

  async wait(timeout?: number): Promise<void> {
    console.log(this.transitionQueue)
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

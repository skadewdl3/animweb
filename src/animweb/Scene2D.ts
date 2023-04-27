/*
The Scene Class acts as the root of all other AnimObjects.
An AnimObject is a special class (see AnimObject.ts) on which we add transitions
and functions to draw shapes.

The Scene itself cannot be animated, but every AnimObject can be animated.

P.S - A function declared inside a class is called a method
*/

const p5 = window.p5

import AnimObject from './AnimObject'
import Color from './helpers/Color'
import Colors from './helpers/Colors'
import Constants from './helpers/Constants'
import { v4 as uuid } from 'uuid'
import { wait } from './helpers/miscellaneous'
import { TransitionQueueItem } from './Transition'
import { RenderingModes } from './helpers/Constants'
import WebAnim from '../main'
// @ts-ignore
import { createSketch } from '../p5-util/sketch'
import { EditorView } from 'codemirror'

export default class Scene {
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
  editor?: EditorView
  fonts: {
    [fontName: string]: any
  } = {}

  constructor(
    width = 800,
    height = 800,
    backgroundColor = Colors.gray1,
    editor: EditorView
  ) {
    this.width = width // default width of the Scene is 800
    this.height = height // default height of the Scene is 800
    this.objects = [] // the objects property will be an Array containing AnimObject instances
    this.backgroundColor = backgroundColor // default background color is gray
    this.editor = editor
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

    this.setupEventListeners()
    new p5(this.sketch, document.body)
  }

  setupEventListeners() {
    // @ts-ignore
    document.querySelector('.btn-play').onclick = () => {
      document.querySelector('.code-error')?.classList.add('hidden')
      this.resetScene()

      document.querySelector('.user-script')?.remove()
      let userScript = document.createElement('script')
      userScript.className = 'user-script'
      userScript.type = 'module'

      let defaultExports = ``

      for (let property in WebAnim) {
        defaultExports = defaultExports.concat(
          `var ${property} = window.WebAnim.${property}\n`
        )
      }

      defaultExports = defaultExports.concat(`render('2D')\n`)
      // @ts-ignore

      let inlineCode = document.createTextNode(
        `try {\n${defaultExports}${this.editor?.state.doc.toString()}\n}\ncatch (err) {
          let [errLineNumber, errLineColumn] = err.stack.split(':').slice(-2).map((i) => parseInt(i))
          let errType = err.stack.split(':')[0]
          let codeError = document.querySelector('.code-error') 
          document.querySelector('.code-error-message').textContent = errType + ': ' + err.message
          document.querySelector('.code-error-line').textContent = 'at line ' + parseInt(errLineNumber - ${
            defaultExports.split('\n').length
          })
          codeError.classList.remove('hidden')
      }`
      )
      userScript.appendChild(inlineCode)
      document.body.appendChild(userScript)
      this.startLoop()
    }

    // @ts-ignore
    document.querySelector('.btn-clear').onclick = () => {
      document.querySelector('.code-error')?.classList.add('hidden')
      this.objects = []
      this.resetScene()
    }

    // @ts-ignore
    document.querySelector('.btn-hide-code').onclick = () => {
      document.querySelector('.code-error')?.classList.add('hidden')
      document.querySelector('.btn-hide-code')?.classList.add('hidden')
      document.querySelector('.btn-show-code')?.classList.remove('hidden')
      document
        .querySelector('.codemirror-editor-container')
        ?.classList.add('hidden')
      document.querySelector('.code-title')?.classList.add('hidden-text')
    }

    // @ts-ignore
    document.querySelector('.btn-show-code').onclick = () => {
      document.querySelector('.code-error')?.classList.remove('hidden')
      document.querySelector('.btn-hide-code')?.classList.remove('hidden')
      document.querySelector('.btn-show-code')?.classList.add('hidden')
      document
        .querySelector('.codemirror-editor-container')
        ?.classList.remove('hidden')
      document.querySelector('.code-title')?.classList.remove('hidden-text')
    }

    // @ts-ignore
    window.onerror = (message: string, _, line: number) => {
      let defaultExports = ``
      for (let property in WebAnim) {
        defaultExports = defaultExports.concat(
          `var ${property} = window.WebAnim.${property}\n`
        )
      }
      let codeError = document.querySelector('.code-error')
      // @ts-ignore
      document.querySelector('.code-error-message').textContent = message
      // @ts-ignore
      document.querySelector('.code-error-line').textContent = `at line ${
        line - defaultExports.split('\n').length
      }`
      codeError?.classList.remove('hidden')
    }
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
    this.setupEventListeners()
    this.hidden = false
    while (!this.canvasElement) {
      await wait(100)
    }
    this.canvasElement.classList.remove('hidden')
    this.startLoop()
  }

  preload(p: any) {
    this.fonts.Math = p.loadFont('/mathfont.otf')
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

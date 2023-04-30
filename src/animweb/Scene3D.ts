/*
The Scene Class acts as the root of all other AnimObject3Ds.
An AnimObject3D is a special class (see AnimObject3D.ts) on which we add transitions
and functions to draw shapes.

The Scene itself cannot be animated, but every AnimObject3D can be animated.

P.S - A function declared inside a class is called a method
*/

import * as THREE from 'three'
import AnimObject3D from './AnimObject3D'
import Color from './helpers/Color'
import Colors from './helpers/Colors'
import { v4 as uuid } from 'uuid'
import { wait } from './helpers/miscellaneous'
import { TransitionQueueItem } from './Transition'
import { RenderingModes } from './helpers/Constants'
import WebAnim from '../main'
// @ts-ignore
// import { createSketch } from '../p5-util/sketch'
import { EditorView } from 'codemirror'
import Camera from './AnimObjects/3D/Camera3D'

export default class Scene3D {
  height: number
  width: number
  sketch: any
  objects: Array<AnimObject3D>
  backgroundColor: Color
  rendererElement: HTMLElement | null = null
  scene: THREE.Scene
  camera: Camera
  renderer: THREE.WebGLRenderer

  transitionQueue: Array<TransitionQueueItem> = []
  mode: RenderingModes = RenderingModes._3D
  id: string = uuid()
  hidden: boolean = false
  editor?: EditorView
  rotate: boolean = true
  rotateAngle: number = 0.01

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
    this.editor = editor
    this.objects = [] // the objects property will be an Array containing AnimObject3D instances
    this.backgroundColor = backgroundColor // default background color is gray

    // do three js shit here

    this.scene = new THREE.Scene()
    this.camera = new Camera(
      this.width, this.height
    )
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(this.width, this.height)
    document.body.appendChild(this.renderer.domElement)
    this.rendererElement = this.renderer.domElement

    this.setupEventListeners()
    this.setup()
    this.draw()
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
    this.scene.remove.apply(this.scene, this.scene.children)
    this.camera = new Camera(this.width, this.height)
    this.objects = []
    this.transitionQueue = []
  }

  updateSceneProps(obj: AnimObject3D) {
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

  // adds an AnimObject3D to be rendered onto the canvas
  add(obj: AnimObject3D): AnimObject3D {
    // updates the sceneHeight anf sceneWidth properties of the AnimObject3D
    // obj.updateSceneDimensions(this.width, this.height)
    this.updateSceneProps(obj)

    // adds the AnimObject3D to the array of objects to be rendered
    this.objects.push(obj)
    obj.mesh && this.scene.add(obj.mesh)
    obj.meshes.forEach((meshName) => {
      // @ts-ignore
      obj[meshName].forEach((obj: AnimObject3D) => this.scene.add(obj.mesh))
    })
    return obj
  }

  // sets up some initial values i.e. witdth, height, background color, etc.
  setup() {
    this.renderer.setClearColor(parseInt(this.backgroundColor.hex.replace('#', ''), 16))
  }


  rotation: boolean = true
  startRotation () {
    this.rotation = true 
  }

  stopRotation () {
    this.rotation = false
  }

  /*
  draws each AnimObject3D onto the canvas
  the actual draw code is included inside the AnimObject3D.draw method
  Scene.draw just runs AnimObject3D.draw for every AnimObject3D in Scene.objects
  */

  angle: number = 0
  draw() {
    requestAnimationFrame(this.draw.bind(this))

    this.objects.forEach((o: AnimObject3D) => o.update())
    this.camera.update()

    this.renderer.render(this.scene, this.camera.camera)
  }

  async hide() {
    this.hidden = true
    this.resetScene()

    while (!this.rendererElement) {
      await wait(100)
    }
    this.rendererElement.setAttribute(
      'style',
      `display: none; width: ${this.width}px; height: ${this.height}px;`
    )
  }

  async show() {
    this.setupEventListeners()
    this.hidden = false
    while (!this.rendererElement) {
      await wait(100)
    }
    this.rendererElement.setAttribute(
      'style',
      `display: block; width: ${this.width}px; height: ${this.height}px;`
    )
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
  removes the given AnimObject3D from the canvas
  this is done by remove the AnimObject3D from Scene.objects
  */
  remove(obj: AnimObject3D) {
    this.objects = this.objects.filter((o) => o.id != obj.id)
  }
}

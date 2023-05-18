export interface UIReactive {
  clear: Function
}

export interface ButtonsReactive extends UIReactive {
  buttons: Array<any>
  addButton: Function
  getButton: Function
  removeButton: Function
}

export interface SlidersReactive extends UIReactive {
  sliders: Array<any>
  addSlider: Function
  getSlider: Function
  removeSlider: Function
}

export interface PromptsReactive extends UIReactive {
  prompts: Array<any>
  addPrompt: Function
  removePrompt: Function
  getPrompt: Function
}

export interface EditorReactive extends UIReactive {
  editor: any
  create: Function
  run: Function
  disabled: boolean
}

export interface CodeReactive {
  hidden: boolean
  show: Function
  hide: Function
  toggle: Function
  toggleMode: Function
  mode: string
}

export interface LoggerReactive extends UIReactive {
  logs: Array<any>
  logComplex: Function
  logMatrix: Function
  logColor: Function
  logArray: Function
  logObject: Function
  log: Function
}

export interface ErrorReactive {
  hidden: boolean
  type: string
  message: string
  lineNumber: any
  show: Function
  hide: Function
}

export interface SVGReactive extends UIReactive {
  svgs: Array<any>
  addSVG: Function
}

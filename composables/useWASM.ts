// @ts-ignore
import init, { greet } from 'wasm'

interface WASMExports {
  greet: Function
}

export default () => {
  init()
  return {
    greet,
  }
}

// @ts-ignore
import init, { greet } from 'wasm'

export default async () => {
  await init(await fetch('wasm_bg.wasm'))
  return {
    greet,
  }
}

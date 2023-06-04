// @ts-ignore
import init, { greet, himom, add, sub } from './../wasm/pkg/wasm.js'

export default async () => {
  await init('@/public/wasm_bg.wasm')
  return {
    greet,
    himom,
    add,
    sub,
  }
}

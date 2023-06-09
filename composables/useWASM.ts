// @ts-ignore
import init, { add, sub, test } from './../wasm/pkg/wasm.js'

export default async () => {
  await init('/wasm_bg.wasm')
  return {
    add,
    sub,
    test,
  }
}

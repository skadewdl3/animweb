// @ts-ignore
import '@/wasm/pkg/wasm_bg.wasm'
import init, { greet } from 'wasm'


export default async () => {
  await init()
  return {
    greet,
  }
}

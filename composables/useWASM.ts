// @ts-ignore
import init, { greet } from 'wasm'

export default async () => {
  await init()
  return {
    greet,
  }
}

export const { add, subtract, mul }: any = await (async () => {
  let response = await fetch('release.wasm').catch(err => console.log(err))
  // @ts-ignore
  let bytes = await response.arrayBuffer()
  let wasm = await WebAssembly.instantiate(bytes, { env: {} })
  return wasm.instance.exports
})()

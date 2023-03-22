# Final Code

```
var plane = new NumberPlane({ showGridLines: true })
scene.add(await Create(plane))

await scene.wait(3000)

var sinx = await plane.plot({ definition: 'y = sin(x)', transition: Transitions.Create, color: Colors.Green(), thickness: 5 })

await scene.wait()

var tangent = await sinx.addAnchorLine({ x: 0, transition: Transitions.Create, color: Colors.Orange(), thickness: 3, length: 4 })
await scene.wait()
tangent.moveTo({ x: 10, duration: 5 })
await scene.wait()
```

### The same length property can be passed to any line to control it's length too.

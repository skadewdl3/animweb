# Final Code

```
var w = window.WebAnim
var plane = new w.NumberPlane({ showGridLines: true })
w.scene.add(await w.Create(plane))

await w.scene.wait(3000)

var sinx = await plane.plot({ definition: 'y = sin(x)', transition: w.Transitions.Create, color: w.Colors.Green(), thickness: 5 })

await w.scene.wait()

var tangent = await sinx.addAnchorLine({ x: 0, transition: w.Transitions.Create, color: w.Colors.Orange(), thickness: 3, length: 4 })
await w.scene.wait()
tangent.moveTo({ x: 10, duration: 5 })
await w.scene.wait()
```

### The same length property can be passed to any line to control it's length too.

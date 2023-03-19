# Final Code

```
var w = window.WebAnim
var plane = new w.NumberPlane({ showGridLines: true })
w.scene.add(await w.Create(plane))

await w.scene.wait(3000)

var sinx = await plane.plot({ definition: 'y = sin(x)', transition: w.Transitions.Create, color: w.Colors.Green(), thickness: 5 })

await w.scene.wait()

var point = await sinx.addAnchorPoint({ x: 0, color: w.Colors.Orange(), size: 10, transition: w.Transitions.Create })

await w.scene.wait(1000)

await point.moveTo({ x: 5, duration: 2 })
```

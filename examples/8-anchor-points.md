# Final Code

```
var plane = new NumberPlane({ showGridLines: true })
scene.add(await Create(plane))

await scene.wait(3000)

var sinx = await plane.plot({ definition: 'y = sin(x)', transition: Transitions.Create, color: Colors.Green(), thickness: 5 })

await scene.wait()

var point = await sinx.addAnchorPoint({ x: 0, color: Colors.Orange(), size: 10, transition: Transitions.Create })

await scene.wait(1000)

await point.moveTo({ x: 5, duration: 2 })
```

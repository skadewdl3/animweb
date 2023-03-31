# Final Code

```
var plane = NumberPlane({ showGridLines: true })
Create(plane)

await wait(3000)

var sinx = await plane.plot({ definition: 'y = sin(x)', transition: Transitions.Create, color: Colors.Green(), thickness: 5 })

await wait()

var point = await sinx.addAnchorPoint({ x: 0, color: Colors.Orange(), size: 10, transition: Transitions.Create })

await wait(1000)

await point.moveTo({ x: 5, duration: 2 })
```

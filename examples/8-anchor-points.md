# Final Code

```
var plane = NumberPlane({ grid: true })
Create(plane)

await wait(3000)

var sinx = Create(plane.plot({ definition: 'y = sin(x)', color: Colors.green, thickness: 5 }))

await wait()

var point = Create(sinx.addAnchorPoint({ x: 0, color: Colors.orange, size: 10 }))

await wait(1000)

await point.moveTo({ x: 5, duration: 2 })
```

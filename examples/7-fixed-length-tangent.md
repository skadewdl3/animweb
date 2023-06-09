# Final Code
Note that this feature is not stable as of now. We are working our best on implementing it ASAP.

```
var plane = NumberPlane({ grid: true })
Create(plane)

await wait(3000)

var sinx = Create(plane.plot({ definition: 'y = sin(x)', color: Colors.green, thickness: 5 }))

await wait()

var tangent = Create(sinx.addAnchorLine({ x: 0, color: Colors.orange, thickness: 3, length: 4 }))
await wait()
tangent.moveTo({ x: 10, duration: 5 })
await wait()
```

### The same length property can be passed to any line to control it's length too.

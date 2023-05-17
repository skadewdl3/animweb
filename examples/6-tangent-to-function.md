# Final Code

```
var plane = NumberPlane({ grid: true })

FadeIn(plane)
await wait(1000)

var cosx = FadeIn(plane.plot({ definition: 'y = cos(x)', color: Colors.green, thickness: 5 }))
await wait()

var tangent = Create(cosx.addTangent({ x: 0, color: Colors.orange, thickness: 3 }))
await wait(1000)

tangent.moveTo({ x: Math.PI })
```

### Currently, addAnchorLine can only create a tangent. More customisation options will come soon.

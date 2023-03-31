# Final Code

```
var plane = NumberPlane({ showGridLines: true })

FadeIn(plane)
await wait(1000)

var cosx = await plane.plot({ definition: 'y = cos(x)', color: Colors.Green(), thickness: 5, transition: Transitions.FadeIn })
await wait()

var tangent = await cosx.addAnchorLine({ x: 0, color: Colors.Orange(), thickness: 3, transition: Transitions.Create })
await wait(1000)

tangent.moveTo({ x: Math.PI })
```

### Currently, addAnchorLine can only create a tangent. More customisation options will come soon.

# Final Code

```
var plane = new NumberPlane({ showGridLines: true })

scene.add(await FadeIn(plane))
await scene.wait(1000)

var cosx = await plane.plot({ definition: 'y = cos(x)', color: Colors.Green(), thickness: 5, transition: Transitions.FadeIn })
await scene.wait()

var tangent = await cosx.addAnchorLine({ x: 0, color: Colors.Orange(), thickness: 3, transition: Transitions.Create })
await scene.wait(1000)

tangent.moveTo({ x: Math.PI })
```

### Currently, addAnchorLine can only create a tangent. More customisation options will come soon.

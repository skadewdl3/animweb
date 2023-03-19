# Final Code

```
var w = window.WebAnim
var plane = new w.NumberPlane({ showGridLines: true })

w.scene.add(await w.FadeIn(plane))
await w.scene.wait(1000)

var cosx = await plane.plot({ definition: 'y = cos(x)', color: w.Colors.Green(), thickness: 5, transition: w.Transitions.FadeIn })
await w.scene.wait()

var tangent = await cosx.addAnchorLine({ x: 0, color: w.Colors.Orange(), thickness: 3, transition: w.Transitions.Create })
await w.scene.wait(1000)

tangent.moveTo({ x: Math.PI })
```

### Currently, addAnchorLine can only create a tangent. More customisation options will come soon.

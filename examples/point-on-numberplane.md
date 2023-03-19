# Final Code

```
var w = window.WebAnim
var plane = new w.NumberPlane({ showGridLines: true })

w.scene.add(await w.FadeIn(plane))
await w.scene.wait(1000)

plane.point({ x: -1, y: 1, transition: w.Transitions.Create, color: w.Colors.Orange(), size: 10 })
```

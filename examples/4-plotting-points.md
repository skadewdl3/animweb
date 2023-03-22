# Final Code

```
var plane = new NumberPlane({ showGridLines: true })

scene.add(await FadeIn(plane))
await scene.wait(1000)

plane.point({ x: -1, y: 1, transition: Transitions.Create, color: Colors.Orange(), size: 10 })
```

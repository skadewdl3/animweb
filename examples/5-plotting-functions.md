# Final Code

```
var w = window.WebAnim
var plane = new w.NumberPlane({ showGridLines: true })

w.scene.add(await w.FadeIn(plane))
await w.scene.wait(1000)

plane.plot({ definition: 'y = sin(x)', color: w.Colors.Green(), thickness: 5, transition: w.Transitions.Create })
```

### Currently, only explicity functions are supported by AnimWeb. Support for Implicit and Parametric functions will come soon.

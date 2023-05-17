# Final Code

```
var plane = NumberPlane({ grid: true })

FadeIn(plane)
await wait(1000)

plane.plot({ definition: 'y = sin(x)', color: Colors.Green(), thickness: 5, transition: Transitions.Create })
```

### Currently, only explicity functions are supported by AnimWeb. Support for Implicit and Parametric functions will come soon.

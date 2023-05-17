# Final Code

```
var plane = NumberPlane({ grid: true })

FadeIn(plane)
await wait(1000)

Create(plane.plot({ definition: 'y = sin(x)', color: Colors.green, thickness: 5 }))
```

### Currently, only explicity functions are supported by AnimWeb. Support for Implicit and Parametric functions will come soon.

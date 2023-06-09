# Final Code

```
var plane = NumberPlane({ grid: true })

FadeIn(plane)
await wait(1000)

Create(plane.plot({ definition: 'y = sin(x)', color: Colors.green, thickness: 5 }))
```

# Limitations
- [ ] Currently, only explicit and implicit functions are supported by AnimWeb. Support for Parametric functions will come soon.

# How it works
AnimWeb uses Marching Squares over a QuadTree grid to draw implicit curves. The boring math details aside, what this means is that currently, implicit curves take a little more time to calculate than explicit curves. If you do not need to plot implicit curves, please use the ```NumberPlane.plot``` function instad of ```NumberPlane.plotImplicit```.

Other than this, implicit curves work the same way as explicit oens do. You can change the thickness, color, etc. all using the same options as explicit curves.

# Basic Code

```
var plane = Create(NumberPlane({ grid: true }))

await wait(1000)

var circle = Create(plane.plotImplicit({ definition: 'x^2 + y^2 = 25', color: Colors.green, thickness: 5 }))
```

# Incomplete features
Currently, following features are unsupported for implicit curves
- [ ] Tangents
- [ ] Anchor Points

These features will be implemented soon. If you are interested in working on them, you can alsways contribute by creating a PR.
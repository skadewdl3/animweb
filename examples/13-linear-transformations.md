# How it works
Linear transformations can be animated in AnimWeb using the Matrix auxiliary class. Basically, you have to create a matrix (either from rows, or from columns) which will then be used as a linear transformation.

### Creating a matrix
```
var matrix = Matrix.fromRows([0, 1], [-1, 0])

var matrxi = Matrix.fromColumns([0, 1], [-1, 0])
```

Once this is done, you can use the matrix as a linear transformation. Of course, you'll need something to apply the transformation to. Here, we apply it to a NumberPlane, but it works on vectors, points and lines too.

```
var plane = Create(NumberPlane({ grid: true }))
var lt = Matrix.fromColumns([0, 1], [-1, 0])
await wait(2000)
plane.transform(lt)
```

When you apply a transformation to a NumberPlane, it will automatically apply it to all points, vectors plotted on it.

# Limitations
- [ ] Linear transformations do not work with curves (implicit or explicit) as of now
- [ ] There may be animation synchornisatoion issues during transform various objects. We are working on a fix for it.
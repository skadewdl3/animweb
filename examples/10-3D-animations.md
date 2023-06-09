# How to switch to 3D
By default, AnimWeb will start up in 2D mode. To switch to 3D, you will need to click the blue button **Switch to 3D** at the top-right of the screen. This is done so that AnimWeb maintains it's speed. The 3D animations API is only loaded when you click switch to 3D.

Once you switch to 3D, the name of all AnimObjects remains mostly the same, except a few changes. These changes are listed below.

#Final Code
```
var plane = Create(NumberPlane())

plane.plot({ definition: 'x^2 + y^2 = 9', color: Colors.blue, filled: false })
```

The above code should show a cylinder in 3D mode. If you see smoething like an inverted parabola, you have not switched to 3D.
you can set ```filled: true``` if you want fill-in the shape and not showing just the wireframe. Note that this feature is under development, thus you will not see any sort of shading on the plot.

Similarly, you can also plot points using the ```NumberPlane.point``` function. Note that you will need to pass x, y and z coordinates. Refer to (plotting-points)[] for more details.

# Features under development
- [ ] Currently, 3D surfaces cannot be animated
- [ ] Linear transformations are not imlpemented in 3D
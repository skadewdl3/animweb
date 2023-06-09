# Complex Plane in 3D
The complex plane can also be displayed in 3D if we simply pass complex numbers as inputs to functions. For example, any polynomial will show roots in the real-complex plane if complex numbers are passed as values of *x*.

The definition for plotting a complex function is currently limited to: *z = f(x)*. Improvements to this will be made at a later date.

# Final Code
```
var plane = show(ComplexPlane())

plane.plot({ definition: 'x^4 = 1' })
```

You'll be able to the see surface intersecting the real axis at tow points and imaginary axis at two points, namely: 1, -1, i, -i.
Similarly, try putting ```definition: 'x^3 = 1'```. You'll see the three cube roots of unity.

Right now, complex numbers themselves cannot be plotted as points. We are working on adding this functionality.

# Features to be implemented 
- [ ] Better support for complex functions
- [ ] Plotting of compelx numbers
- [ ] Complex multiplication as rotation

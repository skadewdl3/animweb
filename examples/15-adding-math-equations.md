# Equations and Latex!

AnimWeb also supports adding and animating equations and basically all of LaTeX. ote that this is not normal TeX but LaTeX. For more information about the syntax (click here)[https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference].

Note that this feature does not support all latex features like using packages, images, etc. It only supports showing mathematical syntax like equations, matrices, fractions, etc.

```
var fraction = Create(Latex({ latex: '\frac{a}{b}', x: 100, y: 100, size: 30 }))
```

As you can see, Latex also supports FadeIn, FadeOut, Create and Morph transitions. We'll discuss morphing in the next example.
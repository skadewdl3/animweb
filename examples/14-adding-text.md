# Text animations!

AnimWeb also supports adding and animating text. The following code should create a piece of text at the coordinates (100, 100).
Note that these coordinates differ from the NumberPlane coordinates.

```
var text = show(Text({ text: 'hi mom', x: 100, y: 100, size: 30 }))
```

The Text AnimObject supports FadeIn, FadeOut, Create and Morph transitions. Here's an example of the Create transition. You can try FadeIn and FadeOut for yourself. We'll discuss Morph in a further example.

```
var text = show(Text({ text: 'hi mom', x: 100, y: 100, size: 30 }))
```

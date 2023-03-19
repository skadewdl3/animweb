# Final Code

```
var w = window.WebAnim

var line = new w.Line({ form: w.Lines.SlopePoint, slope: 1, point: {x: 0, y: 0}, color: w.Colors.Green(), thickness: 5 })

w.scene.add(await w.Create(line, { duration: 10 }))
```

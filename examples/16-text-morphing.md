# Morphing text and equations

Text and latex can be smoothly morphed into one-another (and possibly aother AnimObjects in the future) using SVG animations. Currently, only text-to-text morphing is supported but we are working on implementing more morphing types.

```
var text = Create(Text({ text: 'hi mom', x: 100, y: 100, size: 30 }))

var newText = Text({ text: 'hello world', x: 100, y: 400, size: 30 })

await wait(3000)

Morph(text, newText)
```

This should smoothy convert the text "hi mom" into "hello world".

# Limitations
- [ ] Position of text does not change during morphing
- [ ] Size of text does not change during morphing
- [ ] Latex-to-latex, text-to-latex, etc. momrphs not possible atm.
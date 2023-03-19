# AnimWeb - Create Beautiful Math Animations, Anywhere
AnimWeb is a mathematical animation library inspired by [3Blue1Brown's](https://www.youtube.com/@3blue1brown) [Manim Engine](https://github.com/3b1b/manim).

AnimWeb provides an elegant way to create mathematical animations through code. It is completely online - thus there is no hassle of installation (a caveat of Manim).
AnimWeb features an object-oriented API written in TypeScript using [p5.js](https://p5js.org/) and a code-editor that lets you create animations using JavaScript.

AnimWeb is aimed to help teachers, students and animators alike to create beautiful mathematical animations is as little time as possible


# How to access AnimWeb ?
AnimWeb lives completely online. You can simply visit https://animweb.vercel.app and there it is - your very own math animation tool!


# How to use AnimWeb ?
Using AnimWeb does not require any knowledge of animation or even programming. By learning some basic JavaScript syntax, you can be up and running in [less than 15 minutes](https://youtu.be/BKxLrQYQ_2I).
Even so, the following explanations contain some pointers about the syntax too.

The core of WebAnim are _AnimObjects_. These are simply entities that you can animate using WebAnim. For example, Point, Line, NumberPlane, etc. are AnimObjects.
Henceforth, they will be simply called objects for conciseness.

The root of your animation is always the _Scene_. The scene contains all your objects and the animations you apply to them. Whenever you create an AnimObject, you ___must___ add it to the scene. Otherwise, it will not display.
With that out of the way, let's get animating!

# Your First Animation!

1. To start, open up [AnimWeb](https://animweb.vercel.app). You will see a blank screen with a recorder to the left and a code editor to the right.

![image](https://user-images.githubusercontent.com/43989259/226196763-d5e7ac1f-d3c9-4131-b71a-acbe43d9e535.png)

2. To start, let us create a line. Type the following code (keep the first line as is) into the code editor:

`var line = new w.Line({ form: w.Lines.SlopePoint, slope: 1, point: {x: 0, y: 0} })`

Though you typed it, you might not see anything. To see the animations, you have to hit the __Play__ button (above the code editor).

Did you click the play button ? Still no dice right ? That's because we haven't added our line to the scene!

3. Add the line to the scene by typing the following: 

`w.scene.add(line)`

Now, click the play button - and Voila! We have a lin on the screen.

![image](https://user-images.githubusercontent.com/43989259/226197127-488646d3-9119-4d3e-9e0e-282c0c3d169b.png)

4. But our lines looks very boring right now, and it's not animated either. So let's snazz it up a bit. Modify the line code to the following:

`
var line = new w.Line({ form: w.Lines.SlopePoint, slope: 1, point: {x: 0, y: 0}, color: w.Colors.Green(), thickness: 5 })
`

5. Now to actually animate a line, we can use a __Transition__. AnimWeb uses Transitions to do all kinds of animations. Here, let's use the Create transition to animate our line.
Modify the scene.add line to the following:

`
w.scene.add(await w.Create(line, { duration: 10 }))
`

Hit play - and __BOOM__! You just created your own math animation in under 3 lines of code!

[animweb-animation (6).webm](https://user-images.githubusercontent.com/43989259/226199712-597eba76-c465-4c8f-a630-3d18fb43972c.webm)


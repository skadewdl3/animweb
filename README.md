# AnimWeb - Create Beautiful Math Animations, Anywhere

AnimWeb is a mathematical animation library inspired by <a href="https://www.youtube.com/@3blue1brown" target="_blank">3Blue1Brown's</a> <a href="https://github.com/3b1b/manim" target="_blank">Manim Engine</a>.

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

The root of your animation is always the _Scene_. The scene contains all your objects and the animations you apply to them. Whenever you create an AnimObject, you **_must_** add it to the scene. Otherwise, it will not display.
With that out of the way, let's get animating!

# Your First Animation!

1. To start, open up [AnimWeb](https://animweb.vercel.app). You will see a blank screen with a recorder to the left and a code editor to the right.

![image](https://user-images.githubusercontent.com/43989259/226196763-d5e7ac1f-d3c9-4131-b71a-acbe43d9e535.png)

2. To start, let us create a line. Type the following code (keep the first line as is) into the code editor:

`var line = Line({ form: Lines.SlopePoint, slope: 1, point: {x: 0, y: 0} })`

Though you typed it, you might not see anything. To see the animations, you have to hit the **Play** button (above the code editor).

Did you click the play button ? Still no dice right ? That's because we haven't added our line to the scene!

3. Add the line to the scene by typing the following:

`show(line)`

Now, click the play button - and Voila! We have a lin on the screen.

![image](https://user-images.githubusercontent.com/43989259/226197127-488646d3-9119-4d3e-9e0e-282c0c3d169b.png)

4. But our lines looks very boring right now, and it's not animated either. So let's snazz it up a bit. Modify the line code to the following:

`var line = Line({ form: Lines.SlopePoint, slope: 1, point: {x: 0, y: 0}, color: Colors.Green(), thickness: 5 })`

5. Now to actually animate a line, we can use a **Transition**. AnimWeb uses Transitions to do all kinds of animations. Here, let's use the Create transition to animate our line.
   Modify the scene.add line to the following:

`Create(line, { duration: 10 })`

Hit play - and **BOOM**! You just created your own math animation in under 3 lines of code!

[animweb-animation (6).webm](https://user-images.githubusercontent.com/43989259/226199712-597eba76-c465-4c8f-a630-3d18fb43972c.webm)

For more examples, you can refer to the examples folder (if it's not there, I'll add it soon 😅)

# Recording Animations

1. AnimWeb enables you to export your animation to a variety of formats (WEBM, GIF, PNG, JPG).

2. To record an animation, first code the animation in the code-editor. For this example, we'll simply use the preivious line animation.

3. Now, before hitting play, click the **Red Recorder Button** on the top-left of the screen. Now, AnimWeb will start capturing your animation. Go ahead and hit play, and let's AnimWeb work it's magic.

https://user-images.githubusercontent.com/43989259/226200032-08f8781c-3e7d-4dfb-838d-0a84ddebe8bc.mp4

4. You might notice that your animations are sluggish when recording. This is because AnimWeb doesn't record your screen, but the actual frames of animations. This leads to a much higher quality export. If you want to test your animations, you can always play them without recording.

5. Once the animation has completed, you must click the **Red Recording Button** in the top-left, again - to stop the recording. Once you do so, your exported animation wil automatically download.

[animweb-animation (6).webm](https://user-images.githubusercontent.com/43989259/226200074-3a8f0ec3-bae3-458e-b2d3-ace4d7ebf269.webm)

(Pro tip - Prefer exporting files in the WEBM format since it's much faster than other formats. Exporting in the GIF format take around 2-3 minutes after stopping recording to encode.)

# AnimWeb API

1. Scene

| Property/Method   | Type                       | Default Value                             | Description                                                                  |
| ----------------- | -------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------- |
| height            | number                     | 800                                       | The height of the scene. This also is the height of the exported animation.  |
| width             | number                     | 800                                       | The width of the scene. This also is the width of the exported animation.    |
| objects           | Array<AnimObject>          | []                                        | Contains all the AnimObjects added to the Scene.                             |
| transitionQueue   | Array<TransitionQueueItem> | []                                        | Holds all the Transitions that are playing right now.                        |
| resetScene        | Function                   | () => void                                | Rsets the scene (on click the play or clear buttons)                         |
| queueTransition   | Function                   | (transition: TransitionQueueItem) => void | Used to add a TransitionQueueItem to the transitionQueue                     |
| unqueueTransition | Function                   | (transition: TransitionQueueItem) => void | Used to remove a TransitionQueueItem from the transitionQueue                |
| add               | Function                   | (obj: AnimObject) => void                 | Used to add an AnimObject to the objects array                               |
| wait              | Function                   | (timeout?: number) => Promise<void>       | Used to wait till the transition queue bcomes empty (all transitions finish) |
| remove            | Function                   | (obj: AnimObject) => void                 | Used to remove an AnimObject from the objects array                          |
| draw              | Function                   | () => void                                | Used to draw all AnimObjects to the p5 canvas                                |

(Further docs coming soon)

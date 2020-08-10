---
layout: post
title: Writing the World's Most Advanced Turtle Graphics Library in Rust
author: Sunjay Varma
subreddit: /r/rust
categories:
  - Programming
  - Turtle
  - Rust
---

I created and maintain a library for the [Rust programming language][rust]
called [turtle]. The turtle library (or "crate" in Rust terminology) is an
implementation of [Turtle Graphics]. The idea is that you have a triangular
cursor in the center of your screen (the "turtle") which you can control using
simple commands like "go forward 100 steps" or "turn right 90 degrees". The
turtle draws a line as it walks, so you can use this to create animated
drawings. For example, here's a circle created by walking 1 step forward and
then turning 1 degree to the right 360 times.

![circle](/assets/images/worlds-most-advanced-turtle-graphics-library/circle.gif){: .figure-border .figure-small}

Perhaps surprisingly, this concept scales quite well. Here's a more
complicated example of drawing a snowman:

![snowman](/assets/images/worlds-most-advanced-turtle-graphics-library/snowman.gif){: .figure-border .figure-small}

The source code for this [snowman example] and for the previous [circle example]
can be found on GitHub.

## Table of Contents

* TODO

## A Tool for Learning Programming

The concept of [Turtle Graphics] comes from the [Logo programming language], an
educational language designed in 1967 to control an actual robot that could draw
simple pictures. These days, many programming languages offer some kind of
implementation of Turtle Graphics. For example, the [Python turtle module] is
very commonly used when demonstrating Python to first time users or young
children. It's often way more engaging to see the computer draw a picture than
to just learn how to print and manipulate text.

In Python, you can draw a circle like the one above using the following program:

```py
from turtle import fd, rt

for i in range(360):
    fd(1)
    rt(1)
```

In Rust, the equivalent program looks like this:

```rust
use turtle::Turtle;

fn main() {
    let mut turtle = Turtle::new();

    for _ in 0..360 {
        turtle.forward(3.0);
        turtle.right(1.0);
    }
}
```

As you can see, other than a few extra lines and some slightly more descriptive
names, the Rust program is almost exactly the same as the Python program.

This is on purpose. Many decisions about the API of the turtle crate were made
to ensure that it is an excellent tool for teaching Rust. For example, to make
sure it is easy to learn, the API is largely the same as the Python turtle
module. The names follow Rust naming conventions, but are still just as easy to
use thanks to Rust's very flexible type system. The [`set_pen_color` method] in
the code below takes a string as a color name (similar to the Python turtle
module), but also allows you to create a `Color` type and pass that in.

```rust
use turtle::{Turtle, Color};

fn main() {
    let mut turtle = Turtle::new();

    // These lines are all equivalent
    turtle.set_pen_color("red");
    turtle.set_pen_color([255.0, 0.0, 0.0]);
    turtle.set_pen_color(Color {
        red: 255.0,
        blue: 0.0,
        green: 0.0,
        alpha: 1.0,
    });
}
```

Occassionally, the turtle crate even deviates from the Python turtle module to
keep things idiomatic Rust. For example, instead of using global mutable state
to allow for free functions like Python's `fd` and `rt`, you need to create a
variable to hold the `Turtle` type and pass that through your program. All of
this is based on the philosophy that the turtle crate wouldn't be as useful of
an educational tool if it taught people bad habits or false assumptions that
don't reflect real Rust code. This is a difficult line to walk, so we do
compromise here and there, but overall I think we have done a good job of
balancing these concerns.

The turtle crate is designed to provide a ramp up to Rust's more advanced
features. You can start with the most basic: declaring variables, calling
methods, using loops, etc. and draw a large variety of pictures using just those
ideas. Then, when you're ready, you can get into functions and more advanced
topics from there. Most of the API doesn't use things like `Option` and `Result`
so you can put off teaching those until after people have gotten more
comfortable with types. After that, you can start to use the more advanced
features of the crate like the events API to teach things like pattern matching
and exhaustiveness. I could go on from there, but the main point is that turtle
is intentionally designed to allow people to mostly use their intuition to get
things to work. They can then learn more advanced ideas as they get comfortable
programming.

## Three Years of Development

The turtle crate has been in development for just over 3 years. The first commit
was on Aug 5, 2017.

![turtle commit frequency](/assets/images/worlds-most-advanced-turtle-graphics-library/commit-freq.png)

The basic functionality that you saw above was completed very early in the
development of the library. You can already use the crate right now to draw all
kinds of different pictures. Given that that's the case, you might be wondering
what I'm still working on 3 years later.

## Multiple Async Turtles

It turns out that this idea of "a turtle that draws pictures" has a ton of
potential. For example, what if you had more than one turtle? Could you control
them in separate threads? Remember that turtle is meant to be an educational
tool. If you had this functionality, you could potentially use this as a really
engaging way to teach people about topics like concurrency, parallelism, mutual
exclusion, and synchronization.

If there was a version of the `Turtle` type that could be used in [asynchronous
code][async-book], you could use the turtle crate to teach people about `async`
and `await` syntax. This would provide a pathway to learn about async code
without having to necessarily also understand more complicated topics like
building web servers or writing networking code. (Note: It's not that teaching
async with those other concepts is *bad*, it's that it's *useful* to provide
multiple pathways into a topic, including some that don't require you to know
much in advance. The turtle crate is one potentially engaging pathway into a
topic, not the silver bullet for teaching all things.)

In May 2020, I finally got some time to start bringing these ideas to life. I
completely [rewrote the internals][turtle-rewrite-pr] of the turtle crate to use
the architecture that will one day allow us to have things like "multiple
concurrent async turtles".

The work is very fun and interesting (hence this blog post), but I do sometimes
poke fun at the fact that I spend so much time on a Turtle Graphics library that
almost no one uses yet:

<blockquote class="twitter-tweet tw-align-center"><p lang="en" dir="ltr">me: writes the world&#39;s most advanced turtle graphics library<br><br>world: why...?<br><br>me: idk thought it&#39;d be cool<br><br>world: idc tho<br><br>me: 😬 <a href="https://t.co/Rizr0cBuWI">https://t.co/Rizr0cBuWI</a></p>&mdash; Sunjay (@Sunjay03) <a href="https://twitter.com/Sunjay03/status/1258830909488402432?ref_src=twsrc%5Etfw">May 8, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Hopefully everything I've said above is more than enough explanation about why
this work is important and why I'm still excited about it 3 years later. The
rest of this blog post is about the new architecture and how it makes it
possible to have features like multiple turtles and async support.

## The New New Architecture

If you saw my [RustConf 2018 talk] on the turtle crate, you'll know that in
December of 2017, I [rewrote the turtle crate][turtle-rewrite-2017] to use a new two-process
architecture. The inital version of the crate had been written on Linux using a
two-thread model: one thread for managing the window and one thread for
communicating with it using commands like `forward`, `right`, etc.
Unfortunately, the windowing APIs on MacOS are not thread-safe. You need to use
them on the main thread (the thread where `main` is run) or your program will
not work.

[![turtle commit frequency](/assets/images/worlds-most-advanced-turtle-graphics-library/macos-github-issue.png){: .figure-small}](https://github.com/sunjay/turtle/issues/27){: target="_blank"}

Not wanting to compromise on the simple API I was aiming to produce, I quickly
rewrote the crate to spawn its own process (thus providing two main threads).
This solved the problem, and was the right solution at the time, but because I
was in a hurry, I cut a lot of corners that would need to be resolved later:

* For IPC (Inter-Process Communication), sent JSON between the two processes
  over stdin and stdout (slow, lots of parsing overhead, but easy to test and
  debug)
* To animate the lines as they were being drawn, one of the processes
  continuously re-sent the updated line over and over again 60 times per second
  (wasteful, requires constant communication between the processes, but very
  easy to implement)
* Always sent and recieved entire state (e.g. updating the turtle's pen required
  requesting the entire turtle state, updating the pen property, and then sending
  the entire state back)
* Full image was always redrawn, even if nothing had changed (resulted in [100%
  CPU usage][cpu-usage] even when nothing was happening)
* No concept of more than one turtle (all code assumed that there was only a
  single turtle in existence)

The [new new architecture][turtle-rewrite-pr] addresses all of these issues and
more. It is designed to be as efficient as possible by reducing time spent in
bottlenecks like IPC and rendering.

TODO: "Overview" from #173 + whatever details are necessary to show that all of
the above was addressed

## Asynchronous Turtles

TODO

## Multiple Turtles

TODO

[rust]: https://www.rust-lang.org/
[turtle]: https://turtle.rs
[Turtle Graphics]: https://en.wikipedia.org/wiki/Turtle_graphics
[snowman example]: https://github.com/sunjay/turtle/blob/96d4b8ef49b5f2cd143674e1aac12ffb1a876ef4/examples/snowman.rs
[circle example]: https://github.com/sunjay/turtle/blob/96d4b8ef49b5f2cd143674e1aac12ffb1a876ef4/examples/circle.rs
[Logo programming language]: https://en.wikipedia.org/wiki/Logo_(programming_language)
[Python turtle module]: https://docs.python.org/3/library/turtle.html
[`set_pen_color` method]: https://docs.rs/turtle/1.0.0-rc.3/turtle/struct.Turtle.html#method.set_pen_color
[async-book]: https://rust-lang.github.io/async-book/01_getting_started/02_why_async.html
[turtle-rewrite-pr]: https://github.com/sunjay/turtle/pull/173
[RustConf 2018 talk]: https://youtu.be/Sak6-O1cvgU
[turtle-rewrite-2017]: https://github.com/sunjay/turtle/pull/31
[cpu-usage]: https://github.com/sunjay/turtle/issues/99

# Outline

* Goal: give an overview of how the new architecture in #173 allows for async
  turtles and multiple concurrent turtles
* Turtle is a library for the Rust programming language that implements "turtle
  graphics"
  * https://en.wikipedia.org/wiki/Turtle_graphics
* Many programming languages, especially beginner friendly languages, have
  implementations of turtle graphics
  * https://docs.python.org/3.3/library/turtle.html?highlight=turtle
* The turtle crate ("crates" are what you call "libraries" in Rust) is Rust's
  implementation of turtle graphics
* Rust is a pretty unique language with a lot of interesting features
* That means that the turtle graphics library for the language has the
  opportunity to take advantage of all of that
* Summarize what most turtle graphics libraries provide
* Summarize what I'm in the process of releasing in the turtle crate
  * multiple turtles
  * async turtles
  * multiple async turtles :star_struck:
* Reference RustConf 2018 talk
* New architecture overview ("Overview" section in #173)
* Going to talk about each of the key features in detail
  * Async turtles
  * Multiple turtles
* Async turtles
  * Want an `AsyncTurtle` struct with the same interface as `Turtle` but with
    any methods that would usually block marked `async`
  * `Turtle` becomes a blocking facade over `AsyncTurtle`
* Multiple turtles
  * Talk about sequential consistency
  * Goal was correctnesss -- trying to find the most straightforward impl using
    the primitives available, not invent a new data structure
  * Go over `AccessControl`
  * Mention that other solutions that are potentially simpler are welcome!
* (optional) Justify breaking changes
  * `drawing_mut` violates Rust's borrowing rules if you enable multiple turtles
  * Violates the philosophy mentioned earlier about avoiding teaching bad habits
    or false assumptions
* (optional) Talk about how we got to 0% CPU usage
* (optional) Talk about how we got instant speed to be fast (compile in release mode lol)
* Acknowledgements
  * Tokio team and Alice particularly
  * Eliza, Manish, Alex (and anyone else who helped me design `AccessControl`)
* Future work
  * Necessary steps before this work can be released
  * Fix platform issues
  * Document `AsyncTurtle` and `AsyncDrawing`
  * Have more people try out the APIs to see what they can do
  * Road to v1.0
* Wrap up
  * Use the crate and send tweets to @RustTurtle with what you create
  * Read the guide
  * Come join Zulip

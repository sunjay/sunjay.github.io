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

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">me: writes the world&#39;s most advanced turtle graphics library<br><br>world: why...?<br><br>me: idk thought it&#39;d be cool<br><br>world: idc tho<br><br>me: 😬 <a href="https://t.co/Rizr0cBuWI">https://t.co/Rizr0cBuWI</a></p>&mdash; Sunjay (@Sunjay03) <a href="https://twitter.com/Sunjay03/status/1258830909488402432?ref_src=twsrc%5Etfw">May 8, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

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
* Justify breaking changes
  * `drawing_mut` violates Rust's borrowing rules if you enable multiple turtles
* Acknowledgements
  * Tokio team and Alice particularly
  * Eliza, Manish, Alex (and anyone else who helped me design `AccessControl`)
* Future work
  * Necessary steps before this work can be released
  * Fix platform issues
  * Document `AsyncTurtle` and `AsyncDrawing`
  * Have more people try out the APIs to see what they can do
  * Road to v1.0

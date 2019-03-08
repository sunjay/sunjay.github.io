---
layout: post
title: Modelling Mazes as a Tree of Paths
author: Sunjay Varma
categories:
  - Programming
---

This is a follow-up to my previous post about
[Visualizing Maze Generation][prevpost]. In that post I went over the
two approaches I attempted while trying to generate mazes with
reasonably strong and satisfying solutions.

This post will be a more in depth look at the algorithm of the second
approach. You'll see some of the thought that went behind it as well as
some pseudo code to help you understand the implementation.

As before, a live demonstration as well as the source code is available.

**Final Result:** [Maze Generator][livesite]<br />
**Source Code:** [GitHub][sourcecode]

As noted in the [previous post][prevpost], the second approach improves on
the first by using a more sophisticated knowledge representation to model
the maze:

> The maze is modelled as a graph of paths connecting
> points that happen to lie on a 2D grid.
>
> Each node maps to a point on the grid.
>
> Each connection (or edge) represents an open path that can be traversed.
> Nodes can only connect with other nodes that are adjacent to them on the
> grid.
>
> Any adjacent nodes without an edge between them are shown on the grid
> with a wall.
>
> ![Second Approach to Maze Generation](/assets/posts/maze-generator-second-approach.jpg){: .center}
> Second Approach: Tree of Paths
> {: .text-center}
>
> This is a much more sophisticated knowledge representation because it models
> the connections and paths rather than relying on the opaque points on the 2D grid.

This representation is fine to think about, but how do you actually generate
the tree? How do you fill it with randomly generated paths? This is not just any simple binary tree or ...

- finish off that last sentence
- go into throught process of generating tree branches
- go over pseudo code
- etc.


[prevpost]: /2016/06/30/visualizing-maze-generation
[livesite]: http://sunjay.dev/maze-generator
[sourcecode]: https://github.com/sunjay/maze-generator
[issues]: https://github.com/sunjay/maze-generator/issues

---
layout: post
title: Visualizing Maze Generation
author: sunjay
categories:
  - Programming
---

In this post I will describe a method of generating mazes by modelling the
maze as a tree of paths through a grid space.

Maze generation is more interesting than simple path finding because you are
not operating inside of an existing space. You get to create the world in
which another algorithm can do its path finding.

These mazes are randomly generated. The algorithm is implemented so that you can see each iteration of the maze being developed.

**Final Result:** [Maze Generator](livesite)<br />
**Source Code:** [GitHub](sourcecode)

## The First Approach

<div style='position:relative;padding-bottom:calc(100% / 1.46);margin-bottom:10px'><iframe src='https://gfycat.com/ifr/DeliciousOffensiveIndianabat' frameborder='0' scrolling='no' width='100%' height='100%' style='position:absolute;top:0;left:0;' allowfullscreen></iframe></div>

In this first approach, the algorithm works in two stages:

1. Generate the complete solution from start to finish
2. Create decoy paths and fill out the rest of the available space

The first stage continues to go through the 2D grid from the starting
point until it reaches a sufficient finish. Once that finish point is found,
the algorithm then continues to fill in the rest of the maze with decoy
paths meant to mislead the solver.

![First Approach to Maze Generation](/assets/posts/maze-generator-first-approach.jpg){: .center}
First Approach: 2D Grid
{: .text-center}

The GIF above shows this algorithm in action. The first thing it does is go
from the starting point to a finish at another edge. Unfortunately in this
instance this ends up being a fairly short and unsatisfying path. The
algorithm spends most of its remaining time filling in the rest of the maze.

In practice, there are many issues with an approach like this.

For the maze to be difficult, there must be a strong (fairly complicated) solution.
By trying to go after the solution first, most of the algorithm's time is
spent doing expensive calculations to avoid accidentally creating something
that is not satisfying to solve. This is very error prone.

Problems that occur while trying to generate a strong solution:

* The path can run into a dead-end (runs out of unvisited adjacents)
* The solution path can be too short
* The finish can be too close to the starting point
* etc.

Working around all of these often requires backtracking and then generating
other paths to go around whatever issue happens to come up. This is
expensive and by generating additional paths, we often end up creating much
of the rest of the maze before we even find a good solution. These
complications force us to deviate from our original intention of generating
the full solution path before generating the rest of the maze.

Using a 2D grid to model the maze makes doing things like backtracking,
finding the length of your current path, etc. very expensive or overly complicated.

## The Second Approach

<div style='position:relative;padding-bottom:calc(100% / 1.46);margin-bottom:10px'><iframe src='https://gfycat.com/ifr/IllustriousImaginativeAltiplanochinchillamouse' frameborder='0' scrolling='no' width='100%' height='100%' style='position:absolute;top:0;left:0;' allowfullscreen></iframe></div>

The main insight leading into the second approach is a complete change in
how the maze is represented.

In this approach, the maze is modelled as a graph of paths connecting
points that happen to lie on a 2D grid.

Each node maps to a point on the grid.

Each connection (or edge) represents an open path that can be traversed.
Nodes can only connect with other nodes that are adjacent to them on the
grid.

Any adjacent nodes without an edge between them are shown on the grid
with a wall.

![Second Approach to Maze Generation](/assets/posts/maze-generator-second-approach.jpg){: .center}
Second Approach: Tree of Paths
{: .text-center}

This is a much more sophisticated knowledge representation because it models
the connections and paths rather than relying on the opaque points on the 2D grid.

If we restrict our graph to having no cycles, this representation becomes
quite convenient. A graph without any cycles is equivalent to a tree
structure. In mazes, cycles are not the most useful property because they
have the potential to introduce unwanted shortcuts or other complications.
Having this restriction allows us to make useful assumptions about the
structure of the maze.

As shown in the GIF above, the end in this approach is not selected until
the entire maze tree is generated. Every point on the grid is associated
with a node in the tree.

Selecting the solution can now be done more robustly because all the information about the entire maze is available for use.

This second approach also has an added benefit for the person watching
because the solution is not revealed to them at the beginning.

By modelling a maze as a tree of paths with each node mapping to a point on
a 2D grid, we can generate good mazes and pick strong solutions that make
solving the maze both interesting and satisfying.

Make sure you check out the [live visualization][livesite]. Pull requests
are welcome, so feel free to [fork me on GitHub][sourcecode]. If you find
any bugs or have a great idea for an additional feature, please let me know
by opening an [issue][issues].

[livesite]: http://sunjay.ca/maze-generator
[sourcecode]: https://github.com/sunjay/maze-generator
[issues]: https://github.com/sunjay/maze-generator/issues


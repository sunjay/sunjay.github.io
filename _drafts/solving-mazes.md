---
layout: post
title: Solving Mazes
author: Sunjay Varma
categories:
  - Programming
---

## Outline

- Talk about how algorithms like depth first and breadth first search can only get you to the end but cannot show you the shortest (or "correct") path to reach there
- Backtracking search on the other hand does provide a mechanism for finding the correct path because you know that anywhere you backtracked cannot possibly be the final solution.
- This only works because of the properties of the maze like no loops, tree structure, etc. Loops would introduce problems because they could potentially introduce shortcuts that backtracking would not find.
- In that same way, A* can provide correct solutions as well with the added caveat that you would need to add a step to go back over the correct solution paths (since we don't do any explicit backtracking)
- Implement Heuristic / Top-View search

## Another post after this one:
Title: Fun maze solving visualizations

- These aren't particularly useful or fast maze solving algorithms, but they are fun to visualize and watch
- Villager search
- Line of sight search
- 3D backtracking search (optional, just for fun and extra)


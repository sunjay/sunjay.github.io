---
layout: post
title: Binary Search Trees In Rust
author: Sunjay Varma
subreddit: /r/rust
categories:
  - Programming
  - Data Structures
  - Rust
---

# Outline

Audience: moderately experienced to advanced Rust programmers

Key Takeaways:

- You can write binary trees in Rust very similarly to how you'd write them in C++, using safe
  owned-pointer abstractions like `Box` instead of raw pointers
- You can amortize allocations and get better cache locality by arena allocating your nodes
- This is best when you can cope with slow removals
- `BTreeMap` and `HashMap` are still way faster maps, but a `BSTMap` is good for when you actually
  need a binary tree for some reason

Outline:

- A common way to write binary trees in Rust:
  ```rust
  /// A binary tree node, with a value, and optional left and right subtrees
  struct Node<T> {
      value: T,
      left: Option<Box<Node<T>>>,
      right: Option<Box<Node<T>>>,
  }
  ```
- Note: We use `Option<Box<Node<T>>>` instead of `Box<Option<Node<T>>>` because it is wasteful to
  allocate `Box::new(None)` for empty nodes
----------------------------------------------------------------------
- Aside: Contrast with the typical binary tree in Haskell
    http://learnyouahaskell.com/making-our-own-types-and-typeclasses
  ```haskell
  data Tree a = EmptyTree | Node a (Tree a) (Tree a) deriving (Show, Read, Eq)
  ```
  - Equivalent of this code in Rust:
    ```rust
    enum Tree<T> {
        Empty,
        Node {
            value: T,
            left: Box<Tree<T>>,
            right: Box<Tree<T>>,
        },
    }
    ```
  - The unfortunate thing about this version is that you need `Box::new(Tree::Empty)` to represent
    an empty left or right subtree. This is an avoidable allocation.
----------------------------------------------------------------------
- This design for a binary tree works, but having the nodes spread all over the heap with `Box`
  isn't great for cache locality
- It's also pretty slow to go to the allocator for every node, so creating a large tree quickly will
  be very difficult
- Using arena allocation largely solves these issues
- Simplified explanation of arena allocation
  - Link to: https://en.wikipedia.org/wiki/Region-based_memory_management
  - https://stackoverflow.com/questions/12825148/what-is-the-meaning-of-the-term-arena-in-relation-to-memory
- Here's how that would look in Rust
- Instead of representing the tree by its root node, you wrap the tree in another struct
  ```rust
  struct Tree<T> {
      // All of the allocated nodes, in one contiguous block of memory
      //TODO: Define `Arena` type
      nodes: Arena<Node<T>>,
      // The root node of the tree (or `None` if the tree is empty)
      root: Option</* TODO: pointer into the arena */>,
  }
  ```
- For our arena allocator, we'll use the Rust `Vec` type
- We could hold raw pointers to elements inside that `Vec`

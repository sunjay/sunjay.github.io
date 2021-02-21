---
layout: post
title: Mutable Iterators in Rust
author: Sunjay Varma
subreddit: /r/rust
categories:
  - Programming
  - Rust
---

[Rust] makes it pretty easy to write [iterators] over something like `&[T]` (a [slice] of some
number of values with type `T`). [References] are [`Copy`] because you're [allowed to have several
references that point to the same values][ref-rules]. That means that to implement an iterator over
a slice, you can just take a reference to the next value in your iterator, and a reference to the
rest of the state at the *same time*.

Here's an example that implements an iterator that goes through each item of a `&[T]` value:
([Rust Playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=1c04d41f034eeb4e3bd8bbe5513fa2ec))

```rust
struct Foo<'a, T> {
    items: &'a [T],
}

impl<'a, T> Iterator for Foo<'a, T> {
    type Item = &'a T;

    fn next(&mut self) -> Option<Self::Item> {
        // Get the first item or return `None` via the ? operator
        let next_item = self.items.get(0)?;
        // Update our state to have the rest of the items after
        // the one we are returning
        self.items = &self.items[1..];

        Some(next_item)
    }
}
```

The exact same code, converted to use mutable references does not work:
([Rust Playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=6221885c81ffc77055ac991a7573e730))

```rust
struct Foo<'a, T> {
    items: &'a mut [T],
}

impl<'a, T> Iterator for Foo<'a, T> {
    type Item = &'a mut T;

    fn next(&mut self) -> Option<Self::Item> {
        // Get the first item or return `None` via the ? operator
        let next_item = self.items.get_mut(0)?;
        // Update our state to have the rest of the items after
        // the one we are returning
        self.items = &mut self.items[1..];

        Some(next_item)
    }
}
```

Here are the errors we get:

```
error[E0495]: cannot infer an appropriate lifetime for autoref due to conflicting requirements
  --> src/lib.rs:9:36
   |
9  |         let next_item = self.items.get_mut(0)?;
   |                                    ^^^^^^^
   |
note: first, the lifetime cannot outlive the anonymous lifetime #1 defined on the method body at 8:5...
  --> src/lib.rs:8:5
   |
8  |     fn next(&mut self) -> Option<Self::Item> {
   |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
note: ...so that reference does not outlive borrowed content
  --> src/lib.rs:9:25
   |
9  |         let next_item = self.items.get_mut(0)?;
   |                         ^^^^^^^^^^
note: but, the lifetime must be valid for the lifetime `'a` as defined on the impl at 5:6...
  --> src/lib.rs:5:6
   |
5  | impl<'a, T> Iterator for Foo<'a, T> {
   |      ^^
note: ...so that the types are compatible
  --> src/lib.rs:8:46
   |
8  |       fn next(&mut self) -> Option<Self::Item> {
   |  ______________________________________________^
9  | |         let next_item = self.items.get_mut(0)?;
10 | |         self.items = &mut self.items[1..];
11 | |         Some(next_item)
12 | |     }
   | |_____^
   = note: expected `Iterator`
              found `Iterator`

error[E0495]: cannot infer an appropriate lifetime for lifetime parameter in function call due to conflicting requirements
  --> src/lib.rs:10:27
   |
10 |         self.items = &mut self.items[1..];
   |                           ^^^^^^^^^^^^^^^
   |
note: first, the lifetime cannot outlive the anonymous lifetime #1 defined on the method body at 8:5...
  --> src/lib.rs:8:5
   |
8  |     fn next(&mut self) -> Option<Self::Item> {
   |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
note: ...so that reference does not outlive borrowed content
  --> src/lib.rs:10:27
   |
10 |         self.items = &mut self.items[1..];
   |                           ^^^^^^^^^^
note: but, the lifetime must be valid for the lifetime `'a` as defined on the impl at 5:6...
  --> src/lib.rs:5:6
   |
5  | impl<'a, T> Iterator for Foo<'a, T> {
   |      ^^
note: ...so that reference does not outlive borrowed content
  --> src/lib.rs:10:22
   |
10 |         self.items = &mut self.items[1..];
   |                      ^^^^^^^^^^^^^^^^^^^^
```

For some reason, even the value we get from `self.items.get_mut` doesn't appear to have the `'a`
lifetime we might expect to get. After all, this code does work for `&[T]`.

To understand what the difference is and why it might not work, let's break down the code a little
more to see what steps rustc is doing implicitly for us. We'll start with the iterator over `&[T]`.
([Rust Playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=11c63135d552069e86f09bc8d38de5d4))

```rust
use std::ops::Index;

struct Foo<'a, T> {
    items: &'a [T],
}

impl<'a, T> Iterator for Foo<'a, T> {
    type Item = &'a T;

    fn next<'b>(&'b mut self) -> Option<Self::Item> {
        // let next_item = self.items.get(0)?;
        let items: &'a [T] = self.items;
        let next_item = <[T]>::get(items, 0)?;

        // self.items = &self.items[1..];
        let items: &'a [T] = self.items;
        self.items = <[T] as Index<_>>::index(items, 1..);

        Some(next_item)
    }
}
```

This version of our first example is much more verbose, but also closer to how you can expect rustc
to interpret this code.[^1] Many of the types and lifetimes are now explicit with type annotations
on the variables and the lifetime on `self` as `'b`. We've used [fully-qualified syntax] for all the
method calls to make any [auto-referencing and auto-dereferencing][autoref] explicit.

The `let next_item = self.items.get(0)?` line turns into:

```rust
let items: &'a [T] = self.items;
let next_item = <[T]>::get(items, 0)?;
```

We *copy* `self.items` into a variable, then call get on a reference with lifetime `'a`. This is
fine because as established above, references can be copied and we're allowed to have several that
point to the same data at the same time. The `next_item` borrows an item from `self.items`.

The `self.items = &self.items[1..]`  line turns into:

```rust
let items: &'a [T] = self.items;
self.items = <[T] as Index<_>>::index(items, 1..);
```

Notice how we are borrowing the *same* slice from `self.items` as we did above. Again, this is fine
because references are `Copy` and they can point to the same data multiple times at the same time.
Even though the `next_item` variable borrows from the same slice, we are allowed to borrow it again
here and still have our code work. We pass that reference to a method of the `Index` trait which
returns the remainder of our slice.

Now, to see why the mutable version of this code doesn't work, let's update this expanded version to
use `&mut [T]`.
([Rust Playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=0210a9a01002eed19f3145a76688d87d))

```rust
use std::ops::IndexMut;

struct Foo<'a, T> {
    items: &'a mut [T],
}

impl<'a, T> Iterator for Foo<'a, T> {
    type Item = &'a mut T;

    fn next<'b>(&'b mut self) -> Option<Self::Item> {
        // let next_item = self.items.get_mut(0)?;
        let items: &'a mut [T] = self.items;
        let next_item = <[T]>::get_mut(items, 0)?;

        // self.items = &mut self.items[1..];
        let items: &'a mut [T] = self.items;
        self.items = <[T] as IndexMut<_>>::index_mut(items, 1..);

        Some(next_item)
    }
}
```

> Note: This is *not* the expanded version of the original iterator we wrote for `&mut [T]`. We'll
> get to that later. This is just to illustrate why Rust can't generate this exact same code for
> that version of the iterator.

This code, updated to use mutable references and mutable methods everywhere, does not compile.
Here's the compiler error:

```
error[E0312]: lifetime of reference outlives lifetime of borrowed content...
  --> src/main.rs:12:34
   |
12 |         let items: &'a mut [T] = self.items;
   |                                  ^^^^^^^^^^
   |
note: ...the reference is valid for the lifetime `'a` as defined on the impl at 7:6...
  --> src/main.rs:7:6
   |
7  | impl<'a, T> Iterator for Foo<'a, T> {
   |      ^^
note: ...but the borrowed content is only valid for the lifetime `'b` as defined on the method body at 10:13
  --> src/main.rs:10:13
   |
10 |     fn next<'b>(&'b mut self) -> Option<Self::Item> {
   |             ^^
```

This explains the problem quite clearly. Unlike references, mutable references are *not* `Copy`, so
we can't move/copy the reference out of `self.items`. We have to borrow. Here, since we're taking
the field out of `self.items`, we are borrowing from `self` which has lifetime `'b`. Thus, instead
of the code above, a more accurate expansion would be:

```rust
let items: &'b mut [T] = &mut self.items;
```

Since `'b` is different from `'a`, we can't return it from a function that needs to return
`Option<&'a mut T>`.

With that change, we can get to a reasonably accurate expansion of the iterator we wrote for `&mut [T]`.
([Rust Playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=6d0930fdaddf04e9f74098c42ead4c47))

```rust
use std::ops::IndexMut;

struct Foo<'a, T> {
    items: &'a mut [T],
}

impl<'a, T> Iterator for Foo<'a, T> {
    type Item = &'a mut T;

    fn next<'b>(&'b mut self) -> Option<Self::Item> {
        // let next_item = self.items.get_mut(0)?;
        let items: &'b mut [T] = &mut self.items;
        let next_item = <[T]>::get_mut(items, 0)?;

        // self.items = &mut self.items[1..];
        let items: &'b mut [T] = &mut self.items;
        self.items = <[T] as IndexMut<_>>::index_mut(items, 1..);

        Some(next_item)
    }
}
```

The error message we get when we compile this is nearly identical to the one we previously got for
the original `&mut [T]` iterator. The lifetimes and method calls we made explicit allow rustc to use
those names to make the error clearer than it was before:

```
error[E0495]: cannot infer an appropriate lifetime for lifetime parameter in function call due to conflicting requirements
  --> src/main.rs:13:25
   |
13 |         let next_item = <[T]>::get_mut(items, 0)?;
   |                         ^^^^^^^^^^^^^^^^^^^^^^^^
   |
note: first, the lifetime cannot outlive the lifetime `'b` as defined on the method body at 10:13...
  --> src/main.rs:10:13
   |
10 |     fn next<'b>(&'b mut self) -> Option<Self::Item> {
   |             ^^
note: ...so that reference does not outlive borrowed content
  --> src/main.rs:13:40
   |
13 |         let next_item = <[T]>::get_mut(items, 0)?;
   |                                        ^^^^^
note: but, the lifetime must be valid for the lifetime `'a` as defined on the impl at 7:6...
  --> src/main.rs:7:6
   |
7  | impl<'a, T> Iterator for Foo<'a, T> {
   |      ^^
note: ...so that the types are compatible
  --> src/main.rs:10:53
   |
10 |       fn next<'b>(&'b mut self) -> Option<Self::Item> {
   |  _____________________________________________________^
11 | |         // let next_item = self.items.get_mut(0)?;
12 | |         let items: &'b mut [T] = &mut self.items;
13 | |         let next_item = <[T]>::get_mut(items, 0)?;
...  |
19 | |         Some(next_item)
20 | |     }
   | |_____^
   = note: expected `Iterator`
              found `Iterator`
```

Even though we expected to borrow from `&'a mut [T]`, we end up borrowing from `&'b mut self` which
doesn't necessarily outlive `'a`. This is unfortunate, especially because we *know* that the items
inside `self.items` will definitely have lifetime `'a`.

**Don't lose hope!** There is a relatively simple trick that will allow us to fix this:
[`mem::take`]. The `mem::take` function takes a value out of a mutable reference by replacing it
with its default value. This is *not* an `unsafe` function because the value you take is replaced
with initialized memory. (Uninitialized memory is not allowed in Rust except in a few very specific
places like [`MaybeUninit`].)

For example:
([Rust Playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=d95ae089db2ab491f7ad684633d45f1f))

```rust
use std::mem;

let mut value = 123;
let taken = mem::take(&mut value);
println!("{}", taken); // Prints "123"
println!("{}", value); // Prints "0" (the default value for `i32`)
```

Using `mem::take` allows us to get around borrowing from `self`. Importantly, it doesn't allow us to
get around Rust's lifetime rules (that would be bad!). This is just a trick for borrowing from a
field without needing to borrow *through* `self`.

Okay, so borrowing with the syntax `&mut self.items` borrows through `self`. What if we could remove
`self` from that expression and just get `&mut items` directly? Here's what you need to do:

```rust
// let next_item = self.items.get_mut(0)?;
let items: &'a mut [T] = mem::take(&mut self.items);
let next_item: &'a mut T = <[T]>::get_mut(items, 0)?;
```

Notice how it's now fine to annotate `items` with `&'a mut [T]`. This code works because `&mut [T]`
has [a `Default` implementation][mut-slice-default] that uses the empty slice `&mut []` as a default
value. Since `items` is just a local variable, and doesn't refer to `self` at all, we can now borrow
from it with the lifetime we wanted. I've annotated `next_item` with `&'a mut T` to make that
explicit.

Let's see if this fixes the error we were seeing above:
([Rust Playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=af5a55e91646d0b93b407494131ca3c5))

```rust
use std::mem;
use std::ops::IndexMut;

struct Foo<'a, T> {
    items: &'a mut [T],
}

impl<'a, T> Iterator for Foo<'a, T> {
    type Item = &'a mut T;

    fn next<'b>(&'b mut self) -> Option<Self::Item> {
        // let next_item = self.items.get_mut(0)?;
        let items: &'a mut [T] = mem::take(&mut self.items);
        let next_item: &'a mut T = <[T]>::get_mut(items, 0)?;

        // self.items = &mut self.items[1..];
        // No need to `mem::take` from `self.items` again since we currently
        // just have a default value there
        self.items = <[T] as IndexMut<_>>::index_mut(items, 1..);

        Some(next_item)
    }
}
```

We take the items out of `self.items`, get the first item, and then reassign `self.items` to the
rest of the items after that.

If we compile this code, we no longer get the same error we were getting before! The lifetimes are
now correct! The new error we get is much easier to fix:

```
error[E0499]: cannot borrow `*items` as mutable more than once at a time
  --> src/main.rs:19:54
   |
8  | impl<'a, T> Iterator for Foo<'a, T> {
   |      -- lifetime `'a` defined here
...
14 |         let next_item: &'a mut T = <[T]>::get_mut(items, 0)?;
   |                        ---------                  ----- first mutable borrow occurs here
   |                        |
   |                        type annotation requires that `*items` is borrowed for `'a`
...
19 |         self.items = <[T] as IndexMut<_>>::index_mut(items, 1..);
   |                                                      ^^^^^ second mutable borrow occurs here
```

Only immutable references can be held in multiple places at the same time, mutable references [must
only be held once at any given moment][ref-rules]. Since both `next_item` and the value we're
assigning to `self.items` borrows mutably from `self.items`, the compiler has no way of knowing that
the first item and the rest of the items that we're borrowing don't actually overlap with each
other.

Luckily, the standard library has us covered with the [`split_first_mut`] method. This method
returns a mutable reference to the first element of the slice and a mutable reference to the rest of
the slice.

Using this will save us a bunch of steps:
([Rust Playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=feba677b2f7785be9f6c72b6093953d6))

```rust
use std::mem;

struct Foo<'a, T> {
    items: &'a mut [T],
}

impl<'a, T> Iterator for Foo<'a, T> {
    type Item = &'a mut T;

    fn next<'b>(&'b mut self) -> Option<Self::Item> {
        let items: &'a mut [T] = mem::take(&mut self.items);
        let (next_item, rest): (&'a mut T, &'a mut [T]) = <[T]>::split_first_mut(items)?;

        self.items = rest;

        Some(next_item)
    }
}
```

The `split_first_mut` method takes care of both the `items.get_mut(0)` and `&mut items[1..]` steps
we were performing manually before. We borrow and return an item from the `&'a mut [T]` field with
the `'a` lifetime.

Now that this works, let's clean things up and get rid of some of the extra explicitness we no
longer need in our program:
([Rust Playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=a77553f22dd792f1ab4bcd558eb6bf58))

```rust
use std::mem;

struct Foo<'a, T> {
    items: &'a mut [T],
}

impl<'a, T> Iterator for Foo<'a, T> {
    type Item = &'a mut T;

    fn next(&mut self) -> Option<Self::Item> {
        // Move `self.items` into a local variable without borrowing
        // from `self`. This gurantees that the item we return has
        // lifetime 'a, not the lifetime `self`.
        let items = mem::take(&mut self.items);

        let (next_item, rest) = items.split_first_mut()?;
        self.items = rest;

        Some(next_item)
    }
}
```

This code compiles and works exactly as expected. It's a little different than what we started with,
but still a very small amount of code at the end of the day.

Hopefully you now have a better understanding of the issues that come up when you write iterators
over mutable data. The `mem::take` trick is invaluable for being able to borrow a field's value
without borrowing from `self`. If the type you're trying to borrow from doesn't implement the
`Default` trait, you may still be able to temporarily replace it with something else using
[`mem::replace`] instead of `mem::take`.

## Acknowledgements

A big thank you to Alex Payne ([@myrrlyn]) and Manish Earth ([@manishearth]) who I had explain this
to me over and over again until my intuitive understanding turned into a concrete understanding.
When Alex told me the `mem::take` trick, I was very impressed by the simple brilliance of it. No
unsafe code required.

[Rust]: https://www.rust-lang.org/
[iterators]: https://doc.rust-lang.org/std/iter/trait.Iterator.html
[References]: https://doc.rust-lang.org/std/primitive.reference.html
[slice]: https://doc.rust-lang.org/std/primitive.slice.html
[`Copy`]: https://doc.rust-lang.org/std/marker/trait.Copy.html
[ref-rules]: https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html#the-rules-of-references
[fully-qualified syntax]: https://doc.rust-lang.org/stable/reference/expressions/call-expr.html#disambiguating-function-calls
[autoref]: https://doc.rust-lang.org/book/ch05-03-method-syntax.html#wheres-the---operator
[`mem::take`]: https://doc.rust-lang.org/std/mem/fn.take.html
[`MaybeUninit`]: https://doc.rust-lang.org/std/mem/union.MaybeUninit.html
[mut-slice-default]: https://doc.rust-lang.org/std/primitive.slice.html#impl-Default
[`split_first_mut`]:https://doc.rust-lang.org/std/primitive.slice.html#method.split_first_mut
[`mem::replace`]: https://doc.rust-lang.org/std/mem/fn.replace.html
[@myrrlyn]: https://twitter.com/myrrlyn
[@manishearth]: https://twitter.com/manishearth

[^1]: This is meant to be more illustrative than accurate, so don't expect this to be *exactly* what rustc would do.

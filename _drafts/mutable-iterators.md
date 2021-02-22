---
layout: post
title: Mutable Iterators in Rust
author: Sunjay Varma
subreddit: /r/rust
categories:
  - Programming
  - Rust
---

This blog post goes through the process of writing an iterator over `&[T]` and `&mut [T]` using only
safe [Rust]. This is harder to do than you might expect because of the different rules for immutable
`&` references and mutable `&mut` references. The code we get to at the end is relatively simple and
uses a few special tricks to make things work. You can use these tricks in your own code when you
run into similar situations.

## Iterating Over Slices

In [Rust], the type `&[T]` is a [reference] to a [slice]. The type `&[T]` is an immutable reference
to a slice and the type `&mut [T]` is a mutable reference to a slice. The [Rust borrowing
rules][ref-rules] allow us to have any number of immutable or "shared" references that point to the
same value. To make programming with them convenient, immutable references implement the [`Copy`]
trait.

To write an [iterator] over an immutable slice `&[T]`, we start by defining a type that stores the
slice as its only field. The idea is that we use the [slice `get` method] to get the next item from
the slice (always the first item). Then, we use the index operator `[]` (via the [`Index`] trait) to
create a new slice that contains the second item and onwards. If we reassign our type's field to
that subslice, the next call to the iterator will produce the second value. As this process goes on,
we'll end up going through every value of the slice until there is nothing left.

Here's what that ends up looking like in code:
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

We use `get_mut` instead of `get` and take a mutable slice to the remaining items instead of an
immutable slice.

If we try to compile this, we get the following errors:

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

The compiler complains that even though the type of `self.items` is `&'a mut [T]`, it can't
guarantee that the values we get from it will have the lifetime `'a`. This is surprising given that
our code worked perfectly for when `self.items` had type `&'a [T]`. The lifetime parameter we're
using hasn't changed, so shouldn't this code work too?

## Breaking Things Down

To understand what the difference is and why it might not work, let's break down the code a little
more to see what steps rustc is doing implicitly for us. We'll start with the first iterator we
wrote over `&[T]`:
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
to interpret this code.[^1] This still compiles and runs exactly the same as the iterator code
above. We've made some of the types explicit with [type annotations] and added some extra lifetimes
that were previously [elided]. You can see that the new `items` variable has the type `&'a [T]`
which is exactly what we would expect. We also gave `self` an explicit lifetime `'b` so you can see
that it is in fact different from `'a`. We've used [fully-qualified syntax] for all the method calls
to make any [auto-referencing and auto-dereferencing][autoref] explicit.

The `let next_item = self.items.get(0)?` line turns into:

```rust
let items: &'a [T] = self.items;
let next_item = <[T]>::get(items, 0)?;
```

We first *copy* `self.items` into a variable that has lifetime `'a`. Then we call `get` on that
value. This code works fine because as established above, immutable references can be copied and
both `self.items` and the new `items` variable are allowed to point to the same value at the same
time. The `next_item` variable borrows an item from the `items` variable, so we expect it to have
the `'a` lifetime (even though I haven't explicitly annotated it here).

The `self.items = &self.items[1..]`  line turns into:

```rust
let items: &'a [T] = self.items;
self.items = <[T] as Index<_>>::index(items, 1..);
```

Once again, we *copy* `self.items` into a variable. Even though the `next_item` variable is still
borrowing an item from that slice, this is fine because we're using an immutable reference. This
time, we pass that reference to a method of the [`Index`] trait to get the remainder of the slice
and reassign `self.items`.

Now, to see why the mutable version of this code doesn't work, let's try what we did earlier and
update this expanded code to use `&mut [T]` instead of `&[T]`:
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

Like before, we've changed this code to use `get_mut` instead of `get` and taken a mutable slice of
the remaining items using the `Index` trait instead of an immutable slice.

Compiling this produces the following errors:

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

This error explains the problem by referring to the new `'b` lifetime we added above. It says that
the borrowed `self.items` value is only valid for the lifetime `'b`, not the `'a` lifetime we
expected based on the code that worked fine before. The `&'a mut [T]` annotation on the `items`
variable doesn't seem to be correct this time.

The tricky thing here is that the [Rust borrowing rules][ref-rules] only allow us to have *one*
mutable reference to a given value at any given time. Mutable references are not `Copy`, so when we
assign `self.items` into the `items` variable, we are *moving* it, not copying it. Rust knows that
you can't move an item out of a field that it still expects to have a value, so it assumes that you
must be borrowing it instead. (In a different circumstance, we would get an error about not being
able to [move out of a mutable reference](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=5f833b31af59ee392bd5ab806cd89aa7)).

Since we're now borrowing, we must have the lifetime of the value we are borrowing from: `self`.
Since `self` has lifetime `'b`, the compiler complains that it can't guarantee that the reference
will be valid for lifetime `'a`. To make our expanded version of our code more accurate, let's
change the annotated lifetime to be `'b`:
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

This is now a reasonably accurate expansion for the original `&mut [T]` iterator we wrote at the
beginning of this post.

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

Even though we expected to borrow from `&'a mut [T]` and get a `'a` lifetime, we can now see that we
are getting the `'b` lifetime instead. This is unfortunate, especially because we *know* that the
items inside `self.items` definitely have lifetime `'a`. The compiler just can't see that because it
is trying to borrow from `self` which doesn't have the right lifetime. The different rules for
mutable references have prevented us from being able to write this code!

## The `mem::take` Trick

**Don't lose hope!** There is a relatively simple trick that will allow us to fix this. The
[`mem::take`] function takes a value out of a mutable reference by replacing it with its default
value. This is not an `unsafe` function because we're still leaving something in the location we're
taking the value from.[^2]

Here's an example of using `mem::take`:
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

When the compiler sees the syntax `&mut self.items`, it assumes that we must be borrowing from
`self`. To avoid that, let's try to remove `self` from the equation and get `&mut items` directly.
Here's what that looks like:

```rust
// let next_item = self.items.get_mut(0)?;
let items: &'a mut [T] = mem::take(&mut self.items);
let next_item: &'a mut T = <[T]>::get_mut(items, 0)?;
```

Notice how `items` is now annotated with `&'a mut [T]`, not `&'b mut [T]` as we were forced to do
earlier. This code works because `&mut [T]` has [a `Default` implementation][mut-slice-default] that
uses the empty slice `&mut []` as a default value. When we call `mem::take` on `self.items`,
`self.items` becomes the empty slice and we now have the `&'a mut [T]` value to work with however we
want. We aren't borrowing `self.items` anymore. Instead, we've *moved* it into a local variable
called `items`. Moving the value out of `self` results in the correct lifetime for `next_item`.

This is the updated code using this technique:
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

We take the value of `self.items`, get the first item, and then reassign the field to the remaining
items after that. If we compile this code, we no longer get the same error we were getting before!
The lifetimes are now correct!

**Why is this necessary?** Before we move on to the last error we need to fix, you may be wondering
why this is even necessary. Why can't the compiler just figure out what we mean and use the right
lifetime? Why are we left to use this odd hack to move a field out of a struct just to put it back
again? I am not the most qualified person to answer to those questions, so unfortunately I can't
provide a very good explanation for you. It probably has something to do with [subtyping and
variance].

## Using `split_first_mut`

The final error we get when we compile the latest version of our iterator is as follows:

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

This error says that since we're borrowing from a mutable slice, we can't have two mutable
references that potentially point to the same value. Remember: the compiler doesn't know what slices
are, so it can't do the math to figure out that the first item and the rest of the items won't point
to the same values.

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

## The Final Iterator

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

Although you don't need to, you could also use the `split_first` method to implement the iterator
for `&[T]` with code almost identical to this version. Since you don't need the `mem::take` trick
for that, you can just call `self.items.split_first()` directly.

Here's what that looks like:
([Rust Playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=55cc6cf8d2e820108518317751aee56a))

```rust
struct Foo<'a, T> {
    items: &'a [T],
}

impl<'a, T> Iterator for Foo<'a, T> {
    type Item = &'a T;

    fn next(&mut self) -> Option<Self::Item> {
        let (next_item, rest) = self.items.split_first()?;
        self.items = rest;

        Some(next_item)
    }
}
```

## Conclusion

Hopefully you now have a better understanding of the issues that come up when you write iterators
over mutable data. The `mem::take` trick is invaluable for being able to borrow a field's value
without borrowing from `self`. If the type you're trying to borrow from doesn't implement the
`Default` trait, you may still be able to temporarily replace it with something else using
[`mem::replace`] instead of `mem::take`.

## Acknowledgements

A big thank you to Alex Payne ([@myrrlyn]) and Manish Earth ([@manishearth]) for both inspiring this
post and helping me while I was writing it. I had them both explain this to me over and over again
until my intuitive understanding turned into a concrete understanding. When Alex told me the
`mem::take` trick, I was very impressed by the simple brilliance of it. No unsafe code required.
After seeing that, I immediately sat down to write this blog post so more people could know how this
works.

[Rust]: https://www.rust-lang.org/
[reference]: https://doc.rust-lang.org/std/primitive.reference.html
[slice]: https://doc.rust-lang.org/std/primitive.slice.html
[iterator]: https://doc.rust-lang.org/std/iter/trait.Iterator.html
[slice `get` method]: https://doc.rust-lang.org/stable/std/primitive.slice.html#method.get
[`Index`]: https://doc.rust-lang.org/stable/std/ops/trait.Index.html
[`Copy`]: https://doc.rust-lang.org/std/marker/trait.Copy.html
[ref-rules]: https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html#the-rules-of-references
[type annotations]: https://doc.rust-lang.org/book/ch03-02-data-types.html#data-types
[elided]: https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html#lifetime-elision
[fully-qualified syntax]: https://doc.rust-lang.org/stable/reference/expressions/call-expr.html#disambiguating-function-calls
[autoref]: https://doc.rust-lang.org/book/ch05-03-method-syntax.html#wheres-the---operator
[`mem::take`]: https://doc.rust-lang.org/std/mem/fn.take.html
[`MaybeUninit`]: https://doc.rust-lang.org/std/mem/union.MaybeUninit.html
[mut-slice-default]: https://doc.rust-lang.org/std/primitive.slice.html#impl-Default
[subtyping and variance]: https://doc.rust-lang.org/nomicon/subtyping.html
[`split_first_mut`]:https://doc.rust-lang.org/std/primitive.slice.html#method.split_first_mut
[`mem::replace`]: https://doc.rust-lang.org/std/mem/fn.replace.html
[@myrrlyn]: https://twitter.com/myrrlyn
[@manishearth]: https://twitter.com/manishearth

[^1]: This is meant to be more illustrative than accurate, so don't expect this to be *exactly* what rustc would do.
[^2]: Uninitialized memory is not allowed in Rust except in a few very specific places like [`MaybeUninit`]. You can't safely move a value out of a mutable reference to a field.

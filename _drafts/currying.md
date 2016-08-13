---
layout: post
title: Currying Functions in ES6
author: sunjay
categories:
  - Programming
---

Loosely defined, a curried function takes a single argument
and returns another function that takes the next argument until it can
evaluate to a result.

When used in code, that looks like this:

```javascript
// Let f be a curried function that requires 3 parameters in order to
// evaluate to a result
f(1) // returns a function that takes the 2nd argument
f(1)(2) // returns a function that takes the 3rd argument
f(1)(2)(3) // returns the result since all 3 parameters are satisfied
```

This has many useful properties.

One advantage is that if want to pass a function to another function
with some of its arguments already specified, you do not need to wrap
that function in an additional closure.

```javascript
// When trying to use a first argument of 1 for some function f:
// Instead of
foo((a) => f(1, a));
// You can use
foo(f(1));
```

The wrapping is done for you.

## Implementation in ES6

Turns out implementing this is quite succinct in ES6. With barely any code,
you can take advantage of all the benefits of currying.

Most of the heavy lifting required to curry a function can be done
by the ES6/Javascript [`bind()` function][bind-docs].

From the [`bind()` documentation][bind-docs]:

> The bind() method creates a new function that, when called, has its this keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called.
>
> func.bind(thisArg[, arg1[, arg2[, ...]]])

The part of currying missing from `bind()` is automatically evaluating
the result of the function when enough arguments are provided.

Here we take `bind()` and add in the additional logic need to make any
JavaScript function curried:

```javascript
function curry(f, ...args) {
  if (args.length >= f.length) {
    return f(...args);
  }
  else {
    return (...next) => curry(f.bind(f, ...args), ...next);
  }
}
```

This function is so small that (if you dare) it can even be reduced to
a single-line of JavaScript:

```javascript
const curry = (f, ...args) => (args.length >= f.length) ? f(...args) : (...next) => curry(f.bind(f, ...args), ...next);
```

I suggest using the equivalent and slightly more verbose version above
in any real code.

## Usage of `curry()`

This `curry()` function gives us a lot of flexibility. Not only does it
support passing a single argument into the curried function, it also allows
you to pass multiple arguments into any stage along the way.

```javascript
// maximum flexibility
// f = curry((a, b, c) => ...);
f(1)(2)(3);
f(1, 2)(3);
f(1)(2, 3);
f(1, 2, 3);
```

This makes it possible to do things like this:

```javascript
const numbers = [1, 2, 3, 4, 5, 6];

const fancy = curry((a, b, c) => a + b / c);
numbers.reduce(fancy(1), 0);
numbers.reduce(fancy(10), 0);
numbers.reduce(fancy(100), 0);
```

For the sake of comparison, notice how noisy the uncurried version is:

```javascript
const fancy = (a, b, c) => a + b / c;
numbers.reduce((b, c) => fancy(1, b, c), 0);
numbers.reduce((b, c) => fancy(10, b, c), 0);
numbers.reduce((b, c) => fancy(100, b, c), 0);
```

Supporting the passing of multiple arguments makes these curried functions
compatible with regular JavaScript paradigms and be extremely convenient.
Notice that the standard `reduce()` method does not need to explicitly
support curried functions.

Curried functions are infinitely composable:

```javascript
const f = curry(curry((a, b, c) => a + b * c));
console.log(f(1)(2)(3));
```

The second argument of `curry()` allows you to provide initial arguments
to the function. This is a bit of syntatic sugar for the following:

```javascript
// Instead of
foo(curry(f)(1, 2))
// You can use
foo(curry(f, 1, 2))
```

## Implementation without `bind()`

An alternate, but equivalent way to define the `curry()` function without
using `bind()`:

```javascript
function curry(f, ...args) {
  if (args.length >= f.length) {
    return f(...args);
  }
  else {
    return (...next) => curry(f, ...args, ...next);
  }
}
```

This is still succinct and reducible to a single line if that is what you
desire.

The difference between using `bind()` and using this method is that with
`bind()`, your functions will be special
[ES6 bound functions][bind-bound-functions].

[bind-docs]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind
[bind-bound-functions]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind#Description


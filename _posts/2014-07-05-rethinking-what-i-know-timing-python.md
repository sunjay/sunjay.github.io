---
id: 240
title: 'Rethinking What I Know: Timing Python'
date: 2014-07-05T03:01:16+00:00
author: Sunjay Varma
layout: post
guid: http://sunjay.ca/?p=240
permalink: /2014/07/05/rethinking-what-i-know-timing-python/
categories:
  - Programming
  - Python
  - Software Development
---
I've recently become slightly obsessed with profiling/timing everything. It stems from writing some time dependant code and also from having a general hatred of slowness. I avoid pointless optimization, but it's fun to think about the small differences between things sometimes. In a programming language like Python, there are often lots of different ways to write a single statement. There are things like list comprehensions, built-in functions, non-built-in functions, conventions, etc.

> [I recently asked a question on StackOverflow of a similar nature and it gained quite a bit of traction.](http://stackoverflow.com/q/23861468/551904)

A convention that is popular (or was popular when I first started learning Python several years ago) is doing something, then catching the error later if it didn't work. Here's an example:

<pre class="lang:python decode:true" title="Catching errors after they occur">try:
    MyClass
except NameError:
    ...do something...</pre>

The most popular case for doing this (and the one where this is most needed) is during an import:

<pre class="lang:python decode:true " title="Catching import errors">try:
    import mymodule
except ImportError:
    ...do something...</pre>

That's perfectly reasonable there as it wouldn't make sense to try to check for a module's existence before just trying to import it.

How does doing that affect speed though? Sure there are cases where you need to do something like that, but what happens when you don't?

The Python [timeit](https://docs.python.org/2/library/timeit.html) module comes in handy here. Here's how long it would take to run that many, many times over and over again:

<pre class="lang:python decode:true">&gt;&gt;&gt; from timeit import timeit
&gt;&gt;&gt; timeit("try: a\nexcept NameError: pass")
5.111955313663202</pre>

Now, for comparison's sake, here are two other equivalent methods that check ahead of time for a variable's existence instead of falling through to the error:

<pre class="lang:python decode:true">&gt;&gt;&gt; timeit("'a' in locals()")
1.0223936285547097
&gt;&gt;&gt; timeit("'a' in globals()")
0.3264493787064566</pre>

What a drastic difference!

For the sake of comparison, let's also see what happens if the variable exists already (so it doesn't fall through to the error case).

<pre class="lang:python decode:true ">&gt;&gt;&gt; timeit("try: a\nexcept NameError: pass", "a = 2")
0.037068840545543935
&gt;&gt;&gt; timeit("'a' in locals()", "a = 2")
0.3195678473566659
&gt;&gt;&gt; timeit("'a' in globals()", "a = 2")
0.36463691711469437</pre>

What was slower last time is now an entire order of magnitude faster! It seems that if you expect the variable to be there most of the time, writing <span class="lang:default decode:true  crayon-inline ">try&#8230;catch</span> statement is actually much faster than checking <span class="lang:python decode:true  crayon-inline ">locals()</span>  or <span class="lang:python decode:true  crayon-inline ">globals()</span> !

Another case where I tried this is with the <span class="lang:python decode:true  crayon-inline ">map()</span> function. I'm used to (probably out of bad habits) writing things like this:

<pre class="lang:python decode:true ">&gt;&gt;&gt; a = 2.456
&gt;&gt;&gt; b = 3.467
&gt;&gt;&gt; c = 4.678
&gt;&gt;&gt; d = 5.678
&gt;&gt;&gt; map(int, [a * b, c * d])
[8, 26]</pre>

This is perfectly valid Python code and will get you the result you want. However, let's compare it to the same thing without the <span class="lang:python decode:true  crayon-inline ">map()</span>  function (that is, applying <span class="lang:python decode:true  crayon-inline ">int()</span>  directly).

<pre class="lang:python decode:true">&gt;&gt;&gt; timeit("map(int, [a * b, c * d])", "a = 2.456; b = 3.467; c = 4.678; d = 5.678")
3.5052336329499667
&gt;&gt;&gt; timeit("[int(a * b), int(c * d)]", "a = 2.456; b = 3.467; c = 4.678; d = 5.678")
2.1192277050467965</pre>

Once again, two statements that seemed so similar demonstrate that they have minor differences in how they behave. The <span class="lang:python decode:true  crayon-inline ">map()</span>  version takes slightly longer.

The final small timing difference that I'll explore is between the python implementation of a very basic C function. (This isn't really a statement of the speed difference between Python and C, but more of the difference between this small statement in Python and C.)

Python's [math](https://docs.python.org/2/library/math.html) module is implemented in C and basically provides direct access to the mathematical functions provided by the C standard.

Here's what happens when you replicate a provided math function in Python.

<pre class="lang:python decode:true ">&gt;&gt;&gt; timeit("hypot(a, b)", "from math import hypot; a = 2.556; b = 5.355")
1.2673097753923246
&gt;&gt;&gt; timeit("sqrt(a**2 + b**2)", "from math import sqrt; a = 2.556; b = 5.355")
1.7849683955024567</pre>

There is a very small difference in the Python version and the C version.

You could actually argue that the Python version of this is pretty much equivalent to the C version, and you would be right. Operators are implemented in C and <span class="lang:python decode:true  crayon-inline ">sqrt()</span>  is from the math module, so it is also implemented in C. The small overhead of the Python interpreter however still exists. That's (most likely) what causes the small difference. Things aren't always dramatically slower from one version to another!

So, what can you conclude from all of this? Generally, conventions exist for a reason. What you do in other languages may not apply to Python. (Checking ahead is very important for most languages other than Python.) Will any of this really affect your code's performance all that much? No, probably not at all. These differences are so small you probably won't notice them at all, ever. It is however important to be aware that there are slight (and sometimes not so slight) differences in how fast some of your statements run. Your decision to use a built-in function or check in some large variable can affect your code. Using the Python [timeit](https://docs.python.org/2/library/timeit.html) module, or even better the [cProfile](https://docs.python.org/2/library/profile.html) module can really give you some insight into what's going on.
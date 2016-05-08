---
id: 266
title: A very subtle difference between less than and less than or equal to
date: 2014-07-18T17:29:59+00:00
author: Sunjay Varma
layout: post
guid: http://sunjay.ca/?p=266
permalink: /2014/07/18/a-very-subtle-difference-between-less-than-and-less-than-or-equal-to/
categories:
  - Algorithms
  - Programming
---
I was recently reading about and implementing an A* Pathfinding algorithm via this <a href="http://www.policyalmanac.org/games/aStarTutorial.htm" target="_blank">great article by Patrick Lester</a>. (You don't need to understand or even know what A* is to enjoy this article&#8211;don't worry!)

In the article, Patrick talks about what to do if two squares end up with the same score:

> <span style="color: #000000;">So we go through the list of squares on our open list, which is now down to 7 squares, and we pick the one with the lowest F cost. Interestingly, in this case, there are two squares with a score of 54. So which do we choose? It doesn't really matter. <strong>For the purposes of speed, it can be faster to choose the </strong></span>**<span style="color: #000000; text-decoration: underline;">last</span>**<span style="color: #000000;"><strong> one you added to the open list. This biases the search in favor of squares that get found later on in the search</strong>, when you have gotten closer to the target.</span>

This was very interesting to me because the algorithm itself doesn't contain any logic to track whether a certain score has been found before. It seemed like it might be a lot of unnecessary work to do it manually using some robust data structure. I started to wonder what else I could have done to tell the difference.

As Patrick mentions, **it doesn't (usually) matter which one you pick**. It's just interesting to note how subtly you can choose either the first or last item found with the same score.

I'll demonstrate this with a simple pseudo code algorithm for finding the closest object to a given target. Let's pretend that you're given a certain target object and a list of all objects in whatever world you're working in (except for the target).

This algorithm would (albeit naively) find the closest object to that target:

<pre class="lang:default mark:7 decode:true">Given a list of objects and a target

let closest = the closest object so far (null to start)
let shortest_distance = the shortest distance so far (infinity to start)
for each object in objects:
    distance = distance from object to target
    if closest is null or distance &lt; shortest_distance:
        closest = object
        shortest_distance = distance
return closest</pre>

The algorithm begins by creating some simple variables for the closest object and shortest distance. Then it simply goes through the list and picks out the object that is the shortest distance away from the target by comparing the distance of each object in the list to the shortest distance found so far.

Though the algorithm is very simple, I suggest you take some time to read it over carefully and think about how it really works. **Pay special attention to line 7 as that is what we're going to discuss next.** If it helps, you can try drawing out a few objects, making a list of those objects and then running the algorithm with some target.

What makes line 7 so special is the less than sign (<) used to compare the distances.

Here's a good question: **What's the difference between using a less than sign (<) and using a less than or equal to sign (<=)? How would the algorithm's behaviour change?**

Think about it.

The answer is actually given away in my quote of Patrick's article. Using a less than or equal to sign biases the search to the objects found later in the list. This is a VERY subtle difference and would not matter in most cases, however, **it does change what is returned from the algorithm in certain situations**.

Let's imagine you have a whole bunch of objects (blue dots) surrounding a single target (the big red X).

[<img class="aligncenter size-full wp-image-268" src="http://sunjay.ca/wp-content/uploads/2014/07/object_distances.jpg" alt="" width="285" height="211" />](http://sunjay.ca/wp-content/uploads/2014/07/object_distances.jpg)

All of the objects on the green circle are at the same distance from the target.

This is where the subtle difference between the less than sign (<) and the less than or equal to sign (<=) comes in.

Let's give each object its own letter:

[<img class="aligncenter size-full wp-image-269" src="http://sunjay.ca/wp-content/uploads/2014/07/object_distances_labeled.jpg" alt="" width="285" height="211" />](http://sunjay.ca/wp-content/uploads/2014/07/object_distances_labeled.jpg)

The list of all objects would look something like this: A, B, C, D, E, F, G.

Going through the that list and running the algorithm would result in getting either C, D or G. All three of those objects are the **same distance away from the target** and all three of them are also the **shortest distance away from the target**.

In the version of our algorithm that uses just the less than sign (<), the result would be C. In another version that uses the less than or equal to sign (<=), the result would be G.

_It's interesting to note that regardless of which sign you pick, you will never be able to retrieve just D without doing some major modifications._

**Why do you think the algorithm's behaviour is changing so much? What makes it return C instead of G?**

The answer to that is in the title of this blog post. There is a very subtle difference between the less than sign (<) and the less than or equal to sign (<=).

When the less than sign (<) is being used, all other objects with the shortest distance found _after_ the _first_ one with the shortest distance are _ignored_. On the other hand, when the less than or equal to sign (<=) is used, every time the same shortest distance is found, the algorithm _replaces_ the current closest object with the latest object.

This is a VERY subtle change in behaviour. In _most_ applications it probably won't make too much of a difference. It is however very interesting that you get a different result based on which sign you pick.

Most people wouldn't even notice that. Now you can.
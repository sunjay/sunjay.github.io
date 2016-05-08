---
id: 345
title: 'Laundry, Programming &#038; Efficiency'
date: 2014-08-30T23:10:56+00:00
author: Sunjay Varma
layout: post
guid: http://sunjay.ca/?p=345
permalink: /2014/08/30/laundry-programming-and-efficiency/
categories:
  - Algorithms
  - Personal
  - Programming
---
When programming in the real world, it's important to fit the algorithm you're using to the problem that you're solving. You end up making lots of decisions (sometimes implicitly) that really affect the performance of what you create.

Let's say you have 100,000 words that you want to search through. The words are all in a random order and you know that you only need to find one word once. This is the "problem" that you're out to solve.

If you're an experienced programmer, you may acknowledge that there are lots of different ways to do this.

Two fairly easy approaches are to:

  1. Sort the list first. Then use another algorithm to find the word that you're looking for in the sorted list.
  2. Go through each of the 100,000 words one at a time until you find what you are looking for (a linear search).

Both of those approaches will successfully find the result that you're looking for.

One criteria that I left out of the problem is that we want this solution to be _fast_. That's a very important criteria because there are a lot of very slow ways to solve this problem as well. We could randomly select one word at a time until we found what we were looking for. We want a solution that works both quickly and reliably.

Something to keep in mind: we only need to find what we're looking for once. This is very important.

Now let's talk about laundry. Both approaches listed above can apply to your laundry as well. I personally don't have 100,000 pairs of socks, but if I did, I would really care about how they were organized so that I could quickly pick out what I wanted.

There are a variety of ways that I could put my socks away as well. I could leave all of them in one large pile or I could take the time to sort them into pairs and then store them that way. If I was feeling really adventurous, I could throw all of my socks in the air every morning and then wear the first two that I catch. (I don't do that&#8230;)

<div id="attachment_346" style="width: 310px" class="wp-caption aligncenter">
  <a href="http://sunjay.ca/wp-content/uploads/2014/08/2014-08-30-19.50.52.jpg"><img class="size-medium wp-image-346" src="http://sunjay.ca/wp-content/uploads/2014/08/2014-08-30-19.50.52-300x168.jpg" alt="My Sock Drawer" width="300" height="168" /></a>
  
  <p class="wp-caption-text">
    My Sock Drawer
  </p>
</div>

With socks, the two approaches described above translate like so:

  1. Fold all matching pairs of socks together before putting them in the drawer. Then pick out the pair you want.
  2. Put all of the socks in one large pile (not in pairs) and then pick out socks until you find a pair.

In this case we assume that it doesn't matter which socks you get as long as they belong to the same matching pair.

We now have two approaches to the same problem. It is very difficult to say which way is better without first fitting your algorithm to the problem that you're solving.

It's important to distinguish that in our problem, we know that we only want to find what we're looking for once. This problem would be very different if we knew that we were going to perform our search multiple times.

Sorting the words or your socks has a lot of benefit when you know that you plan on doing many searches over and over again. You can intuitively see that it would be faster to sort first because the searching algorithms for sorted data are (generally) much faster than the searching algorithms for random data. The time you spend sorting is made up for by the time you save each time you complete a search using the faster algorithm. When doing multiple searches, you only need to sort the data once.

With socks, if you sort them beforehand, you're guaranteed that every pair you pull out will be a matching pair. You've taken some time to do the work beforehand and it pays off every time you repeat your search.

When programming in the real world (not just with socks and words), you should try to figure out where you should be doing some work in advance and where it doesn't matter. You can shave off quite a bit of computation time just by thinking about which parts of your program will repeat themselves during execution and which parts don't really need all the extra work you're putting into them.

Efficiency is important. Though premature optimization is the root of all evil, just a little bit of thought beforehand about how you're doing things can save you a lot of time optimizing and refactoring in the future.

I for one know that I need to quickly pull out a pair of socks every day, so I've gone ahead and done a bit of work beforehand to save me a lot of time in the next few weeks:

<div id="attachment_347" style="width: 310px" class="wp-caption aligncenter">
  <a href="http://sunjay.ca/wp-content/uploads/2014/08/2014-08-30-20.57.20.jpg"><img class="size-medium wp-image-347" src="http://sunjay.ca/wp-content/uploads/2014/08/2014-08-30-20.57.20-300x168.jpg" alt="Sorted For Efficiency" width="300" height="168" /></a>
  
  <p class="wp-caption-text">
    Sorted For Efficiency
  </p>
</div>

&nbsp;
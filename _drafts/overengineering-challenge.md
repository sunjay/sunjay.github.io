---
layout: post
title: "Overengineering Challenge: Displaying a Simple Page with as Many Steps as Possible"
author: sunjay
categories:
  - Programming
---

As a software developer, I am often tasked with engineering "good" solutions
to problems. The best software developers are able to solve problems by
doing the bare minimum required. This is important because for anything
that is to remain easily maintainable, extensible, and usable, it needs to
have as few moving parts as possible.

This is an exercise in doing the complete opposite.

## FAQ

**Why are you doing this?** When you spend so long training your
brain to minimize effort as much as possible, it is interesting to consider
what would happen if you did the opposite for a while. Think of this as the
Rube Goldberg Machine of software development.

**Why are you REALLY doing this?** [Just for fun.][whynotgif]{: target="_blank"}

**Can I do it too?** YES. You don't even need to be a software developer
to try it. If you do take it on, [contact me][contact] and I will put your
attempt up here for everyone to see.

## Rules

1. You must complete the challenge and meet the output requirements exactly
    * The user **must** be able to actually reach the page - the main challenge is how to overengineer the page in a way that is invisible to the end user
    * You don't need to do anything the original page doesn't do - like work in every possible browser or operating system
2. You can resolve anything you see as ambiguous by making reasonable assumptions within the spirit of the challenge
3. You can use any technologies, web or otherwise to complete the challenge
4. Anything you use must actually lead to the desired output or have reasonable justification for its use

Unreasonably superfluous additions or repetitions do not count. The point is
to be creative and combine as many different things as possible. Try to make
it as organized and coherent as possible. It might be complicated, but it
still has to work!

**Extra points:** actually implement part or all of your crazy solution

## Challenge

In as many steps as possible, create the following page:

[Overengineering Challenge][challenge-target]{: target="_blank"}

It looks like this:

[![Overengineering Challenge Target Output][challenge-target-thumb]{: .center}][challenge-target-large]{: target="_blank"}
Click image to view larger size
{: .text-center}

**The challenge is to produce the given output in as many steps as possible
while keeping the fact that those steps exist completely invisible to the end user.**

* The page only needs to look the same (same content and layout)
* The code (markup/styling/etc.) can be whatever you like and does not need to match the code of the challenge file
* Assume that this page will never be updated in the future and it only needs to be built and deployed once exactly as is -- your license to go crazy
* You can use any technologies (you don't need to use web technologies)

If you are making this for the web, you should try to keep the page load
time under 5 seconds. That is approximately the amount of time it takes the
user to lose interest and stop trying to load your page.

Keep in mind that there are really two phases to this:

1. **Matching the specified output:** Making the page appear on the screen
2. **Deploying the page:** Delivering that page to the user in a way that actually allows them to access it

You can choose to do one or both of these stages, adding as much complexity
along the way as you like. Just make sure, as stated before, that all of
these extra steps are completely invisible to the end user. To them it
should feel like they are visiting any other page.

**Most importantly:** Be creative, have fun, and go CRAZY!

[contact]: /contact
[challenge-target]: /assets/posts/overengineering-challenge/output.html
[challenge-target-thumb]: /assets/posts/overengineering-challenge/overengineering-challenge_thumb.png
[challenge-target-large]: /assets/posts/overengineering-challenge/overengineering-challenge.png
[whynotgif]: /assets/posts/overengineering-challenge/whynot.gif


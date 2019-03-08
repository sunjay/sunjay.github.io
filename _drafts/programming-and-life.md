---
layout: post
title: Things Programming Can Teach You About Life
author: Sunjay Varma
categories:
  - Life
---

> **TL;DR:** Assumptions are everywhere. Try considering **why** you think what
> you think and **why** others think what they think (especially the people you
> disagree with).

I wrote my first line of code almost 9 years ago in 2008. Since then, I have
gone in depth in more programming languages, frameworks, libraries and different
applications than I can count.

Along the way, I have learned a lot about software and its many nuances. I work
with software every day and I have learned to consider every aspect of it in
great depth.

Though the title of this post may suggest otherwise, as a software developer, I
don't actually sit around applying any of this to life. I just do my job and try
to do it well.

The reason I thought it would be valuable to you to write this post is because I
have been thinking about aspects of my personal life in great detail and I
realized that it's possible to apply things you can learn from software to real
life.

This isn't anything particularly new. You can actually do this with any
discipline. It's just that people tend to do it with easier things that they're
more familiar with. Think about how many times people have used figures of
speech or analogies that have to do with something like cooking (e.g. "too many
cooks in the kitchen") or cleaning. No one ever uses a function or a pointer to
teach someone about life.

In this post, we're going to explore the relationship that programming has with
our real lives.

## Programming and Relationships
*Note: Don't turn back now, relationships are not the main focus of this post.*

One notable example of where programming can be applied to our lives is
[Extreme Programming (XP)][extreme-programming]. XP is a set of values,
principles and practices that are meant to make your software development
more effective.

It's five values are:

* Communication
* Simplicity
* Feedback
* Courage
* Respect

These have certain benefits for programming work, but consider how much more
effective other things could be if you brought these values to the other areas
of your life.

For example, can you imagine how much better off you would be if you brought
communication, simplicity, feedback, courage, and respect to every relationship
in your life?

This post is not about how XP applies to relationships or anything else like
that. While exploring that might be slightly interesting or even humorous, I
don't think it would actually provide you with very much value in your day to
day life.

This is just an example that demonstrates that software development principles
can in fact be applied more generally than just in the context of writing code.

In the rest of this post, I'm going to talk about a much more interesting topic.
This is something that is more generic than XP and in my opinion more compelling
to discuss in the context of life overall.

## Assumptions, assumptions, assumptions

Consider the following piece of code written in the C programming language:

```c
int main(int argc, char const *argv[]) {
    // Print the first argument provided to the program
    printf("%d\n", argv[0]);
    return 0;
}
```

> **Don't worry if you're not a programmer or you don't know C.** You don't
> need to know much about any particular language in order to understand
> this post.

If you were able to figure out what this piece of code does and you know the C
programming language, you're probably a little infuriated with me for putting
this up in front of you. For those with a keen eye, there are a number of
problems with this program:

* No `#include <stdio.h>` in order to bring the `printf` function in scope
* Did not check how many arguments were provided using `argc`
* Printed `argv[0]` instead of the actual first argument which is `argv[1]`
* Incorrectly formatted a string (`char *`) as a number (`%d`)
* Some would argue that I should have used `EXIT_SUCCESS` instead of `0` in the
  return statement
* ...and probably some more things that someone who knows even more than I do
  could point out

The funny thing is, this program [will compile][ideone-compiled] and produce a
result. There are some warnings depending on your compiler, but most compilers
should let it through and generate code to the best of their abilities.

At face value, this code looks innocent enough. It would probably pass the code
review of someone who does not know much about programming or does not know much
about the C programming language.

The reason so many problems with it exist is because the person who wrote this
code made many *assumptions* about how it would work. In fact, every problem
pointed out before can be rewritten as an assumption:

* *Assume:* the `printf` function is available for use, even without an `#include`
* *Assume:* the correct number of command line arguments are available in `argv`
* *Assume:* `argv[0]` is the first argument provided to the program
* *Assume:* `%d` will correctly format the first argument as was intended
* *Assume:* Returning `0` will communicate a successful exit in a portable manner

Assumptions are a really powerful tool for programmers. Making assumptions can
allow you to write a lot less code. The above example is much shorter than what
it would have been had we addressed all of the assumptions listed above. This
comes at a cost of course since this program is riddled with problems (called
"bugs").

There are other assumptions that programmers make which don't cause bugs but in
fact make code simpler and easier to understand for everyone. For example, the
code assumes that the `printf` function will work as expected. This is a
reasonable assumption which allows us to use that function and not have to write
our own equivalent.

Assumptions can both be used as a tool to make things easier and also cause
problems in certain contexts as well.

One of the applications of identifying and addressing assumptions is something
called "debugging". Debugging is the process of finding and eliminating problems
in code. One of the most effective ways to debug a program in my experience is
to start with the code you think is causing problems and check every possible
assumption until you find the error.

For example, with the above code: when that program runs, it does not print out
the first argument like it is supposed to. One of the assumptions that we are
making is that `argv[0]` refers to the first argument passed to the program. If
you were to check that assumption, either with online information or by trial
and error, you would find that it is incorrect to use `argv[0]` and that
`argv[1]` should have been used instead. You could then go on and check your
assumption that `%d` will format your argument as a number. Of course, this is
also incorrect. With the type `char *`, the format specifier `%s` is the correct
option that should have been used. Continuing this process, you would eventually
converge on a program that has none of the problems listed above.

After many years of practicing this, most programmers who are successful in
their craft become experts in finding and addressing the assumptions in their
programs. They become extremely adept at it and can often just look at a program
to find every problem with it.

## Assumptions in Life

So what does all of this have to do with life?

It turns out that if you look close enough, almost everything we say, everything
that anyone talks about or writes about, is written on a foundation of
fundamental assumptions that everyone implicitly knows about but never really
considers. Put another way: **we all use assumptions on a daily basis, but never
really stop to consider those assumptions and whether they need to be addressed
or not.**

The C program above compiled. The compiler is the program responsible for
turning that code into something the computer can understand. It accepted the
program and allowed you to run it even though it was riddled with problems. The
problems were all caused by assumptions that were made, but they slipped through
and the program ran anyway.

In life, when we communicate with other people, we speak to each other on the
basis of certain assumptions that we make about each other. When we say
something like "meet you at the park", we are assuming that you understand that
"you" is referring to "you the listener", "the park" is referring to a common
location that we both understand and many more things about that which you need
to implicitly get in order to comprehend the sentence.

Assumptions are extremely important. Without them, we would have to define
everything in excruciating detail all the time. Imagine having to say "you (the
person I am talking to) meet me (come into my presence) at the park (256 Apple
St at the north-east corner by the tree with pine needles)." That would truly be
absurd. Every point in a conversation would take 2 hours to express and you
would never be done clarifying every part of everything that you said.

We need assumptions in order to live our lives effectively. However, just like
in the C program above, if we misuse them (mistakenly or not), it can cause a
lot of problems. The tricky part of life is that it is not always as clear as it
is in programming which assumptions are causing all the problems. It might not
even be clear what the assumptions are in the first place.

Especially when dealing with peoples' opinions or feelings, assumptions can get
really unruly to deal with. Opinions and feelings are by definition very
personal to people. If not handled carefully, trying to address those things
can get really messy.

It's hard to demonstrate this with a contrived example, so allow me to use
something that is a little more serious and controversial:

> Elections in democracies are and always will be the best and only fair way to
> make decisions in a society

If you come from a country where elections and democracy are common (like I do),
you may not see how this is controversial. However, if you search online for
something like "downsides to democracy", you will find lots of people talking
about [various problems][democracy-problems] that democratic systems have to
deal with. This is despite the fact that democracy is more often than not
promoted as something romantic and flawless.

By breaking down the assumptions made in this statement, you can begin to see
exactly where the opinion is coming from:

* Assumption: that a certain definition of "best" is the best for society
* Assumption: the definition of best will not change over time
* Assumption: elections are the *only* fair way
* Assumption: decisions that societies have to make *can* be decided by elections
  in democracies (i.e. that elections are a valid process for solving the problem)
* Assumption: elections can only occur in democracies
* etc.

Much like with debugging, it is most effective to try and directly address the
assumptions being made. It would not make any sense to sit there and yell at the
compiler for being wrong because the compiler does not care if you think that it
is wrong. Likewise, telling people you disagree with about how "stupid" or
"wrong" you think they are doesn't tend to be very effective when it comes to
changing their mind or having them see your side of the story.

Addressing the assumptions behind a statement is a much more effective way to
address the problem you have with someone's opinion. You may not ever be able to
change anyone's mind completely, but you at least have the opportunity to reach
some common ground and try to address the root of the problem (the assumptions)
instead of just trying to fight the symptoms (the opinion).

You can do this with yourself as well. Though you may not have noticed them up
until now, there are many fundamental assumptions that you have about things in
your life. There are many things you get emotionally charged about and those are
where you will find the strongest and most unbendable assumptions.

While there is nothing wrong with having assumptions (since we all do), it can
still be very important to understand the ones you have. By looking at yourself
in this new way, you gain the ability to understand, address and even question
why you think what you think.

There is a certain flexibility you get in life when you fully understand that
your assumptions are in fact just thoughts which can be updated and rearranged
to suit what works for you in your life.

You never know, maybe you will find out that you don't actually agree with one
of the fundamental assumptions that you have held for a long time.

## Conclusion

Programming and software development teach us to find and address assumptions in
our code with razor sharp accuracy and precision. It turns out that this skill
has much broader applications when it comes to communicating with people and
understanding ourselves.

Even if you completely disagree with someone, you can identify the assumptions
in what they are saying. By addressing those, you can discuss things with people
without having to argue about who is right or wrong. You can actually learn to
see where other peoples' opinions are coming from.

When we start to see other peoples' assumptions, we get a chance to look at
those people as more than just "stupid" or "wrong" for believing what they
believe. We can address the root of the problems that we have with them (their
assumptions), instead of trying to argue away the symptoms of those problems
(their opinions).

In reading all of this, don't forget that **you** also have many
fundamental assumptions that you make about everything. If someone is
challenging something you say, you can now begin to look at both their
assumptions **and** your assumptions as well to see if you can understand where
they are coming from while keeping in mind why you think what you think as well.

[extreme-programming]: https://www.tutorialspoint.com/extreme_programming/extreme_programming_values_principles.htm
[ideone-compiled]: https://ideone.com/6cNCa1
[democracy-problems]: http://greengarageblog.org/16-significant-advantages-and-disadvantages-of-democracy

---
id: 75
title: Happy Halloween! Fixing Your Scary Code!
date: 2013-10-31T11:30:31+00:00
author: Sunjay Varma
layout: post
guid: http://sunjay.ca/?p=75
permalink: /2013/10/31/happy-halloween-fixing-your-scary-code/
categories:
  - 'C#'
  - Code Design
  - Programming
  - Python
---
Happy Halloween Everyone!

<div style="width: 212px" class="wp-caption alignright">
  <img style="border: 1px solid black;" alt="Scary Code!" src="http://sunjay.ca/wp-content/uploads/2013/11/scary-code.jpg" width="202" height="151" />
  
  <p class="wp-caption-text">
    Don't let your code scare people away!
  </p>
</div>

If your code looks scarier than a
  
ghost or a ghoul on Halloween, it's time to clean up your act! It's very important to make sure your code is readable and consistent. You want the people who read your code (including yourself) to have the easiest time possible. That means using whitespace and indenting consistently and effectively. Here are some examples of what **NOT** to do and how you can make sure your code looks great and turns out fantastic!

**Fixing the little things presented in this article will make a world of a difference for both you and your code! It's worth it to be able to read and go back to the things you write, even if you don't think you'll need to go back anytime soon.**

<!--more-->

<p style="padding-left: 30px;">
  For Python programmers: You can consult <a href="http://www.python.org/dev/peps/pep-0008/" target="_blank">PEP 8</a> for a complete and comprehensive guide of what to do and what not to do. Python is widely regarded as one of the most readable languages for many very good reasons. Use PEP 8 as a gateway into the world of beautiful, readable and consistent code.
</p>

## Use White Space To Uncramp Your Code

Here's some code that could use some major work (written in C#):

<pre class="lang:c# decode:true" title="An Ugly Piece Of Code">using System;
class FancyProgram{
static int SomeMethod( int [ ] q){return q[1]+97;}
static void Main( )
{
int r;
r= 2+ 2* FancyProgram.SomeMethod ( new int[ ] { 1, 2, 3, 3} ) ;
    Console.WriteLine( "HELP! I've eaten too much candy! Over {0} pieces already!", r );}
}</pre>

For those who are curious, this code does compile and it produces the result you would expect had this code been at all readable:

<p style="padding-left: 30px;">
  HELP! I've eaten too much candy! Over 200 pieces already!
</p>

Unfortunately, though the compiler doesn't care what our code looks like, our human readers do. It's important to remember: even if your code isn't going to be read by other people, it will most definitely be read by you. Make _your_ life as easy as possible by taking a few extra seconds to make your code look great.

Let's start with the indentation in this code sample.

When indenting your code,

  * be consistent,
  * indicate precedence and logic correctly, and
  * aim to make everything as readable as possible.

Whether you use tabs or spaces, keep your scripts consistent with just one of those so that everything is displayed the same from editor to editor. If you use 4 spaces instead of a tab, use 4 spaces throughout your code. Don't arbitrarily change from spaces to tabs halfway through your script. Also, avoid changing the number of spaces being used to indent. This is easy to get away with in languages other than Python and should be avoided.

Indenting should be used to tell the user what code is going to run where. Code that runs within a class should be indented so it is _contained_ within that class. Code that runs within a method of that class should be indented so it is contained within the method _and_ its parent class.

<p style="padding-left: 30px;">
  <strong>Nitpicking: Indenting Braces</strong> When indenting braces (the "{" and "}" characters), consider the following: Braces represent the beginnings and ends of methods, classes, etc. Thus, they are not necessarily <em>contained </em>within the class. Only things contained within other things should be indented.
</p>

<p style="padding-left: 30px;">
  Braces placed on the line underneath their connected statements should be indented to the same level the line above them. Only indent statements that are contained within other statements.
</p>

<p style="padding-left: 30px;">
  Note: Some readers may choose to put the brace on the same line as whatever class, method, etc. that they are defining. This is widely accepted and can often be a great way of doing things. Keeping braces on separate lines from their connected statements is useful for preventing mistakes. The separate braces clearly designate where code is in a specific block and which block a piece of code belongs to.
</p>

### Using White Space Effectively

White space (i.e. blank lines, spaces, tabs, etc.) should be used to increase the clarity of your code. Since compilers/interpreters do not care what your white space looks like, it's up to you to make sure your code is readable for everyone (including yourself).

Empty lines are a great way to start organizing your code. Use blank lines to chunk/break down your code into readable pieces that can quickly be scanned by the human eye. You want the person reading your code to quickly be able to see which statements are related and which ones require more attention.

If your code sections become too large, break them down further to ensure maximum readability. You want yourself and your teammates to be able to scan and understand your code quickly. Chunking your code into _code blocks_ using blank lines will make a world of a difference.

Use spaces to describe operator precedence and priority. The above ugly code suffers from poor use of spaces. The line <span class="lang:c# decode:true  crayon-inline ">r= 2+ 2* FancyProgram.SomeMethod(&#8230;)</span>  is generally unclear and hard to decipher quickly. Here's a clearer way to rewrite that line: <span class="lang:c# decode:true  crayon-inline ">r = 2 + 2*FancyProgram.SomeMethod(&#8230;)</span>

Note the use of spaces to indicate that <span class="lang:c# decode:true  crayon-inline ">2*FancyProgram.SomeMethod(&#8230;)</span>  will be evaluated first.

**Caution:** Avoid using spaces extraneously. _Too much_ white space is also a bad thing. Here are some situations to avoid extra white space in:

  * Immediately inside parentheses, brackets or braces
  * Immediately before a comma, semicolon, or colon
  * Immediately before the open parenthesis that starts the argument list of a function call.
  * Immediately before the open parenthesis that starts an indexing or slicing.

See PEP 8 for some examples and further discussion on <a title="PEP 8, White Space" href="http://www.python.org/dev/peps/pep-0008/#pet-peeves" target="_blank">extraneous spaces</a>.

### Dealing With Lines Of Code That Are Just Too Long

If you have lines that are too long (i.e. greater than [80 characters](http://www.python.org/dev/peps/pep-0008/#maximum-line-length)), logically break those lines at or near the 80 character mark and use a single indent to indicate that the next line is just a continuation of the previous one. (The following code samples are written in Python)

<pre class="lang:python decode:true" title="Indenting Long Lines of Code">def carvePumpkinIntoSomethingAwesome(awesomeShape='bat', carvingTools={},
    numberOfCandles=2, pumpkinPieForDessert=True):
    ...Some Code...</pre>

Some readers may also choose to use the following forms which in certain contexts are just as good. The above is just a general case which can be used in most situations without fail.

<pre class="lang:python decode:true" title="Another Way To Indent Longer Lines">def carvePumpkinIntoSomethingAwesome(awesomeShape='bat', carvingTools={},
        numberOfCandles=2, pumpkinPieForDessert=True):
    ...Some Code...</pre>

This form is better for shorter method names and can help emphasize that the continued portion of the line is part of the method parameters.

<pre class="lang:python decode:true" title="Be Careful With This Technique!">def carvePumpkin(awesomeShape='bat', carvingTools={},
                 numberOfCandles=2, pumpkinPieForDessert=True):
    ...Some Code...</pre>

## Organize Your Code So It Makes Sense To Both Humans And Computers

Remember: Just because your code compiles, that does not mean it's well-written or readable.

When you organize your code and variables, do it logically. Consider that you may eventually want to go back and change things around. Write in a way that makes it easy for anyone to figure out what your code means. Make sure its clear where someone should look to change different pieces of your code.

Creating variable names is an art. It's art that largely depends on the context of its use. Certain variable names may make sense in certain specific contexts. In other contexts however, they may mean absolutely nothing.

In general, your variable names should be as self-explanatory and universal as possible. If a variable name makes sense to you, but might not to everyone else in the world, leave a comment describing its function and use.

When commenting code, it's important to ensure that your comments will actually be read and used. Avoid comments that are too long or too obvious. Here are some general guidelines for good commenting:

  * Ask yourself **WHY** you're doing what you're doing and then describe that
  * Do not state the obvious, any experienced coder can understand or figure out what a statement does
  * Whenever possible, avoid abbreviations and use full sentences to ensure maximum clarity
  * Do not be lazy. Comments are the key to understanding that brilliant piece of code you wrote two months ago that now means almost nothing to you.

Keep your line length to an _appropriate_ length. Though 80 characters is mentioned above, in the real world, line length is often determined by the problem at hand. Different programming languages demand different coding conventions. In cases like these, do what is best for yourself, your reader and the clarity of your code. Don't have excessively long lines of code and whenever possible, break up long lines to increase readability.

**Summary: **Whenever possible, do what is best for yourself and for anyone else who may ever read your code. Do not be lazy, go for clarity and readability. Be as consistent as possible. Don't be excessive with white space, use just enough.

Have a great Halloween and have fun coding!

&nbsp;
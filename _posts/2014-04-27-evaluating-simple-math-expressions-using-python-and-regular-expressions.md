---
id: 149
title: Evaluating Simple Math Expressions using Python and Regular Expressions
date: 2014-04-27T18:21:51+00:00
author: Sunjay Varma
layout: post
guid: http://sunjay.ca/?p=149
permalink: /2014/04/27/evaluating-simple-math-expressions-using-python-and-regular-expressions/
categories:
  - Programming
  - Python
---
A recent StackOverflow question prompted me to start thinking about parsing with regular expressions. In this post, I'm going to describe how to evaluate simple math expressions using Python regular expressions. At the end, you will be able to evaluate math expressions in the correct order of operations. This post assumes you have an intermediate understanding of Python's syntax and regular expressions.<!--more-->

**IMPORTANT: You should not attempt to use this solution in production code. The eval function and exec statement can be used to destroy your application or your computer. This is just a fun little experiment.**

Now, "parsing with regular expressions" is sort of a lie. You're not really parsing when you're using regular expressions. The regular expression engine is. You don't really get much control over that. If you want a robust solution to this kind of problem, you should definitely look at learning how to write a _real_ parser.

This problem is very interesting because it requires you to look at exactly how simple mathematical expressions work.

First of all, there exists a concept called the "order of operations". You can't simply evaluate mathematical expressions from left to right because there are certain operations that must occur first.

A simple way to represent this is with the acronym **BEDMAS**.

  * **B** &#8211; Brackets
  * **E** &#8211; Exponents
  * **D** &#8211; Division
  * **M** &#8211; Multiplication
  * **A** &#8211; Addition
  * **S** &#8211; Subtraction

What this denotes is that brackets should be evaluated before exponents, which should be evaluated before division operations, etc. At the very end, subtraction should be evaluated last. Granted, division and multiplication,  as well as addition and subtraction can be done in any order. For the purposes of this post however, we will stick to thinking of things in this **exact** order.

Brackets will be covered near the end. We will first figure out how to interpret every other operation below that.

**Note: **A robust implementation of nested brackets will still require a real parser. This post will only cover a basic, recursion-based method of evaluating them. Nested brackets will be very error prone and only work in certain special cases.

## Processing The Expression

A simple math expression can look like this:

<pre class="lang:python decode:true">1 + 2 ^ 3 * 4</pre>

How can we possibly take that expression and figure out that it is 33? Well let's create a simple plan of attack. Python, like many languages, has its own parser to deal with these kinds of expressions. Computers by default do not. While a computer may understand adding and some other simple operations, going through a string, grouping things correctly and following an order of operations is much more complicated.

Here's our plan of attack:

  1. Find all supported expressions (in this case, anything in BEDMAS)
  2. Convert supported expressions into function calls (i.e., 2 + 3 will be converted into add(2, 3))
  3. Evaluate the functions

Let's say we have the following very simple expression:

<pre class="lang:default decode:true">2 * 3</pre>

Using regular expressions, we can "parse" that into its respective pieces.

<pre class="lang:python decode:true" title="Matching a very simple expression">&gt;&gt;&gt; import re
&gt;&gt;&gt; matchobj = re.match("(.+)\*(.+)", "2*3")
&gt;&gt;&gt; matchobj.groups()
('2', '3')</pre>

Now, just using some simple Python, we can take the resulting groups and convert that string into something that makes a function call.

<pre class="lang:python decode:true" title="Converting the matched groups into a function call">&gt;&gt;&gt; expr = "mul(%s)"%(",".join(matchobj.groups()))
'mul(2,3)'</pre>

The <a href="https://docs.python.org/2.7/library/operator.html#operator.mul" target="_blank">mul()</a> function being referenced here is actually a real function in the built-in <a href="https://docs.python.org/2.7/library/operator.html" target="_blank">operator</a> module. That module exposes all of the basic Python operators.

Evaluating this line is as easy as defining a scope and calling the <span class="lang:default decode:true  crayon-inline">eval()</span>  function.

<pre class="lang:python decode:true">&gt;&gt;&gt; import operator
&gt;&gt;&gt; scope = {"mul": operator.mul}
&gt;&gt;&gt; eval(expr, scope)
6</pre>

Note the dictionary passed into <span class="lang:default decode:true  crayon-inline ">eval()</span> . This represents the "scope" used to evaluate the given expression. Any variable that is not given in that dictionary will **not exist** during the evaluation.

More advanced expressions require deeper analysis. Let's take the longer expression from before:

<pre class="lang:python decode:true">1 + 2 ^ 3 * 4</pre>

The answer to this is of course <span class="lang:default decode:true  crayon-inline ">33</span> because <span class="lang:default decode:true  crayon-inline ">2 ^ 3</span> is <span class="lang:default decode:true  crayon-inline ">8</span>, <span class="lang:default decode:true  crayon-inline ">8 * 4</span> is <span class="lang:default decode:true  crayon-inline ">32</span> and <span class="lang:default decode:true  crayon-inline ">32 + 1</span> is <span class="lang:default decode:true  crayon-inline ">33</span>.

Notice how every operation is grouped. According to BEDMAS, 2 ^ 3 is evaluated first. That part of the expression is "bounded" by the other, lower precedence operators around it. The + and the * can be considered the "stopping points" which limit what applies to that expression.

[<img class="aligncenter wp-image-166 size-medium" src="http://sunjay.ca/wp-content/uploads/2014/04/operator_grouping-300x63.png" alt="" width="300" height="63" />](http://sunjay.ca/wp-content/uploads/2014/04/operator_grouping.png)

The nice thing about regular expressions is that we can actually specify these kinds of "stopping points" right in our expression. When we were matching that simple multiplication expression before, we used <span class="lang:python decode:true crayon-inline">(.+)</span> . Instead of that, if we use <span class="lang:python decode:true crayon-inline">([^abc]+)</span> , we can actually exclude certain characters and thus put a "boundary" on what gets matched by the expression (in this example, the characters "a", "b" and "c").

Using these boundaries strategically, we can implement our evaluator.

As I claimed, operations of higher precedence are bounded by operators of lower precedence. Based on that, we can work out the following regular expressions:

<pre class="lang:python decode:true" title="Regular expressions for the EDMAS portion of BEDMAS">r_exp = re.compile("([^/*+-]+)\^([^/*+-]+)")
r_div = re.compile("([^*+-]+)\/([^*+-]+)")
r_mul = re.compile("([^+-]+)\*([^+-]+)")
r_add = re.compile("([^-]+)\+([^-]+)")
r_sub = re.compile("(.+)\-(.+)")</pre>

Notice how the expressions get more generic as you go down in precedence. Applying these expressions in order should provide you with a correctly converted expression.

Let's discuss how the actual conversion process works.

In the simple example above, it was fairly straightforward. There was only one expression and one operation, so converting it was a simple matter of replacing the entire string with a single function call expression.

In more complicated examples however, we're going to have to use Python's <span class="lang:python decode:true  crayon-inline">re.sub()</span>  method to make sure that everything is replaced in the correct place.

Luckily, <span class="lang:python decode:true  crayon-inline">re.sub()</span> takes a function as its <span class="lang:default decode:true  crayon-inline ">repl</span>  argument. This function can be used to convert the matched pieces into an appropriate function expression. Since all operations are going to use this exact same method, other than a few small name changes, we can generalise the entire process into a factory function.

<pre class="lang:python decode:true" title="Replaces expressions with function calls">def converter_factory(func_name):
    """
    Returns a function that returns a string expression that would a list to
    the given func_name
    """
    def _process(matchobj):
        args = map(str.strip, matchobj.groups())
        if not all(args):
            raise SyntaxError("Invalid syntax.")
        args = map(process_expression, args)
        return "%s(%s)"%(func_name, ",".join(args))
        
    return _process</pre>

This function returns a function that will take the given function name and match object, combine the match object's groups and then put all of this information together into a function call expression. Note that it also processes all parts of the expression using <span class="lang:python decode:true  crayon-inline">process_expression()</span> . This ensures that no parts are left unevaluated in expressions such as <span class="lang:default decode:true  crayon-inline ">2 * 3 * 4</span> .

At this point, all that is left is to actually use this factory in combination with the defined regular expressions in the correct order:

<pre class="lang:python decode:true" title="Convert expressions into their functional equivalents">def process_expression(expr):
    """
    Processes an expression, replacing relevant parts with
    their equivalent functions
    """
    expr = r_exp.sub(converter_factory("pow"), expr)
    expr = r_div.sub(converter_factory("div"), expr)
    expr = r_mul.sub(converter_factory("mul"), expr)
    expr = r_add.sub(converter_factory("add"), expr)
    expr = r_sub.sub(converter_factory("sub"), expr)
    return expr</pre>

Calling <span class="lang:python decode:true  crayon-inline ">process_expression()</span>  on a few different expressions:

<pre class="lang:python decode:true" title="Using process_expression() on a few expressions">&gt;&gt;&gt; process_expression("2 * 3")
'mul(2,3)'
&gt;&gt;&gt; process_expression("1 + 2 * 3")
'add(1,mul(2,3))'
&gt;&gt;&gt; process_expression("1 + 2 * 3 ^ 2")
'add(1,mul(2,pow(3,2)))'
&gt;&gt;&gt; process_expression("1 + 2 ^ 4 - 3 ^ 2 + 3")
'sub(add(1,pow(2,4)),add(pow(3,2),3))'</pre>

Notice how every expression is correctly grouped. The order of operations has been followed perfectly!

Now, you may be asking yourself: what about brackets? The very first piece of BEDMAS doesn't seem to be covered here yet.

Here's where some magic comes in.

Consider what expressions actually exist within parenthesis:

<pre class="lang:default decode:true">4 ^ (2 * 3)</pre>

<span class="lang:default decode:true  crayon-inline ">2 * 3</span>  looks exactly like the expression that was processed first in the above examples! All of the work to process that has already been done within the process_expression function. All that's left is to substitute/replace all expressions within parentheses with their processed equivalents.

First of all, here's an expression to match parenthesis (brackets):

<pre class="lang:python decode:true" title="An expression for matching parenthesis">r_par = re.compile("\(([^)]+)\)")</pre>

Now to augment the <span class="lang:python decode:true  crayon-inline ">process_expression()</span>  function to correctly evaluate what's inside the brackets.

<pre class="lang:python decode:true" title="The entire process_expression() function">def process_expression(expr):
    """
    Processes an expression, replacing relevant parts with
    their equivalent functions
    """
    expr = r_par.sub(lambda m: process_expression(m.group(1)), expr)
    expr = r_exp.sub(converter_factory("pow"), expr)
    expr = r_div.sub(converter_factory("div"), expr)
    expr = r_mul.sub(converter_factory("mul"), expr)
    expr = r_add.sub(converter_factory("add"), expr)
    expr = r_sub.sub(converter_factory("sub"), expr)
    return expr</pre>

Let's try it out:

<pre class="lang:python decode:true" title="Trying out the new process_expression() function">&gt;&gt;&gt; process_expression("(1 + 2) * 3")
'mul(add1,2,3)'</pre>

Uh oh! That doesn't look correct. It seems that something went wrong with our evaluation. Think back to how all of this was implemented. Somewhere, something went wrong and the regular expressions became confused.

It turns out that the error was actually something not accounted for while writing the <span class="lang:python decode:true  crayon-inline ">converter_factory()</span>  function. The problem is that the function returned by <span class="lang:python decode:true  crayon-inline ">converter_factory()</span>  returns something in the form of <span class="lang:python decode:true  crayon-inline ">"%s(%s)"</span> . Notice the brackets.

Replacing those brackets with something else (in this case, I chose square brackets), solves the problem and makes the <span class="lang:python decode:true  crayon-inline ">process_expression()</span>  function work again.

<pre class="lang:python decode:true" title="Examples of the fully implemented process_expression function">&gt;&gt;&gt; process_expression("(2 * 3)")
'mul[2,3]'
&gt;&gt;&gt; process_expression("(1 + 2) * 3")
'mul[add[1,2],3]'
&gt;&gt;&gt; process_expression("(1 + 2 * 3) ^ 2")
'pow[add[1,mul[2,3]],2]'
&gt;&gt;&gt; process_expression("1 + 2 ^ (4 - 3) ^ (2 + 3)")
'add[1,pow[pow[2,sub[4,3]],add[2,3]]]'</pre>

## Evaluating The Processed Expression

Now that the expressions have been successfully processed, evaluating them is quite straightforward. All it involves is building a correct scope variable and replacing the added square brackets with parenthesis.

Thanks to Python's built-in <span class="lang:python decode:true  crayon-inline ">vars()</span>  function, building the scope can be done quite easily:

<pre class="lang:python decode:true" title="Building an evaluation scope">import operator
scope = {}
scope.update(vars(operator))</pre>

Evaluating the expression is just a matter of calling eval() on the processed result after replacing the square brackets with parenthesis.

<pre class="lang:python decode:true" title="Evaluating processed expressions">def eval_expression(expr):
    """
    Evaluates and processes an expression and returns the result
    """
    return eval(process_expression(expr).replace("[", "(").replace("]", ")"), scope)</pre>

That's all! You should now be able to evaluate simple mathematical expressions.

Here's the completed result:

<pre class="lang:python decode:true" title="The Completed Implementation">import re
import operator

# All operators: ^ / * + -
r_par = re.compile("\(([^)]+)\)")
r_exp = re.compile("([^/*+-]+)\^([^/*+-]+)")
r_div = re.compile("([^*+-]+)\/([^*+-]+)")
r_mul = re.compile("([^+-]+)\*([^+-]+)")
r_add = re.compile("([^-]+)\+([^-]+)")
r_sub = re.compile("(.+)\-(.+)")

scope = {}
scope.update(vars(operator))

def converter_factory(func_name):
    """
    Returns a function that returns a string expression that would a list to
    the given func_name
    """
    def _process(matchobj):
        args = map(str.strip, matchobj.groups())
        if not all(args):
            raise SyntaxError("Invalid syntax.")
        args = map(process_expression, args)
        return "%s(%s)"%(func_name, ",".join(args))
        
    return _process

def process_expression(expr):
    """
    Processes an expression, replacing relevant parts with
    their equivalent functions
    """
    expr = r_par.sub(lambda m: process_expression(m.group(1)), expr)
    expr = r_exp.sub(converter_factory("pow"), expr)
    expr = r_div.sub(converter_factory("div"), expr)
    expr = r_mul.sub(converter_factory("mul"), expr)
    expr = r_add.sub(converter_factory("add"), expr)
    expr = r_sub.sub(converter_factory("sub"), expr)
    return expr

def eval_expression(expr):
    """
    Evaluates and processes an expression and returns the result
    """
    return eval(process_expression(expr).replace("[", "(").replace("]", ")"), scope)

def exec_expression(expr):
    """
    Executes and processes an expression and returns the result
    """
    exec process_expression(expr).replace("[", "(").replace("]", ")") in scope

if __name__ == "__main__":
    print "Simple Mathematical Expression Evaluator"
    print "Press Ctrl+C to quit"
    while True:
        input_expr = raw_input("&gt; ")
        try:
            if "=" in input_expr:
                exec_expression(input_expr)
            else:
                print eval_expression(input_expr)
        except SyntaxError:
            print "SyntaxError"
        except KeyboardInterrupt:
            print "KeyboardInterrupt"
            break
</pre>

When you run this file, you will be greeted with a prompt which as well as allowing you to evaluate simple expressions will also allow you to define variables using "=" as well.

Thanks for reading!

Sunjay
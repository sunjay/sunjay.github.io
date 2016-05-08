---
id: 356
title: 'Trying Something New: Programming in Racket'
date: 2014-10-22T23:45:34+00:00
author: Sunjay Varma
layout: post
guid: http://sunjay.ca/?p=356
permalink: /2014/10/22/trying-something-new-programming-in-racket/
categories:
  - Genius Tic-Tac-Toe
  - Programming
  - Racket
---
This week I sat down and decided to learn a new programming language. From Sunday to today (it's Wednesday), I have been learning and programming in Lisp&#8230;well actually in Racket.

I started by trying to learn Lisp. Trying to download Lisp led me to Common Lisp which turned out to be too much of a pain to install on Windows. I settled on Scheme but then it turned out that many people use Racket now instead of Scheme. Finally, I settled on learning Racket, a very user friendly language.

Racket is a subset of Scheme and a further subset of Lisp. (Note: Subset may not be the most precise word here&#8230;I've only been programming in this language for 3 days!)

## Learning a New Language: Racket

You may be wondering why I would bother to sit down and learn another language, especially if you've read the <a href="http://sunjay.ca/2013/10/18/a-long-list-of-beautiful-things/" target="_blank">list of languages I've explored already</a>.

For me, there are three main reasons I decided to learn Lisp/Scheme/Racket:

  1. Exploring new languages and their capabilities is usually pretty fun and interesting
  2. I have always wanted to try a mainly functional <a href="http://en.wikipedia.org/wiki/Polish_notation" target="_blank">Polish prefix notation</a> based language &#8212; most of my other experience is in more traditional languages that use <a href="http://en.wikipedia.org/wiki/Infix_notation" target="_blank">infix notation</a>
  3. Many experienced programmers claim to be able to pick up any language very quickly; I wanted to demonstrate my ability to do that

Some of you who are reading this may know that I am also the author of the game <a href="http://gttt.me" target="_blank">Genius Tic-Tac-Toe</a>. As a challenge to myself in Racket, I decided to write a script to render a Genius Tic-Tac-Toe board.

Here's the finished result:

<div id="attachment_357" style="width: 310px" class="wp-caption aligncenter">
  <a href="http://sunjay.ca/wp-content/uploads/2014/10/board-render.png"><img class="size-medium wp-image-357" src="http://sunjay.ca/wp-content/uploads/2014/10/board-render-300x300.png" alt="Board Rendered Using Racket" width="300" height="300" /></a>
  
  <p class="wp-caption-text">
    Board Rendered Using Racket
  </p>
</div>

For comparison, here's what the same board looks like in the browser:

<div id="attachment_358" style="width: 310px" class="wp-caption aligncenter">
  <a href="http://sunjay.ca/wp-content/uploads/2014/10/real-board-screenshot.png"><img class="size-medium wp-image-358" src="http://sunjay.ca/wp-content/uploads/2014/10/real-board-screenshot-300x297.png" alt="The real Genius Tic-Tac-Toe board this is based on" width="300" height="297" /></a>
  
  <p class="wp-caption-text">
    A screenshot of the real Genius Tic-Tac-Toe board this is based on
  </p>
</div>

**Note:** I have removed any extraneous details like the board win images and the extra colors for the current tiles and last move. Those are not included in the Racket script and would have made the comparison more difficult.

As you can see, the two boards are pretty close. The board drawn using racket was rendered as an image. The other board from Genius Tic-Tac-Toe board was rendered by my browser and defined using HTML and CSS.

A couple of things about using Racket:

  * Racket programming requires a lot of recursion. You should keep that in mind when you read the code I used to generate that image.
  
    > From The Racket Guide (Section 2.3.4): "recursion does not lead to particularly bad performance in Racket, and there is no such thing as stack overflow; you can run out of memory if a computation involves too much context, but exhausting memory typically requires orders of magnitude deeper recursion than would trigger a stack overflow in other languages. These considerations,combined with the fact that tail-recursive programs automatically run the same as a loop,lead Racket programmers to embrace recursive forms rather than avoid them."

  * This dive into the world of recursive functions caused me to have to rethink a lot of the algorithms I would have typically used to render that board. This was a very interesting intellectual exercise as well as a programming exercise.
  * Racket is actually a very sophisticated language. The program I produced in just a few hours doesn't even comes close to representing what you can do with it.

On learning a new language:

  * I actually tend to learn new languages or frameworks fairly often and usually have to do so very quickly (in the last year or so I have had to learn a new one every few months)
  * To learn Racket, I read _<a href="http://docs.racket-lang.org/quick/index.html" target="_blank">Quick: An Introduction to Racket with Pictures</a>_, then I skimmed _<a href="http://docs.racket-lang.org/more/index.html" target="_blank">More: Systems Programming with Racket</a>_. Finally, for some more depth, I read the first two and a half chapters of _<a href="http://docs.racket-lang.org/guide/index.html" target="_blank">The Racket Guide</a>_.
  * To learn about drawing and producing images, I read <a href="http://docs.racket-lang.org/draw/overview.html" target="_blank"><em>The Racket Drawing Toolkit Overview</em>.</a>
  * You'll notice that I read some resources in greater depth than others. Choosing what you read and what you skim over is an important skill for when you're looking to pick something up quickly.
  * Reading as much as I did and combining it with my existing programming expertise gave me the foundations that I needed to be reasonably comfortable in Racket. I was lucky to have been using a language with such great documentation.
  * Writing the program to render that board actually only took a few hours. I spent most of my time reading about and understanding the language from all of the resources I listed above.

## The Finished Racket Program

My Racket program: (<a href="https://gist.github.com/sunjay/a9c1d90a5d55a5082492" target="_blank"><strong>GitHub Gist</strong></a>)

<pre class="height-set:true lang:scheme decode:true " title="draw-board.rkt">#lang racket

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;
; Program for Drawing Genius Tic-Tac-Toe Boards
;
; Author: Sunjay Varma
; Copyright 2014 by Sunjay Varma. All rights reserved.
;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(require racket/draw)

; Constants
(define PIECE_X #\x)
(define PIECE_O #\o)
(define PIECE_BLANK #\space)

(define TILES 3)
(define TILE_SIZE 50)
(define BOARD_SIZE (* TILE_SIZE TILES))
(define BOARDS 3)
(define GRID_SIZE (* BOARD_SIZE BOARDS))

(define FILLED_TILE_COLOR (make-color 112 200 226))
(define UNFILLED_TILE_COLOR "white")
(define PIECE_COLOR (make-color 120 120 120))
(define PIECE_LINE_THICKNESS 3)

(define PIECE_PADDING 0.10)

; Main Board Drawing Function
(define (draw-board board)
  (define target (make-bitmap GRID_SIZE GRID_SIZE)) ; A 450x450 bitmap
  (define dc (new bitmap-dc% [bitmap target]))
  (draw-rows dc board 0 #t)
  (draw-board-borders dc)
  target)

; Draws the given board rows starting at the given vertical offset index
(define (draw-rows dc rows offset start-filled?)
  (cond
    ; quit if there are no more remaining board rows
    [(cons? rows)
     (define row (first rows))
     (draw-columns dc row 0 offset start-filled?)
     
     (define other-rows (rest rows))
     (draw-rows dc other-rows (+ offset 1) (not start-filled?))]))

; Draws the given row tiles starting at the given horizontal offset index
(define (draw-columns dc cols offset vertical-offset filled?)
  (cond
    [(cons? cols)
     (define col (first cols))
     
     ; Draw this column tile
     (define top (* vertical-offset TILE_SIZE))
     (define left (* offset TILE_SIZE))
     
     (if filled?
         (send dc set-brush FILLED_TILE_COLOR 'solid)
         (send dc set-brush UNFILLED_TILE_COLOR 'solid))
     (send dc set-pen "black" 0 'transparent)
     (send dc draw-rectangle left top TILE_SIZE TILE_SIZE)
     
     (cond
       [(equal? col PIECE_X)
        (draw-piece-x dc offset vertical-offset)]
       [(equal? col PIECE_O)
        (draw-piece-o dc offset vertical-offset)])
     
     (define other-cols (rest cols))
     (draw-columns dc other-cols (+ offset 1) vertical-offset (not filled?))]))

; Draws the borders and separators for each individual board on the grid
(define (draw-board-borders dc)
  (send dc set-pen "black" 2 'solid)
  (define (draw-border dc counter)
    (define line-offset (- (* BOARD_SIZE counter) 0))
    ; Draw horizontal line
    (send dc draw-line 0 line-offset GRID_SIZE line-offset)
    ; Draw vertical line
    (send dc draw-line line-offset 0 line-offset GRID_SIZE)
    
    (cond
      [(&gt;= counter 0) (draw-border dc (- counter 1))]))
  (draw-border dc BOARDS))

; Draws the X piece
(define (draw-piece-x dc hori-offset vert-offset)
  (let* ([padding (* TILE_SIZE PIECE_PADDING)]
         [top (+ (* vert-offset TILE_SIZE) padding)]
         [left (+ (* hori-offset TILE_SIZE) padding)]
         [bottom (- (* (+ vert-offset 1) TILE_SIZE) padding)]
         [right (- (* (+ hori-offset 1) TILE_SIZE) padding)])
    (send dc set-pen PIECE_COLOR PIECE_LINE_THICKNESS 'solid)
    (send dc set-brush "black" 'transparent)
    (send dc draw-line left top right bottom)
    (send dc draw-line right top left bottom)))

; Draws the O piece
(define (draw-piece-o dc hori-offset vert-offset)
  (let* ([padding (* TILE_SIZE PIECE_PADDING)]
         [top (+ (* vert-offset TILE_SIZE) padding)]
         [left (+ (* hori-offset TILE_SIZE) padding)]
         [radius (- (/ TILE_SIZE 2) padding)]
         [size (* radius 2)])
    (send dc set-pen PIECE_COLOR PIECE_LINE_THICKNESS 'solid)
    (send dc set-brush "black" 'transparent)
    (send dc draw-rounded-rectangle left top size size radius)))

; Some Test Data
(define test-board
  (list
   (list PIECE_X PIECE_O PIECE_BLANK PIECE_O PIECE_X PIECE_BLANK PIECE_BLANK PIECE_O PIECE_BLANK)
   (list PIECE_BLANK PIECE_X PIECE_BLANK PIECE_BLANK PIECE_BLANK PIECE_X PIECE_O PIECE_X PIECE_X)
   (list PIECE_X PIECE_X PIECE_BLANK PIECE_X PIECE_O PIECE_BLANK PIECE_BLANK PIECE_BLANK PIECE_BLANK)
   (list PIECE_BLANK PIECE_BLANK PIECE_O PIECE_O PIECE_X PIECE_X PIECE_O PIECE_BLANK PIECE_X)
   (list PIECE_X PIECE_X PIECE_X PIECE_O PIECE_O PIECE_O PIECE_BLANK PIECE_O PIECE_BLANK)
   (list PIECE_BLANK PIECE_BLANK PIECE_BLANK PIECE_BLANK PIECE_BLANK PIECE_X PIECE_O PIECE_BLANK PIECE_X)
   (list PIECE_BLANK PIECE_BLANK PIECE_BLANK PIECE_BLANK PIECE_O PIECE_BLANK PIECE_O PIECE_BLANK PIECE_O)
   (list PIECE_BLANK PIECE_O PIECE_BLANK PIECE_BLANK PIECE_X PIECE_BLANK PIECE_O PIECE_X PIECE_BLANK)
   (list PIECE_BLANK PIECE_O PIECE_X PIECE_BLANK PIECE_BLANK PIECE_X PIECE_BLANK PIECE_BLANK PIECE_O)))
</pre>

If you use <a href="http://docs.racket-lang.org/drracket/" target="_blank">DrRacket</a> (<a href="http://download.racket-lang.org/" target="_blank">download here</a>) to run this, all you have to do is type: <span class="lang:scheme decode:true  crayon-inline ">(draw-board test-board)</span>  and an image will be produced right in your window using the test data I have provided.

I tried to follow the Racket programming conventions I gathered from what I was reading. Some conventions I made up on my own from other languages. Hopefully you find the code fairly readable.

As you can see, this program, while producing a fairly simple result, is by no means trivial in nature. There are several levels of recursion and it may take you a bit to fully understand how the program works. I tried to optimize the logic so that I wouldn't need to repeat the recursive steps too many times. I combined many operations that probably could have been separated to make the code more readable.

Overall, I believe that the program demonstrates a reasonable grasp of the Racket language. For a few hours of work after 3 days of knowing about a language, it's pretty awesome.

If you have any questions or comments, please leave them in the Comments section below!

Sunjay
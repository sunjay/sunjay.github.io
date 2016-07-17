---
layout: post
title: "Overengineering Challenge: Displaying a Simple Page with as Many Steps as Possible (Submission)"
author: sunjay
categories:
  - Programming
---

**TODO: Fix challenge link**{: .highlighted}

This is my submission to [my own Overengineering Challenge][challenge].

If you would like to participate as well, please checkout
[the challenge][challenge] and [contact me][contact] when you
have your submission ready.

[contact]: /contact

## The Challenge in a Nutshell

Create [this page][challenge-target] in as many steps as possible while
ensuring that those steps remain completely invisible to the user viewing
the page.

[![Overengineering Challenge Target Output][challenge-target-thumb]{: .center}][challenge-target-large]{: target="_blank"}
Click image to view larger size
{: .text-center}

There are more details and rules on the [challenge page][challenge].

## My Submission

This is divided into several steps.

From backend to frontend:

1. PostgreSQL database
2. RethinkDB database
3. Node.js + KoaJS REST API
4. Task Queue Roulette
5. WebSocket Server/Client
8. React
9. Canvas
10. SCSS

### TL;DR:

1. Page begins to load
2. Page queries REST API for encrypted WebSocket server URL
3. API server places request in a task queue
4. Task queue is randomly shuffled until placed task is finally selected
5. API server returns an encrypted WebSocket server URL
6. Page queries REST API for WebSocket server URL decryption key
7. API server **might** give back the final encryption key
8. Page decrypts WebSocket server URL using each key it was given in succession
9. Page connects with WebSocket server
10. Page begins conversation with WebSocket server
11. Page asks WebSocket server for some color information
12. WebSocket server doesn't want to tell
13. Page attempts to bribe server
14. WebSocket server is insulted closes connection
15. WebSocket server closes connection
16. Page opens another WebSocket connection
17. WebSocket server takes the bribe this time and provides some information
18. This goes on for a while...
19. Finally the page has some data
TODO

The PostgreSQL database holds the color data, essentially the summary table at the end of the page.

The RethinkDB database holds a single document for each shade of gray from white to black.

Node.js + KoaJS REST API provides a single resource that provides two endpoints:

1. one to retrieve a vigenere cipher encrypted URL and
2. one to get the key to unencrypt it.

These must be called one after the other because the resource for the encrypted URL also provides a key that must be used to fetch the key. There is no way to parallelize this.

If the key resource provides a "next" link then the URL has been encrypted more than once. The key resource must be requested again with the next key until the encrypted URL is completely unencrypted. The number of times it is encrypted varies. 99.99% of the time it is only encrypted once. However for this to work the remaining 0.01% of the time you have to write additional code that checks for a next key and makes further requests.

Each request is placed into a task queue. This is no ordinary task queue however. The queue processes tasks in random order. Once a task is removed from the queue, 50% of the time, it will be placed back in for "further marinating".

The websocket server provides the actual color data. After forcing the
REST API to hand over the websocket server URL, you can connect to it
using the JavaScript WebSocket API.

After connecting with the websocket server, the client must engage in
"a conversation". These conversations start with "Hello" and must end in
"Talk to you soon." The websocket server does not like goodbyes. In these
conversations, the websocket client is asking the websocket server for information. The websocket server is not in the best mood however so you should offer it some sort of bribe. Usually this is a high enough number
to say that you really want something but not so high as to imply that you
don't know how much what you want is worth. Bid too high or two low and
the websocket server will close its connection and you will have to start
again. The websocket server may ask you to bid higher or lower. If you guess
correctly, you will be provided the answer to your question. Guess incorrectly too many times and your connection will be closed. A new amount is generated for each question every time you connect.

The client must open two separate websocket connections to the websocket
server. One connection can only be used for the main colors and the other
can only be used for shades of gray. These connections are not allowed to
communicate with the server at the same time. The server doesn't like
listening to more than one conversation at a time from a single client. The
client must manage this and ensure that conversations on one channel are finished before it starts a conversation on the other.
The onus is on the client to make sure it doesn't send messages from one channel before the conversation is finished on the other.

To request the shades of gray, you start by asking for white. The websocket
server will return that color's data as well as a link to the next shade. No need to ask any more questions or bribe any further. The websocket
server is very generous.

The react components are deeply nested. Like DEEPLY nested. And recursive.

Canvas is used to render the color boxes. Each square is divided into exactly 100,000 rectangles and then individually drawn. Shades diagram is
first drawn in reverse on a separate canvas in a web worker and then reversed before final rendering.

All the elements are given their own unique class name. The CSS is written
in deeply nested SCSS with each class name getting its own styles. Repetition everywhere.

The table is constructed using a special react &lt;MyTable&gt; component.
This component constructs the table using the DOM API, then converts those
elements into text which is then parsed using a custom written parser into
React components.

TODO: Keep expanding the complexity
TODO: Organize this into sections and link the summary steps to their section
TODO: Better name for the steps/sections

## Try it for yourself
Check out the [challenge page][challenge] and try this for yourself!
Submit your attempt to me via [my contact page][contact] and I will feature
you on the challenge page!

[contact]: /contact
[challenge-target]: /assets/posts/overengineering-challenge/output.html
[challenge-target-thumb]: /assets/posts/overengineering-challenge/overengineering-challenge_thumb.png
[challenge-target-large]: /assets/posts/overengineering-challenge/overengineering-challenge.png


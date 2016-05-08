---
id: 373
title: Design Needs Iteration &#8211; History of Genius Tic-Tac-Toe's Design
date: 2015-07-01T18:05:23+00:00
author: Sunjay Varma
layout: post
guid: http://sunjay.ca/?p=373
permalink: /2015/07/01/design-needs-iteration-history-of-genius-tic-tac-toes-design/
categories:
  - Genius Tic-Tac-Toe
---
When all you've got to start with is an idea and some code, you tend to sacrifice design. While this is fine in the beginning stages of any project, you should actively work to improve the design and bring it up to the same level of quality as the functionality of your project. Functionality is only as important as a design is usable (and pretty).

[Genius Tic-Tac-Toe](https://geniustictactoe.com/) was initially launched on May 1, 2014. While the project was originally started midway through 2013, it took a lot to finally release it to the world that day.

_See my other post where I answer: [How long did it take me to make Genius Tic-Tac-Toe?](http://sunjay.ca/2014/07/05/how-long-did-it-take-me-to-make-genius-tic-tac-toe/)_

_**Tip:** Click on the images in this post to see their full sizes!_

**Aug 4, 2013:** Initially, it all started with the board looking like this:<!--more-->

<div id="attachment_374" style="width: 560px" class="wp-caption aligncenter">
  <a href="http://sunjay.ca/wp-content/uploads/2015/07/2013-08-04-first-commit.png"><img class="wp-image-374 size-large" src="http://sunjay.ca/wp-content/uploads/2015/07/2013-08-04-first-commit-1024x493.png" alt="" width="550" height="265" /></a>
  
  <p class="wp-caption-text">
    Aug 4, 2013 &#8211; The First Commit
  </p>
</div>

This was my initial commit back on August 4, 2013.

**Note about the name:** The game originally started out being called "Ultimate Tic-Tac-Toe" after the game it was based on. However by the time I released it, I had realized that not only is my game different from Ultimate Tic-Tac-Toe in some of its rules, the name Ultimate Tic-Tac-Toe had been watered down immensely by the number of copycat games popping up everywhere. Eventually I changed the name to what it is today so I wouldn't end up being just another clone.

**Nov 1, 2013:** I started out by experimenting:

<div id="attachment_379" style="width: 560px" class="wp-caption aligncenter">
  <a href="http://sunjay.ca/wp-content/uploads/2015/07/2013-11-01-older.png"><img class="wp-image-379 size-large" src="http://sunjay.ca/wp-content/uploads/2015/07/2013-11-01-older-1024x493.png" alt="" width="550" height="265" /></a>
  
  <p class="wp-caption-text">
    Also Nov 1, 2013
  </p>
</div>

A mess of gradients, drop shadows, pill shaped buttons and weird symbols. You'll notice that I had started to pick up on the user's need to know which piece they currently were. I had also started to realize that button colors could signify how nice or how scary an action was.

**Nov 1, 2013 (two hours later):** I stripped out everything I had before and decided I wanted a two column layout and a full grey color scheme. (Grey was the only color I knew how to use back then&#8230;)

<div id="attachment_377" style="width: 560px" class="wp-caption aligncenter">
  <a href="http://sunjay.ca/wp-content/uploads/2015/07/2013-11-01.png"><img class="wp-image-377 size-large" src="http://sunjay.ca/wp-content/uploads/2015/07/2013-11-01-1024x489.png" alt="" width="550" height="263" /></a>
  
  <p class="wp-caption-text">
    Nov 1, 2013 &#8211; all the different styles for clickable tiles, ties, won boards, etc.
  </p>
</div>

I was really dissatisfied with these designs. As a developer I had never really experienced the design side of anything. Making something look usable and pretty was turning out to be a challenge.

**Dec 16, 2013:** Another experimental color scheme.

<div id="attachment_380" style="width: 560px" class="wp-caption aligncenter">
  <a href="http://sunjay.ca/wp-content/uploads/2015/07/2013-12-16.png"><img class="size-large wp-image-380" src="http://sunjay.ca/wp-content/uploads/2015/07/2013-12-16-1024x494.png" alt="2013-12-16" width="550" height="265" /></a>
  
  <p class="wp-caption-text">
    Dec 16, 2013
  </p>
</div>

This one in particular is quite dark. Imagine if the game had stayed this way&#8230;

**Dec 22, 2013:** Finally, I started making some progress into a design that was at least not horrible to look at&#8230;

<div id="attachment_382" style="width: 560px" class="wp-caption aligncenter">
  <a href="http://sunjay.ca/wp-content/uploads/2015/07/2013-12-22.png"><img class="size-large wp-image-382" src="http://sunjay.ca/wp-content/uploads/2015/07/2013-12-22-1024x498.png" alt="Dec 22, 2013" width="550" height="267" /></a>
  
  <p class="wp-caption-text">
    Dec 22, 2013
  </p>
</div>

Things were starting to workout but I realized the thick pieces were looking a bit too "blocky".

**Dec 23, 2013:** One day later I had this:

<div id="attachment_383" style="width: 560px" class="wp-caption aligncenter">
  <a href="http://sunjay.ca/wp-content/uploads/2015/07/2013-12-23.png"><img class="size-large wp-image-383" src="http://sunjay.ca/wp-content/uploads/2015/07/2013-12-23-1024x498.png" alt="Dec 23, 2013" width="550" height="267" /></a>
  
  <p class="wp-caption-text">
    Dec 23, 2013
  </p>
</div>

I remember staying up with my roommate Tejas (a better designer than I) and hearing him say "why is everything so grey? Just use some color!" I didn't listen to him fully at the time, but his saying that did eventually inspire a lot of what Genius Tic-Tac-Toe looks like today.

**Jan 3, 2014:** Finally! While it was still grey, at least it was finally clear which board you should be moving on. Look back on the previous screenshots and see if you can tell which board is the current board you can move on. There is actually a small visual hint on the board! It's just impossible to see and thus really unusable.

<div id="attachment_384" style="width: 560px" class="wp-caption aligncenter">
  <a href="http://sunjay.ca/wp-content/uploads/2015/07/2014-01-03.png"><img class="size-large wp-image-384" src="http://sunjay.ca/wp-content/uploads/2015/07/2014-01-03-1024x576.png" alt="Jan 3, 2014" width="550" height="309" /></a>
  
  <p class="wp-caption-text">
    Jan 3, 2014
  </p>
</div>

**Mar 29, 2014:** In March of 2014, I finally decided I was going to release Genius Tic-Tac-Toe at the beginning of May. That left me just two months and so I started working on it constantly; iterating designs and changing to better technologies.

Finally, I created this:

<div id="attachment_385" style="width: 560px" class="wp-caption aligncenter">
  <a href="http://sunjay.ca/wp-content/uploads/2015/07/2014-03-29.png"><img class="size-large wp-image-385" src="http://sunjay.ca/wp-content/uploads/2015/07/2014-03-29-1024x583.png" alt="Mar 29, 2014" width="550" height="313" /></a>
  
  <p class="wp-caption-text">
    Mar 29, 2014
  </p>
</div>

The first "flattened" version of Genius Tic-Tac-Toe.

This also spawned the first login screen of Genius Tic-Tac-Toe:

<div id="attachment_387" style="width: 560px" class="wp-caption aligncenter">
  <a href="http://sunjay.ca/wp-content/uploads/2015/07/2014-03-29-login.png"><img class="size-large wp-image-387" src="http://sunjay.ca/wp-content/uploads/2015/07/2014-03-29-login-1024x463.png" alt="Mar 29, 2014" width="550" height="249" /></a>
  
  <p class="wp-caption-text">
    Mar 29, 2014
  </p>
</div>

**Mar 30, 2014:** The next day I finally decided enough was enough. I sat down and started playing with colors.

Finally, after hours of work, I settled on a brand new design which still for the most part remains today.

<div id="attachment_388" style="width: 560px" class="wp-caption aligncenter">
  <a href="http://sunjay.ca/wp-content/uploads/2015/07/2014-03-30.png"><img class="size-large wp-image-388" src="http://sunjay.ca/wp-content/uploads/2015/07/2014-03-30-1024x500.png" alt="Mar 30, 2014" width="550" height="269" /></a>
  
  <p class="wp-caption-text">
    Mar 30, 2014
  </p>
</div>

Man, that's pretty good. That's a long way from where it started in August 2013.

You'll notice that this was the day the name changed as well.

**May 1, 2014:** Finally launch day arrived. This is how the game looked:

<div id="attachment_389" style="width: 560px" class="wp-caption aligncenter">
  <a href="http://sunjay.ca/wp-content/uploads/2015/07/2014-05-01-launch-day.png"><img class="size-large wp-image-389" src="http://sunjay.ca/wp-content/uploads/2015/07/2014-05-01-launch-day-1024x580.png" alt="May 1, 2014" width="550" height="312" /></a>
  
  <p class="wp-caption-text">
    May 1, 2014
  </p>
</div>

**July 1, 2015 (today):** Since then the game hasn't changed very drastically. I realized that the sidebar was terrible, noisy and created far too many responsiveness bugs to be worth it.

<div id="attachment_390" style="width: 560px" class="wp-caption aligncenter">
  <a href="http://sunjay.ca/wp-content/uploads/2015/07/2015-07-01.png"><img class="size-large wp-image-390" src="http://sunjay.ca/wp-content/uploads/2015/07/2015-07-01-1024x655.png" alt="July 1, 2015" width="550" height="352" /></a>
  
  <p class="wp-caption-text">
    July 1, 2015 (today)
  </p>
</div>

I decided to create a permanently siding side menu that remained off the page and gave the game the main focus. After all, when you're on Genius Tic-Tac-Toe, you're there to play.

<div id="attachment_391" style="width: 560px" class="wp-caption aligncenter">
  <a href="http://sunjay.ca/wp-content/uploads/2015/07/2015-07-01-menu.png"><img class="size-large wp-image-391" src="http://sunjay.ca/wp-content/uploads/2015/07/2015-07-01-menu-1024x655.png" alt="July 1, 2015 - sliding menu open" width="550" height="352" /></a>
  
  <p class="wp-caption-text">
    July 1, 2015 &#8211; sliding menu open
  </p>
</div>

I hope this showed you that most good ideas don't start out pretty and that it always takes iteration to make a project better. I'm not done iterating Genius Tic-Tac-Toe just yet!

If you haven't played yet, click the big link below to go check it out!

<h1 style="text-align: center;">
  <a href="https://geniustictactoe.com/">Go to Genius Tic-Tac-Toe</a>
</h1>

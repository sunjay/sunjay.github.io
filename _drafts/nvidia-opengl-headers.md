---
layout: post
title: "Overengineering Challenge: Displaying a Simple Page with as Many Steps as Possible"
author: sunjay
categories:
  - Programming
---

I just want to write some of this down and get it out there in case
anyone else is running into this. I have spent the last 3 days trying
to figure out how to install OpenGL headers on Linux Mint with an
Nvidia graphics card.

TL;DR:

* Symbolically link everything in `/usr/include/nvidia-<DRIVER VERSION>` into `/usr/include`
* Symbolically link everything in `/usr/lib/nvidia-<DRIVER VERSION>` into `/usr/lib/`

Commands:

* `sudo ln -s /usr/include/nvidia-361/* /usr/include/`
* `sudo ln -s /usr/lib/nvidia-361/* /usr/lib/`

**USE THESE WITH EXTREME CAUTION.** These are important directories. The second command listed will probably give you some warnings about files that were not symbolically linked because they already exist. This seems to be okay.

You need to have the `nvidia-<DRIVER VERSION>-dev` package for your driver version.

My driver version is `361` so I would use `nvidia-361` in everything above.

## What happened

- Trying to use Rust's `kiss3D` package
    - depends on GLFW
    - requires OpenGL headers
    - Getting errors about no open gl path or library
    - Tried installing GLFW manually
    - Errors about no `GL/gl.h` file
- Asked on various sites (link to all questions)
    - Few or no responses
- Tried to install `mesa-common-dev` since it has Gl/gl.h
- Tried to install the hundreds of other packages mentioned
- Upgraded from Linux Mint 17.3 to Linux Mint 18
- Tried to manually install nvidia drivers from the website with the `--opengl-headers` argument - http://nvidia.custhelp.com/app/answers/detail/a_id/163/~/linux---where-can-i-get-gl.h-or-glx.h-so-i-can-compile-opengl-programs%3F
- Some mentioned symlinking but no one said how or why
- https://ubuntuforums.org/showthread.php?t=189704
    - mentioned "mesa-common-dev. If you have an Nvidia card, you can grab nvidia's gl.h which will have their own extensions by installing nvidia-glx-dev."
    - Realized that this was an nvidia problem and gave up trying to install GLFW or mesa-common-dev
- process is dangerous and not for the faint of heart
- be very careful and fully understand this before you try it

## Why this works

- nvidia provides all the appropriate headers but doesn't put them in the
  expected directories
- there are supposed to be packages that fix this but none of them do anything
- need to manually symlink

## The result

- Spinning cube


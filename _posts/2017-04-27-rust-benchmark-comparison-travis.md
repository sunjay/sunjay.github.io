---
layout: post
title: Using Travis CI to Compare Rust Benchmarks
author: sunjay
subreddit: /r/rust
categories:
  - Programming
---

This is a follow up to Lloyd's excellent post on BenchApe about
[Rust Performance Testing on Travis CI][rust-perf]. If you haven't read that
post already, I suggest you start there. This post provides an updated version
of the `travis-after-success.sh` script described in his post.

I recently [tweeted][tweet] about that article and it seems that a lot of people
are interested in Rust performance testing, so I thought it would help a lot of
people if I shared my improvements on his script.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/rustlang">@rustlang</a> This is a great article on setting up benchmarking in Rust with Travis CI. Just used it for a project!<a href="https://t.co/EAcMHOvXGu">https://t.co/EAcMHOvXGu</a></p>&mdash; Sunjay (@Sunjay03) <a href="https://twitter.com/Sunjay03/status/854392657581355008">April 18, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

## Figuring out the problem

When I initially tried `travis-after-success.sh` script provided in the BenchApe
post, I ran into some problems. The script was using `${TRAVIS_COMMIT}` which
apparently [doesn't get set to anything valid][travis-commit-fail] during a pull
request build.

Trying to checkout the value of that variable in a pull request build failed
with an error that looked something like:

```
fatal: reference is not a tree: 9a49f5135b63bff6737828e8d64b78e5974f9916
```

> **What's a pull request build?**
>
> To give you some background, when you have a PR open on GitHub, Travis CI runs
> two builds every time you push: a "push build" and a PR build. These run
> essentially the same things, but with different environment variables. The PR
> build is given a bit more information like which branch the PR is based on.
>
> If you setup the [Travis Integration on Github][travis-github], you get a
> comment (shown below) telling you about both sets of build results:
>
> ![Travis Integration Comment][travis-integration-comment]

I tried using the [Travis CI environment variables documentation][travis-env] to
figure out what to use instead of `${TRAVIS_COMMIT}`, but eventually ended up
just inspecting the environment variables myself. I looked at both a
[push build][push-env] and a [PR build][pr-env] directly using the following
command in my `after_success` configuration:

```bash
# Added this to my after_success script
env | grep "TRAVIS_"
```

**The result:** the benchmark results in both my [push build][push-good] and
[PR build][pr-good] are identical and using the correct branches, exactly as
I would expect!

## The Updated Script

The updated `travis-after-success.sh` script:

```bash
#!/usr/bin/env bash

set -e
set -x

if [ "${TRAVIS_PULL_REQUEST_BRANCH:-$TRAVIS_BRANCH}" != "master" ] && [ "$TRAVIS_RUST_VERSION" == "nightly" ]; then
    REMOTE_URL="$(git config --get remote.origin.url)"
    cargo install cargo-benchcmp

    # Clone the repository fresh..for some reason checking out master fails
    # from a normal PR build's provided directory
    cd ${TRAVIS_BUILD_DIR}/..
    git clone ${REMOTE_URL} "${TRAVIS_REPO_SLUG}-bench"
    cd  "${TRAVIS_REPO_SLUG}-bench"

    # The Travis environment variables behave like so:
    # TRAVIS_BRANCH
    #   - if PR build, this is the pr base branch
    #   - if push build, this is the branch that was pushed
    # TRAVIS_PULL_REQUEST_BRANCH
    #   - if PR build, this is the "target" of the pr, i.e. not the base branch
    #   - if push build, this is blank
    #
    # Example:
    # You open a PR with base `master`, and PR branch `foo`
    # During a PR build:
    #     TRAVIS_BRANCH=master
    #     TRAVIS_PULL_REQUEST_BRANCH=foo
    # During a push build:
    #     TRAVIS_BRANCH=foo
    #     TRAVIS_PULL_REQUEST_BRANCH=

    # Bench the pull request base or master
    if [ -n "$TRAVIS_PULL_REQUEST_BRANCH" ]; then
      git checkout -f "$TRAVIS_BRANCH"
    else # this is a push build
      # This could be replaced with something better like asking git which
      # branch is the base of $TRAVIS_BRANCH
      git checkout -f master
    fi
    cargo bench --verbose | tee previous-benchmark
    # Bench the current commit that was pushed
    git checkout -f "${TRAVIS_PULL_REQUEST_BRANCH:-$TRAVIS_BRANCH}"
    cargo bench --verbose | tee current-benchmark
    cargo benchcmp previous-benchmark current-benchmark
fi
```

I encourage you to actually read through this script so that you understand
exactly what it is doing.

> **Adding this to your Travis CI configuration**
>
> If you keep the name of this script as `travis-after-success.sh` and place it
> in the same directory as your `.travis.yml` file, you can run it in Travis CI
> by adding the script to the `after_success` section of your `.travis.yml` file:
>
> ```yml
> after_success:
>   - ./travis-after-success.sh
> ```
>
> If you copy this into your repository, make sure you make the script executable:
>
> ```bash
> chmod +x travis-after-success.sh
> ```

## Differences From The Original

This script still does pretty much the exact same things as the
[original][orig-script].

There are however some key differences:

* The new script uses `set -e` so the script stops if any command results in a
  non-zero exit code
  * This removes the need to end every line with `&& \`
* The new script uses `set -x` to log each bash command that is run so
  your build log shows you exactly what happened
  * The commands show up in the build log prefixed by `+`
    (see [this answer](http://stackoverflow.com/a/2853811/551904) for more info)
* `cargo-benchcmp` is installed before your benchmarks run
  * I'm actually considering moving this lower so that it doesn't install until
    it is actually about to be run
  * I didn't use `--force` because with Travis CI's caching feature it's possible
    that a version may already be installed (this needs to be tweaked some more)
* The Travis CI environment variables are documented in detail so that the next
  person reading the script does not have to repeat the experimentation that I performed
* The correct base branch is chosen based on the environment variables (instead
  of just always using master)
* The filenames of the benchmark results are changed to more common terms like
  "previous" and "current"
  * This could still be improved by maybe using the branch names as the
    filenames instead
* The program `tee` is used instead of redirecting the output so that each
  run of `cargo bench` shows up in the build log and no results are ever lost

## Wrapping Up

Next time you're reviewing a pull request, you'll be able to see a detailed
performance comparision between the pull request branch and the branch that it
is based on at the end of your build log.

If you find any issues with this script, or see possible any improvements,
please don't hesitate to [contact me][contact], [open an issue][new-issue], or
send a pull request to the [repository for this website][website-repo].

[**Follow @Sunjay03 on Twitter**](http://twitter.com/sunjay03){:target="_blank"}

[tweet]: https://twitter.com/Sunjay03/status/854392657581355008
[rust-perf]: https://beachape.com/blog/2016/11/02/rust-performance-testing-on-travis-ci/
[orig-script]: https://beachape.com/blog/2016/11/02/rust-performance-testing-on-travis-ci/#getting-benchmark-comparisons-in-pull-requests
[travis-github]: https://github.com/integrations/travis-ci
[travis-integration-comment]: /assets/posts/rust-benchmarking-travis/travis-integration.png
[travis-commit-fail]: https://travis-ci.org/brain-lang/brainfuck/jobs/224077306#L350
[updated-script]: #the-updated-script
[push-env]: https://travis-ci.org/brain-lang/brainfuck/jobs/226452086#L924
[pr-env]: https://travis-ci.org/brain-lang/brainfuck/jobs/226452109#L930
[push-good]: https://travis-ci.org/brain-lang/brainfuck/jobs/226462183#L1111
[pr-good]: https://travis-ci.org/brain-lang/brainfuck/jobs/226462199#L1119
[travis-env]: https://docs.travis-ci.com/user/environment-variables/#Default-Environment-Variables
[contact]: /contact
[new-issue]: https://github.com/sunjay/sunjay.github.io/issues
[website-repo]: https://github.com/sunjay/sunjay.github.io

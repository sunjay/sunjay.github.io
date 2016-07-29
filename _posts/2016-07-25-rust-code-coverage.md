---
layout: post
title: "Rust Code Coverage Guide: kcov + Travis CI + Codecov / Coveralls"
author: sunjay
excerpt: "A comprehensive guide to generating code coverage for Rust projects, integrating that into Travis CI and publishing the results to either Codecov or Coveralls."
subreddit: /r/rust
categories:
  - Programming
---

**Last Updated:** July 29, 2016

For questions about or problems with Rust code coverage, use the
[Rust IRC channels][rust-irc], StackOverflow or [contact][contact] me.
This website is [open-source][website-source] so if you find a problem
with this guide, please open a [new issue][website-issues].
{: .alert}

The de facto [code coverage tutorial for Rust][old-tutorial]{: rel="nofollow" target="_blank"} was published
on March 15, 2015. If you Google "rust code coverage" you will largely find
links to that tutorial. It is a great guide, many things have changed in the
year since it was published.

This guide covers everything you need to know to get code coverage working
for your Rust project. It goes over some common problems you may run into
as well as their solutions. [Travis CI][travis-ci] integration and
publishing your coverage results to either [Codecov][codecov] or
[Coveralls][coveralls] will be discussed near the end.

I recently dove quite deeply into the current state of Rust code coverage
when I set it up for [my own project][lion-github] and also
[helped][codecov-rust-pr] the [Codecov][codecov] team fully
integrate Rust into their platform. I wrote the
[Codecov Rust example][codecov-example-rust] which contains detailed
instructions for sending your coverage data to Codecov. This
guide will go into even more detail about Rust code coverage.

## Prerequisites

You should understand how testing works in Rust and how to run your tests
with cargo. The [Rust book][rust-testing] has a great section on this.

You should also know the basics of how to use Travis CI. The
[Travis CI website][travis-ci-tutorial] is an excellent resource for
getting setup.

## Caveats

The tool being used, kcov, is not Rust-specific. It uses DWARF
debugging information in your generated executable to determine
which lines have been covered.
[kcov does not always generate the most accurate coverage information][kcov-inaccurate].

kcov will likely only work for x86 and x86_64 Linux. This is usually enough
for Travis CI integration but you may need some extra steps to get it
working locally if you are not on that operating system.

As of writing this guide, there is no way to generate code coverage
data for Rust doctests. This is because the doctest executable is only
generated temporarily while it is being run. If you find a way to collect
coverage for doctests, please open a [new issue][website-issues] or
[contact][contact] me to let me know.

## Getting kcov

You need to use a very recent version of kcov in order to get it to
work with Rust executables.

Before you begin, see if your package manager has a kcov version greater
than or equal to kcov 31. If it does, you will likely be able to install
kcov using your package manager and skip the *Manually Compiling kcov* section
entirely. Earlier versions of kcov may also work, but I have only verified
kcov 31.

To install using apt:

```bash
sudo apt-get install kcov
```

Once installed, check your kcov version use the `--version` argument:

```bash
kcov --version
```

Very old versions do not support the `--version` argument so if you get
an error message instead of a version, your kcov version is too old.

## Manually Compiling kcov

Install the dependencies for kcov:

```bash
sudo apt-get install libcurl4-openssl-dev libelf-dev libdw-dev cmake gcc binutils-dev libiberty-dev
```

In the [original Rust code coverage tutorial][old-tutorial]{: rel="nofollow" target="_blank"},
only `libcurl4-openssl-dev`, `libelf-dev`, `libdw-dev`,
`cmake`, and `gcc` were required. However,
[shortly after that was published][kcov-additional-deps],
kcov added `binutils` and `libiberty` as dependencies as well.

The new dependencies allow you to run kcov with the `--verify`
option as shown below.

To compile the kcov source code, run the following commands:

```bash
wget https://github.com/SimonKagstrom/kcov/archive/master.tar.gz
tar xzf master.tar.gz
cd kcov-master
mkdir build
cd build
cmake ..
make
# puts kcov in the default location usually /usr/local/bin/kcov
sudo make install
```

To make kcov install in a different location, run `cmake` like this:

```bash
cmake -DCMAKE_INSTALL_PREFIX:PATH=/usr ..
```

To avoid running `make install`, copy both kcov and the generated `*.so`
files from the `build/src` directory. The shared objects are necessary for
working with Rust executables.

## Collecting Coverage Data
kcov runs your test executables and then outputs a report showing
which lines were covered and which lines were not.

To collect coverage data, first generate your test executable without running it:

```bash
cargo test --no-run
```

The compiled binaries are placed in `target/debug`. Cargo may create multiple
test executables if you have multiple binaries.

To run your tests and collect coverage, run kcov with the following command:

```bash
kcov --exclude-pattern=/.cargo,/usr/lib --verify target/cov target/debug/<executable name>
```

You know it worked if you get the same output you see when you run
your tests with `cargo test`. You can see your coverage data in
`target/cov`. Change that path in the command above to output
coverage somewhere else.

Be careful here because kcov will only run a single executable. If you
replace `<executable name>` with a pattern that matches multiple executables,
only one of them will run.

**Note:** If collecting coverage for multiple test executables, make sure you
are not inadvertently overwriting the coverage data of one of your other
executables. When you run kcov, it will automatically store coverage in a
directory named after the full name of the executable you pass in.
It will also merge any coverage it finds each time you run it for a
different executable. This may cause some lines to
appear uncovered even though they are covered in another test executable.
Whether or not things are merged should not be an issue for Codecov because
it will automatically search for and merge all of your coverage data
automatically. Coveralls should be able to do this as well.

The path `/usr/lib` is included in `--exclude-pattern` so that shared
libraries you may be using are not included. You may not always need this.
You can exclude any path you don't want showing up in your coverage data
by adding to the comma separated list in the `--exclude-pattern` option.

The `--verify` option is used by kcov to "verify breakpoint setup (to catch compiler bugs)" -- [see `kcov --uncommon-options`][kcov-uncommon-options].

Without it you will get an error that looks something like this:

```
kcov: Process exited with signal 4 (SIGILL) at 0x7ffff73c0301

kcov: Illegal instructions are sometimes caused by some GCC versions
kcov: miscompiling C++ headers. If the problem is persistent, try running
kcov: with --verify. For more information, see
kcov: http://github.com/SimonKagstrom/kcov/issues/18
```

If you get this error (or something like it):

```
kcov: error while loading shared libraries: libopcodes-2.24-system.so: cannot open shared object file: No such file or directory
```

It means the libraries used to compile kcov are out of date. Recompiling
kcov using the instructions above or reinstalling it using your package
manager should solve the problem.

Example coverage report generated by kcov for [lion][lion-github]:

[![kcov file coverage report][lion-files-coverage]][lion-files-coverage]{: target="_blank"}
Click image to view larger size
{: .text-center}

[![kcov line coverage report][lion-line-coverage]][lion-line-coverage]{: target="_blank"}
Click image to view larger size
{: .text-center}

The [live Codecov coverage report][lion-codecov] generated using the kcov
coverage data is available on Codecov.

## Coverage Data

Each time you run kcov using the instructions above, it will
generate a coverage report for your executable and place it in
the `target/cov/<executable name>/` directory. If you run kcov
multiple times, it will merge the coverage data into a single report and
place that in a special `kcov-merged` directory.

```bash
find . -name "cobertura.xml"
./target/cov/<test-executable-1>/cobertura.xml
./target/cov/<test-executable-2>/cobertura.xml
./target/cov/kcov-merged/cobertura.xml
```

Full instructions for how to upload this data to Codecov or Coveralls is
provided below. For any other coverage provider, these are likely the files
you will need to upload.

## Travis CI Integration

***Update (July 29, 2016):** As pointed out in [#1][website#1], there is a
script called [travis-cargo][travis-cargo] that handles Travis and
Coveralls integration for you. The Travis configuration you would use to
integrate that is similar to the one below except that it has the kcov
installation details hidden behind the script.*

These instructions are specific to Travis CI, but should be ubiquitous enough
to translate to any CI provider. We essentially need to take the above
instructions and translate them into a Travis CI configuration.

As of July 25, 2016, the version of kcov that can be downloaded with `apt`
is not recent enough to run Rust executables. That means that you need to
compile kcov manually in your Travis CI configuration for this to work.

Here is the complete Travis CI configuration:

```yaml
language: rust
rust:
  - 1.9.0

addons:
  apt:
    packages:
      - libcurl4-openssl-dev
      - libelf-dev
      - libdw-dev
      - cmake
      - gcc
      - binutils-dev

after_success: |
  wget https://github.com/SimonKagstrom/kcov/archive/master.tar.gz &&
  tar xzf master.tar.gz &&
  cd kcov-master &&
  mkdir build &&
  cd build &&
  cmake .. &&
  make &&
  sudo make install &&
  cd ../.. &&
  rm -rf kcov-master &&
  kcov --exclude-pattern=/.cargo,/usr/lib --verify target/cov target/debug/<executable name>-* &&
  bash <(curl -s https://codecov.io/bash) &&
  echo "Uploaded code coverage"
```

Make sure you replace `<executable name>` with the name of your test
executable. The `-*` afterwards is a pattern that will automatically match
the hash generated by cargo after your executable name.

Once the version of kcov available with `apt` is updated, this configuration will become:

```yaml
language: rust
rust:
  - 1.9.0

addons:
  apt:
    packages:
      - kcov

after_success: |
  kcov --exclude-pattern=/.cargo,/usr/lib --verify target/cov target/debug/<executable name>-* &&
  bash <(curl -s https://codecov.io/bash) &&
  echo "Uploaded code coverage"
```

### Step-by-step Explanation

Let's go through each section of the configuration.

```yaml
language: rust
```

Tells Travis CI that this is a Rust project. Travis CI has a
[default rust-specific configuration][travis-ci-default-rust-config] that
gets loaded when you use this option.

```yaml
rust:
  - 1.9.0
```

Update this with the versions of Rust you plan to support.

```yaml
addons:
  apt:
    packages:
      - libcurl4-openssl-dev
      - libelf-dev
      - libdw-dev
      - cmake
      - gcc
      - binutils-dev
```

Installs the necessary dependencies for compiling kcov.

```yaml
after_success: |
  wget https://github.com/SimonKagstrom/kcov/archive/master.tar.gz &&
  tar xzf master.tar.gz &&
  cd kcov-master &&
  mkdir build &&
  cd build &&
  cmake .. &&
  make &&
  sudo make install &&
  cd ../.. &&
  rm -rf kcov-master &&
  kcov --exclude-pattern=/.cargo,/usr/lib --verify target/cov target/debug/<executable name>-* &&
  bash <(curl -s https://codecov.io/bash) &&
  echo "Uploaded code coverage"
```

This is the largest step in the Travis configuration. It essentially
just follows the exact steps outlined above for manually building kcov.

Let's break this down even further:

```bash
  wget https://github.com/SimonKagstrom/kcov/archive/master.tar.gz &&
  tar xzf master.tar.gz &&
  cd kcov-master &&
  mkdir build &&
  cd build &&
  cmake .. &&
  make &&
  sudo make install &&
```

These are all the manual compilation steps.

```bash
  cd ../.. &&
  rm -rf kcov-master &&
```

This removes the kcov-master folder so that it is not accidentally picked
up when coverage is uploaded to Codecov.

```bash
  kcov --exclude-pattern=/.cargo,/usr/lib --verify target/cov target/debug/<executable name>-* &&
```

This runs kcov with the first executable found with the
`<executable name>-*` pattern. The `-*` will match the hash that cargo
automatically appends to executable names.

If you have multiple test executables with the same name but a different
hash, you can replace the kcov command with this bash for loop to avoid
any conflicts:

```bash
  for file in target/debug/<executable name>-*; do mkdir -p "target/cov/$(basename $file)"; kcov --exclude-pattern=/.cargo,/usr/lib --verify "target/cov/$(basename $file)" "$file"; done &&
```

This will make a folder for each set of results before running the tests.
Using this will not impact Codecov because it will automatically find all
coverage results regardless of the folder structure.

You only need to use this loop if your `<executable name>-*` pattern matches
more than one executable. Without it, only some of your test results will be
reflected in the kcov report.

```bash
  bash <(curl -s https://codecov.io/bash) &&
```

This line uploads the coverage to Codecov and is explained in more
detail below. Make sure you **remove** this line if you do not plan to use Codecov.

### Caveats of this setup

* Tests run twice, once during the build and once after success to collect
    coverage. You can customize this behaviour by refining the Travis CI
    configuration [`script` option][travis-ci-script].

* kcov is recompiled during every build. This adds some time to every build.
    This can potentially be improved using Travis CI's
    [caching feature][travis-ci-caching]. Cache the kcov executable
    to avoid repeating this step in every build.

A future version of this guide may resolve these issues.

## Codecov Integration

Integrating Codecov with Travis CI requires that you add a single bash
command to the `after_success:` section of your configuration.

```bash
  bash <(curl -s https://codecov.io/bash)
```

In the configuration above, this is included after building and running
kcov. **You do not need to add this line again if you are using the
Travis CI configuration above.**

***Update (July 29, 2016):** As pointed out in [#1][website#1], there is a
script called [travis-cargo][travis-cargo] that handles Travis and
Coveralls integration for you. Using Codecov with the configuration provided
by the travis-cargo documentation should be exactly the same. Just add
the line above to the `after_success:` section provided in their example
configuration.*

This loads and runs a script that automatically finds and uploads coverage
data to Codecov from a Travis CI machine. Only the `cobertura.xml` files
that kcov generates should be uploaded.

The source code of the script is [available on GitHub][codecov-uploader-src]
and you can see which files it is uploading in the build output.

Example Travis CI output, for the [lion project][lion-uploaded-coverage]:

```
==> Travis CI detected.
    project root: .
==> Running gcov disable via -X gcov
    -> Running gcov in .
==> Searching for coverage reports under:
    +  .
    -> Found 2 reports
==> Python coveragepy not found
==> Detecting git/mercurial file structure
==> Reading reports
    + ./target/cov/lion-d992d5a006a939c3/lion-d992d5a006a939c3/cobertura.xml bytes=63276
    + ./target/cov/lion-ffbc62e55890c961/lion-ffbc62e55890c961/cobertura.xml bytes=608
==> Uploading reports
    url: https://codecov.io
    query: branch=master&commit=b6e5d84873cc5702080470f5a2546edd4da247ea&build=41.1&build_url=&tag=&slug=sunjay/lion&yaml=&service=travis&flags=&pr=false&job=143150794
    -> Pinging Codecov
    -> to S3 https://codecov.s3.amazonaws.com
    -> View reports at http://codecov.io/github/sunjay/lion/commit/b6e5d84873cc5702080470f5a2546edd4da247ea
Uploaded code coverage
```

## Coveralls Integration

Coveralls integration is built in to kcov. To upload your coverage to
Coveralls, add the `--coveralls-id` to your kcov command.

For Travis CI, you can update the kcov command to be:

```bash
kcov --coveralls-id=$TRAVIS_JOB_ID --exclude-pattern=/.cargo,/usr/lib --verify target/cov target/debug/<executable name>
```

I don't use Coveralls myself, so if this integration does not work for you
please open a [new issue][website-issues] or [contact][contact] me and I will
look into what is going on.

Make sure you delete the Codecov specific line if you are using the
Travis CI configuration above with Coveralls. See the *Codecov Integration*
section for more details about which part is Codecov specific.

## Wrapping Up

You should now have the necessary tools and knowledge to:

* Generate code coverage for your Rust project locally
* Integrate code coverage into your Travis configuration
* Upload code coverage data to either Codecov or Coveralls

For questions about or problems with Rust code coverage, use the
[Rust IRC channels][rust-irc], StackOverflow or [contact][contact] me.
If you find a problem with this guide, please open a
[new issue][website-issues].

[old-tutorial]: https://users.rust-lang.org/t/tutorial-how-to-collect-test-coverages-for-rust-project/650
[contact]: /contact
[rust-irc]: https://www.rust-lang.org/community.html#irc-channels
[rust-testing]: https://doc.rust-lang.org/book/testing.html
[website-source]: https://github.com/sunjay/sunjay.github.io
[website-issues]: https://github.com/sunjay/sunjay.github.io/issues
[codecov]: https://codecov.io/
[codecov-rust-pr]: https://github.com/codecov/example-rust/pull/1
[codecov-example-rust]: https://github.com/codecov/example-rust
[coveralls]: https://coveralls.io/
[kcov-inaccurate]: http://stackoverflow.com/questions/32521800/why-does-kcov-calculate-incorrect-code-coverage-statistics-for-rust-programs
[kcov-additional-deps]: https://github.com/SimonKagstrom/kcov/commit/fd52edb836467e768eb6cd7567f0e38e14a62f18
[kcov-uncommon-options]: https://github.com/SimonKagstrom/kcov/blob/34cb463aa974f45a9744cc4dbe3861a440b9ccd8/src/configuration.cc#L607
[travis-ci]: https://travis-ci.org/
[travis-ci-caching]: https://docs.travis-ci.com/user/caching/#Caching-directories-(Bundler%2C-dependencies)
[travis-ci-script]: https://docs.travis-ci.com/user/customizing-the-build/#Customizing-the-Build-Step
[travis-ci-default-rust-config]: https://docs.travis-ci.com/user/languages/rust#Default-test-script
[travis-ci-tutorial]: https://docs.travis-ci.com/user/getting-started/#To-get-started-with-Travis-CI%3A
[lion-files-coverage]: /assets/posts/rust-code-coverage/lion-file-coverage.png
[lion-line-coverage]: /assets/posts/rust-code-coverage/lion-line-coverage.png
[lion-github]: https://github.com/sunjay/lion
[lion-codecov]: https://codecov.io/gh/sunjay/lion
[lion-uploaded-coverage]: https://travis-ci.org/sunjay/lion/builds/143150785#L689
[codecov-uploader-src]: https://github.com/codecov/codecov-bash
[website#1]: https://github.com/sunjay/sunjay.github.io/issues/1
[travis-cargo]: https://github.com/huonw/travis-cargo


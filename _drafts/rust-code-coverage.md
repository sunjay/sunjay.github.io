---
layout: post
title: "Rust Code Coverage Guide: kcov + Travis CI + Codecov / Coveralls"
author: sunjay
categories:
  - Programming
---

**Last Updated:** TODO

The de facto [code coverage tutorial for Rust][old-tutorial]{: rel="nofollow" target="_blank"} was published
on March 15, 2015. If you Google "rust code coverage" you will largely find
links to that tutorial. It is a great guide and covers much of what you
need to know to generate code coverage data for your project.

In this post, I will be going into greater depth about Rust code coverage,
how to set it up on your local machine as well as detailed instructions
about integrating it with Travis CI, [Coveralls][coveralls] and [Codecov][codecov].

If you have any questions or comments regarding this article, please use my [Contact][contact] form to get in touch with me.<br />
A faster way to get help is to use the [Rust IRC channels][rust-irc].<br />
This website is [open-source][website-source] so if you find a problem with this article, please open an [Issue][website-issues] and I will address it as quickly as possible.
{: .alert}

I recently [helped][codecov-rust-pr] the [Codecov][codecov] team fully
integrate Rust by writing their [Rust example][codecov-example-rust].
With that, you have detailed instructions for sending your coverage data to [Codecov][codecov].
This guide is a much more detailed version of that example.

I will also talk about integrating into [Coveralls][coveralls] for anyone using
that service instead of Codecov.

## Caveats

This tutorial will likely only work for x86 and x86_64 Linux.
This is usually enough for Travis CI integration but you may
need some extra steps to get it working locally.

The tool being used, `kcov`, is not Rust-specific. It uses DWARF debugging information
in your generated executable to determine which lines have been covered.
[kcov does not always generate the most accurate coverage information][kcov-inaccurate].

As of writing this guide, there is no way to generate code coverage data for Rust doctests.
This is because the doctest executable is only generated temporarily while it is being run.
If you find a way to collect coverage for doctests, please open an [Issue][website-issues] and
let me know.

You need to use a very recent version for kcov in order to get it to work with Rust executables.
That means that the version of kcov that comes with most package managers will not be enough.
I will cover building kcov from source in this guide.

## Manually Compiling kcov

To begin, install `kcov`'s dependencies.

```bash
sudo apt-get install libcurl4-openssl-dev libelf-dev libdw-dev cmake gcc binutils-dev libiberty-dev
```

This will be different on systems without `apt` or `apt-get`.

In the [original Rust code coverage tutorial][old-tutorial]{: rel="nofollow" target="_blank"},
only `libcurl4-openssl-dev libelf-dev libdw-dev cmake gcc` were required.
[Shortly afterwards][kcov-additional-deps], `kcov` added `binutils` and `libiberty`.

If you do not install those last two, you will not be able to run `kcov` with the
`--verify` option as shown below.

To compile `kcov`, run the following commands:

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

To make `kcov` install in a different location, run `cmake` like this:

```bash
cmake -DCMAKE_INSTALL_PREFIX:PATH=/usr ..
```

To avoid running `make install`, copy both `kcov` and the generated `*.so`
files from the `build/src` directory. The shared objects are necessary for
working with Rust executables.

## Collecting Coverage Data
`kcov` runs your test executables and then outputs a report showing
which lines were covered and which lines were not.

To collect coverage data, first generate your test executable without running it:

```bash
cargo test --no-run
```

The compiled binaries are placed in `target/debug`. Cargo may create multiple
test executables if you have multiple binaries.

**IMPORTANT:** If collecting coverage for multiple test executables, run `kcov`
once for **each** executable and store the coverage **separately**. Codecov will
automatically find and merge all of your coverage data automatically. If you do
not do this, you will find that some of the lines that run in one executable are
not shown in the coverage output for the other executable.

Run `kcov` with the following command:

```bash
kcov --exclude-pattern=/.cargo,/usr/lib --verify target/cov target/debug/<executable name>
```

You know it worked if you get the same output you see when you run your tests with `cargo test`.
You can see your coverage data in `target/cov`. Change that path in the command above to output
coverage somewhere else.

The path `/usr/lib` is included so that shared libraries you may be using are not included. You
may not always need this. You can exclude any path you don't want showing up in your coverage data
by adding to the comma separated list in the `--exclude-pattern` option.

The `--verify` option is used by kcov to "verify breakpoint setup (to catch compiler bugs)"
(see [kcov --uncommon-options][kcov-uncommon-options].

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

It means the libraries used to compile `kcov` are out of date. Recompiling `kcov` using the instructions above should solve the
problem. This happened to me when I updated my version of Linux Mint.

## Coverage Data

Each time you run `kcov`, it will generate a coverage report for your executable
and place it in the `target/cov/<executable name>/` directory. If you run `kcov`
multiple times, it will merge the coverage data into a single report and place that
in a special `kcov-merged` directory.

Codecov uses the `cobertura.xml` file found in `kcov-merged`. If you only have
one executable, it will find its coverage in its test executable directory
and use that automatically.

For multiple test executables:

```bash
find . -name "cobertura.xml"
./target/cov/<test executable 1>/cobertura.xml
./target/cov/<test executable 2>/cobertura.xml
./target/cov/kcov-merged/cobertura.xml
```

For any other coverage provider, it is likely that these are the files you will
need to upload.

Outline:

- contributed to [Codecov][codecov] to integrate Rust code coverage from kcov
- A few things you should know before we begin:
    - This tutorial will likely only work for x86 and x86_64 Linux
        - this is enough for running on things like Travis, but you may need to take extra steps if you want to run code coverage locally
    - kcov not a Rust-specific code coverage tool, it uses DWARF debugging
      information to figure out which lines have run
    - kcov does not always generate entirely accurate code coverage: http://stackoverflow.com/questions/32521800/why-does-kcov-calculate-incorrect-code-coverage-statistics-for-rust-programs
    - As of writing this guide, there is no way to generate code coverage data for Rust doctests. The executable is only created temporarily while it is being run. If you find a way to collect doctest coverage, please open an [Issue][website-issues] and let me know.
- Old versions of kcov, including most packaged versions will not work with
  a Rust executable.
- We need to compile it manually
- (Detailed kcov compilation instructions)
- You can see an HTML coverage report by opening `foo/bar/index.html`
- The `--verify` flag does BLAH and without it you may get FOO error message
- Travis CI instructions
    - These instructions are specific to Travis CI, but should be ubiquitous enough to translate to any CI provider
    - To integrate with Travis CI, we essentially need to take the above instructions and translate them into a Travis CI configuration
    - Some caveats: since Travis CI trashes all files between builds, it is useful to use the Travis CI cache option to significantly speed up the build
    - Tests run twice, once in the build and once for coverage -- this can be fixed
- Integrating Codecov is as easy as running the codecov.io bash script at the end of your build after success: (example + full Travis CI)
    - It is important to run each test executable individually
    - You should tweak this if necessary based on your current setup
    - This should work out-of-the-box for most projects setup with cargo
    - This will upload the cobertura.xml files generated by kcov automatically
- Coveralls integration is built in to kcov
    - Show how to use the coveralls id option (or whatever it is called) with kcov
- If you have any questions, please don't hesitate to contact me (link to contact) or create an issue (link to website issues) for any problems or typos in this article


[old-tutorial]: https://users.rust-lang.org/t/tutorial-how-to-collect-test-coverages-for-rust-project/650
[contact]: /contact
[rust-irc]: https://www.rust-lang.org/community.html#irc-channels
[website-source]: https://github.com/sunjay/sunjay.github.io
[website-issues]: https://github.com/sunjay/sunjay.github.io/issues
[codecov]: https://codecov.io/
[codecov-rust-pr]: https://github.com/codecov/example-rust/pull/1
[codecov-example-rust]: https://github.com/codecov/example-rust
[coveralls]: https://coveralls.io/
[kcov-inaccurate]: http://stackoverflow.com/questions/32521800/why-does-kcov-calculate-incorrect-code-coverage-statistics-for-rust-programs
[kcov-additional-deps]: https://github.com/SimonKagstrom/kcov/commit/fd52edb836467e768eb6cd7567f0e38e14a62f18
[kcov-uncommon-options]: https://github.com/SimonKagstrom/kcov/blob/34cb463aa974f45a9744cc4dbe3861a440b9ccd8/src/configuration.cc#L607


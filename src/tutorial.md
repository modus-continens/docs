# Tutorial

## Installation

You can install Modus from crates.io:

```
cargo install modus
```

Currently, Modus is only available on Linux, and only officially supports x86_64[^x86_why].

<!-- TODO: release this crate -->

You can also build Modus from source by cloning [the repository](https://github.com/modus-continens/modus) and running `cargo build`.

## Your First Modusfile

Modusfiles are our version of Dockerfiles. They are a collection of rules that specify how to build images. We now demostrate how to use Modus to build a simple rust application.

```Modusfile
my_app(profile) :-
  (
    from("rust:alpine")::set_workdir("/usr/src/app"), # FROM rust:alpine; WORKDIR /usr/src/app
    copy(".", "."), # COPY . .
    cargo_build(profile), # calling into another predicate
  )::set_entrypoint(f"./target/${profile}/my_app"). # ENTRYPOINT ["./target/release/my_app"]

cargo_build("debug") :- run("cargo build"). # RUN cargo build
cargo_build("release") :- run("cargo build --release"). # RUN cargo build --release
```

Assuming that you are familiar with Dockerfiles, the meaning of the above Modusfile should be mostly easy to guess. In particular:

* The syntax is an extension of [Datalog](https://en.wikipedia.org/wiki/Datalog) (which is itself a subset of Prolog), but you do not need to know either of those languages to write your own Modusfile.

* Line-comments starts with `#`. In the above case, the equivalent instructions in Dockerfile have been written out for clarity using comments.

* Modusfile consists of a series of rules of the form `HEAD :- BODY.`, where `HEAD` is a single literal, and `BODY` is an expression involving other literals.

* A literal has the form `foo(arg1, arg2, ...)` where `foo` is the name of the predicate, and `arg1`, `arg2`, etc. are arguments. Examples of literals in the above file are `my_app("debug")`, `from("rust")`. Literals can also have no parameters, in which case you omit the parenthesis, like `my_app`.

* Expression uses `,` to denote logical "and", and `;` to denote logical "or". Expressions can be nested with `()`, and can also have "`::`" operators that may change the behaviour of the modified expression in some way. A later section will discuss logic in Modus in more detail, but for now just think of `a, b` as "do `a` then `b`", and think of `a; b` as "do either of `a` or `b`, whichever works".

Note that instead of writing `run("cargo build")` directly in `my_app`, we used a custom rule `cargo_build`, which we defined later, and, when defining `cargo_build`, we have separate definition for when the argument is `dev` and when it is `release`. To make this clearer, consider the line

```Modusfile
cargo_build("debug") :- run("cargo build").
```

What this means is that `run("cargo build")` logically implies `cargo_build("debug")`. Given this definition, whenever Modus sees `cargo_build("debug")`, Modus replaces it with `run("cargo build")`.

The `set_workdir` operator takes in a path, and sets the working directory of its image operand. This changes subsequent resolution of relative paths, such as in the destination argument of `copy`. `set_entrypoint` simply overrides the entrypoint of an image.

To build a Modusfile, you just need to use the "`modus build`" command. The usage is fairly similar to `docker build`:

```
modus build [-f <Modusfile>] <CONTEXT> <QUERY>
```

`CONTEXT` is a directory containing any source file that you want to make available to Docker, just like the context directory in `docker build`. `QUERY` is a literal denoting what you want to build. You can use "`-f <Modusfile>`" to specify the Modusfile to build, and the default is `Modusfile` in the context directory.

In our case, we can use `my_app("debug")` as our query in order to build a debug image. However, we can also specify unbounded variables in our query. If we simply use `my_app(X)` as our query, **Modus will build two images in parallel** for us, one being the debug image and the other being the release image. You can think of it as saying "For all X, as long as `my_app(X)` generates a valid image, build it". You can also go a step further and add parameters to select the rust channel, base distributions, etc. You can't specify a default for these parameters, but you can define versions of `my_app` that takes different numbers (including zero) of parameters, to simulate having a default. For example, by adding:

```Modusfile
my_app :- my_app("release").
```

The query `my_app` will now build the release version, while you can still use `my_app("debug")` to build the debug version.

The attentive reader will have noticed that our Modusfile builds both a debug and a release image. Consider how you would do this with Dockerfiles &mdash; you would either need two separate Dockerfiles, each building one version, or do something with build arguments. It may not be a problem if you only have debug and release images, but it quickly become hard to manage, especially if you need to take separate steps depending on some arguments.

## Intermediate Build Stages

For our next step, we want to reduce the size of the final image by building the rust code in a separate stage, then starting a new image and copying the binary inside. This can be easily implemented in Modusfile as well. We will just need to add the following lines to our existing Modusfile, and use `trimmed_app` as our query instead:

```Modusfile
trimmed_app(profile) :-
  (
    from("alpine"),
    my_app(profile)::copy(f"target/${profile}/my_app", ".")
  )::set_entrypoint("./my_app").
```

`image::copy(source, destination)` is an operator that allows you to copy files from another image to the current one. The `image` here can actually be any expression generating an image, so you could also "inline" `my_app` and write something like:

```Modusfile
trimmed_app(profile) :-
  (
    from("alpine"),
    (
      from("rust:alpine")::set_workdir("/usr/src/app"),
      copy(".", "."),
      cargo_build(profile)
    )::copy(f"target/${profile}/my_app", ".")
  )::set_entrypoint("./my_app").
```

Note that both `source` and `destination` can be relative paths. They will all be resolved sensibly based on respective the working directory.

## Logics in Modus

Not all predicates has to be about building. Since Modus is based on a logic programming language, it goes without saying that you can write more complicated Modusfile, which can do things like figure out which version of compiler to use depeneding on constraints on parameters, or take additional steps for debug builds, etc. Here is a quick rundown of some Modus patterns:

* Defining multiple rules for the same predicate with different parameters. We have already seen how this lets us "select" what cargo command to run.
* Creating a dictionary by defining a set of constant rules for a predicate. For example:

```Modusfile
target_cc_flags("debug", "-Og -fsanitize=address,undefined").
target_cc_flags("release", "-O3").
target_cc_flags("fuzz", "-Og -fsanitize=fuzzer,address,undefined -DFUZZING=1").

my_app(target) :-
  ...,
  target_cc_flags(target, flags),
  run(f"make CFLAGS='${flags}' CXXFLAGS='${flags}'"),
  ....
```

Note that rules with no body can be written as `HEAD.`, and is always true.

* Defining a predicate that "restricts" the set of input. This is necessary to make unbounded variables work. For example:

```Modusfile
rust_channel(channel) :-
  channel = "stable"; channel = "nightly"; channel = "beta".

# or

rust_channel("stable").
rust_channel("nightly").
rust_channel("beta").

my_app(channel) :-
  from("rust:alpine"),
  rust_channel(channel),
  run(f"rustup run ${channel} cargo build").
```

Without `rust_channel(channel)`, the query `my_app(X)` would fail, because it is not possible to build an infinite set of images. With the predicate to limit the values of `X`, a query like `my_app(X)` will build 3 images, each with a different version of rust.

## Where to go from here&hellip;

Now that you have learned the basics of Modus, you can go ahead and read the rest of the documentation, which dive deeper into how everything works exactly (groundness, predicate kinds, etc), as well as other built-in predicates and operators like `number_{gt,lt,eq,geq,leq}`, string parsing and manipulation, operators to set environment variables, temproarily changing the working directory with `in_workdir`, squashing image layers with `::merge`, etc.

[^x86_why]: As part of the buildkit integration Modus will fetch pre-built images from Docker Hub, and we currently only build images for x86_64. Supports for other architectures will be added in the future.

# Tutorial

## Installation

You can install Modus from crates.io:

```
cargo install modus
```

Currently Modus is only available on Linux, and only officially support x86_64[^x86_why].

<!-- TODO: release this crate -->

You can also build Modus from source by cloning [the repository](https://github.com/modus-continens/modus) and running `cargo build`.

## Your first Modusfile

Modusfiles are our version of Dockerfiles. They are a collection of rules that determine how images are built. The syntax is an extension of [Datalog](https://en.wikipedia.org/wiki/Datalog) (which is itself a subset of Prolog), but you do not need to know either of those languages to write your own Modusfile.

For this tutorial, we will demostrate how to use Modus to build a rust web application. We have one slightly uncommon requirement though: **we need to build separate debug and release images**. This could be useful for a number of pratical reasons, but consider how you would do this with Dockerfiles: you would either need two separate Dockerfiles, each building one version, or do something with build arguments. It may not be a problem if you only have debug and release images, but it quickly become hard to manage, especially if you need to take separate steps depending on some arguments.

To do the same with Modus, you would probably start with the following Modusfile:

```Modusfile
my_app(profile) :-
  (
    from("rust")::set_workdir("/usr/src/app"), # FROM rust; WORKDIR /usr/src/app
    copy(".", "."), # COPY . .
    cargo_build(profile), # calling into another predicate
  )::set_entrypoint(f"target/${profile}/my_app"). # ENTRYPOINT ["$PWD/target/release/my_app"]

cargo_build("debug") :- run("cargo build"). # RUN cargo build
cargo_build("release") :- run("cargo build --release"). # RUN cargo build --release
```

Assuming that you are familiar with Dockerfiles, the meaning of the above Modusfile should be mostly easy to guess. In Modusfile line-comments starts with `#`. In the above case, the equivalent instructions in Dockerfile have been written out for clarity.

You may notice that, instead of writing `run("cargo build")` directly in `my_app`, we used a predicate `cargo_build` which we defined later. You can think of this almost as some sort of "subroutines". Note that when defining `cargo_build`, we have separate definition for when the argument is `dev` and when it is `release`.

Also note the special syntax for `set_workdir` and `set_entrypoint`: they are *operators* in Modus, and in this case they both operate on images. The `set_workdir` operator takes in a path, and emits a new image with the working directory property set to the provided path. This will affect future resolution of relative paths, such as in the destination argument of `copy`. `set_entrypoint` simply overrides the entrypoint of an image. (Note that the entrypoint can currently only be an (absolute or relative) path to an executable, not a shell command.)

To build a Modusfile, you just need to use the "`modus build`" command. The usage is fairly similar to `docker build`:

```
modus build [-f <Modusfile>] <CONTEXT> <QUERY>
```

**CONTEXT** is a directory containing any source file that you want to make available to Docker, just like the context directory in `docker build`. **QUERY** is a "invocation" of the rule you want to build, expressed as a *literal*. A literal in Modus has the form `foo(arg1, arg2, ...)` where `foo` is the name of the predicate you are referring to, and `arg1`, `arg2`, etc. are arguments. Examples of literals in the above file are `my_app("debug")`, `from("rust")`, `set_entrypoint("target/release/my_app")`, etc. You can use "`-f <Modusfile>`" to specify the Modusfile to build, and the default is `Modusfile` in the context directory.

In our case, we can use `my_app("debug")` as our query in order to build a debug image. However, we can also specify unbounded variables in our query. If we simply use `my_app(X)` as our query, Modus will build **two** images in parallel for us, one being the debug image and the other being the release image. You can think of it as saying "For all X, as long as `my_app(X)` is defined, build it".

You can also go a step further and add parameters to select the rust channel, base distributions, etc.

You can't specify a default to these parameters, but you can define versions of `my_app` which takes different numbers (including zero) of parameters, to simulate having a default. For example, by adding:

```Modusfile
my_app :- my_app("release").
```

The query `my_app` will now build the release version, while you can still use `my_app("debug")` to build the debug version.

## Intermediate build stages

TODO

## Leverging parallelism

Let's say that you have taken your fancy Rust web app to the next level, and also wrote its front-end in Rust. This means that you will also need to compile your front-end code with cargo, but since you are compiling for the "wasm" target, it needs to be done separately from the compilation of the backend server - one `cargo build` isn't going to do it.

The "naive" way to do this would be to put another build step after `cargo build`, which would also build the wasm target. This certainly works, but you may be missing out on potential parallelism which can save you some precious CI time.

TODO

## Where to go from here...

[^x86_why]: As part of the buildkit integration Modus will fetch pre-built images from Docker Hub, and we currently only build images for x86_64. Supports for other architectures will be added in the future.

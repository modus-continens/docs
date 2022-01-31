# Tutorial

## Installation

Currently Modus is only available on Linux, and only officially support x86_64. This is because as part of the buildkit integration Modus will fetch pre-built images from Docker Hub.

You can install Modus from crates.io:

```
cargo install modus
```

<!-- TODO: release this crate -->

You can also build Modus from source by cloning [the repository](https://github.com/modus-continens/modus) and running `cargo build`.

## Your first Modusfile

Modusfiles are our version of Dockerfiles. They are a collection of rules that determine how images are built. The syntax is an extension of [Datalog](https://en.wikipedia.org/wiki/Datalog) (which is itself a subset of Prolog), but you do not need to know either of those languages to write your own Modusfile.

For this tutorial, we will demostrate how to use Modus to build a hypothetical rust web application. Starting with the most basic setup, the following Modusfile will build the application directly in one container.

```Modusfile
my_app :-
  (
    from("rust")::set_workdir("/usr/src/app"), # FROM rust; WORKDIR /usr/src/app
    copy(".", "."), # COPY . .
    run("cargo build --release") # RUN cargo build --release
  )::set_entrypoint("target/release/my_app"). # ENTRYPOINT ["target/release/my_app"]
```

If you are familiar with Dockerfiles, the meaning of the above Modusfile should not be too difficult to guess. In Modusfile line-comments starts with `#`. In the above case, the equivalent instructions in Dockerfile have been written out for clarity. There is only one rule - `my_app`, which builds the image. `from`, `copy` and `run` are just like their Dockefile counterparts.

However, note the special syntax for `set_workdir` and `set_entrypoint`: they are *operators* in Modus, and in this case they both operate on images. The `set_workdir` operator takes in a path, and emits a new image with the working directory property set to the provided path. This will affect future resolution of relative paths, such as in the destination argument of `copy`. `set_entrypoint` simply overrides the entrypoint of an image. (Note that the entrypoint can currently only be a path to an executable, not a shell command.)

To build a Modusfile, you just need to use the "`modus build`" command. The usage is fairly similar to `docker build`:

```
modus build [-f <Modusfile>] <CONTEXT> <QUERY>
```

`CONTEXT` is a directory containing any source file that you want to make available to Docker, just like the context directory in `docker build`. `QUERY` is a "invocation" of the rule you want to build, expressed as a *literal*. A literal in Modus has the form `foo(arg1, arg2, ...)` where `foo` is the name of the predicate you are referring to, and `arg1`, `arg2`, etc. are arguments. Examples of valid literals in the above file are `my_app`, `from("rust")`, `set_entrypoint("target/release/my_app")`, etc. You can use "`-f <Modusfile>`" to specify the Modusfile to build, and the default is `Modusfile` in the context directory.

In our case, we can use `my_app` as our query in order to build our image. For more complicated Modusfiles, you can also specify arguments that gets passed to your rules. For example, the following Modusfile allows you to specify the base image, as well as the rust toolchain channel (`stable`, `beta`, `nightly`) via build query:

```Modusfile
my_app(base_img, rust_channel) :-
  (
    from(base_img)::set_workdir("/usr/src/app"),
    run(f"rustup default ${rust_channel}"),
    copy(".", "."),
    run("cargo build --release")
  )::set_entrypoint("target/release/my_app").

my_app(rust_channel) :-
  my_app("rust", rust_channel).

my_app :- my_app("rust", "stable").
```

Any of the query below can be used to build this Modusfile:

- `my_app` will build the app with the `rust` image and the `stable` channel.
- `my_app("nightly")` will build the app with the `rust` image and the `nightly` channel.
- `my_app("rust:alpine", "stable")` will build the app with the `rust:alpine` image and the `stable` channel.

## Reducing final image size with intermediate build stages

TODO

## Leverging parallelism

Let's say that you have taken your fancy Rust web app to the next level, and also wrote its front-end in Rust. This means that you will also need to compile your front-end code with cargo, but since you are compiling for the "wasm" target, it needs to be done separately from the compilation of the backend server - one `cargo build` isn't going to do it.

The "naive" way to do this would be to put another build step after `cargo build`, which would also build the wasm target. This certainly works, but you may be missing out on potential parallelism which can save you some precious CI time.

TODO

## Non-image rules

## Multiple final images, also built in parallel

## Where to go from here...

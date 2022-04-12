# Foundations

Container images are built on top of base images by copying information from other images and intacting with the environment. Modus uses decidable logic programming to concisely capture and efficiently resolve dependencies between images and to encapluate environmental interactions with predicates and operators. This section discusses the logic programming foundations of Modus. You do not need to understand these foundations to use, and profit from, Modus.

## Design Principles

- _Maintainability_: make build definitions maintainable by enabling modularity, code reuse and dependency resolution.
- _Efficiency_: make builds efficient by automatic parallelisation and fine-grained caching; provide tools for optimising the image size.
- _Expressiveness_: enable the user to express complex build workflows.
- _Simplicity_: provide minimalistic syntax and well-defined, non-Turing-complete semantics for build definitions.

## Container Image Build Model

A [Docker/OSI container image](https://opencontainers.org/) consists of a set of layers combined using a [union mount filesystem](https://en.wikipedia.org/wiki/Union_mount). To build an image, the user specifies the parent image and defines operations that are executed on top of the parent image to form new layers. The most common operations are copying local files into the container and executing shell commands.

Another important operation which enables [multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/) is copying files from another image. A multi-stage build can be visualised as the following graph. Each instruction in this graph creates a new filesystem layer. Instructions are specified using Dockerfile's notation: `FROM` defines the parent image, `COPY` copies local files, `RUN` executes shell command, and `COPY --from` copies files from another container.

![Container Image Build Model](build_model.svg)

The key insight of Modus is that the resolution of dependencies between images in this build model maps to [Horn clauses](https://en.wikipedia.org/wiki/Horn_clause), logical formulas in the form \\( u \leftarrow (p \wedge q\ \wedge ... \wedge\ t) \\). Particularly, container images correspond to logical facts, build rules are logical rules that derive new facts from existing facts, and the build graph is a minimal proof of the fact representing the build target from the facts representing existing images.

Consider the following recursive build script:

```Modusfile
a(mode) :-
    (
        mode = "production",
        from("alpine"),
        a("development")::copy("/app", "/app")
    ;
        mode = "development",
        from("gcc"),
        copy(".", "/app"),
        run("cd /app && make")
    )::set_workdir("/app").
```

For the goal `a(X)`, where `X` is a variable, Modus computes the following build trees:

```
a("production")
╞══ from("alpine")
└── a("development")::copy("/app", "/app")
    ╞══ from("gcc")
    ├── copy(".", "/app")
    └── run("cd /app && make")
a("development")
╞══ from("gcc")
├── copy(".", "/app")
└── run("cd /app && make")
```

The subtree `a("development")` of the two trees is shared; it is only built once.

## Datalog

Datalog is a decidable fragment of Horn clauses. A good overview of Datalog is given in the following article:

_[What You Always Wanted to Know About Datalog (And Never Dared to Ask)](https://ieeexplore.ieee.org/document/43410)_<br>
Stefano Ceri, Georg Gottlob, Letizia Tanca<br>
IEEE TKDE 1989

Modus uses Datalog because it is:

- declarative, the success of solving does not depend on the ordering of clauses;
- expressive;
- decidable, so it can always generate a minimal proof.

Thus, Datalog presents a sweet spot between expressiveness and computatibility, which is important for a build system. Standard Datalog, despite its suitability for addressing their core dependency resolution problem, does not capture a container build environmental dependencies. To solve this problem, Modus extends Datalog with build-specific predicates and build parameters via ungrounded variables. Modus supports two Datalog extensions, namely builtin predicates described in [Predicates](./library/predicates/) and non-grounded variables. To realise these extensions, Modus uses a custom top-down Datalog solver for generating proofs.

### Builtin Predicates

Dependency resolution is only part of the story. Container builds must also interact with the environment. Predicates elegantly capture these interactions. We have equipped Modus with a library of built-in predicates to handle these interactions. For example, the `semver_*` predicates define software version comparison as per the [SemVer](https://semver.org/) specification.  For example, the following fact is true: `semver_lt("1.0.3","1.1.0")`, where `lt` means `<`.

The key difficulty of adding built-in predicates to Datalog is that built-in predicates such as `semver_lt` are infinite relations, which require special handling to retain Datalog's decidability. We support built-in predicates by deferring the evaluation of a built-in predicate until the arguments of this predicate are bound to constants.

Since not all arguments of a predicate have to be bound to a constant during evaluation, e.g. if an argument depends on the other arguments, builtin predicates in Modus have Prolog-like signatures that specify which parameters have to be initialised (see [Predicates](./library/predicates/index.html)). <!-- FIXME: https://github.com/rust-lang/mdBook/issues/984 -->

### Non-Grounded Variables

Build systems often use parameters that are passed by the user when they launch a build. Dockerfiles allow users to specify arbitrary parameters when launching a target's build using the `--build-arg` option. For example, a user may want to parameretise `app`'s image build with the parameter `cflags` to control complation flags:

```Modusfile
app(cflags) :-
  from("gcc:latest"),
  copy(".", "."),
  run(f"gcc ${cflags} test.c -o test").
```

In this rule, the variable `cflags` is not _grounded_, as it only appears as an argument of a built-in predicate `run` that expects an instantiated variable. Thus, this is an invalid Datalog program, since it violates standard Datalog's safety conditions that do not permit non-grounded variables. A workaround of this problem is to define possible compilation flags using a dedicated predicate:

```Modusfile
supported_flags("-g").
supported_flags("").

a(cflags) :-
    supported_flags(cflags),
    from("gcc:latest"),
    copy(".", "."),
    run(f"gcc ${cflags} test.c -o test").
```

However, GCC accepts a large number of flags, so it would impractical to list all accepted flags in the Modus program. Instead, it would be natural to allow users to use this program to build the goal `app("-g")`, since the argument of `run` can then be inferred from the goal.

To enable such usage scenarios, we relaxed the safety conditions by allowing user-defined predicates with non-grounded variables. At the same time, we introduced the new restriction that, during evaluation, we defer the evaluation of these predicates until all of their arguments are bound to constants. Doing so enabled us to support the usage scenario above without sacrificing Datalog's safety.

For user-defined predicates, variables which do not appear in the body have to be initialised before the rule can be applied. For example, for the script:

```Modusfile
a(X) :-
  from("alpine"),
  run("echo Hello").
```

A goal like `a("foo")`, where `"foo"` is a arbitrary string constant, would build the same image, but the query `a(X)` is not allowed. This ensures that each resulting image is mapped to a constant literal like `a("foo")`.


### Proof Optimality

A Datalog fact can be inferred from other facts in multiple ways and therefore multiple proof trees may exists. Thus, an image defined in Modus may also be built using different build DAGs. Modus searches for an optimal proof, that is a proof with a minimal cost. The cost of a proof is the number of layers in the build DAG.

To illustrate proof optimality, consider again this build script:

```Modusfile
a(mode) :-
    (
        mode = "production",
        from("alpine"),
        a("development")::copy("/app", "/app")
    ;
        mode = "development",
        from("gcc"),
        copy(".", "/app"),
        run("cd /app && make")
    )::set_workdir("/app").
```

For the goal `a("production")`, Modus will compute the following build trees:

```
a("production")
╞══ from("alpine")
└── a("development")::copy("/app", "/app")
    ╞══ from("gcc")
    ├── copy(".", "/app")
    └── run("cd /app && make")
```

However, if we add a new rule that uses a cached development image from a registry

```Modusfile
a("development") :- from("myregistry.domain.com/app:1.1-dev").
```

then the result of the goal `a("production")` will become

```
a("production")
╞══ from("alpine")
└── a("development")::copy("/app", "/app")
    ╘══ from("myregistry.domain.com/app:1.1-dev")
```

because this tree involves fewer layer operations than the original one.

There may be situations when several minimal proofs of the same cost exist. In this case, Modus chooses one non-deterministically. Specifically, for a given program and a goal, Modus will always choose the same proof, but reordering rules may cause Modus to generate a different proof. To avoid non-determinism, it is recommend to avoid rules with uncontrolled choice:

```Modusfile
a :- b; c.
```

Instead, this rule can be re-written with an auxiliary variable to control the choice:

```Modusfile
a("left") :- b.
a("right") :- c.
```

Modus produces a warning when the build graph construction is non-deterministic.

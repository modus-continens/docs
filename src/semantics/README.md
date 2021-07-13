# Semantics

Given a build script and a query, Modus performs two operations:

1. computes the minimal build [directed acyclic graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph) (DAG) using a Datalog solver;
2. executes the build in parallel using [BuildKit](https://github.com/moby/buildkit).

## Build DAG Construction

The DAG is computed using a Datalog solver. Specifically, the build DAG is the minimal proof of the target fact from existing facts representing base images.

Consider the following recursive build script:

```
a(mode) :- (
        mode = "production", from("alpine"), a("development")::copy("/app", "/app");
        mode = "development", from("gcc"), copy(".", "/app"), run("cd /app && make")
    )::workdir("/app").
```

For the query `a(X)`, where `X` is a variable, Modus will compute the following build trees:

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

This is a DAG, because the subtree `a("development")` of the two trees is shared; it will only be built once.

The minimality of the DAG is essential. For example, if we add a new rule that uses a cached development image from a registry

```
a("development") :- from("myregistry.domain.com/app:1.1-dev")
```

Then, the result of the query `a("production")` will become

```
a("production")
╞══ from("alpine")
└── a("development")::copy("/app", "/app")
    ╘══ from("myregistry.domain.com/app:1.1-dev")
```

because it involves fewer layer operations.

Particularities of logical inference are described in [Logic](./logic.md).

## Build Execution

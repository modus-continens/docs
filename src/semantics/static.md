# Static

Modus represents build rules as [Horn clauses](https://en.wikipedia.org/wiki/Horn_clause), logical formulas in the form \\( u \leftarrow (p \wedge q\ \wedge ... \wedge\ t) \\). Container images correspond to logical facts; build rules are logical rules that derive new facts from existing facts. To build an image or a set of images, the user specifies a query, which is an image expression (see [Predicate Kinds](../syntax.md#predicate-kinds)).

For a given build script (a sequence of rules and facts) and a query, the static semantics is the optimal proof of the query from the given facts using the given rules.

Consider the following recursive build script:

```
a(mode) :- (
        mode = "production", from("alpine"), a("development")::copy("/app", "/app");
        mode = "development", from("gcc"), copy(".", "/app"), run("cd /app && make")
    )::set_workdir("/app").
```

For the query `a(X)`, where `X` is a variable, Modus computes the following build trees:

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

Datalog is a specific kind of Horn clauses with specific semantics. To use Modus, the knowledge of Datalog is not required. Hovewer, to understand the semantics of Modus precisely, it is recommended to consult the following article:

_What You Always Wanted to Know About Datalog (And Never Dared to Ask)_<br>
Stefano Ceri, Georg Gottlob, Letizia Tanca<br>
IEEE TKDE 1989

Modus uses Datalog for several reasons:

- Datalog is declarative, the success of solving does not depend on the ordering of clauses;
- Datalog is expressive;
- in Datalog, the generation of minimal proofs is decidable.

Note that there is no fundamental connection between Datalog's expressive power and container builds. In fact, the expressiveness of the standard Datalog is not sufficient to conveniently express some natural build scenarios. For this reason, Modus supports two extensions, namely builtin predicates described in [Predicates](/library/predicates/README.md) and non-grounded variables. To realise these extensions, Modus uses a custom top-down Datalog solver for generating proofs.

### Non-Grounded Variables

Modus extends Datalog with non-grounded variables. To illustrate this extension, consider the following build script:

```
a(cflags) :-
    from("gcc:latest"),
    copy(".", "."),
    run(f"gcc ${clags} test.c -o test").
```

If the user specifies the query `a("-g")`, then Modus will build an image with a binary compiled with debug symbols. Hovewer, for the query `a(X)`, Modus will return an error, because the compilation flags `cflags` cannot be inferred from build definitions. This problem can be solved by, for example, adding possible compilation flags using a dedicated predicate:

```
supported_flags("-g").
supported_flags("").

a(cflags) :-
    supported_flags(cflags),
    from("gcc:latest"),
    copy(".", "."),
    run(f"gcc ${clags} test.c -o test").
```

For the later script, the query `a(X)` will results in two images: `a("-g")` and `a("")`.

In the standard Datalog, only the second variant is possible, because all variables have to be grounded (variables apearing in the head of a rule should also appear in the body, not in builtin predicates). Hovewer, specifying all possible values of all parameters is inconvenient. For this reason, Modus supports non-grounded variables. Specifically, it will make the best effort to initialise each variable in the rule before returning an error.

Builtin predicates in Modus has Prolog-like signatures that specify which parameters have to be initialised (see [Predicates](../library/predicates/README.md)).


### Proof Optimality

Modus searches for the optimal proof, that is the proof with minimal cost. The cost of a proof is the number of layers in the build DAG.

To illustrate proof optimality, consider again this build script:

```
a(mode) :- (
        mode = "production", from("alpine"), a("development")::copy("/app", "/app");
        mode = "development", from("gcc"), copy(".", "/app"), run("cd /app && make")
    )::set_workdir("/app").
```

For the query `a("production")`, Modus will compute the following build trees:

```
a("production")
╞══ from("alpine")
└── a("development")::copy("/app", "/app")
    ╞══ from("gcc")
    ├── copy(".", "/app")
    └── run("cd /app && make")
```

However, if we add a new rule that uses a cached development image from a registry

```
a("development") :- from("myregistry.domain.com/app:1.1-dev").
```

then the result of the query `a("production")` will become

```
a("production")
╞══ from("alpine")
└── a("development")::copy("/app", "/app")
    ╘══ from("myregistry.domain.com/app:1.1-dev")
```

because this tree involves fewer layer operations than the original one.

There may be situations when several minimal proofs of the same cost exist. In this case, Modus chooses one in an unspecified way. Although Modus is deterministic, reordering rules may cause Modus to generate a different minimal proof. To avoid non-determinism, it is recommend to avoid rules with uncontrolled choice:

```
a :- b; c.
```

Instead, this rule can be re-written with an auxiliary variable to control the choice:

```
a(choice) :-
    choice = "left", b; 
    choice = "right", c.
```

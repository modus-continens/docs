# Semantics

Given a build script and a query, Modus performs two operations:

1. computes the build [Directed acyclic graph (DAG)](https://en.wikipedia.org/wiki/Directed_acyclic_graph) using an extended [Datalog](https://en.wikipedia.org/wiki/Datalog) solver;
2. executes the build in parallel using [BuildKit](https://github.com/moby/buildkit).

The build DAG is a graph that describes dependencies between build operations. It is a DAG, and not a set of trees, because some intermediate images can be shared and built only once. The DAG is computed by a Datalog solver as the minimal proof of the build target from true facts representing either existing images, or intrinsics like `run` which add build steps. The build DAG is constructed statically, i.e. the values of the variables do not depend on the results of build execution. Particularities of DAG construction are described in [Static](./static.md).

After the build DAG is computed, it is transformed into a [BuildKit](https://github.com/moby/buildkit) representation. Then, BuildKit executes build subtrees in parallel to construct the target images. Particularities of build execution are described in [Runtime](./runtime.md).

## Negation

Expressions can be negated, which acts as a logical check. Here are some examples of expressions using negation:
- `!(a(X), b)`
- `!(foo(X) ; bar(Y) ; !baz(X)), lit(X)`
  Note that X is constrained with all of `foo(X)`, the nested negation `baz(X)` and the 
  positive literal `lit(X)`.

A negated expression asserts that the positive expression fails to be proved, i.e. we cannot 
construct a proof tree of it.
The variables of a negated expression must be grounded (e.g. through some other literal) or must be 
an anonymous variable.

This is an example of a Modusfile using negation:
```
app(X) :-
    (
        windows(X),
        from("jturolla/failing-container")
    ;
        !windows(X),
        from(X),
        run("echo hello-world")
    ).
    
windows("...").
```

Usually, negation can be thought of as falsehood, however, there is an important distinction between proving
falsehood and *Negation as Failure* (NAF). 
If the fact `windows(c1).` is not present (for some constant `c1`), we say `!windows(c1)` succeeds.
So we are not truly _inferring_ `!windows(c1)`.

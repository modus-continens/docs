# Semantics

Given a Modusfile and a goal, Modus performs two operations:

1. computes the build [DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph) using a [Datalog](https://en.wikipedia.org/wiki/Datalog) solver;
2. executes the build in parallel using [BuildKit](https://github.com/moby/buildkit).

The build DAG is a graph that describes dependencies between build operations. The DAG is computed by a Datalog solver as a minimal proof of the build target from true facts representing either existing images, or intrinsics like `run` which add build steps. The build DAG is constructed statically, i.e. the values of the variables do not depend on the results of build execution.

After the build DAG is computed, it is transformed into a [BuildKit](https://github.com/moby/buildkit) representation. Then, BuildKit executes build subtrees in parallel to construct the target images.

## Predicate Kinds

In a literal such as `a(b, "c")`, we refer to `a` as the predicate name. There exist predicates of three and only three kinds:

- image predicates;
- layer predicates;
- logic predicates.

An _image predicate_ is one of the following:

- builtin predicate `from`;
- a predicate, in all definitions `<head> :- <body>` of which, the body is an image expression.

An _image expression_ is defined as follows:

- an image literal, which is an application of an image predicate, is an image expression;
- an application of an operator to an image expression (`<expression> "::" <operator>`) is an image expression, except for the `::copy` operator;
- `<expression1> "," <expression2>` is an image expression iff 
  - either `<expression1>` is an image expression, and `<expression2>` is not an image expression.
  - or `<expression1>` is a logic expression and `<expression2>` is an image expression.
- `<expression1> ";" <expression2>` is an image expression iff both `<expression1>` and `<expression2>` are image expressions.

In the following example, `a` is an image predicate, and `b` is not:

```
a :-
    from("ubuntu"),
    run("apt-get update").
    
b(X) :- X = "a".
```

A _layer predicate_ is one of the following:

- the builtin predicate `run`;
- the builtin predicate `copy`;
- a predicate, in all definitions `<head> :- <body>` of which, the body is a layer expression.

A _layer expression_ is defined as follows:

- a layer literal, which is an application of a layer predicate, is a layer expression;
- an application of an operator to a layer expression (`<expression> "::" <operator>`) is a layer expression;
- `<expression1> "," <expression2>` is a layer expressions iff either:
  - both `<expression1>` and `<expression2>` are layer expressions.
  - or `<expression1>` is a logic expression and `<expression2>` is a layer expression.
- `<expression1> ";" <expression2>` is a layer expression iff both `<expression1>` and `<expression2>` are layer expressions.
- an application of the operator `::copy` to an image literal is a layer expression;

In the following example, `a` is a layer predicate, and `b` is not:

```
a :- (from("ubuntu"), run("apt-get update"))::copy("/etc/hosts", ".").
    
b(X) :- X = "a".
```

A _logic predicate_ is one of the following:

- a buildin predicate, except for `from`, `run` and `copy`;
- a predicate, in all definitions `<head> :- <body>` of which, the body is a logic expression.

A _logic expression_ is defined as follows:

- a logic literal, which is an application of a logic predicate, is a logic expression;
- a unification is a logic expression;
- an application of an operator to a logic expression (`<literal> "::" <operator>`) is a logic expression.
- `<expression1> "," <expression2>` and `<expression1> ";" <expression2>` are logic expressions iff both `<expression1>` and `<expression2>` are logic expressions.
- the negation of a logic expression

In the following example, `a` and `a_prime` are logic predicates, but `b` is not:

```
a(Y) :- semver_geq(Y, "1.2.3").
a_prime(Y) :- !a(Y).
    
b(X) :- X = "a", from("ubuntu").
```

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

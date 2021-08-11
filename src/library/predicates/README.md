# Predicates

In Modus, there are three kinds of predicates: image predicates, layer predicates and logic predicates (see [Predicate Kinds](../syntax.md#predicate-kinds)). Builtin predicates have Prolog-like signatures that specify which parameters have to be initialised (see [Non-Grounded Variables](../semantics/static.md#non-grounded-variables)):

```
predicate(?Variable1, +Variable2, -Variable3)
```

where

- `?` means: This variable can be either instantiated or not. Both ways are possible.
- `+` means: This variable is an input to the predicate. As such it must be instantiated.
- `-` means: This variable is an output to the predicate. It is usually non-instantiated, but may be if you want to check for a specific "return value".

For example, `run` has the signature `run(+cmdline)`, which means that the argument has to be initialised.

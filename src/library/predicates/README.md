# Predicates

Builtin predicates have Prolog-like signatures that specify which parameters have to be initialised (see [Non-Grounded Variables](../../semantics/static.md#non-grounded-variables)):

```
predicate(?Variable1, +Variable2, -Variable3)
```

where

- `?` means: This variable can be either instantiated or not. Both ways are possible.
- `+` means: This variable is an input to the predicate. As such it must be instantiated.
- `-` means: This variable is an output to the predicate. It is usually non-instantiated, but may be if you want to check for a specific "return value".

For example, `run` has the signature `run(+cmdline)`, which means that the argument has to be initialised.

### Predicate Kinds

All predicates in Modus belong to one of the three kinds: image predicates, layer predicates and logic predicates.

[Image predicates](./image.md) create new images. Examples of such are the builtin `from`, as well as any predicates that adds further layers upon a `from`.

[Layer predicates](./layer.md) adds new layers on tops of an image, and can not itself be built. Example include `run` or `copy`.

[Logic predicates](./logic/README.md) does neither, can be used anywhere, but can not be built on its own.

The kind of a predicate determines where it can be used. For example, a rule body can not contain more than one image predicates, nor can layer predicates appear before image predicates. The kind of a user-defined predicate is inferred automatically, while the kind of a builtin predicate is documented in the [library section](../library/README.md).

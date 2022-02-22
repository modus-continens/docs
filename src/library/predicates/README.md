# Predicates

Predicate are used to encapsulate build logic. Predicates in Modus belong to one of the three kinds: image predicates, layer predicates and logic predicates. [Image predicates](./image.md) create new images, e.g. the predicate `from`, as well as any predicates that adds further layers upon a `from`. [Layer predicates](./layer.md) adds new layers on tops of an image, and can not itself be built, e.g. `run` or `copy`. [Logic predicates](./logic/README.md) does neither, can be used anywhere, but can not be built on its own. The kind of a predicate determines where it can be used. For example, a rule body can not contain more than one image predicates, nor can layer predicates appear before image predicates. The kind of a user-defined predicate is inferred automatically, while the kind of a builtin predicate is pre-defined.


Builtin predicates have Prolog-like signatures that specify which parameters have to be initialised:

```
predicate(?Variable1, +Variable2, -Variable3)
```

where

- `?` means: This variable can be either instantiated or not. Both ways are possible.
- `+` means: This variable is an input to the predicate. As such it must be instantiated.
- `-` means: This variable is an output to the predicate. It is usually non-instantiated, but may be if you want to check for a specific "return value".

For example, `run` has the signature `run(+cmdline)`, which means that the argument has to be initialised.

| Predicate | Kind | Description |
| - | - | - |
| [`from`](./image.md#from) | Image | Refer to existing local/registry image by its name |
| [`run`](./layer.md#run) | Layer | Execute shell command |
| [`copy`](./layer.md#copy) | Layer | Copy local file/directory |
| [`number_eq`](./logic/number.md) | Logic | `=` for numbers |
| [`number_gt`](./logic/number.md) | Logic | `>` for numbers |
| [`number_lt`](./logic/number.md) | Logic | `<` for numbers |
| [`number_geq`](./logic/number.md) | Logic | `>=` for numbers |
| [`number_leq`](./logic/number.md) | Logic | `<=` for numbers |
| [`string_concat`](./logic/string.md#string_concat) | Logic | Concatenate strings |
| [`string_length`](./logic/string.md#string_length) | Logic | Compute string length |
| [`semver_exact`](./logic/semver.md#semver_exact) | Logic | Equality with compatibility check for SemVer versions |
| [`semver_gt`](./logic/semver.md#semver_op) | Logic | `>` for SemVer versions |
| [`semver_lt`](./logic/semver.md#semver_op) | Logic | `<` for SemVer versions |
| [`semver_geq`](./logic/semver.md#semver_op) | Logic | `>=` for SemVer versions |
| [`semver_leq`](./logic/semver.md#semver_op) | Logic | `<=` for SemVer versions |

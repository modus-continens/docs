# SemVer

- <a name="semver-op"></a> `semver_OP(+a, +b)`: compare semver versions, resolves if `a` OP `b` is true. Valid OPs are the same as those for [`number_OP`](number.md), except there is no `semver_eq`.

- <a name="semver-exact"></a> `semver_exact(+a, +b)`:  `=I.J.K` means exactly the version `I.J.K`; `=I.J` means equivalent to `>=I.J.0, <I.(J+1).0`; `=I` means equivalent to `>=I.0.0, <(I+1).0.0`.

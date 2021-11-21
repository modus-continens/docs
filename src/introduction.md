# Introduction

Modus is a dialect of [Datalog](https://en.wikipedia.org/wiki/Datalog) for building [container](https://en.wikipedia.org/wiki/OS-level_virtualization) images. Modus has the following goals:

- _Maintainability_: make build definitions maintainable by enabling modularity, code reuse and dependency resolution.
- _Efficiency_: make builds efficient by automatic parallelisation and fine-grained caching; provide tools for optimising the image size.
- _Expressiveness_: enable the user to express complex build workflows.
- _Simplicity_: provide minimalistic syntax and well-defined, non-Turing-complete semantics for build definitions.

Please check the [language overview](./overview.md) to see how Modus achieves these goals.

Modus is free software; you can find the source code on [GitHub](https://github.com/modus-continens/modus). To get started with Modus, please check [installation guide](https://github.com/modus-continens/modus/blob/main/INSTALL.md).

Modus uses semantic versioning; until version 1.0 is declared, breaking changes are possible. The current version, 0.1, is a preview release. We welcome bug reports and feature requests submitted through [GitHub Issues](https://github.com/mechtaev/modus/issues).

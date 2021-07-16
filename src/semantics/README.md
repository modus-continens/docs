# Semantics

Given a build script and a query, Modus performs two operations:

1. computes the build [DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph) using a [Datalog](https://en.wikipedia.org/wiki/Datalog) solver; 
2. executes the build in parallel using [BuildKit](https://github.com/moby/buildkit).

The build DAG is a graph that describes dependencies between build operations. It is a DAG, and not a set of trees, because some intermediate images can be shared and built only once. The DAG is computed by a Datalog solver as the minimal proof of the build target from true facts representing existing images. The build DAG is constructed statically, i.e. the values of the variables do not depend on the results of build execution. Particularities of DAG construction are described in [Static](./static.md).

After the build DAG is computed, it is transformed into a [BuildKit](https://github.com/moby/buildkit) representation. Then, BuildKit executes build subtrees in parallel to construct the target images. Particularities of build execution are described in [Runtime](./runtime.md).


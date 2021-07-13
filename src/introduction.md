# Introduction

Modus is a [Datalog](https://en.wikipedia.org/wiki/Datalog)-based domain-specific language for building [container](https://en.wikipedia.org/wiki/OS-level_virtualization) images. Modus has the following goals:

- _Maintainability_: make build definitions maintainable by enabling modularity, code reuse and dependency resolution.
- _Efficiency_: make builds efficient by automatic parallelisation and fine-grained caching; provide tools for optimising the image size.
- _Expressiveness_: enable the user to express complex build workflows.
- _Simplicity_: provide minimalistic syntax and well-defined, non-Turing-complete semantics for build definitions.

Modus is free software; you can find the source code on [GitHub](https://github.com/modus-continens/modus). For more information, please check [installation guide](https://github.com/modus-continens/modus/blob/main/INSTALL.md). Modus uses semantic versioning; until version 1.0 is declared, breaking changes are possible. We welcome bug reports and feature requests submitted through [GitHub Issues](https://github.com/mechtaev/modus/issues).

## Overview

Container images are intrinsically parametrised. Typical image parameters are software versions, compilation flags and configuration options. For example, an image with Python version 3.7 installed on Ubuntu 20.04 can be represented as `python("3.7", "ubuntu", "20.04")`. Modus explicitly models image parameters in its build rules.

Build rules describe how new images are constructed from existing images. For example, an
image with installed Pylint can be built using the following rule:

```
pylint("3.7", "ubuntu", "20.04") :-
    python("3.7", "ubuntu", "20.04"),
    run("pip install pylint").
```

Rules can contain variables. The following rule builds an image with Pylint for any Python version and any Ubuntu version:

```
pylint(python_version, "ubuntu", ubuntu_version) :-
    python(python_version, "ubuntu", ubuntu_version),
    run("pip install pylint").
```

Such representation of rules naturally maps to [Horn clauses](https://en.wikipedia.org/wiki/Horn_clause), logical formulas in the form \\( u \leftarrow (p \wedge q\ \wedge ... \wedge\ t) \\). Particularly, container images correspond to logical facts,  build rules are logical rules that derive new facts from existing facts, and the build tree is a proof of the fact representing the build target from true facts representing existing images.

Build instructions may behave differently depending on the values of the variables. To specify these differences, logical conditions are used to constraint the applicability of each rule. The example below shows how `python(python_version, distr, distr_version)` is built for different Linux distributions (`,` is the logical and, `;` is the logical or, `f"..."` is a format string):

```
python(python_version, "fedora", distr_version) :-
    fedora(distr_version),
    run(f"dnf install python${python_version}").
python(python_version, "ubuntu", distr_version) :-
    (distr_version = "16.04"; distr_version = "18.04"; distr_version = "20.04"),
    ubuntu(distr_version),
    run(f"apt-get install -y python${python_version}").
python(python_version, "ubuntu", "14.04") :-
    ubuntu(distr_version),
    run(f"apt-get install -y software-properties-common && \
          add-apt-repository ppa:deadsnakes/ppa && \
          apt-get update && \
          apt-get install -y python${python_version}").
```

Modus provides a library of helper predicates to manipulate common data formats. For example, the second rule above can be re-written using the predicate `semver_geq` that implements the greater or equal comparision operator for versions:

```
python(python_version, "ubuntu", distr_version) :-
    semver_geq(distr_version, "16.04"),
    ubuntu(distr_version),
    run(f"apt-get install -y python${python_version}").
```

To build an image, the user specifies the target as a query to the build system. For example, the query `python("3.8", "fedora", "34")` builds an image with Python 3.8 installed on Fedora 34. The user can specify a query with variables to build multiple images in parallel. For example, the query `python("3.8", "ubuntu", X), semver_geq(X, "18.04")` will build two images: `python("3.8", "ubuntu", "20.04")` and `python("3.8", "ubuntu", "18.04")`.

An important pattern of container builds is [multi-stage build](https://docs.docker.com/develop/develop-images/multistage-build/). In multi-stage builds, data is transferred between several built images. For example, one image is used to compile the application, and the other is for deployment. In Modus, multi-stage builds are supported using the `::copy` operator (`::workdir` changes the working directory of a container, `::arg` specifies environment variables of a command, `::cmd` provides the default executable):


```
builder(go_version) :-
    from(f"golang:${go_version}")
        ::workdir("/go/src/github.com/alexellis/href-counter/"),
    run("go get -d -v golang.org/x/net/html"),
    copy("app.go", "."),
    run("go build -a -installsuffix cgo -o app .")
        ::arg("CGO_ENABLED", "0")::arg("GOOS", "linux").

release :- (
        from("alpine:latest")::workdir("root"),
        run("apk --no-cache add ca-certificates"),
        builder("1.16")::copy("/go/src/github.com/alexellis/href-counter/app", ".")
    )::cmd("./app").
```

Since Docker images consist of layers, it is impossible to delete files added to the previous layers, which may significantly increase the resulting image size. Modus provides the `::merge` operator that squashes multiple layers into one:

```
app(optimisation) :-
    from("gcc:latest"),
    (
        copy("src", "."),
        (optimisation = "on", run("cd src; make install-opt");
         optimisation = "off, run("cd src; make install")),
        run("rm -rf src")
    )::merge.
```

Software installation and configuration often involve repetitive sequences of instructions. Modus allows to encapsulate them into reusable user-defined commands:

```
install(lib, version) :-
    run(f"wget https://example.com/releases/${lib}-v${version}.tar.gz && \
          tar xf ${lib}-v${version}.tar.gz && \
          mv ${lib}-v${version}/ /build"),
    run("cd /build && make install"),
    run(f"rm ${lib}-v${version}.tar.gz && \
          rm -rf /build").
    
app :-
    from("gcc:latest"),
    (
        install("liba", "1.3.5"),
        install("libb", "4.1")
    )::merge.
```

In this example, the `install` command downloads, compiles and installs the specified versions of the specified libraries. Then, multiple envocations of `install` can be merged using the `::merge` operator resulting in a single layer.

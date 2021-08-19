# Overview

Modus is a container build definition language focusing on maintainability, efficiency, expressiveness and simplicity. This overview describes key ideas behind Modus and how it achieves its goals.

### Build Model

A [Docker/OSI container image](https://opencontainers.org/) consists of a set of layers combined using a [union mount filesystem](https://en.wikipedia.org/wiki/Union_mount). To build an image, the user specifies the parent image and defines operations that are executed on top of the parent image to form new layers. The most common operations are copying local files into the container and executing shell commands. Another important operation which enables [multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/) is copying files from a temporary container.

A multi-stage build can be visualised as the following graph. Each instruction in this graph creates a new filesystem layer. Instructions are specified using Dockerfile's notation: `FROM` defines the parent image, `COPY` copies local files, `RUN` executes shell command, and `COPY --from` copies files from another container. 

![Container Image Build Model](build_model.svg)

Languages for container build definitions, such Dockerfile format, are designed to express this graph structure. Modus introduces a more high-level approach for expressing this build graph, which enables more maintanable and flexible build definitions.

### Parameterised Builds

Container images are intrinsically parameterised. Typical image parameters are software versions, compilation flags and configuration options. For example, an image with Python version 3.7 installed on Ubuntu 20.04 can be represented as `python("3.7", "ubuntu", "20.04")`. Modus explicitly models image parameters in its build rules.

Build rules describe how new images are constructed from existing images. For example, an
image with installed Pylint can be built using the following rule:

```
pylint("3.7", "ubuntu", "20.04") :-
    python("3.7", "ubuntu", "20.04"),
    run("pip install pylint").
```

This rules states that the image `pylint("3.7", "ubuntu", "20.04")` can be derived from the image `python("3.7", "ubuntu", "20.04")` by adding the layer `run("pip install pylint")`.

Rules can contain variables. The following rule builds an image with Pylint for any Python version and any Ubuntu version:

```
pylint(python_version, "ubuntu", ubuntu_version) :-
    python(python_version, "ubuntu", ubuntu_version),
    run("pip install pylint").
```

### Build Graph as Minimal Proof

Such representation of images and build rules naturally maps to [Horn clauses](https://en.wikipedia.org/wiki/Horn_clause), logical formulas in the form \\( u \leftarrow (p \wedge q\ \wedge ... \wedge\ t) \\). Particularly, container images correspond to logical facts, build rules are logical rules that derive new facts from existing facts, and the build graph is the minimal proof of the fact representing the build target from the facts representing existing images.

For example, given the following rules where `,` is the logical and, `f"..."` is a format string

```
pylint(python_version, "ubuntu", ubuntu_version) :-
    python(python_version, "ubuntu", ubuntu_version),
    run("pip install pylint").

python(python_version, "ubuntu", distr_version) :-
    from(f"ubuntu:${distr_version}"),
    run(f"apt-get install -y python${python_version}").
```

the build tree of the image with Pylint 3.7 on Ubuntu 20.04 corresponds to the following proof of the fact `pylint("3.7", "ubuntu", "20.04")`:

```
pylint("3.7", "ubuntu", "20.04")
╞══ python("3.7", "ubuntu", "20.04")
│    ╞══ from("ubuntu:20.04")
│    └── run("apt-get install -y python3.7")
└── run("pip install pylint")
```

In this build tree, `══` preceeds parent images, `──` preceeds layers.

### Dependencies

Build instructions may behave differently depending on the values of the parameters. To specify these differences, logical conditions are used to constraint the applicability of each rule. The example below shows how `python(python_version, distr, distr_version)` is built for different Linux distributions (`;` is the logical or):

```
python(python_version, "fedora", distr_version) :-
    from(f"fedora:${distr_version}"),
    run(f"dnf install python${python_version}").

python(python_version, "ubuntu", distr_version) :-
    (distr_version = "16.04"; distr_version = "18.04"; distr_version = "20.04"),
    from(f"ubuntu:${distr_version}"),
    run(f"apt-get install -y python${python_version}").

python(python_version, "ubuntu", "14.04") :-
    from(f"ubuntu:${distr_version}"),
    run(f"apt-get install -y software-properties-common && \
          add-apt-repository ppa:deadsnakes/ppa && \
          apt-get update && \
          apt-get install -y python${python_version}").
```

### Library

Modus provides a library of helper predicates to manipulate common data formats (versions, paths, images, etc). For example, the second rule above can be re-written using the predicate `semver_geq` that implements the greater or equal comparision operator for versions:

```
python(python_version, "ubuntu", distr_version) :-
    semver_geq(distr_version, "16.04"),
    from(f"ubuntu:${distr_version}"),
    run(f"apt-get install -y python${python_version}").
```

### Multiple Images

To build an image, the user specifies the target as a query to the build system. For example, the query `python("3.8", "fedora", "34")` for the above script builds an image with Python 3.8 installed on Fedora 34. The user can specify a query with variables to build multiple images in parallel. For example, the query `python("3.8", "ubuntu", X), semver_geq(X, "18.04")` will build two images: `python("3.8", "ubuntu", "20.04")` and `python("3.8", "ubuntu", "18.04")`.

### Scope

Modularity requires controlling the scope of variables. Modus provide fine-grained control over the execution environment of commands. Consider the following example:

```
app(ARG) :-
    from("ubuntu:20.04"),
    copy(".", "/root"),
    (
        run("/root/script_1"),
        run("/root/script_2")::in_workdir("/etc"),
    )::in_env("ARG", "123"),
    run(f"/root/script_3 ${ARG}").
```

Only the scripts 1 and 2 are executed in the environment `ARG=123` set via the `::in_env` operator. The script 3 receives the value of the variable `ARG` as the command line argument using a formatted string `f"..."`, but its environment it unaffected. Only the script 2 is executed in the directory `/etc`, which is specified using the `::in_workdir` operator.

### Multi-Stage Builds

In multi-stage builds, data is transferred between several built images. For example, one image is used to compile the application, and the other is for deployment. In Modus, multi-stage builds are supported using the `::copy` operator (`::set_workdir` changes the working directory of a container, `::set_cmd` sets the default executable):


```
builder(go_version) :-
    from(f"golang:${go_version}")
        ::set_workdir("/go/src/github.com/alexellis/href-counter/"),
    run("go get -d -v golang.org/x/net/html"),
    copy("app.go", "."),
    run("go build -a -installsuffix cgo -o app .")
        ::in_env("CGO_ENABLED", "0")
        ::in_env("GOOS", "linux").

release :-
    (
        from("alpine:latest")::set_workdir("/root"),
        run("apk --no-cache add ca-certificates"),
        builder("1.16")::copy("/go/src/github.com/alexellis/href-counter/app", ".")
    )::set_cmd("./app").
```

### Complex Workflows

Modus enables users to specify complex build workflows that are automatically resolved based on query parameters. For example, the script below builds the dependency `lib` in a separate container if its version is incompatible with the current version of gcc (`!` is the logical negation):

```
# lib version <= "1.0.2" can be compiled with any version of gcc:
lib_gcc(lib_version, gcc_version) :- semver_leq(lib_version, "1.0.2").

# lib version > "1.0.2" requires gcc 10.3 or higher:
lib_gcc(lib_version, gcc_version) :-
    semver_gt(lib_version, "1.0.2"), semver_geq(gcc_version, "10.3").

lib(lib_version, gcc_version):
    from(f"gcc:${gcc_version}"),
    run("mkdir -p /app/lib"),
    (
        lib_gcc(lib_version, gcc_version),
        copy("scripts/install_lib.sh", "/app/lib"),
        run("./install_lib.sh")
            ::in_workdir("/app/lib")::in_env("LIB_VERSION", lib_version)
    ;
        !lib_gcc(lib_version, gcc_version),
        lib(lib_version, "10.3")::copy("/app/lib", "/app/lib")
    ).

app(lib_version, gcc_version) :-
    lib(lib_version, gcc_version)
    copy(".", "/app")
    run("cd /app && make").
```

For the query `app("1.0.2-beta", "8.5")`, Modus will compute the following build tree:

```
app("1.0.2-beta", "8.5")
╞══ lib("1.0.2-beta", "8.5")
│    ╞══ from("gcc:8.5")
│    ├── run("mkdir -p /app/lib")
│    ├── copy("scripts/install_lib.sh", "/app/lib")
│    └── run("./install_lib.sh")
├── copy(".", "/app")
└── run("cd /app && make")
```

However, for the query `app("1.0.3", "8.5")`, the build tree will be different because `lib_gcc("1.0.3", "8.5")` is false:

```
app("1.0.3", "8.5")
╞══ lib("1.0.3", "8.5")
│    ╞══ from("gcc:8.5")
│    ├── run("mkdir -p /app/lib")
│    └── lib("1.0.3", "10.3")::copy("/app/lib", "/app/lib")
│        ╞══ from("gcc:10.3")
│        ├── run("mkdir -p /app/lib")
│        ├── copy("scripts/install_lib.sh", "/app/lib")
│        └── run("./install_lib.sh")
├── copy(".", "/app")
└── run("cd /app && make")
```

### Merging Layers

Since container images consist of layers, it is impossible to delete files added to the previous layers, which may significantly increase the resulting image size. Modus provides the `::merge` operator that squashes multiple layers into one:

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

### User-Defined Commands

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

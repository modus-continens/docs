# Command Line Tool

The following screencast demonstrates a simple but complete workflow of proving, building, tagging and running images.
[![asciicast](https://asciinema.org/a/DelA6wHXgWGaFUhPUnZAdFZDw.svg)](https://asciinema.org/a/DelA6wHXgWGaFUhPUnZAdFZDw)

## `modus build`

Much like `docker build`, the `modus build` command builds a Modusfile.

**Syntax**: `modus build [options] <context> <goal>`

`context` is a directory containing all files (including the Modusfile) to send to Docker for building. `.dockerignore` can be used to exclude files in the same way as `docker build`.

`goal` is the target literal to build.

**Options**:

`-f <modusfile>`: Allows building something other than `./Modusfile`.

`--json` or `--json=<file>`: Outputs the build results as JSON.

In the first case, the output are written to stdout. In the second case, the output are written to the file specified.

An example JSON output looks like this:

```json
[
  {
    "predicate": "all",
    "args": [
      "frontend",
      "release"
    ],
    "digest": "sha256:595a66d80d1ef681f821e0ae92fd785b437ad2fbd5c564da093f588e37dfd65f"
  }
]
```

There will be one entry for every final image built, with the applied arguments for the predicate stored in the `args` array. This could be useful for scripting in CI routines. For example, the following command runs `modus build`, then tags the produced images with `modus/` + the valuation of `X`:

```sh
modus build . 'all(X, "release")' --json | jq -r '.[] | .digest, ("modus/" + .args[0])' | xargs -L 2 docker tag
```

`--no-cache`: Ignore all existing build cache. This effectively forces a complete rebuild of the image. Existing base images used in `from` clauses are **not** re-downloaded. To update those, use `docker pull`.

`-v` or `--verbose`: Print all the build output. This is implemented by passing `--progress=plain` to `docker build`, which turns off the interactive progress report and instead print all the stages with numbering and their output.


**Developer options**: useful for debugging Modus itself.

`--docker-flags=<flags>`: Pass additional raw flags to `docker build`.

`--custom-buildkit-frontend=<frontend>`: Use a custom buildkit frontend. The default is `ghcr.io/modus-continens/modus-buildkit-frontend:` + commit hash of the Modus program (embedded in binary at build time).

`--image-export-concurrency <integer>`, `--image-resolve-concurrency <number>`: Controls the concurrency used during image export and image resolution respectively.

Image resolution is done at the beginning of the build, and may involves fetching metadata (and downloading the image if necessary) from the repository. Image export is the very last step of any build process, and is usually disk IO-bound, although delay may be introduced by `docker build`.

Defaults: `--image-export-concurrency=8`, `--image-resolve-concurrency=3`.

## `modus proof`

`modus proof` prints out proof trees based on some Modus facts/rules, and a provided goal.

**Syntax**: `modus proof [options] <context> <goal>`

- `context` is a directory that should contain the Modusfile that contains the facts/rules.
This is chosen to match the interface of `modus build`.
- `goal` specifies the goal to prove.

**Options**:

- `--compact`: Changes the output of proof trees, omitting logical rule resolution.
- `-e, --explain`: Prints out a structured 'explanation' of the steps taken to prove `<goal>` during
SLD resolution. (See `-g` for a graphical version of this.)
This may be verbose.
- `-f <modusfile>`: Use the facts and rules of this Modusfile, instead of `<context>/Modusfile`.
- `-g, --graph`: Outputs DOT source for a graph of the SLD tree. This can given to `dot -Tpng` to produce
a PNG of the graph.
Recommended over `-e` for larger Modusfiles.

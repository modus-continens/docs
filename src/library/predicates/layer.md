# Layer

- <a name="run"></a>`run(+command)`: Run a shell command.

  `command` should be a string containing a shell script. At runtime, the script will be executed with `/bin/sh -c`.

  This is equivalent to `RUN` in Dockerfile.

- <a name="copy"></a>`copy(+src, +dst)`: Copy local file/directory.

  Existing files already in the image will be overwritten in the new layer, and directories will be copied recursively. Any non-existant parent directories will be created.

  This is equivalent to `COPY` in Dockerfile without a `--from` option. Following Docker's behavior, if `src` is a directory, **the content of `src`** is copied into `dst`, but not `src` itself. This means that `copy("dir", "/")` basically means `cp -r dir/* /`.

  If `dst` is a relative path, it is resolved based on the current image's working directory. `src` must be a relative path, and must not be outside the build context.

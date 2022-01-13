# Layer

- <a name="run"></a>`run(+command)`: Run a shell command.

  `command` should be a string containing a shell script. At runtime, the script will be executed with `/bin/sh -c`.

  This is equivalent to `RUN` in Dockerfile.

- <a name="copy"></a>`copy(+src, +dst)`: Copy local file/directory.

  Existing files already in the image will be overwritten in the new layer, and directories will be copied recursively. Any non-existant parent directories will be created. <!-- TODO: test this -->

  This is equivalent to `COPY` in Dockerfile without a `--from` option.

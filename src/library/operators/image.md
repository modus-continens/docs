# Image

- <a name="copy"></a>`::copy(+src, +dst)`: Copy file/directory from another image.

  Existing files already in the current image will be overwritten in the new layer, and directories will be copied recursively. Any non-existant parent directories will be created.

  This is equivalent to `COPY --from=src_image` in Dockerfile. Following Docker's behavior, if `src` is a directory, the content of `src` is copied into `dst`, but not `src` itself. This means that `copy("dir", "/")` is equivalent to `cp -r dir/* /`.

  If `src` is a relative path, it is resolved based on the source image's working directory. If `dst` is a relative path, it is resolved based on the current image's working directory.

- <a name="append-path"></a>`::append_path(+path)`: append string to the PATH environment variable.

- <a name="simple-set"></a>`::set_env(+key, +value)`, `::set_entrypoint(+str_or_array)`, `::set_cmd(+array)`, `::set_workdir(+dir)`, `::set_user(+username)`: Set image properties.

  `::set_workdir` also allows specifying a relative path based on the input image's working directory. This will be resolved to an absolute path.

  `::set_entrypoint` will clear any command the image has, to be consistent with the `ENTRYPOINT` command in Dockerfile.

  Example:
  ```Modusfile
  app :-
    (
      from("alpine"),
      copy("./app", "/"),
      copy("./entrypoint.sh", "/")
    )::set_entrypoint("/entrypoint.sh")
     ::set_cmd(["start"]).
  ```

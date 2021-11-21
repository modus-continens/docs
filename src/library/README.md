# Library

Modus standard library is a collection of builtin predicates and operators. Predicates describe images, layers and their dependencies. Operators are typically used to configure how the build tree is executed.

### List of Predicates

| Predicate | Kind | Description |
| - | - | - |
| [`from`](./predicates/image.md#from) | Image | Refer to existing local/registry image by its name |
| [`run`](./predicates/layer.md#run) | Layer | Execute shell command |
| [`copy`](./predicates/layer.md#copy) | Layer | Copy local file/directory |
| [`number_eq`](./predicates/logic/number.md#number_eq) | Logic | `=` for numbers |
| [`number_gt`](./predicates/logic/number.md#number_gt) | Logic | `>` for numbers |
| [`number_lt`](./predicates/logic/number.md#number_lt) | Logic | `<` for numbers |
| [`number_geq`](./predicates/logic/number.md#number_geq) | Logic | `>=` for numbers |
| [`number_leq`](./predicates/logic/number.md#number_leq) | Logic | `<=` for numbers |
| [`string_concat`](./predicates/logic/string.md#string_concat) | Logic | Concatenate strings |
| [`string_length`](./predicates/logic/string.md#string_length) | Logic | Compute string length |
| [`string_gt`](./predicates/logic/string.md#string_gt) | Logic | `>` for strings |
| [`string_lt`](./predicates/logic/string.md#string_lt) | Logic | `<` for strings |
| [`string_geq`](./predicates/logic/string.md#string_geq) | Logic | `>=` for strings |
| [`string_leq`](./predicates/logic/string.md#string_leq) | Logic | `<=` for strings |
| [`semver_eq`](./predicates/logic/semver.md#semver_eq) | Logic | `=` for SemVer versions |
| [`semver_gt`](./predicates/logic/semver.md#semver_gt) | Logic | `>` for SemVer versions |
| [`semver_lt`](./predicates/logic/semver.md#semver_lt) | Logic | `<` for SemVer versions |
| [`semver_geq`](./predicates/logic/semver.md#semver_geq) | Logic | `>=` for SemVer versions |
| [`semver_leq`](./predicates/logic/semver.md#semver_leq) | Logic | `<=` for SemVer versions |
| [`image_registry`]((./predicates/logic/registry.md#image_registry)) | Logic | Parse image repository |
| [`image_namespace`]((./predicates/logic/registry.md#image_namespace)) | Logic | Parse image namespace |
| [`image_repo`]((./predicates/logic/registry.md#image_repo)) | Logic | Parse image repo |
| [`image_tag`]((./predicates/logic/registry.md#image_tag)) | Logic | Parse image tag |
| [`os_basename`]((./predicates/logic/unix.md#os_basename)) | Logic | Parse UNIX path basename |
| [`os_dirname`]((./predicates/logic/unix.md#os_dirname)) | Logic | Parse UNIX path dirname |
| [`os_env`]((./predicates/logic/unix.md#os_env)) | Logic | Read environment variable |
| [`os_read`]((./predicates/logic/unix.md#os_read)) | Logic | Read file content |
| [`url_scheme`]((./predicates/logic/url.md#url_scheme)) | Logic | Parse URL scheme |
| [`url_username`]((./predicates/logic/url.md#url_username)) | Logic | Parse URL username |
| [`url_password`]((./predicates/logic/url.md#url_password)) | Logic | Parse URL password |
| [`url_host`]((./predicates/logic/url.md#url_host)) | Logic | Parse URL host |
| [`url_port`]((./predicates/logic/url.md#url_port)) | Logic | Parse URL port |
| [`url_path`]((./predicates/logic/url.md#url_path)) | Logic | Parse URL path |
| [`url_query`]((./predicates/logic/url.md#url_query)) | Logic | Parse URL query |
| [`url_fragment`]((./predicates/logic/url.md#url_fragment)) | Logic | Parse URL fragment |


### List of Operators

| Operator | Kind | Description |
| - | - | - |
| [`::copy`](./operators/image.md#copy) | Image | Copy file/directory to current image |
| [`::set_user`](./operators/image.md#set_user) | Image | Set user |
| [`::set_expose`](./operators/image.md#set_expose) | Image | Set exposed port |
| [`::set_env`](./operators/image.md#set_env) | Image | Set environment variable |
| [`::set_entrypoint`](./operators/image.md#set_entrypoint) | Image | Set entrypoint |
| [`::set_cmd`](./operators/image.md#set_cmd) | Image | Set default arguments to entrypoint |
| [`::set_volume`](./operators/image.md#set_volume) | Image | Set volume |
| [`::set_workdir`](./operators/image.md#set_workdir) | Image | Set current working directory |
| [`::set_label`](./operators/image.md#set_label) | Image | Add metadata to image |
| [`::set_stopsignal`](./operators/image.md#set_stopsignal) | Image | Set stop signal |
| [`::in_workdir`](./operators/image.md#in_workdir) | Layer | Specify working directory for layer commands |
| [`::in_env`](./operators/image.md#in_env) | Layer | Specify environment variables for layer commands |
| [`::merge`](./operators/image.md#arg) | Layer | Marge layers |
| [`::max_number`](./operators/image.md#max_number) | Logic | Maximize given number |
| [`::min_number`](./operators/image.md#min_number) | Logic | Minimize given number |
| [`::max_string`](./operators/image.md#max_string) | Logic | Maximize given string |
| [`::min_string`](./operators/image.md#min_string) | Logic | Minimize given string |
| [`::max_semver`](./operators/image.md#max_string) | Logic | Maximize given SemVer version |
| [`::min_semver`](./operators/image.md#min_string) | Logic | Minimize given SemVer version |




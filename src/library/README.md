# Library

Modus standard library is a collection of builtin predicates and operators. Predicates describe images, layers and their dependencies. Operators are typically used to configure how the build tree is executed.

### List of Predicates

| Predicate | Kind | Description |
| - | - | - |
| [`from`](./predicates/image.md#from) | Image | Refer to existing local/registry image by its name |
| [`run`](./predicates/layer.md#run) | Layer | Execute shell command |
| [`copy`](./predicates/layer.md#copy) | Layer | Copy local file/directory |
| [`number_eq`](./predicates/logic/number.md) | Logic | `=` for numbers |
| [`number_gt`](./predicates/logic/number.md) | Logic | `>` for numbers |
| [`number_lt`](./predicates/logic/number.md) | Logic | `<` for numbers |
| [`number_geq`](./predicates/logic/number.md) | Logic | `>=` for numbers |
| [`number_leq`](./predicates/logic/number.md) | Logic | `<=` for numbers |
| [`string_concat`](./predicates/logic/string.md#string_concat) | Logic | Concatenate strings |
| [`string_length`](./predicates/logic/string.md#string_length) | Logic | Compute string length |
| [`semver_eq`](./predicates/logic/semver.md#semver_eq) | Logic | `=` for SemVer versions |
| [`semver_gt`](./predicates/logic/semver.md#semver_gt) | Logic | `>` for SemVer versions |
| [`semver_lt`](./predicates/logic/semver.md#semver_lt) | Logic | `<` for SemVer versions |
| [`semver_geq`](./predicates/logic/semver.md#semver_geq) | Logic | `>=` for SemVer versions |
| [`semver_leq`](./predicates/logic/semver.md#semver_leq) | Logic | `<=` for SemVer versions |
<!-- | [`image_registry`]((./predicates/logic/registry.md#image_registry)) | Logic | Parse image repository |
| [`image_namespace`]((./predicates/logic/registry.md#image_namespace)) | Logic | Parse image namespace |
| [`image_repo`]((./predicates/logic/registry.md#image_repo)) | Logic | Parse image repo |
| [`image_tag`]((./predicates/logic/registry.md#image_tag)) | Logic | Parse image tag | -->
<!-- | [`os_basename`]((./predicates/logic/unix.md#os_basename)) | Logic | Parse UNIX path basename |
| [`os_dirname`]((./predicates/logic/unix.md#os_dirname)) | Logic | Parse UNIX path dirname |
| [`os_env`]((./predicates/logic/unix.md#os_env)) | Logic | Read environment variable |
| [`os_read`]((./predicates/logic/unix.md#os_read)) | Logic | Read file content | -->
<!-- | [`url_scheme`]((./predicates/logic/url.md#url_scheme)) | Logic | Parse URL scheme |
| [`url_username`]((./predicates/logic/url.md#url_username)) | Logic | Parse URL username |
| [`url_password`]((./predicates/logic/url.md#url_password)) | Logic | Parse URL password |
| [`url_host`]((./predicates/logic/url.md#url_host)) | Logic | Parse URL host |
| [`url_port`]((./predicates/logic/url.md#url_port)) | Logic | Parse URL port |
| [`url_path`]((./predicates/logic/url.md#url_path)) | Logic | Parse URL path |
| [`url_query`]((./predicates/logic/url.md#url_query)) | Logic | Parse URL query |
| [`url_fragment`]((./predicates/logic/url.md#url_fragment)) | Logic | Parse URL fragment | -->


### List of Operators

Operators are predicates beginning with `::` which can be applied to a set of predicates.

| Operator | From | To | Description |
| - | - | - | - |
| [`::copy`](./operators/image.md#copy) | Image | Layer | Copy file/directory to current image |
| [`::set_env`](./operators/image.md#simple-set) | Image | Image | Set environment variable |
| [`::set_entrypoint`](./operators/image.md#simple-set) | Image | Image | Set entrypoint |
| [`::set_workdir`](./operators/image.md#simple-set) | Image | Image | Set current working directory |
| [`::in_workdir`](./operators/layer.md#in_workdir) | Layers | Layers | Specify working directory for layer commands |
| [`::in_env`](./operators/layer.md#in_env) | Layers | Layers | Specify environment variables for layer commands |
| [`::merge`](./operators/layer.md#merge) | Layers | Layer | Marge layers |

<!-- | [`::set_user`](./operators/image.md#set_user) | Image | Set user | -->
<!-- | [`::set_expose`](./operators/image.md#set_expose) | Image | Set exposed port | -->
<!-- | [`::set_cmd`](./operators/image.md#set_cmd) | Image | Set default arguments to entrypoint | -->
<!-- | [`::set_volume`](./operators/image.md#set_volume) | Image | Set volume | -->
<!-- | [`::set_label`](./operators/image.md#set_label) | Image | Add metadata to image | -->
<!-- | [`::set_stopsignal`](./operators/image.md#set_stopsignal) | Image | Set stop signal | -->

<!-- | [`::max_number`](./operators/image.md#max_number) | Logic | Maximize given number |
| [`::min_number`](./operators/image.md#min_number) | Logic | Minimize given number |
| [`::max_string`](./operators/image.md#max_string) | Logic | Maximize given string |
| [`::min_string`](./operators/image.md#min_string) | Logic | Minimize given string |
| [`::max_semver`](./operators/image.md#max_string) | Logic | Maximize given SemVer version |
| [`::min_semver`](./operators/image.md#min_string) | Logic | Minimize given SemVer version | -->

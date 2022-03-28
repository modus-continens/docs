# Operators

Operators begin with `::`; they can be applied to expressions to control the build process.

| Operator | From | To | Description |
| - | - | - | - |
| [`::copy`](./image.md#copy) | Image | Layer | Copy file/directory to current image |
| [`::set_env`](./image.md#simple-set) | Image | Image | Set environment variable |
| [`::set_entrypoint`](./image.md#simple-set) | Image | Image | Set entrypoint |
| [`::set_cmd`](./image.md#simple-set) | Image | Image | Set image command |
| [`::set_workdir`](./image.md#simple-set) | Image | Image | Set current working directory |
| [`::append_path`](./image.md#append_path) | Image | Image | Append PATH variable |
| [`::in_workdir`](./layer.md#in_workdir) | Layer | Layer | Specify working directory for layer commands |
| [`::in_env`](./layer.md#in_env) | Layer | Layer | Specify environment variables for layer commands |
| [`::merge`](./layer.md#merge) | Layer | Layer | Merge layers |

<!-- | [`::set_user`](./operators/image.md#set_user) | Image | Set user | -->
<!-- | [`::set_expose`](./operators/image.md#set_expose) | Image | Set exposed port | -->
<!-- | [`::set_cmd`](./operators/image.md#set_cmd) | Image | Set default arguments to entrypoint | -->
<!-- | [`::set_volume`](./operators/image.md#set_volume) | Image | Set volume | -->
<!-- | [`::set_label`](./operators/image.md#set_label) | Image | Add metadata to image | -->
<!-- | [`::set_stopsignal`](./operators/image.md#set_stopsignal) | Image | Set stop signal | -->

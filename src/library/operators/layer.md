# Layer

- <a name="in_workdir"></a>`::in_workdir(+dir)`: Temporary change the image's working directory, affecting any operations inside the operator.

- <a name="in_env"></a>`::in_env(+key, +value)`: Temporary set environment variable, affecting any operations inside the operator.

- <a name="merge"></a>`::merge`: Squash anything inside into one image layer.

  The only allowed operations inside are `run`, `copy` and `::copy`. This can improve image size if operations overwrite each other.

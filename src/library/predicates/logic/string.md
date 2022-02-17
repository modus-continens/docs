# String

- <a name="string_concat"></a>`string_concat(?a, ?b, ?res)`: Concatenate two strings.

  At least two arguments must be grouneded. Resolves if `a` + `b` = `res`. If one of the argument is ungrounded, this predicate constrains it so that the statement is true, by either concating the two strings or removing a prefix or suffix from `res`.

  f-strings act as a syntatic sugar for this predicate: `X = f"${a}(content of b)"`, `X = f"(content of a)${b}` or `X = f"${a}${b}"` is equivalent to `string_concat(a, b, X)`.

  Due to the limitation of our logic resolution algorithm, this predicate can not be part of a recursion. For example, `a(X) :- string_concat("a", Y, X), a(Y)` is not allowed.

- <a name="string_length"></a>`string_length(+str, -len)`: Get the length of a string.

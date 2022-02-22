# Grammar

A Modus build srcipt is a sequence of facts and rules. A fact is of the form

```
<fact> ::= <head> "."
```

A rule is of the form 

```
<rule> ::= <head> ":-" <body> "."
```

The head of a fact or a rule is a `<literal>` of the form

```
<literal> ::= <identifier> "(" <arg_list> ")"
            | <identifier>
```

where `<identifier>` is a non-empty alpha-numeric string, not starting with a number, and possibly containing `_`; `<arg_list>` is a comma-separated list of terms.

A term is either a variable or a string literal. A variable is represented as an `<identifier>`; string literals are described in [String Literals](#string-literals).

`a("b", _c)` and `foo` are examples of syntactically valid literals.

The body of a rule is an expression defined as follows:

```
<expression> ::= <literal>
               | <unification>
               | <expression> "::" <operator>
               | <expression> "," <expression>
               | <expression> ";" <expression>
               | "(" <expression> ")"
```

A unification asserts the equality of two terms/variables:

```
<unification> ::= ( <variable> | <term> ) "=" ( <variable> | <term> )
```

Operators have the same grammar as literals.

The following are examples of syntactically valid expressions:

- `a("b", _c)`
- `a = "foo"`
- `a("b", _c)::b(_c)`
- `a::b`
- `a, b("c")`
- `(a; b), c`

## Predicate Kinds

In a literal such as `a(b, "c")`, we refer to `a` as the predicate name. There exist predicates of three and only three kinds:

- image predicates;
- layer predicates;
- logic predicates.

An _image predicate_ is one of the following:

- builtin predicate `from`;
- a predicate, in all definitions `<head> :- <body>` of which, the body is an image expression.

An _image expression_ is defined as follows:

- an image literal, which is an application of an image predicate, is an image expression;
- an application of an operator to an image expression (`<expression> "::" <operator>`) is an image expression, except for the `::copy` operator;
- `<expression1> "," <expression2>` is an image expression iff 
  - either `<expression1>` is an image expression, and `<expression2>` is not an image expression.
  - or `<expression1>` is a logic expression and `<expression2>` is an image expression.
- `<expression1> ";" <expression2>` is an image expression iff both `<expression1>` and `<expression2>` are image expressions.

In the following example, `a` is an image predicate, and `b` is not:

```
a :-
    from("ubuntu"),
    run("apt-get update").
    
b(X) :- X = "a".
```

A _layer predicate_ is one of the following:

- the builtin predicate `run`;
- the builtin predicate `copy`;
- a predicate, in all definitions `<head> :- <body>` of which, the body is a layer expression.

A _layer expression_ is defined as follows:

- a layer literal, which is an application of a layer predicate, is a layer expression;
- an application of an operator to a layer expression (`<expression> "::" <operator>`) is a layer expression;
- `<expression1> "," <expression2>` is a layer expressions iff either:
  - both `<expression1>` and `<expression2>` are layer expressions.
  - or `<expression1>` is a logic expression and `<expression2>` is a layer expression.
- `<expression1> ";" <expression2>` is a layer expression iff both `<expression1>` and `<expression2>` are layer expressions.
- an application of the operator `::copy` to an image literal is a layer expression;

In the following example, `a` is a layer predicate, and `b` is not:

```
a :- (from("ubuntu"), run("apt-get update"))::copy("/etc/hosts", ".").
    
b(X) :- X = "a".
```

A _logic predicate_ is one of the following:

- a buildin predicate, except for `from`, `run` and `copy`;
- a predicate, in all definitions `<head> :- <body>` of which, the body is a logic expression.

A _logic expression_ is defined as follows:

- a logic literal, which is an application of a logic predicate, is a logic expression;
- a unification is a logic expression;
- an application of an operator to a logic expression (`<literal> "::" <operator>`) is a logic expression.
- `<expression1> "," <expression2>` and `<expression1> ";" <expression2>` are logic expressions iff both `<expression1>` and `<expression2>` are logic expressions.

In the following example, `a` is a logic predicate, and `b` is not:

```
a(Y) :- semver_geq(Y, "1.2.3").
    
b(X) :- X = "a", from("ubuntu").
```

## Operator Kinds

There exist operators of three and only three kinds:

- image operators;
- layer operators;
- logic operators.

Image operators are only applied to image expressons. Layer operators are only applied to layer expressions. Logic operators can be applied to any expressions.

## String Literals

There exist two types of string literals:

- Normal strings
- Formatted strings

Normal strings are sequences of characters surrounded with double quotes, in which `"` needs to be escaped and `\` is used as the escape characted. Specifically, the following characters are escaped: `\"`, `\\`, `\n`, `\r`, `\t`, `\\`, `\0`. To break a single-line string to multiple lines, use a string continuation, a newline character preceded with `\`. Below are examples of valid string literals:

- `"abc"`
- `"a\nb"`
- `"\"abc\""`
- ```
  "hello,\
   world"
  ```

Formatted strings are just like normal strings, but they starts with the letter `f` before the first quote symbol, and `$` can be escaped. Below are examples of valid string literals:

- `f"abc"`
- `f"10\$"`
- `f"hello, ${name}"`

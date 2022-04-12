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
               | !<expression>
```

A unification asserts the equality of two terms (which could be variables):

```
<unification> ::= <term> "=" <term>
                | <term> "!=" <term>
```

Operators have the same grammar as literals.

The following are examples of syntactically valid expressions:

- `a("b", _c)`
- `a = "foo"`
- `a("b", _c)::b(_c)`
- `a::b`
- `a, b("c")`
- `(a; b), c`
- `!(a(X), b(X))`
- `"1.0.1" = version`

## Full EBNF

```
<fact> ::= <head> "."
<rule> ::= <head> ":-" <body> "."
<head> ::= <literal>
<body> ::= <expression>
<literal> ::= <identifier> "(" <arg_list> ")"
            | <identifier>
<operator> ::= <literal>
<expression> ::= <literal>
               | <unification>
               | <expression> "::" <operator>
               | <expression> "," <expression>
               | <expression> ";" <expression>
               | "(" <expression> ")"
               | !<expression>
<unification> ::= <term> "=" <term>
                | <term> "!=" <term>

<arg_list> ::= <term> { "," <term> }
<term> ::= <variable> | '"' <char_string> '"' | <format_string_term>
<variable> ::= <identifier>
<format_string_term> ::= 'f"' { <char_string> | <interpolation> } '"'
<interpolation> ::= "${" <variable> "}"

<char_string> ::= { <char> }
<identifier> ::= ( <letter> | "_" ) [ <alphanumeric_with_underscore> ]
<alphanumeric_with_underscore> ::= { <letter> | <digit> | "_" }
<alphanumeric> ::= { <letter> | <digit> }
<letter> ::= "A" | "B" | "C" | "D" | "E" | "F" | "G"
       | "H" | "I" | "J" | "K" | "L" | "M" | "N"
       | "O" | "P" | "Q" | "R" | "S" | "T" | "U"
       | "V" | "W" | "X" | "Y" | "Z" | "a" | "b"
       | "c" | "d" | "e" | "f" | "g" | "h" | "i"
       | "j" | "k" | "l" | "m" | "n" | "o" | "p"
       | "q" | "r" | "s" | "t" | "u" | "v" | "w"
       | "x" | "y" | "z"
<digit> ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
```

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

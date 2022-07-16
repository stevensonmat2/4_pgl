// This assignment will be somewhat different from the previous ones, since
// we're focusing on a different part of the interpreter this time.

// We're focusing specifically on the core algorithms for parsing expressions,
// so we're only working with a sublanguage of the one we saw in assignment 3.
import { Expr } from "./AST";

// The lexer generator library we'll be working with is called Moo. Here we
// import two relevant types: the Lexer type, which is the type of our actual
// lexer object, and the Token type, which is the type of each token that we
// get back as the output of the lexing process. (Remember that "lexing" and
// "tokenizing" are synonyms, as are "lexer"/"tokenizer" and "lex"/"tokenize".)
import { Lexer, Token } from "moo";

// The parser generator library we'll be working with is called Nearley. Here
// we import three relevant types: the CompiledRules type, which is the type of
// a set of context-free grammar production rules; the Grammar type, which
// allows us to turn a CompiledRules value into a usable value; and the Parser
// type, which is the type of our actual parser object.
import { CompiledRules, Grammar, Parser } from "nearley";

// The lexer for this project is defined in src/Grammar/Lexer.ts. That file is
// where you'll start your work on this assignment, but read through the rest of
// this file first in order to understand the context of your work.
import { lexer } from "./Grammar/Lexer";

// The parser for this project is defined in src/Grammar/Expression.ne. The
// notation "export { default as ... }" allows us to access the context-free
// grammar defined in a .ne file: expressionRules is a CompiledRules object
// representing the rules of our context-free grammar for parsing expressions.
import { default as expressionRules } from "../gen/Grammar/Expression";


// This is our function for tokenizing a string into an array of tokens.
export function tokenize(source: string): Token[] {
  // The .reset method loads an input string into the lexer for processing. The
  // Lexer class is designed so that an individual lexer is *reusable*: even if
  // we've already lexed some input with this lexer, calling .reset will
  // restore it to its initial state, ready to lex the new input.
  lexer.reset(source);

  // This call is what "drives" the lexer to produce the array of tokens as
  // output.
  return Array.from(lexer);
}


// This is our function for parsing an input string as an expression.  Note that
// we don't call our lexer explicitly in this function, but it is called
// implicitly by Nearley when the parser runs.
export function parse(source: string): Expr[] {
  // The Grammar.fromCompiled function turns our CompiledRules into a Grammar.
  // The Parser constructor takes that Grammar and returns a Parser; then we
  // use .feed to pass our source text into the parser we just constructed;
  // then finally we use .finish to get our array of output ASTs. The Parser
  // class is designed so that an individual parser is **not** reusable: we
  // need to construct a new parser for each input string we want to parse.
  return new Parser(Grammar.fromCompiled(expressionRules)).feed(source).finish();
}


// The parse function returns **every possible** AST for the input string,
// which may include more than one AST if our grammar is *ambiguous*.
// Ultimately, our interpreter should only run a **single** AST, so an
// ambiguous grammar is a buggy grammar!

// For debugging, it is very helpful to have a function that returns every
// possible AST, as our parse function does: if we have ambiguity, the output
// of the parse function will help us figure out how to resolve it.

// For actual program execution, though, we should not accept an ambiguous
// parse result: it should be considered a *parse error*. The parseUnambiguous
// function simply checks that the output of the parse function is a single
// unique AST, and throws an AmbiguousParseError or NoParseError if it isn't.

export class NoParseError extends Error { }
export class AmbiguousParseError extends Error { }

export function parseUnambiguous(source: string): Expr {
  const parses = parse(source);
  if (parses.length == 1)
    return parses[0];
  else if (parses.length == 0)
    throw new NoParseError("input is invalid: " + source);
  else
    throw new AmbiguousParseError("input is ambiguous: " + source);
}


// ********************
// * EXERCISE 1 START *
// ********************

// Open src/Grammar/Lexer.ts. Add a new lexing rule for *hexadecimal integer
// literals*, as defined below.

// Your new lexing rule **must** be named "hex". This will be the name of the
// token sort for hexadecimal integer literals. The name of a lexing rule is
// written to the left of the colon: for example, the provided grammar includes
// rules named "float" and "parenL".

// A hexadecimal integer literal is written with a hash symbol followed by at
// least one hexadecimal digit. The digits A/B/C/D/E/F may be written in
// uppercase or lowercase, and a single hexadecimal integer literal may include
// both uppercase and lowercase digits.

// Your lexing rule for hexadecimal literals should **not** match a negative
// sign. The parser handles negated literals with its rule for the negation
// operator.

// For example:

//   #0
//   #1
//   #D
//   #FFFF
//   #0A1B2C3D4E5F
//   #BadCafe

// Here are some **invalid** examples that your rule should **not** match:

//   FFFF
//   -#FFFF
//   0x1234
//   #WXYZ

// The parser is already configured to parse tokens of the "hex" sort
// correctly, so once you finish adding the lexing rule, you should be able to
// use hexadecimal integer literals in the expressions you input on the page. A
// hexadecimal integer literal will show up as a NumLeaf in the AST.

// ******************
// * EXERCISE 1 END *
// ******************


// ********************
// * EXERCISE 2 START *
// ********************

// Open src/Grammar/Lexer.ts. Add a new lexing rule for *character literals*,
// as defined below.

// Your new lexing rule **must** be named "char". This will be the name of the
// token sort for character literals. The name of a lexing rule is written to
// the left of the colon: for example, the provided grammar includes rules
// named "float" and "parenL".

// A character literal is written with a single quote, followed by any single
// character except a single quote or a backslash, followed by another single
// quote.

// For example:

//   'a'
//   'n'
//   't'
//   'A'
//   'B'
//   '1'
//   '$'
//   '?'
//   '"'

// In addition to the definition above, there are four special character
// literals that your rule should match:

//   '\''
//   '\\'
//   '\n'
//   '\t'

// You must have **one** rule that matches **all** of the valid character
// literals: it won't work if you try to have a separate rule for the four
// special character literals.

// Here are some **invalid** examples that your rule should **not** match:

//   a
//   'abc'
//   "a"
//   '\'
//   '''

// The parser is already configured to parse tokens of the "char" sort
// correctly, so once you finish adding the lexing rule, you should be able to
// use character literals in the expressions you input on the page. A character
// literal will show up as a NumLeaf in the AST, according to the Unicode code
// point of the character: for example, the character literal 'A' shows up as
// the number 65, because the Unicode code point of the character 'A' is 65.

// ******************
// * EXERCISE 2 END *
// ******************


// ********************
// * EXERCISE 3 START *
// ********************

// Open src/Grammar/Expression.ne. This is a Nearley file, which defines a
// *context-free grammar* and *postprocessing rules* for each *production* in
// the grammar.

// There is a rule for the %times operator in this file, but it is ambiguous: it
// produces **more than one** AST for some inputs, such as "1 * 2 * 3".

// Rewrite this rule so that it is not ambiguous, meaning it always produces
// exactly one AST for any valid input. Do not modify any other rule in the
// grammar.

// Specifically, the %times operator should be *left-associative*, it should
// have a *higher precedence* than the %plus and %minus operators, and it
// should have a *lower precedence* than the %negate operator. When you
// complete exercise 4, the %times operator should also have a *lower
// precedence* than the %exponent operator.

// For example:

//   1 * 2 * 3
//   should produce the same AST as
//   (1 * 2) * 3

//   1 * 2 * 3 * 4
//   should produce the same AST as
//   ((1 * 2) * 3) * 4

//   -1 * 2 + --3 * 4
//   should produce the same AST as
//   ((-1) * 2) + ((--3) * 4)

//   -1 * 2 + --3 ^ 4 * ---5 ^ 6 - 7
//   should produce the same AST as
//   (((-1) * 2) + (((--3) ^ 4) * ((---5) ^ 6))) - 7

// Do not change the postprocessing function for the %times rule: in principle
// it is possible to hack together a (fairly painful) solution to this problem
// that way, but that's not the exercise we're going for here.

// ******************
// * EXERCISE 3 END *
// ******************


// ********************
// * EXERCISE 4 START *
// ********************

// Open src/Grammar/Expression.ne. This is a Nearley file, which defines a
// *context-free grammar* and *postprocessing rules* for each *production* in
// the grammar.

// The lexer is already configured to recognize the %exponent operator, but
// there are no grammar rules for parsing an exponent expression. Add and
// modify the appropriate rules so that the %exponent operator can be parsed
// unambiguously.

// Specifically, the %exponent operator should be *right-associative*, it
// should have a *higher precedence* than the %plus and %minus operators, and
// it should have a *lower precedence* than the %negate operator. When you
// complete exercise 3, the %exponent operator should also have a
// *higher precedence* than the %times operator.

// For example:

//   1 ^ 2 ^ 3
//   should produce the same AST as
//   1 ^ (2 ^ 3)

//   1 ^ 2 ^ 3 ^ 4
//   should produce the same AST as
//   1 ^ (2 ^ (3 ^ 4))

//   1 ^ 2 + 3 ^ 4
//   should produce the same AST as
//   (1 ^ 2) + (3 ^ 4)

//   1 ^ 2 * 3 ^ 4
//   should produce the same AST as
//   (1 ^ 2) * (3 ^ 4)

//   -1 ^ 2 * --3 ^ 4
//   should produce the same AST as
//   ((-1) ^ 2) * ((--3) ^ 4)

//   1 ^ 2 ^ 3 * 4 * 5 + 6 - 7
//   should produce the same AST as
//   ((((1 ^ (2 ^ 3)) * 4) * 5) + 6) - 7

// You will need to add rules **and** modify at least one existing rule in
// order to get the correct results in this exercise. It's your job to figure
// out which you need to modify, but you must not modify any of the "atom"
// rules or add any new "atom" rules.

// For the postprocessing function in the rule you add for the %exponent
// symbol, you must use postprocessWith(buildExponentExpr). Do not modify the
// definition of buildExponentExpr.

// ******************
// * EXERCISE 4 END *
// ******************
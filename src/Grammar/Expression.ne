# This is a Nearley file used to *generate* the gen/Grammar/Expression.ts file.
# When this project is built, all of the .ne files are compiled to .ts files.

# Comments in a .ne file begin with a hash.

# There is no multi-line comment syntax in Nearley (like /* */ in TypeScript),
# only single-line comments beginning with a hash.

# We will cover parsing with Nearley in lecture after we cover lexing with
# regexes. For a quick refresher, read **only** the "Vocabulary" section in the
# "Writing a parser" page from the Nearley documentation, found here:
# https://nearley.js.org/docs/grammar#vocabulary

# **DO NOT FOLLOW THE INSTALLATION INSTRUCTIONS IN THE NEARLEY DOCUMENTATION.**
# In this project, Nearley will be installed automatically through our usual
# "npm i" command.

# It will also be helpful to read the "Operator precedence is not black magic"
# section in the "How to grammar good" page from the Nearley documentation,
# found here:
# https://nearley.js.org/docs/how-to-grammar-good#operator-precedence-is-not-black-magic

# The rest of the Nearley documentation may be interesting, but won't be very
# relevant to this assignment: we're using Nearley in a relatively simple way,
# without using very many of its features. In particular, our postprocessWith
# function is hiding some of the implementation details of Nearley's
# postprocessing functionality, so the Nearley documentation on postprocessing
# may be a little misleading when working on this assignment.

# This command tells Nearley that we're using TypeScript (instead of
# JavaScript, which is the default.)
@preprocessor typescript

# We can include TypeScript code in a Nearley file between @{% and %} markers.
# Here we just import the types that we'll be using.
@{%
  // Within this block, we're writing TypeScript code, so we use TypeScript
  // comment syntax. This code is going to end up in the
  // gen/Grammar/Expression.ts file, so we use "../.." to navigate to the
  // project root in order to find the src folder. You should never modify the
  // files in the gen folder: they'll get overwritten each time you build this
  // project.
  import {
    Expr,
    PlusExpr, MinusExpr, TimesExpr, ExponentExpr,
    NegateExpr,
    NumLeaf, VarLeaf
  } from "../../src/AST";

  import { Token } from "moo";
  import { lexer } from "../../src/Grammar/Lexer";

  import { postprocessWith } from "../../src/Library/Parsing";

  import {
    unparenthesize,
    buildPlusExpr, buildMinusExpr, buildTimesExpr, buildExponentExpr,
    buildNegateExpr,
    buildNumLeaf, buildVarLeaf,
    convertFloat, convertHex, convertChar
  } from "../../src/Grammar/Postprocessors"
%}

# This command tells Nearley that we want to use the lexer named "lexer" that
# we imported above. Without this command, we wouldn't have a lexer, and our
# parser would be acting on individual **characters** instead of *tokens*.
@lexer lexer


# Now that we have Nearley configured and we have all the imports we need, we
# define each *production rule* in our *context-free grammar*. Our *terminals*
# are the names of our lexer rules, which are written prefixed with a %, like
# %plus for the rule named "plus".

expression1 -> expression1 %plus expression2
  {% postprocessWith(buildPlusExpr) %}

# Each production rule also comes with a *postprocessing* function, which does
# the work to actually construct the final AST. The postprocessing function is
# specified between {% and %}, and we call the postprocessWith function as a
# convenience wrapper that lets our postprocessing functions take in arguments
# in a more convenient way. All of these postprocessing functions are defined
# in src/Grammar/Postprocessors.ts, which has comments explaining the pattern.

expression1 -> expression1 %dash expression2
  {% postprocessWith(buildMinusExpr) %}

# The id postprocessor is a special built-in Nearley feature: it's the "no-op"
# postprocessor, which does no work and simply returns the exact tree that it
# parsed. This makes sense for rules with only a single nonterminal on the
# right side, like this one below, where a postprocessor for expression2 has
# already constructed an AST.

expression1 -> expression2
  {% id %}


expression2 -> expression2 %times expression3
  {% postprocessWith(buildTimesExpr) %}

expression2 -> expression3
  {% id %}

expression3 -> expression4 %exponent expression3
  {% postprocessWith(buildExponentExpr) %}

expression3 -> expression4
  {% id %}

expression4 -> atom {% id %}

expression4 -> %dash expression4
  {% postprocessWith(buildNegateExpr) %}

atom -> %parenL expression1 %parenR
  {% postprocessWith(unparenthesize) %}

atom -> number
  {% postprocessWith(buildNumLeaf) %}

atom -> %name
  {% postprocessWith(buildVarLeaf) %}


number -> %hex
  {% postprocessWith(convertHex) %}

number -> %float
  {% postprocessWith(convertFloat) %}

number -> %char
  {% postprocessWith(convertChar) %}
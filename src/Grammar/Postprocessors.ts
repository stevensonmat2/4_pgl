// This file contains all of the postprocessing functions that get called in
// the .ne files. You can drop breakpoints in these functions to see how the
// postprocessing functions are called during parsing.

import { Token } from "moo";

import {
  Expr,
  PlusExpr, MinusExpr, TimesExpr, ExponentExpr,
  NegateExpr,
  NumLeaf, VarLeaf,
} from "../AST";

// This function is called from the first expression1 rule in
// src/Grammar/Expression.ne. When Nearley calls a postprocessing function for
// a production rule, it passes **exactly one argument for each terminal or
// nonterminal in the rule**.
export function buildPlusExpr(
  leftSubtree: Expr,
  plusSign: Token,
  rightSubtree: Expr
): PlusExpr {
  // The expression1 rule has three "terminals or nonterminals": the expression1
  // nonterminal, followed by the %plus terminal, followed by the expression2
  // nonterminal. In this function, the leftSubtree argument is the AST
  // corresponding to that expression1 nonterminal, the plusSign argument is the
  // token corresponding to the %plus terminal, and the rightSubtree argument is
  // the AST corresponding to the expression2 nonterminal.
  return {
    tag: "plus",
    leftSubexpr: leftSubtree,
    rightSubexpr: rightSubtree
  };
}

export function buildMinusExpr(
  leftSubtree: Expr,
  minusSign: Token,
  rightSubtree: Expr
): MinusExpr {
  return {
    tag: "minus",
    leftSubexpr: leftSubtree,
    rightSubexpr: rightSubtree
  };
}

export function buildTimesExpr(
  leftSubtree: Expr,
  timesSign: Token,
  rightSubtree: Expr
): TimesExpr {
  return {
    tag: "times",
    leftSubexpr: leftSubtree,
    rightSubexpr: rightSubtree
  };
}

export function buildExponentExpr(
  leftSubtree: Expr,
  exponentSign: Token,
  rightSubtree: Expr
): ExponentExpr {
  return {
    tag: "exponent",
    leftSubexpr: leftSubtree,
    rightSubexpr: rightSubtree
  };
}

export function buildNegateExpr(
  dashSign: Token,
  subtree: Expr
): NegateExpr {
  return {
    tag: "negate",
    subexpr: subtree
  };
}

export function buildNumLeaf(
  numValue: number
): NumLeaf {
  return {
    tag: "num",
    value: numValue
  };
}

export function buildVarLeaf(
  nameToken: Token
): VarLeaf {
  return {
    tag: "var",
    name: nameToken.text
  };
}

export function convertHex(
  hexToken: Token
): number {
  return Number.parseInt(hexToken.text.slice(1), 16);
}

export function convertFloat(
  floatToken: Token
): number {
  return Number.parseFloat(floatToken.text);
}

export function convertChar(
  charToken: Token
): number {
  if (charToken.text.charAt(1) == '\\') {
    switch (charToken.text.charAt(2)) {
      case '\'': return "'".charCodeAt(0);
      case '\\': return "\\".charCodeAt(0);
      case 'n': return "\n".charCodeAt(0);
      case 't': return "\t".charCodeAt(0);
    }
  }

  return charToken.text.charCodeAt(1);
}

export function unparenthesize(
  leftParen: Token,
  tree: Expr,
  rightParen: Token
): Expr {
  return tree;
}
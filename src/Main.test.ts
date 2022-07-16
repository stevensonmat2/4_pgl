import "jest-extended";

import { Token } from "moo";
import { Grammar } from "nearley";

import {
  Expr, PlusExpr, MinusExpr, TimesExpr, ExponentExpr,
  NegateExpr,
  NumLeaf, VarLeaf
} from "./AST";

import {
  tokenize, parse, parseUnambiguous
} from "./Main";

test("hexadecimal integer literal lexing test", () => {
  let tokens: Token[];

  tokens = tokenize("#1");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("hex");
  expect(tokens[0].text).toEqual("#1");

  tokens = tokenize("#1 #F");
  expect(tokens.length).toEqual(2);
  expect(tokens[0].type).toEqual("hex");
  expect(tokens[0].text).toEqual("#1");
  expect(tokens[1].type).toEqual("hex");
  expect(tokens[1].text).toEqual("#F");

  tokens = tokenize("1+#1");
  expect(tokens.length).toEqual(3);
  expect(tokens[2].type).toEqual("hex");
  expect(tokens[2].text).toEqual("#1");

  tokens = tokenize("1-#1");
  expect(tokens.length).toEqual(2);
  expect(tokens[1].type).toEqual("hex");
  expect(tokens[1].text).toEqual("-#1");

  tokens = tokenize("#ABCD");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("hex");
  expect(tokens[0].text).toEqual("#ABCD");

  tokens = tokenize("#ABCD-");
  expect(tokens.length).toEqual(2);
  expect(tokens[0].type).toEqual("hex");
  expect(tokens[0].text).toEqual("#ABCD");

  tokens = tokenize("#aBcD");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("hex");
  expect(tokens[0].text).toEqual("#aBcD");

  tokens = tokenize("#0a1B2c3D4");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("hex");
  expect(tokens[0].text).toEqual("#0a1B2c3D4");

  tokens = tokenize("-#0a1B2c3D4");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("hex");
  expect(tokens[0].text).toEqual("-#0a1B2c3D4");

  tokens = tokenize("---#0a1B2c3D4");
  expect(tokens.length).toEqual(3);
  expect(tokens[2].type).toEqual("hex");
  expect(tokens[2].text).toEqual("-#0a1B2c3D4");

  tokens = tokenize("ABCD");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("name");
  expect(tokens[0].text).toEqual("ABCD");

  tokens = tokenize("aBcD");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("name");
  expect(tokens[0].text).toEqual("aBcD");

  tokens = tokenize("0xFFFF");
  expect(tokens.length).toEqual(2);
  expect(tokens[0].type).toEqual("float");
  expect(tokens[0].text).toEqual("0");
  expect(tokens[1].type).toEqual("name");
  expect(tokens[1].text).toEqual("xFFFF");

  // this is how to test for an expected exception
  expect(() => tokenize("#1.2")).toThrow();
});

test("character literal lexing test", () => {
  let tokens: Token[];

  tokens = tokenize("'a'");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("char");
  expect(tokens[0].text).toEqual("'a'");

  tokens = tokenize("'1'");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("char");
  expect(tokens[0].text).toEqual("'1'");

  tokens = tokenize("'Q'");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("char");
  expect(tokens[0].text).toEqual("'Q'");

  tokens = tokenize("'$'");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("char");
  expect(tokens[0].text).toEqual("'$'");

  tokens = tokenize("'?'");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("char");
  expect(tokens[0].text).toEqual("'?'");

  tokens = tokenize("'/'");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("char");
  expect(tokens[0].text).toEqual("'/'");

  tokens = tokenize("'\"'");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("char");
  expect(tokens[0].text).toEqual("'\"'");

  tokens = tokenize("'\\''");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("char");
  expect(tokens[0].text).toEqual("'\\''");

  tokens = tokenize("'\\n'");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("char");
  expect(tokens[0].text).toEqual("'\\n'");

  tokens = tokenize("'\\\\'");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("char");
  expect(tokens[0].text).toEqual("'\\\\'");

  tokens = tokenize("a");
  expect(tokens.length).toEqual(1);
  expect(tokens[0].type).toEqual("name");
  expect(tokens[0].text).toEqual("a");

  expect(() => tokenize("'abc'")).toThrow();
  expect(() => tokenize("\"a\"")).toThrow();
  expect(() => tokenize("'\\'")).toThrow();
  expect(() => tokenize("'''")).toThrow();
});

test("%times node parsing test", () => {
  expect(parse("1 * 2 * 3"))
    .toEqual([parseUnambiguous("(1 * 2) * 3")]);

  expect(parse("1 * 2 * 3 * 4"))
    .toEqual([parseUnambiguous("((1 * 2) * 3) * 4")]);

  expect(parse("-1 * 2 + --3 * 4"))
    .toEqual([parseUnambiguous("((-1) * 2) + ((--3) * 4)")]);

  expect(parse("-1 * 2 + --3 ^ 4 * ---5 ^ 6 - 7"))
    .toEqual([parseUnambiguous("(((-1) * 2) + (((--3) ^ 4) * ((---5) ^ 6))) - 7")]);
});

test("%exponent node parsing test", () => {
  expect(parse("1 ^ 2 ^ 3"))
    .toEqual([parseUnambiguous("1 ^ (2 ^ 3)")]);

  expect(parse("1 ^ 2 ^ 3 ^ 4"))
    .toEqual([parseUnambiguous("1 ^ (2 ^ (3 ^ 4))")]);

  expect(parse("1 ^ 2 + 3 ^ 4"))
    .toEqual([parseUnambiguous("(1 ^ 2) + (3 ^ 4)")]);

  expect(parse("-1 ^ 2 + --3 ^ 4"))
    .toEqual([parseUnambiguous("((-1) ^ 2) + ((--3) ^ 4)")]);

  expect(parse("-1 ^ 2 * --3 ^ 4"))
    .toEqual([parseUnambiguous("((-1) ^ 2) * ((--3) ^ 4)")]);

  expect(parse("1 ^ 2 ^ 3 * 4 * 5 + 6 - 7"))
    .toEqual([parseUnambiguous("((((1 ^ (2 ^ 3)) * 4) * 5) + 6) - 7")]);
});

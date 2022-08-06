import { Lexer, Rules } from "moo";
import { compileLexer } from "../Library/Parsing";

const lexingRules: Rules = {
  _: /[ \t]+/,
  float: /-?\d+(?:\.\d*)?/,
  name: /[A-Za-z]\w*/,
  plus: /\+/,
  times: /\*/,
  exponent: /\^/,
  dash: /-/,
  parenL: /\(/,
  parenR: /\)/,
  equal: /=/,
  comma: /,/,
  hex: /#[A-Fa-f0-9]+/,
  char: /'[\d|\D|\w|\s|\.]'/,
};

export const lexer: Lexer = compileLexer(lexingRules);
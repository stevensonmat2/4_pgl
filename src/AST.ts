export type Expr =
  PlusExpr | MinusExpr | TimesExpr | ExponentExpr |
  NegateExpr |
  NumLeaf | VarLeaf;


export type BinaryExpr = {
  readonly leftSubexpr: Expr;
  readonly rightSubexpr: Expr;
};

export type UnaryExpr = {
  readonly subexpr: Expr;
};


export type PlusExpr = { readonly tag: "plus" } & BinaryExpr;
export type MinusExpr = { readonly tag: "minus" } & BinaryExpr;
export type TimesExpr = { readonly tag: "times" } & BinaryExpr;
export type ExponentExpr = { readonly tag: "exponent" } & BinaryExpr;
export type NegateExpr = { readonly tag: "negate" } & UnaryExpr;

export type NumLeaf = { readonly tag: "num", readonly value: number };
export type VarLeaf = { readonly tag: "var", readonly name: string };


export function treeToString(tree: Expr): string {
  switch (tree.tag) {
    case "plus":
      return (
        "(" + treeToString(tree.leftSubexpr) +
        " + " + treeToString(tree.rightSubexpr) +
        ")"
      );

    case "minus":
      return (
        "(" + treeToString(tree.leftSubexpr) +
        " - " + treeToString(tree.rightSubexpr) +
        ")"
      );

    case "times":
      return (
        "(" + treeToString(tree.leftSubexpr) +
        " * " + treeToString(tree.rightSubexpr) +
        ")"
      );

    case "exponent":
      return (
        "(" + treeToString(tree.leftSubexpr) +
        " ^ " + treeToString(tree.rightSubexpr) +
        ")"
      );

    case "negate":
      return "(- " + treeToString(tree.subexpr) + ")";

    case "num":
      return tree.value.toString();

    case "var":
      return tree.name;
  }
}
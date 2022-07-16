  import * as moo from "moo";

  export const compileLexer = (rules: moo.Rules): moo.Lexer => {
    const lexer = moo.compile(rules);
    lexer.next = (next => () => {
      let token: moo.Token | undefined;
      for (
        token = next.call(lexer);
        token && /_+/.test(token.type!);
        token = next.call(lexer)
      );
      return token;
    })(lexer.next);
    return lexer;
  }

  export const postprocessWith =
    <Ts extends any[], T> (
      f: (...args: Ts) => T
    ) => (
      args: Ts
    ): T =>
      f(...args);
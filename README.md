# CS 320, Summer 2022

# Assignment 4

In previous assignments, we've been working on code that takes ASTs as input. In this assignment, we'll focus in on the *syntax analysis* phase of our interpreter, which **produces** the ASTs that the rest of the interpreter phases operate on.

This assignment is going to be a little different from most of the other assignments in this course: this is the **only** assignment where you're going to be working directly with *regular expressions* (regexes) and *context-free grammars* (CFGs). Both of these are quite deep concepts that you can explore in more theoretical depth in a "theory of computation" course like CS 311.

The goal of this assignment is for you to gain some hands-on experience specifying *tokenizing rules* and *parsing rules*. In the field of PL, these are our primary use cases for regexes and CFGs.

This assignment will depend heavily on the week 4/5 lecture material, so make sure to review those lecture recordings if you need to!

## Getting help

Before you ask a question, **re-read the comments in the part of the assignment that you're having trouble with**, and see if there's anything in the comments that isn't making sense to you. If you can point to a specific part of the text that you're confused about, it's much easier for me to help you!

## Assignment setup

Download the code of the assignment project from <https://gitlab.cecs.pdx.edu/cas28/assignment-4-cs-320-summer-2022/-/archive/main/assignment-4-cs-320-summer-2022-main.zip>.

If you're using macOS or a GUI file manager on Linux, make sure to turn on the "show hidden files" setting in your file manager when you extract the zip archive. There should be a folder called ".vscode" in the archive, which will be invisible in your file manager by default because its name begins with a dot.

In VSCode, open the "File" menu and click "Open Folder..." if that option is there; otherwise click "Open". Either way, you should open the ***folder*** that you just extracted: the folder that contains `README.md`, `package.json`, etc. This is important: ***open the folder itself***, not any file ***in*** the folder. This is how VSCode knows where to find the project settings.

Alternatively, if you're working in a command line, navigate to this same folder in your terminal.

## Installing the dependencies, building, running, testing, submitting

This project is set up the same way as assignment 1, and all of the assignments in this course will have this same project structure.

Remember to run the `npm i` command once in the project folder before starting your work. This needs to be done once for each assignment.

Building, running, testing, and debugging the code works the same way as in assignment 1. Make sure to review the assignment 1 README if you need to.

Each assignment in this course will have you reading through comments in the `src/Main.ts` file. **After reading the rest of this README**, open that file to start the assignment.

The `src/Library.ts` file from assignment 1 has become the `src/Library` folder, but it still serves the same purpose. You're not expected to read or understand this code, and you shouldn't modify it, but you're welcome to ask about it if you're curious!

When you're finished with your code, submit it to the assignment 4 dropbox on Canvas. The soft deadline for this assignment is listed on its Canvas dropbox page.

## Code requirements

The general code requirements that you're expected to follow are also the same as in assignment 1. Make sure to review the assignment 1 README if you need to!

## The language

Our toy language in this assignment is a **sublanguage** of the one from assignment 3: there are only ***expressions***, not ***statements***. You can find the complete list of expression forms in `src/AST.ts`.

This is just to help us focus on the core concepts of parsing for now. The language will grow again soon!

## The webpage

This time, the assignment webpage has two sections:

- *Tokenizing*, where the input source code is converted to an array of tokens.
- *Parsing*, where the input source code is converted to an AST, with two functions:
  - `parse`, which returns **every possible** valid AST for the input source.
  - `parseUnambiguous`, which returns an error if there is not **exactly one** valid AST for the input source.

Each input text box on the page accepts an *expression*, as defined in `src/AST.ts`.

## The code

Our focus in this assignment is in the `src/Grammar` folder, where the tokenizing and parsing rules for our language are specified:

- `src/Grammar/Lexer.ts` specifies the tokenizing rules in the format described in lecture notes 5 (syntax and lexical analysis).
- `src/Grammar/Expression.ne` specifies the parsing rules with the theory described in lecture notes 6 (parsing theory), in the format described in lecture notes 7 (applied parsing).
- `src/Grammar/Postprocessors.ts` specifies the postprocessing step described in lecture notes 7 (applied parsing).

The `gen` folder is automatically generated each time the project is built, so you should not edit any files in it by hand: think of it as another folder like `build`.

As usual, open `src/Main.ts` to start reading about the provided code.

## Grading

Each exercise is worth five points. You will get partial credit for partially-correct answers, but not for answers that fail to compile.

**THE AUTOMATED TESTS ARE NOT A COMPLETE GUARANTEE OF YOUR GRADE.** They are meant to catch most possible mistakes, but they're not perfect. Your functions must work as specified for **all possible inputs** of the correct type, not just for the specific inputs that are tested in the automated tests. The tests also do not check the requirements described in the "Code requirements" section above.
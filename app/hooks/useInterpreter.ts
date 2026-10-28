import {
  useEffect,
  useState,
} from 'react';

import { CharStream, CommonTokenStream } from 'antlr4ng';
import { PseudocodeLexer } from './interpreter/.antlr/PseudocodeLexer';
import { PseudocodeParser } from './interpreter/.antlr/PseudocodeParser';
import TsInterpreterVisitor from './interpreter/TsInterpreterVisitor';
import TraceInterpreterVisitor from './interpreter/TraceInterpreterVisitor';

/**
 * Provides a hook to interpret pseudocode.
 *
 * @param source The source code to interpret.
 */
export default function useInterpreter(
  source: string,
) {
  const [js, setJs] = useState('');
  const [tree, setTree] = useState('');
  const [trace, setTrace] = useState('');
  const [error, setError] = useState(null as string | null);

  useEffect(() => {
    try {
      const inputStream = CharStream.fromString(source);
      const lexer = new PseudocodeLexer(inputStream);
      const tokenStream = new CommonTokenStream(lexer);
      const parser = new PseudocodeParser(tokenStream);

      const tree = parser.program();

      // JS Compiler
      const jsVisitor = new TsInterpreterVisitor();
      setJs(jsVisitor.visit(tree)!);

      // Raw Parse Tree
      setTree(formatParseTree(tree.toStringTree(parser)));

      // Execution Trace (JSON)
      const traceLexer = new PseudocodeLexer(CharStream.fromString(source));
      const traceParser = new PseudocodeParser(
        new CommonTokenStream(traceLexer),
      );
      const traceTree = traceParser.program();
      const traceVisitor = new TraceInterpreterVisitor();
      traceVisitor.visit(traceTree);

      setTrace(JSON.stringify(traceVisitor.steps, null, 2));
      setError(null);
    } catch (error: any) {
      setJs('');
      setTree('');
      setTrace('');
      setError(`Error: ${error.message}`);
    }
  }, [source]);

  return [
    js, tree, trace, error,
  ] as const;
}

/*********************
 * Private functions *
 *********************/

/**
 * Formats the given parse tree into a human-readable string.
 *
 * @param treeString The input parse tree
 * @returns A human-readable parse tree
 */
function formatParseTree(treeString: string): string {
  let indentLevel = 0;
  let result = '';
  for (let i = 0; i < treeString.length; i++) {
    const char = treeString[i];
    if (char === '(') {
      result += '\n' + '  '.repeat(indentLevel);
      indentLevel++;
    } else if (char === ')') {
      indentLevel--;
    }
    result += char;
  }
  return result.trim();
}

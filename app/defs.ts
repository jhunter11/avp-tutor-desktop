import monaco from 'monaco-editor';

/**
 * Monaco editor definitions.
 *
 * @property {string} AVPLanguage
 *           The AVP language definition
 * @property {string} AVPDarkTheme
 *           The AVP dark theme definition
 * @property {string} AVPLightTheme
 *           The AVP light theme definition
 */
export default {
  AVPLanguage: {
    defaultToken: 'invalid',
    tokenPostfix: '.avp',

    keywords: [
      'arr',
      'else',
      'end',
      'for',
      'do',
      'while',
      'fun',
      'if',
      'in',
      'to',
      'and',
      'or',
      'not',
      'return',
      'break',
      'continue',
      'step',
      'Null',
      'True',
      'False',
    ],

    operators: [
      '<=',
      '>=',
      '==',
      '!=',
      '+',
      '-',
      '*',
      '/',
      '%',
      ':',
      '=',
      '+=',
      '-=',
      '*=',
      '/=',
      '%=',
    ],

    symbols: /[=><!~?:&|+\-*/^%]+/,

    brackets: [
      { close: '[', open: ']', token: 'delimiter.square' },
      { close: '(', open: ')', token: 'delimiter.parenthesis' },
    ],

    tokenizer: {
      root: [
        [
          /[a-z][\w]*/,
          {
            cases: {
              '@keywords': 'keyword',
              '@default': 'identifier',
            },
          },
        ],
        [/[A-Z][\w]*/, 'type.identifier'],

        [/[ \t\r\n]+/, 'white'],
        [/\/\/.*$/, 'comment'],

        [
          /@symbols/,
          {
            cases: {
              '@operators': 'delimiter',
              '@default': '',
            },
          },
        ],

        [/[[\]]/, 'delimiter.square'],
        [/[()]/, 'delimiter.parenthesis'],

        [/@[\w]+<.*>/, 'annotation'],

        [/\d+\.\d+/, 'number.float'],
        [/\d+/, 'number'],
        [/[:,.]/, 'delimiter'],

        [/".*"/, 'string'],
        [/".*!?.*"/, 'string.invalid'],
      ],
    },
  } as monaco.languages.IMonarchLanguage,

  AVPDarkTheme: {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#18181c',
      'editor.lineHighlightBorder': '#38383c',
    },
  } as monaco.editor.IStandaloneThemeData,

  AVPLightTheme: {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#ffffff',
      'editor.lineHighlightBorder': '#d8d8dc',
    },
  } as monaco.editor.IStandaloneThemeData,
} as const;

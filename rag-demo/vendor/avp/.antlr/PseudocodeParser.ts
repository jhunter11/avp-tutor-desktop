
import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { PseudocodeListener } from "./PseudocodeListener.js";
import { PseudocodeVisitor } from "./PseudocodeVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class PseudocodeParser extends antlr.Parser {
    public static readonly TYPE_INT = 1;
    public static readonly TYPE_FLOAT = 2;
    public static readonly TYPE_STRING = 3;
    public static readonly TYPE_BOOL = 4;
    public static readonly TYPE_DOUBLE = 5;
    public static readonly ARR = 6;
    public static readonly TO = 7;
    public static readonly FUN = 8;
    public static readonly FOR = 9;
    public static readonly IN = 10;
    public static readonly IF = 11;
    public static readonly ELSE = 12;
    public static readonly ELSEIF = 13;
    public static readonly RETURN = 14;
    public static readonly END = 15;
    public static readonly WHILE = 16;
    public static readonly DO = 17;
    public static readonly BREAK = 18;
    public static readonly AND = 19;
    public static readonly OR = 20;
    public static readonly CONTINUE = 21;
    public static readonly TRUE = 22;
    public static readonly FALSE = 23;
    public static readonly NULL_VAL = 24;
    public static readonly LBRACK = 25;
    public static readonly RBRACK = 26;
    public static readonly LPAREN = 27;
    public static readonly RPAREN = 28;
    public static readonly COLON = 29;
    public static readonly COMMA = 30;
    public static readonly SEMI = 31;
    public static readonly AT = 32;
    public static readonly PLUS_EQ = 33;
    public static readonly MINUS_EQ = 34;
    public static readonly EQ = 35;
    public static readonly EQEQ = 36;
    public static readonly NOTEQ = 37;
    public static readonly PLUS = 38;
    public static readonly MINUS = 39;
    public static readonly POWER = 40;
    public static readonly STAR = 41;
    public static readonly SLASH = 42;
    public static readonly LESS_EQ = 43;
    public static readonly GREATER_EQ = 44;
    public static readonly LT = 45;
    public static readonly GT = 46;
    public static readonly MOD = 47;
    public static readonly MOD_EQ = 48;
    public static readonly ID = 49;
    public static readonly FLOAT = 50;
    public static readonly INT = 51;
    public static readonly STRING = 52;
    public static readonly NL = 53;
    public static readonly WS = 54;
    public static readonly COMMENT = 55;
    public static readonly RULE_program = 0;
    public static readonly RULE_statement = 1;
    public static readonly RULE_assignment = 2;
    public static readonly RULE_assignable = 3;
    public static readonly RULE_arrayInitialization = 4;
    public static readonly RULE_metadata = 5;
    public static readonly RULE_metadataParams = 6;
    public static readonly RULE_metadataParam = 7;
    public static readonly RULE_block = 8;
    public static readonly RULE_functionDecl = 9;
    public static readonly RULE_paramList = 10;
    public static readonly RULE_param = 11;
    public static readonly RULE_forEachLoop = 12;
    public static readonly RULE_forLoop = 13;
    public static readonly RULE_whileLoop = 14;
    public static readonly RULE_doWhileLoop = 15;
    public static readonly RULE_ifStatement = 16;
    public static readonly RULE_functionCallStmt = 17;
    public static readonly RULE_returnStatement = 18;
    public static readonly RULE_breakStatement = 19;
    public static readonly RULE_continueStatement = 20;
    public static readonly RULE_expressionList = 21;
    public static readonly RULE_expression = 22;
    public static readonly RULE_logicalOrExpression = 23;
    public static readonly RULE_logicalAndExpression = 24;
    public static readonly RULE_comparisonExpression = 25;
    public static readonly RULE_additiveExpression = 26;
    public static readonly RULE_multiplicativeExpression = 27;
    public static readonly RULE_powerExpression = 28;
    public static readonly RULE_unaryExpression = 29;
    public static readonly RULE_primaryExpression = 30;
    public static readonly RULE_atom = 31;

    public static readonly literalNames = [
        null, null, null, null, null, null, "'arr'", "'to'", "'fun'", "'for'", 
        "'in'", "'if'", "'else'", null, "'return'", "'end'", "'while'", 
        "'do'", "'break'", "'and'", "'or'", "'continue'", null, null, null, 
        "'['", "']'", "'('", "')'", "':'", "','", "';'", "'@'", "'+='", 
        "'-='", "'='", "'=='", "'!='", "'+'", "'-'", "'**'", "'*'", "'/'", 
        "'<='", "'>='", "'<'", "'>'", "'%'", "'%='"
    ];

    public static readonly symbolicNames = [
        null, "TYPE_INT", "TYPE_FLOAT", "TYPE_STRING", "TYPE_BOOL", "TYPE_DOUBLE", 
        "ARR", "TO", "FUN", "FOR", "IN", "IF", "ELSE", "ELSEIF", "RETURN", 
        "END", "WHILE", "DO", "BREAK", "AND", "OR", "CONTINUE", "TRUE", 
        "FALSE", "NULL_VAL", "LBRACK", "RBRACK", "LPAREN", "RPAREN", "COLON", 
        "COMMA", "SEMI", "AT", "PLUS_EQ", "MINUS_EQ", "EQ", "EQEQ", "NOTEQ", 
        "PLUS", "MINUS", "POWER", "STAR", "SLASH", "LESS_EQ", "GREATER_EQ", 
        "LT", "GT", "MOD", "MOD_EQ", "ID", "FLOAT", "INT", "STRING", "NL", 
        "WS", "COMMENT"
    ];
    public static readonly ruleNames = [
        "program", "statement", "assignment", "assignable", "arrayInitialization", 
        "metadata", "metadataParams", "metadataParam", "block", "functionDecl", 
        "paramList", "param", "forEachLoop", "forLoop", "whileLoop", "doWhileLoop", 
        "ifStatement", "functionCallStmt", "returnStatement", "breakStatement", 
        "continueStatement", "expressionList", "expression", "logicalOrExpression", 
        "logicalAndExpression", "comparisonExpression", "additiveExpression", 
        "multiplicativeExpression", "powerExpression", "unaryExpression", 
        "primaryExpression", "atom",
    ];

    public get grammarFileName(): string { return "Pseudocode.g4"; }
    public get literalNames(): (string | null)[] { return PseudocodeParser.literalNames; }
    public get symbolicNames(): (string | null)[] { return PseudocodeParser.symbolicNames; }
    public get ruleNames(): string[] { return PseudocodeParser.ruleNames; }
    public get serializedATN(): number[] { return PseudocodeParser._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, PseudocodeParser._ATN, PseudocodeParser.decisionsToDFA, new antlr.PredictionContextCache());
    }
    public program(): ProgramContext {
        let localContext = new ProgramContext(this.context, this.state);
        this.enterRule(localContext, 0, PseudocodeParser.RULE_program);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 68;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 477952) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & 2228225) !== 0)) {
                {
                this.state = 66;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case PseudocodeParser.FUN:
                case PseudocodeParser.FOR:
                case PseudocodeParser.IF:
                case PseudocodeParser.RETURN:
                case PseudocodeParser.WHILE:
                case PseudocodeParser.DO:
                case PseudocodeParser.BREAK:
                case PseudocodeParser.AT:
                case PseudocodeParser.ID:
                    {
                    this.state = 64;
                    this.statement();
                    }
                    break;
                case PseudocodeParser.NL:
                    {
                    this.state = 65;
                    this.match(PseudocodeParser.NL);
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                }
                this.state = 70;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 71;
            this.match(PseudocodeParser.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public statement(): StatementContext {
        let localContext = new StatementContext(this.context, this.state);
        this.enterRule(localContext, 2, PseudocodeParser.RULE_statement);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 76;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 73;
                    this.metadata();
                    }
                    }
                }
                this.state = 78;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 2, this.context);
            }
            this.state = 89;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 3, this.context) ) {
            case 1:
                {
                this.state = 79;
                this.assignment();
                }
                break;
            case 2:
                {
                this.state = 80;
                this.functionDecl();
                }
                break;
            case 3:
                {
                this.state = 81;
                this.functionCallStmt();
                }
                break;
            case 4:
                {
                this.state = 82;
                this.forEachLoop();
                }
                break;
            case 5:
                {
                this.state = 83;
                this.forLoop();
                }
                break;
            case 6:
                {
                this.state = 84;
                this.doWhileLoop();
                }
                break;
            case 7:
                {
                this.state = 85;
                this.ifStatement();
                }
                break;
            case 8:
                {
                this.state = 86;
                this.whileLoop();
                }
                break;
            case 9:
                {
                this.state = 87;
                this.returnStatement();
                }
                break;
            case 10:
                {
                this.state = 88;
                this.breakStatement();
                }
                break;
            }
            this.state = 94;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 4, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 91;
                    _la = this.tokenStream.LA(1);
                    if(!(_la === 31 || _la === 53)) {
                    this.errorHandler.recoverInline(this);
                    }
                    else {
                        this.errorHandler.reportMatch(this);
                        this.consume();
                    }
                    }
                    }
                }
                this.state = 96;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 4, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public assignment(): AssignmentContext {
        let localContext = new AssignmentContext(this.context, this.state);
        this.enterRule(localContext, 4, PseudocodeParser.RULE_assignment);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 100;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 32) {
                {
                {
                this.state = 97;
                this.metadata();
                }
                }
                this.state = 102;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 103;
            this.assignable();
            this.state = 104;
            _la = this.tokenStream.LA(1);
            if(!(((((_la - 33)) & ~0x1F) === 0 && ((1 << (_la - 33)) & 7) !== 0))) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 107;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case PseudocodeParser.TRUE:
            case PseudocodeParser.FALSE:
            case PseudocodeParser.NULL_VAL:
            case PseudocodeParser.LPAREN:
            case PseudocodeParser.MINUS:
            case PseudocodeParser.ID:
            case PseudocodeParser.FLOAT:
            case PseudocodeParser.INT:
            case PseudocodeParser.STRING:
                {
                this.state = 105;
                this.expression();
                }
                break;
            case PseudocodeParser.ARR:
                {
                this.state = 106;
                this.arrayInitialization();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public assignable(): AssignableContext {
        let localContext = new AssignableContext(this.context, this.state);
        this.enterRule(localContext, 6, PseudocodeParser.RULE_assignable);
        try {
            this.state = 115;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 7, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 109;
                this.match(PseudocodeParser.ID);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 110;
                this.match(PseudocodeParser.ID);
                this.state = 111;
                this.match(PseudocodeParser.LBRACK);
                this.state = 112;
                this.expression();
                this.state = 113;
                this.match(PseudocodeParser.RBRACK);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public arrayInitialization(): ArrayInitializationContext {
        let localContext = new ArrayInitializationContext(this.context, this.state);
        this.enterRule(localContext, 8, PseudocodeParser.RULE_arrayInitialization);
        let _la: number;
        try {
            this.state = 186;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 17, this.context) ) {
            case 1:
                localContext = new RangeArrayContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 117;
                this.match(PseudocodeParser.ARR);
                this.state = 118;
                this.match(PseudocodeParser.LBRACK);
                this.state = 122;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 53) {
                    {
                    {
                    this.state = 119;
                    this.match(PseudocodeParser.NL);
                    }
                    }
                    this.state = 124;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 125;
                (localContext as RangeArrayContext)._from_ = this.expression();
                this.state = 126;
                this.match(PseudocodeParser.TO);
                this.state = 130;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 53) {
                    {
                    {
                    this.state = 127;
                    this.match(PseudocodeParser.NL);
                    }
                    }
                    this.state = 132;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 133;
                (localContext as RangeArrayContext)._to = this.expression();
                this.state = 137;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 53) {
                    {
                    {
                    this.state = 134;
                    this.match(PseudocodeParser.NL);
                    }
                    }
                    this.state = 139;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 140;
                this.match(PseudocodeParser.RBRACK);
                }
                break;
            case 2:
                localContext = new SizeArrayContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 142;
                this.match(PseudocodeParser.ARR);
                this.state = 143;
                this.match(PseudocodeParser.LPAREN);
                this.state = 147;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 53) {
                    {
                    {
                    this.state = 144;
                    this.match(PseudocodeParser.NL);
                    }
                    }
                    this.state = 149;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 150;
                (localContext as SizeArrayContext)._size = this.expression();
                this.state = 159;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 30) {
                    {
                    this.state = 151;
                    this.match(PseudocodeParser.COMMA);
                    this.state = 155;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    while (_la === 53) {
                        {
                        {
                        this.state = 152;
                        this.match(PseudocodeParser.NL);
                        }
                        }
                        this.state = 157;
                        this.errorHandler.sync(this);
                        _la = this.tokenStream.LA(1);
                    }
                    this.state = 158;
                    (localContext as SizeArrayContext)._defaultVal = this.expression();
                    }
                }

                this.state = 164;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 53) {
                    {
                    {
                    this.state = 161;
                    this.match(PseudocodeParser.NL);
                    }
                    }
                    this.state = 166;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 167;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 3:
                localContext = new ValueArrayContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 169;
                this.match(PseudocodeParser.ARR);
                this.state = 170;
                this.match(PseudocodeParser.LBRACK);
                this.state = 174;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 53) {
                    {
                    {
                    this.state = 171;
                    this.match(PseudocodeParser.NL);
                    }
                    }
                    this.state = 176;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 177;
                this.expressionList();
                this.state = 181;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 53) {
                    {
                    {
                    this.state = 178;
                    this.match(PseudocodeParser.NL);
                    }
                    }
                    this.state = 183;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 184;
                this.match(PseudocodeParser.RBRACK);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public metadata(): MetadataContext {
        let localContext = new MetadataContext(this.context, this.state);
        this.enterRule(localContext, 10, PseudocodeParser.RULE_metadata);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 188;
            this.match(PseudocodeParser.AT);
            this.state = 189;
            this.match(PseudocodeParser.ID);
            this.state = 190;
            this.match(PseudocodeParser.LT);
            this.state = 192;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (((((_la - 49)) & ~0x1F) === 0 && ((1 << (_la - 49)) & 15) !== 0)) {
                {
                this.state = 191;
                this.metadataParams();
                }
            }

            this.state = 194;
            this.match(PseudocodeParser.GT);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public metadataParams(): MetadataParamsContext {
        let localContext = new MetadataParamsContext(this.context, this.state);
        this.enterRule(localContext, 12, PseudocodeParser.RULE_metadataParams);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 196;
            this.metadataParam();
            this.state = 201;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 30) {
                {
                {
                this.state = 197;
                this.match(PseudocodeParser.COMMA);
                this.state = 198;
                this.metadataParam();
                }
                }
                this.state = 203;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public metadataParam(): MetadataParamContext {
        let localContext = new MetadataParamContext(this.context, this.state);
        this.enterRule(localContext, 14, PseudocodeParser.RULE_metadataParam);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 204;
            _la = this.tokenStream.LA(1);
            if(!(((((_la - 49)) & ~0x1F) === 0 && ((1 << (_la - 49)) & 15) !== 0))) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public block(): BlockContext {
        let localContext = new BlockContext(this.context, this.state);
        this.enterRule(localContext, 16, PseudocodeParser.RULE_block);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 209;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 20, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 206;
                    this.statement();
                    }
                    }
                }
                this.state = 211;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 20, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public functionDecl(): FunctionDeclContext {
        let localContext = new FunctionDeclContext(this.context, this.state);
        this.enterRule(localContext, 18, PseudocodeParser.RULE_functionDecl);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 212;
            this.match(PseudocodeParser.FUN);
            this.state = 213;
            this.match(PseudocodeParser.ID);
            this.state = 214;
            this.match(PseudocodeParser.LPAREN);
            this.state = 216;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 32 || _la === 49) {
                {
                this.state = 215;
                this.paramList();
                }
            }

            this.state = 218;
            this.match(PseudocodeParser.RPAREN);
            this.state = 219;
            this.match(PseudocodeParser.COLON);
            this.state = 221;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 220;
                this.match(PseudocodeParser.NL);
                }
                }
                this.state = 223;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 53);
            this.state = 225;
            this.block();
            this.state = 226;
            this.match(PseudocodeParser.END);
            this.state = 227;
            this.match(PseudocodeParser.FUN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public paramList(): ParamListContext {
        let localContext = new ParamListContext(this.context, this.state);
        this.enterRule(localContext, 20, PseudocodeParser.RULE_paramList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 229;
            this.param();
            this.state = 234;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 30) {
                {
                {
                this.state = 230;
                this.match(PseudocodeParser.COMMA);
                this.state = 231;
                this.param();
                }
                }
                this.state = 236;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public param(): ParamContext {
        let localContext = new ParamContext(this.context, this.state);
        this.enterRule(localContext, 22, PseudocodeParser.RULE_param);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 240;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 32) {
                {
                {
                this.state = 237;
                this.metadata();
                }
                }
                this.state = 242;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 243;
            this.match(PseudocodeParser.ID);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public forEachLoop(): ForEachLoopContext {
        let localContext = new ForEachLoopContext(this.context, this.state);
        this.enterRule(localContext, 24, PseudocodeParser.RULE_forEachLoop);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 245;
            this.match(PseudocodeParser.FOR);
            this.state = 249;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 32) {
                {
                {
                this.state = 246;
                this.metadata();
                }
                }
                this.state = 251;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 253;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 27) {
                {
                this.state = 252;
                this.match(PseudocodeParser.LPAREN);
                }
            }

            this.state = 255;
            this.match(PseudocodeParser.ID);
            this.state = 256;
            this.match(PseudocodeParser.IN);
            this.state = 257;
            this.match(PseudocodeParser.ID);
            this.state = 259;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 28) {
                {
                this.state = 258;
                this.match(PseudocodeParser.RPAREN);
                }
            }

            this.state = 261;
            this.match(PseudocodeParser.COLON);
            this.state = 263;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 262;
                this.match(PseudocodeParser.NL);
                }
                }
                this.state = 265;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 53);
            this.state = 267;
            this.block();
            this.state = 268;
            this.match(PseudocodeParser.END);
            this.state = 269;
            this.match(PseudocodeParser.FOR);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public forLoop(): ForLoopContext {
        let localContext = new ForLoopContext(this.context, this.state);
        this.enterRule(localContext, 26, PseudocodeParser.RULE_forLoop);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 271;
            this.match(PseudocodeParser.FOR);
            this.state = 275;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 32) {
                {
                {
                this.state = 272;
                this.metadata();
                }
                }
                this.state = 277;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 278;
            this.match(PseudocodeParser.LPAREN);
            this.state = 279;
            this.assignment();
            this.state = 280;
            _la = this.tokenStream.LA(1);
            if(!(_la === 30 || _la === 31)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 281;
            this.expression();
            this.state = 282;
            _la = this.tokenStream.LA(1);
            if(!(_la === 30 || _la === 31)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            this.state = 283;
            this.assignment();
            this.state = 284;
            this.match(PseudocodeParser.RPAREN);
            this.state = 285;
            this.match(PseudocodeParser.COLON);
            this.state = 287;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 286;
                this.match(PseudocodeParser.NL);
                }
                }
                this.state = 289;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 53);
            this.state = 291;
            this.block();
            this.state = 292;
            this.match(PseudocodeParser.END);
            this.state = 293;
            this.match(PseudocodeParser.FOR);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public whileLoop(): WhileLoopContext {
        let localContext = new WhileLoopContext(this.context, this.state);
        this.enterRule(localContext, 28, PseudocodeParser.RULE_whileLoop);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 295;
            this.match(PseudocodeParser.WHILE);
            this.state = 297;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 31, this.context) ) {
            case 1:
                {
                this.state = 296;
                this.match(PseudocodeParser.LPAREN);
                }
                break;
            }
            this.state = 299;
            this.expression();
            this.state = 301;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 28) {
                {
                this.state = 300;
                this.match(PseudocodeParser.RPAREN);
                }
            }

            this.state = 303;
            this.match(PseudocodeParser.COLON);
            this.state = 305;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 304;
                this.match(PseudocodeParser.NL);
                }
                }
                this.state = 307;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 53);
            this.state = 309;
            this.block();
            this.state = 310;
            this.match(PseudocodeParser.END);
            this.state = 311;
            this.match(PseudocodeParser.WHILE);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public doWhileLoop(): DoWhileLoopContext {
        let localContext = new DoWhileLoopContext(this.context, this.state);
        this.enterRule(localContext, 30, PseudocodeParser.RULE_doWhileLoop);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 313;
            this.match(PseudocodeParser.DO);
            this.state = 315;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 29) {
                {
                this.state = 314;
                this.match(PseudocodeParser.COLON);
                }
            }

            this.state = 318;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 317;
                this.match(PseudocodeParser.NL);
                }
                }
                this.state = 320;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 53);
            this.state = 322;
            this.block();
            this.state = 323;
            this.match(PseudocodeParser.WHILE);
            this.state = 324;
            this.match(PseudocodeParser.LPAREN);
            this.state = 325;
            this.expression();
            this.state = 326;
            this.match(PseudocodeParser.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public ifStatement(): IfStatementContext {
        let localContext = new IfStatementContext(this.context, this.state);
        this.enterRule(localContext, 32, PseudocodeParser.RULE_ifStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 328;
            this.match(PseudocodeParser.IF);
            this.state = 330;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 36, this.context) ) {
            case 1:
                {
                this.state = 329;
                this.match(PseudocodeParser.LPAREN);
                }
                break;
            }
            this.state = 332;
            this.expression();
            this.state = 334;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 28) {
                {
                this.state = 333;
                this.match(PseudocodeParser.RPAREN);
                }
            }

            this.state = 336;
            this.match(PseudocodeParser.COLON);
            this.state = 338;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 337;
                this.match(PseudocodeParser.NL);
                }
                }
                this.state = 340;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while (_la === 53);
            this.state = 342;
            this.block();
            this.state = 361;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 13) {
                {
                {
                this.state = 343;
                this.match(PseudocodeParser.ELSEIF);
                this.state = 345;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 39, this.context) ) {
                case 1:
                    {
                    this.state = 344;
                    this.match(PseudocodeParser.LPAREN);
                    }
                    break;
                }
                this.state = 347;
                this.expression();
                this.state = 349;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (_la === 28) {
                    {
                    this.state = 348;
                    this.match(PseudocodeParser.RPAREN);
                    }
                }

                this.state = 351;
                this.match(PseudocodeParser.COLON);
                this.state = 353;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 352;
                    this.match(PseudocodeParser.NL);
                    }
                    }
                    this.state = 355;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 53);
                this.state = 357;
                this.block();
                }
                }
                this.state = 363;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 372;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 12) {
                {
                this.state = 364;
                this.match(PseudocodeParser.ELSE);
                this.state = 365;
                this.match(PseudocodeParser.COLON);
                this.state = 367;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                do {
                    {
                    {
                    this.state = 366;
                    this.match(PseudocodeParser.NL);
                    }
                    }
                    this.state = 369;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                } while (_la === 53);
                this.state = 371;
                this.block();
                }
            }

            this.state = 374;
            this.match(PseudocodeParser.END);
            this.state = 375;
            this.match(PseudocodeParser.IF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public functionCallStmt(): FunctionCallStmtContext {
        let localContext = new FunctionCallStmtContext(this.context, this.state);
        this.enterRule(localContext, 34, PseudocodeParser.RULE_functionCallStmt);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 377;
            this.match(PseudocodeParser.ID);
            this.state = 378;
            this.match(PseudocodeParser.LPAREN);
            this.state = 380;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (((((_la - 22)) & ~0x1F) === 0 && ((1 << (_la - 22)) & 2013397031) !== 0)) {
                {
                this.state = 379;
                this.expressionList();
                }
            }

            this.state = 382;
            this.match(PseudocodeParser.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public returnStatement(): ReturnStatementContext {
        let localContext = new ReturnStatementContext(this.context, this.state);
        this.enterRule(localContext, 36, PseudocodeParser.RULE_returnStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 387;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 32) {
                {
                {
                this.state = 384;
                this.metadata();
                }
                }
                this.state = 389;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 390;
            this.match(PseudocodeParser.RETURN);
            this.state = 391;
            this.expression();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public breakStatement(): BreakStatementContext {
        let localContext = new BreakStatementContext(this.context, this.state);
        this.enterRule(localContext, 38, PseudocodeParser.RULE_breakStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 393;
            this.match(PseudocodeParser.BREAK);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public continueStatement(): ContinueStatementContext {
        let localContext = new ContinueStatementContext(this.context, this.state);
        this.enterRule(localContext, 40, PseudocodeParser.RULE_continueStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 395;
            this.match(PseudocodeParser.CONTINUE);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public expressionList(): ExpressionListContext {
        let localContext = new ExpressionListContext(this.context, this.state);
        this.enterRule(localContext, 42, PseudocodeParser.RULE_expressionList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 397;
            this.expression();
            this.state = 408;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 30) {
                {
                {
                this.state = 398;
                this.match(PseudocodeParser.COMMA);
                this.state = 402;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 53) {
                    {
                    {
                    this.state = 399;
                    this.match(PseudocodeParser.NL);
                    }
                    }
                    this.state = 404;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 405;
                this.expression();
                }
                }
                this.state = 410;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public expression(): ExpressionContext {
        let localContext = new ExpressionContext(this.context, this.state);
        this.enterRule(localContext, 44, PseudocodeParser.RULE_expression);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 411;
            this.logicalOrExpression();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public logicalOrExpression(): LogicalOrExpressionContext {
        let localContext = new LogicalOrExpressionContext(this.context, this.state);
        this.enterRule(localContext, 46, PseudocodeParser.RULE_logicalOrExpression);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 413;
            localContext._left = this.logicalAndExpression();
            this.state = 418;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 20) {
                {
                {
                this.state = 414;
                localContext._OR = this.match(PseudocodeParser.OR);
                localContext._op.push(localContext._OR!);
                this.state = 415;
                localContext._logicalAndExpression = this.logicalAndExpression();
                localContext._right.push(localContext._logicalAndExpression!);
                }
                }
                this.state = 420;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public logicalAndExpression(): LogicalAndExpressionContext {
        let localContext = new LogicalAndExpressionContext(this.context, this.state);
        this.enterRule(localContext, 48, PseudocodeParser.RULE_logicalAndExpression);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 421;
            localContext._left = this.comparisonExpression();
            this.state = 426;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 19) {
                {
                {
                this.state = 422;
                localContext._AND = this.match(PseudocodeParser.AND);
                localContext._op.push(localContext._AND!);
                this.state = 423;
                localContext._comparisonExpression = this.comparisonExpression();
                localContext._right.push(localContext._comparisonExpression!);
                }
                }
                this.state = 428;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public comparisonExpression(): ComparisonExpressionContext {
        let localContext = new ComparisonExpressionContext(this.context, this.state);
        this.enterRule(localContext, 50, PseudocodeParser.RULE_comparisonExpression);
        let _la: number;
        try {
            localContext = new CompareExprContext(localContext);
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 429;
            (localContext as CompareExprContext)._left = this.additiveExpression();
            this.state = 434;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (((((_la - 36)) & ~0x1F) === 0 && ((1 << (_la - 36)) & 1923) !== 0)) {
                {
                {
                this.state = 430;
                (localContext as CompareExprContext).__tset653 = this.tokenStream.LT(1);
                _la = this.tokenStream.LA(1);
                if(!(((((_la - 36)) & ~0x1F) === 0 && ((1 << (_la - 36)) & 1923) !== 0))) {
                    (localContext as CompareExprContext).__tset653 = this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                (localContext as CompareExprContext)._op.push((localContext as CompareExprContext).__tset653!);
                this.state = 431;
                (localContext as CompareExprContext)._additiveExpression = this.additiveExpression();
                (localContext as CompareExprContext)._right.push((localContext as CompareExprContext)._additiveExpression!);
                }
                }
                this.state = 436;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public additiveExpression(): AdditiveExpressionContext {
        let localContext = new AdditiveExpressionContext(this.context, this.state);
        this.enterRule(localContext, 52, PseudocodeParser.RULE_additiveExpression);
        let _la: number;
        try {
            localContext = new AddExprContext(localContext);
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 437;
            (localContext as AddExprContext)._left = this.multiplicativeExpression();
            this.state = 442;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 38 || _la === 39) {
                {
                {
                this.state = 438;
                (localContext as AddExprContext).__tset700 = this.tokenStream.LT(1);
                _la = this.tokenStream.LA(1);
                if(!(_la === 38 || _la === 39)) {
                    (localContext as AddExprContext).__tset700 = this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                (localContext as AddExprContext)._op.push((localContext as AddExprContext).__tset700!);
                this.state = 439;
                (localContext as AddExprContext)._multiplicativeExpression = this.multiplicativeExpression();
                (localContext as AddExprContext)._right.push((localContext as AddExprContext)._multiplicativeExpression!);
                }
                }
                this.state = 444;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public multiplicativeExpression(): MultiplicativeExpressionContext {
        let localContext = new MultiplicativeExpressionContext(this.context, this.state);
        this.enterRule(localContext, 54, PseudocodeParser.RULE_multiplicativeExpression);
        let _la: number;
        try {
            localContext = new MulExprContext(localContext);
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 445;
            (localContext as MulExprContext)._left = this.powerExpression();
            this.state = 450;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (((((_la - 41)) & ~0x1F) === 0 && ((1 << (_la - 41)) & 67) !== 0)) {
                {
                {
                this.state = 446;
                (localContext as MulExprContext).__tset731 = this.tokenStream.LT(1);
                _la = this.tokenStream.LA(1);
                if(!(((((_la - 41)) & ~0x1F) === 0 && ((1 << (_la - 41)) & 67) !== 0))) {
                    (localContext as MulExprContext).__tset731 = this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                (localContext as MulExprContext)._op.push((localContext as MulExprContext).__tset731!);
                this.state = 447;
                (localContext as MulExprContext)._powerExpression = this.powerExpression();
                (localContext as MulExprContext)._right.push((localContext as MulExprContext)._powerExpression!);
                }
                }
                this.state = 452;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public powerExpression(): PowerExpressionContext {
        let localContext = new PowerExpressionContext(this.context, this.state);
        this.enterRule(localContext, 56, PseudocodeParser.RULE_powerExpression);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 453;
            localContext._left = this.unaryExpression();
            this.state = 458;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 40) {
                {
                {
                this.state = 454;
                localContext._POWER = this.match(PseudocodeParser.POWER);
                localContext._op.push(localContext._POWER!);
                this.state = 455;
                localContext._unaryExpression = this.unaryExpression();
                localContext._right.push(localContext._unaryExpression!);
                }
                }
                this.state = 460;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public unaryExpression(): UnaryExpressionContext {
        let localContext = new UnaryExpressionContext(this.context, this.state);
        this.enterRule(localContext, 58, PseudocodeParser.RULE_unaryExpression);
        try {
            this.state = 464;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case PseudocodeParser.MINUS:
                localContext = new UnaryMinusExprContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 461;
                this.match(PseudocodeParser.MINUS);
                this.state = 462;
                this.unaryExpression();
                }
                break;
            case PseudocodeParser.TRUE:
            case PseudocodeParser.FALSE:
            case PseudocodeParser.NULL_VAL:
            case PseudocodeParser.LPAREN:
            case PseudocodeParser.ID:
            case PseudocodeParser.FLOAT:
            case PseudocodeParser.INT:
            case PseudocodeParser.STRING:
                localContext = new PrimaryExprContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 463;
                this.primaryExpression();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public primaryExpression(): PrimaryExpressionContext {
        let localContext = new PrimaryExpressionContext(this.context, this.state);
        this.enterRule(localContext, 60, PseudocodeParser.RULE_primaryExpression);
        let _la: number;
        try {
            this.state = 482;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 57, this.context) ) {
            case 1:
                localContext = new ParenExpressionContext(localContext);
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 466;
                this.match(PseudocodeParser.LPAREN);
                this.state = 467;
                this.expression();
                this.state = 468;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 2:
                localContext = new FunctionCallExpressionContext(localContext);
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 470;
                this.match(PseudocodeParser.ID);
                this.state = 471;
                this.match(PseudocodeParser.LPAREN);
                this.state = 473;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if (((((_la - 22)) & ~0x1F) === 0 && ((1 << (_la - 22)) & 2013397031) !== 0)) {
                    {
                    this.state = 472;
                    this.expressionList();
                    }
                }

                this.state = 475;
                this.match(PseudocodeParser.RPAREN);
                }
                break;
            case 3:
                localContext = new ArrayAccessExpressionContext(localContext);
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 476;
                this.match(PseudocodeParser.ID);
                this.state = 477;
                this.match(PseudocodeParser.LBRACK);
                this.state = 478;
                this.expression();
                this.state = 479;
                this.match(PseudocodeParser.RBRACK);
                }
                break;
            case 4:
                localContext = new AtomExpressionContext(localContext);
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 481;
                this.atom();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public atom(): AtomContext {
        let localContext = new AtomContext(this.context, this.state);
        this.enterRule(localContext, 62, PseudocodeParser.RULE_atom);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 484;
            _la = this.tokenStream.LA(1);
            if(!(((((_la - 22)) & ~0x1F) === 0 && ((1 << (_la - 22)) & 2013265927) !== 0))) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public static readonly _serializedATN: number[] = [
        4,1,55,487,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,
        2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,20,
        7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,2,26,7,26,
        2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,31,1,0,1,0,5,0,67,
        8,0,10,0,12,0,70,9,0,1,0,1,0,1,1,5,1,75,8,1,10,1,12,1,78,9,1,1,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,90,8,1,1,1,5,1,93,8,1,10,
        1,12,1,96,9,1,1,2,5,2,99,8,2,10,2,12,2,102,9,2,1,2,1,2,1,2,1,2,3,
        2,108,8,2,1,3,1,3,1,3,1,3,1,3,1,3,3,3,116,8,3,1,4,1,4,1,4,5,4,121,
        8,4,10,4,12,4,124,9,4,1,4,1,4,1,4,5,4,129,8,4,10,4,12,4,132,9,4,
        1,4,1,4,5,4,136,8,4,10,4,12,4,139,9,4,1,4,1,4,1,4,1,4,1,4,5,4,146,
        8,4,10,4,12,4,149,9,4,1,4,1,4,1,4,5,4,154,8,4,10,4,12,4,157,9,4,
        1,4,3,4,160,8,4,1,4,5,4,163,8,4,10,4,12,4,166,9,4,1,4,1,4,1,4,1,
        4,1,4,5,4,173,8,4,10,4,12,4,176,9,4,1,4,1,4,5,4,180,8,4,10,4,12,
        4,183,9,4,1,4,1,4,3,4,187,8,4,1,5,1,5,1,5,1,5,3,5,193,8,5,1,5,1,
        5,1,6,1,6,1,6,5,6,200,8,6,10,6,12,6,203,9,6,1,7,1,7,1,8,5,8,208,
        8,8,10,8,12,8,211,9,8,1,9,1,9,1,9,1,9,3,9,217,8,9,1,9,1,9,1,9,4,
        9,222,8,9,11,9,12,9,223,1,9,1,9,1,9,1,9,1,10,1,10,1,10,5,10,233,
        8,10,10,10,12,10,236,9,10,1,11,5,11,239,8,11,10,11,12,11,242,9,11,
        1,11,1,11,1,12,1,12,5,12,248,8,12,10,12,12,12,251,9,12,1,12,3,12,
        254,8,12,1,12,1,12,1,12,1,12,3,12,260,8,12,1,12,1,12,4,12,264,8,
        12,11,12,12,12,265,1,12,1,12,1,12,1,12,1,13,1,13,5,13,274,8,13,10,
        13,12,13,277,9,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,1,13,4,
        13,288,8,13,11,13,12,13,289,1,13,1,13,1,13,1,13,1,14,1,14,3,14,298,
        8,14,1,14,1,14,3,14,302,8,14,1,14,1,14,4,14,306,8,14,11,14,12,14,
        307,1,14,1,14,1,14,1,14,1,15,1,15,3,15,316,8,15,1,15,4,15,319,8,
        15,11,15,12,15,320,1,15,1,15,1,15,1,15,1,15,1,15,1,16,1,16,3,16,
        331,8,16,1,16,1,16,3,16,335,8,16,1,16,1,16,4,16,339,8,16,11,16,12,
        16,340,1,16,1,16,1,16,3,16,346,8,16,1,16,1,16,3,16,350,8,16,1,16,
        1,16,4,16,354,8,16,11,16,12,16,355,1,16,1,16,5,16,360,8,16,10,16,
        12,16,363,9,16,1,16,1,16,1,16,4,16,368,8,16,11,16,12,16,369,1,16,
        3,16,373,8,16,1,16,1,16,1,16,1,17,1,17,1,17,3,17,381,8,17,1,17,1,
        17,1,18,5,18,386,8,18,10,18,12,18,389,9,18,1,18,1,18,1,18,1,19,1,
        19,1,20,1,20,1,21,1,21,1,21,5,21,401,8,21,10,21,12,21,404,9,21,1,
        21,5,21,407,8,21,10,21,12,21,410,9,21,1,22,1,22,1,23,1,23,1,23,5,
        23,417,8,23,10,23,12,23,420,9,23,1,24,1,24,1,24,5,24,425,8,24,10,
        24,12,24,428,9,24,1,25,1,25,1,25,5,25,433,8,25,10,25,12,25,436,9,
        25,1,26,1,26,1,26,5,26,441,8,26,10,26,12,26,444,9,26,1,27,1,27,1,
        27,5,27,449,8,27,10,27,12,27,452,9,27,1,28,1,28,1,28,5,28,457,8,
        28,10,28,12,28,460,9,28,1,29,1,29,1,29,3,29,465,8,29,1,30,1,30,1,
        30,1,30,1,30,1,30,1,30,3,30,474,8,30,1,30,1,30,1,30,1,30,1,30,1,
        30,1,30,3,30,483,8,30,1,31,1,31,1,31,0,0,32,0,2,4,6,8,10,12,14,16,
        18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,
        62,0,8,2,0,31,31,53,53,1,0,33,35,1,0,49,52,1,0,30,31,2,0,36,37,43,
        46,1,0,38,39,2,0,41,42,47,47,2,0,22,24,49,52,523,0,68,1,0,0,0,2,
        76,1,0,0,0,4,100,1,0,0,0,6,115,1,0,0,0,8,186,1,0,0,0,10,188,1,0,
        0,0,12,196,1,0,0,0,14,204,1,0,0,0,16,209,1,0,0,0,18,212,1,0,0,0,
        20,229,1,0,0,0,22,240,1,0,0,0,24,245,1,0,0,0,26,271,1,0,0,0,28,295,
        1,0,0,0,30,313,1,0,0,0,32,328,1,0,0,0,34,377,1,0,0,0,36,387,1,0,
        0,0,38,393,1,0,0,0,40,395,1,0,0,0,42,397,1,0,0,0,44,411,1,0,0,0,
        46,413,1,0,0,0,48,421,1,0,0,0,50,429,1,0,0,0,52,437,1,0,0,0,54,445,
        1,0,0,0,56,453,1,0,0,0,58,464,1,0,0,0,60,482,1,0,0,0,62,484,1,0,
        0,0,64,67,3,2,1,0,65,67,5,53,0,0,66,64,1,0,0,0,66,65,1,0,0,0,67,
        70,1,0,0,0,68,66,1,0,0,0,68,69,1,0,0,0,69,71,1,0,0,0,70,68,1,0,0,
        0,71,72,5,0,0,1,72,1,1,0,0,0,73,75,3,10,5,0,74,73,1,0,0,0,75,78,
        1,0,0,0,76,74,1,0,0,0,76,77,1,0,0,0,77,89,1,0,0,0,78,76,1,0,0,0,
        79,90,3,4,2,0,80,90,3,18,9,0,81,90,3,34,17,0,82,90,3,24,12,0,83,
        90,3,26,13,0,84,90,3,30,15,0,85,90,3,32,16,0,86,90,3,28,14,0,87,
        90,3,36,18,0,88,90,3,38,19,0,89,79,1,0,0,0,89,80,1,0,0,0,89,81,1,
        0,0,0,89,82,1,0,0,0,89,83,1,0,0,0,89,84,1,0,0,0,89,85,1,0,0,0,89,
        86,1,0,0,0,89,87,1,0,0,0,89,88,1,0,0,0,90,94,1,0,0,0,91,93,7,0,0,
        0,92,91,1,0,0,0,93,96,1,0,0,0,94,92,1,0,0,0,94,95,1,0,0,0,95,3,1,
        0,0,0,96,94,1,0,0,0,97,99,3,10,5,0,98,97,1,0,0,0,99,102,1,0,0,0,
        100,98,1,0,0,0,100,101,1,0,0,0,101,103,1,0,0,0,102,100,1,0,0,0,103,
        104,3,6,3,0,104,107,7,1,0,0,105,108,3,44,22,0,106,108,3,8,4,0,107,
        105,1,0,0,0,107,106,1,0,0,0,108,5,1,0,0,0,109,116,5,49,0,0,110,111,
        5,49,0,0,111,112,5,25,0,0,112,113,3,44,22,0,113,114,5,26,0,0,114,
        116,1,0,0,0,115,109,1,0,0,0,115,110,1,0,0,0,116,7,1,0,0,0,117,118,
        5,6,0,0,118,122,5,25,0,0,119,121,5,53,0,0,120,119,1,0,0,0,121,124,
        1,0,0,0,122,120,1,0,0,0,122,123,1,0,0,0,123,125,1,0,0,0,124,122,
        1,0,0,0,125,126,3,44,22,0,126,130,5,7,0,0,127,129,5,53,0,0,128,127,
        1,0,0,0,129,132,1,0,0,0,130,128,1,0,0,0,130,131,1,0,0,0,131,133,
        1,0,0,0,132,130,1,0,0,0,133,137,3,44,22,0,134,136,5,53,0,0,135,134,
        1,0,0,0,136,139,1,0,0,0,137,135,1,0,0,0,137,138,1,0,0,0,138,140,
        1,0,0,0,139,137,1,0,0,0,140,141,5,26,0,0,141,187,1,0,0,0,142,143,
        5,6,0,0,143,147,5,27,0,0,144,146,5,53,0,0,145,144,1,0,0,0,146,149,
        1,0,0,0,147,145,1,0,0,0,147,148,1,0,0,0,148,150,1,0,0,0,149,147,
        1,0,0,0,150,159,3,44,22,0,151,155,5,30,0,0,152,154,5,53,0,0,153,
        152,1,0,0,0,154,157,1,0,0,0,155,153,1,0,0,0,155,156,1,0,0,0,156,
        158,1,0,0,0,157,155,1,0,0,0,158,160,3,44,22,0,159,151,1,0,0,0,159,
        160,1,0,0,0,160,164,1,0,0,0,161,163,5,53,0,0,162,161,1,0,0,0,163,
        166,1,0,0,0,164,162,1,0,0,0,164,165,1,0,0,0,165,167,1,0,0,0,166,
        164,1,0,0,0,167,168,5,28,0,0,168,187,1,0,0,0,169,170,5,6,0,0,170,
        174,5,25,0,0,171,173,5,53,0,0,172,171,1,0,0,0,173,176,1,0,0,0,174,
        172,1,0,0,0,174,175,1,0,0,0,175,177,1,0,0,0,176,174,1,0,0,0,177,
        181,3,42,21,0,178,180,5,53,0,0,179,178,1,0,0,0,180,183,1,0,0,0,181,
        179,1,0,0,0,181,182,1,0,0,0,182,184,1,0,0,0,183,181,1,0,0,0,184,
        185,5,26,0,0,185,187,1,0,0,0,186,117,1,0,0,0,186,142,1,0,0,0,186,
        169,1,0,0,0,187,9,1,0,0,0,188,189,5,32,0,0,189,190,5,49,0,0,190,
        192,5,45,0,0,191,193,3,12,6,0,192,191,1,0,0,0,192,193,1,0,0,0,193,
        194,1,0,0,0,194,195,5,46,0,0,195,11,1,0,0,0,196,201,3,14,7,0,197,
        198,5,30,0,0,198,200,3,14,7,0,199,197,1,0,0,0,200,203,1,0,0,0,201,
        199,1,0,0,0,201,202,1,0,0,0,202,13,1,0,0,0,203,201,1,0,0,0,204,205,
        7,2,0,0,205,15,1,0,0,0,206,208,3,2,1,0,207,206,1,0,0,0,208,211,1,
        0,0,0,209,207,1,0,0,0,209,210,1,0,0,0,210,17,1,0,0,0,211,209,1,0,
        0,0,212,213,5,8,0,0,213,214,5,49,0,0,214,216,5,27,0,0,215,217,3,
        20,10,0,216,215,1,0,0,0,216,217,1,0,0,0,217,218,1,0,0,0,218,219,
        5,28,0,0,219,221,5,29,0,0,220,222,5,53,0,0,221,220,1,0,0,0,222,223,
        1,0,0,0,223,221,1,0,0,0,223,224,1,0,0,0,224,225,1,0,0,0,225,226,
        3,16,8,0,226,227,5,15,0,0,227,228,5,8,0,0,228,19,1,0,0,0,229,234,
        3,22,11,0,230,231,5,30,0,0,231,233,3,22,11,0,232,230,1,0,0,0,233,
        236,1,0,0,0,234,232,1,0,0,0,234,235,1,0,0,0,235,21,1,0,0,0,236,234,
        1,0,0,0,237,239,3,10,5,0,238,237,1,0,0,0,239,242,1,0,0,0,240,238,
        1,0,0,0,240,241,1,0,0,0,241,243,1,0,0,0,242,240,1,0,0,0,243,244,
        5,49,0,0,244,23,1,0,0,0,245,249,5,9,0,0,246,248,3,10,5,0,247,246,
        1,0,0,0,248,251,1,0,0,0,249,247,1,0,0,0,249,250,1,0,0,0,250,253,
        1,0,0,0,251,249,1,0,0,0,252,254,5,27,0,0,253,252,1,0,0,0,253,254,
        1,0,0,0,254,255,1,0,0,0,255,256,5,49,0,0,256,257,5,10,0,0,257,259,
        5,49,0,0,258,260,5,28,0,0,259,258,1,0,0,0,259,260,1,0,0,0,260,261,
        1,0,0,0,261,263,5,29,0,0,262,264,5,53,0,0,263,262,1,0,0,0,264,265,
        1,0,0,0,265,263,1,0,0,0,265,266,1,0,0,0,266,267,1,0,0,0,267,268,
        3,16,8,0,268,269,5,15,0,0,269,270,5,9,0,0,270,25,1,0,0,0,271,275,
        5,9,0,0,272,274,3,10,5,0,273,272,1,0,0,0,274,277,1,0,0,0,275,273,
        1,0,0,0,275,276,1,0,0,0,276,278,1,0,0,0,277,275,1,0,0,0,278,279,
        5,27,0,0,279,280,3,4,2,0,280,281,7,3,0,0,281,282,3,44,22,0,282,283,
        7,3,0,0,283,284,3,4,2,0,284,285,5,28,0,0,285,287,5,29,0,0,286,288,
        5,53,0,0,287,286,1,0,0,0,288,289,1,0,0,0,289,287,1,0,0,0,289,290,
        1,0,0,0,290,291,1,0,0,0,291,292,3,16,8,0,292,293,5,15,0,0,293,294,
        5,9,0,0,294,27,1,0,0,0,295,297,5,16,0,0,296,298,5,27,0,0,297,296,
        1,0,0,0,297,298,1,0,0,0,298,299,1,0,0,0,299,301,3,44,22,0,300,302,
        5,28,0,0,301,300,1,0,0,0,301,302,1,0,0,0,302,303,1,0,0,0,303,305,
        5,29,0,0,304,306,5,53,0,0,305,304,1,0,0,0,306,307,1,0,0,0,307,305,
        1,0,0,0,307,308,1,0,0,0,308,309,1,0,0,0,309,310,3,16,8,0,310,311,
        5,15,0,0,311,312,5,16,0,0,312,29,1,0,0,0,313,315,5,17,0,0,314,316,
        5,29,0,0,315,314,1,0,0,0,315,316,1,0,0,0,316,318,1,0,0,0,317,319,
        5,53,0,0,318,317,1,0,0,0,319,320,1,0,0,0,320,318,1,0,0,0,320,321,
        1,0,0,0,321,322,1,0,0,0,322,323,3,16,8,0,323,324,5,16,0,0,324,325,
        5,27,0,0,325,326,3,44,22,0,326,327,5,28,0,0,327,31,1,0,0,0,328,330,
        5,11,0,0,329,331,5,27,0,0,330,329,1,0,0,0,330,331,1,0,0,0,331,332,
        1,0,0,0,332,334,3,44,22,0,333,335,5,28,0,0,334,333,1,0,0,0,334,335,
        1,0,0,0,335,336,1,0,0,0,336,338,5,29,0,0,337,339,5,53,0,0,338,337,
        1,0,0,0,339,340,1,0,0,0,340,338,1,0,0,0,340,341,1,0,0,0,341,342,
        1,0,0,0,342,361,3,16,8,0,343,345,5,13,0,0,344,346,5,27,0,0,345,344,
        1,0,0,0,345,346,1,0,0,0,346,347,1,0,0,0,347,349,3,44,22,0,348,350,
        5,28,0,0,349,348,1,0,0,0,349,350,1,0,0,0,350,351,1,0,0,0,351,353,
        5,29,0,0,352,354,5,53,0,0,353,352,1,0,0,0,354,355,1,0,0,0,355,353,
        1,0,0,0,355,356,1,0,0,0,356,357,1,0,0,0,357,358,3,16,8,0,358,360,
        1,0,0,0,359,343,1,0,0,0,360,363,1,0,0,0,361,359,1,0,0,0,361,362,
        1,0,0,0,362,372,1,0,0,0,363,361,1,0,0,0,364,365,5,12,0,0,365,367,
        5,29,0,0,366,368,5,53,0,0,367,366,1,0,0,0,368,369,1,0,0,0,369,367,
        1,0,0,0,369,370,1,0,0,0,370,371,1,0,0,0,371,373,3,16,8,0,372,364,
        1,0,0,0,372,373,1,0,0,0,373,374,1,0,0,0,374,375,5,15,0,0,375,376,
        5,11,0,0,376,33,1,0,0,0,377,378,5,49,0,0,378,380,5,27,0,0,379,381,
        3,42,21,0,380,379,1,0,0,0,380,381,1,0,0,0,381,382,1,0,0,0,382,383,
        5,28,0,0,383,35,1,0,0,0,384,386,3,10,5,0,385,384,1,0,0,0,386,389,
        1,0,0,0,387,385,1,0,0,0,387,388,1,0,0,0,388,390,1,0,0,0,389,387,
        1,0,0,0,390,391,5,14,0,0,391,392,3,44,22,0,392,37,1,0,0,0,393,394,
        5,18,0,0,394,39,1,0,0,0,395,396,5,21,0,0,396,41,1,0,0,0,397,408,
        3,44,22,0,398,402,5,30,0,0,399,401,5,53,0,0,400,399,1,0,0,0,401,
        404,1,0,0,0,402,400,1,0,0,0,402,403,1,0,0,0,403,405,1,0,0,0,404,
        402,1,0,0,0,405,407,3,44,22,0,406,398,1,0,0,0,407,410,1,0,0,0,408,
        406,1,0,0,0,408,409,1,0,0,0,409,43,1,0,0,0,410,408,1,0,0,0,411,412,
        3,46,23,0,412,45,1,0,0,0,413,418,3,48,24,0,414,415,5,20,0,0,415,
        417,3,48,24,0,416,414,1,0,0,0,417,420,1,0,0,0,418,416,1,0,0,0,418,
        419,1,0,0,0,419,47,1,0,0,0,420,418,1,0,0,0,421,426,3,50,25,0,422,
        423,5,19,0,0,423,425,3,50,25,0,424,422,1,0,0,0,425,428,1,0,0,0,426,
        424,1,0,0,0,426,427,1,0,0,0,427,49,1,0,0,0,428,426,1,0,0,0,429,434,
        3,52,26,0,430,431,7,4,0,0,431,433,3,52,26,0,432,430,1,0,0,0,433,
        436,1,0,0,0,434,432,1,0,0,0,434,435,1,0,0,0,435,51,1,0,0,0,436,434,
        1,0,0,0,437,442,3,54,27,0,438,439,7,5,0,0,439,441,3,54,27,0,440,
        438,1,0,0,0,441,444,1,0,0,0,442,440,1,0,0,0,442,443,1,0,0,0,443,
        53,1,0,0,0,444,442,1,0,0,0,445,450,3,56,28,0,446,447,7,6,0,0,447,
        449,3,56,28,0,448,446,1,0,0,0,449,452,1,0,0,0,450,448,1,0,0,0,450,
        451,1,0,0,0,451,55,1,0,0,0,452,450,1,0,0,0,453,458,3,58,29,0,454,
        455,5,40,0,0,455,457,3,58,29,0,456,454,1,0,0,0,457,460,1,0,0,0,458,
        456,1,0,0,0,458,459,1,0,0,0,459,57,1,0,0,0,460,458,1,0,0,0,461,462,
        5,39,0,0,462,465,3,58,29,0,463,465,3,60,30,0,464,461,1,0,0,0,464,
        463,1,0,0,0,465,59,1,0,0,0,466,467,5,27,0,0,467,468,3,44,22,0,468,
        469,5,28,0,0,469,483,1,0,0,0,470,471,5,49,0,0,471,473,5,27,0,0,472,
        474,3,42,21,0,473,472,1,0,0,0,473,474,1,0,0,0,474,475,1,0,0,0,475,
        483,5,28,0,0,476,477,5,49,0,0,477,478,5,25,0,0,478,479,3,44,22,0,
        479,480,5,26,0,0,480,483,1,0,0,0,481,483,3,62,31,0,482,466,1,0,0,
        0,482,470,1,0,0,0,482,476,1,0,0,0,482,481,1,0,0,0,483,61,1,0,0,0,
        484,485,7,7,0,0,485,63,1,0,0,0,58,66,68,76,89,94,100,107,115,122,
        130,137,147,155,159,164,174,181,186,192,201,209,216,223,234,240,
        249,253,259,265,275,289,297,301,307,315,320,330,334,340,345,349,
        355,361,369,372,380,387,402,408,418,426,434,442,450,458,464,473,
        482
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!PseudocodeParser.__ATN) {
            PseudocodeParser.__ATN = new antlr.ATNDeserializer().deserialize(PseudocodeParser._serializedATN);
        }

        return PseudocodeParser.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(PseudocodeParser.literalNames, PseudocodeParser.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return PseudocodeParser.vocabulary;
    }

    private static readonly decisionsToDFA = PseudocodeParser._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class ProgramContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.EOF, 0)!;
    }
    public statement(): StatementContext[];
    public statement(i: number): StatementContext | null;
    public statement(i?: number): StatementContext[] | StatementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StatementContext);
        }

        return this.getRuleContext(i, StatementContext);
    }
    public NL(): antlr.TerminalNode[];
    public NL(i: number): antlr.TerminalNode | null;
    public NL(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NL);
    	} else {
    		return this.getToken(PseudocodeParser.NL, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_program;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterProgram) {
             listener.enterProgram(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitProgram) {
             listener.exitProgram(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitProgram) {
            return visitor.visitProgram(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class StatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public assignment(): AssignmentContext | null {
        return this.getRuleContext(0, AssignmentContext);
    }
    public functionDecl(): FunctionDeclContext | null {
        return this.getRuleContext(0, FunctionDeclContext);
    }
    public functionCallStmt(): FunctionCallStmtContext | null {
        return this.getRuleContext(0, FunctionCallStmtContext);
    }
    public forEachLoop(): ForEachLoopContext | null {
        return this.getRuleContext(0, ForEachLoopContext);
    }
    public forLoop(): ForLoopContext | null {
        return this.getRuleContext(0, ForLoopContext);
    }
    public doWhileLoop(): DoWhileLoopContext | null {
        return this.getRuleContext(0, DoWhileLoopContext);
    }
    public ifStatement(): IfStatementContext | null {
        return this.getRuleContext(0, IfStatementContext);
    }
    public whileLoop(): WhileLoopContext | null {
        return this.getRuleContext(0, WhileLoopContext);
    }
    public returnStatement(): ReturnStatementContext | null {
        return this.getRuleContext(0, ReturnStatementContext);
    }
    public breakStatement(): BreakStatementContext | null {
        return this.getRuleContext(0, BreakStatementContext);
    }
    public metadata(): MetadataContext[];
    public metadata(i: number): MetadataContext | null;
    public metadata(i?: number): MetadataContext[] | MetadataContext | null {
        if (i === undefined) {
            return this.getRuleContexts(MetadataContext);
        }

        return this.getRuleContext(i, MetadataContext);
    }
    public SEMI(): antlr.TerminalNode[];
    public SEMI(i: number): antlr.TerminalNode | null;
    public SEMI(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.SEMI);
    	} else {
    		return this.getToken(PseudocodeParser.SEMI, i);
    	}
    }
    public NL(): antlr.TerminalNode[];
    public NL(i: number): antlr.TerminalNode | null;
    public NL(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NL);
    	} else {
    		return this.getToken(PseudocodeParser.NL, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_statement;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterStatement) {
             listener.enterStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitStatement) {
             listener.exitStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitStatement) {
            return visitor.visitStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AssignmentContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public assignable(): AssignableContext {
        return this.getRuleContext(0, AssignableContext)!;
    }
    public EQ(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.EQ, 0);
    }
    public PLUS_EQ(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.PLUS_EQ, 0);
    }
    public MINUS_EQ(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.MINUS_EQ, 0);
    }
    public expression(): ExpressionContext | null {
        return this.getRuleContext(0, ExpressionContext);
    }
    public arrayInitialization(): ArrayInitializationContext | null {
        return this.getRuleContext(0, ArrayInitializationContext);
    }
    public metadata(): MetadataContext[];
    public metadata(i: number): MetadataContext | null;
    public metadata(i?: number): MetadataContext[] | MetadataContext | null {
        if (i === undefined) {
            return this.getRuleContexts(MetadataContext);
        }

        return this.getRuleContext(i, MetadataContext);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_assignment;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterAssignment) {
             listener.enterAssignment(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitAssignment) {
             listener.exitAssignment(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitAssignment) {
            return visitor.visitAssignment(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AssignableContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public ID(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.ID, 0)!;
    }
    public LBRACK(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.LBRACK, 0);
    }
    public expression(): ExpressionContext | null {
        return this.getRuleContext(0, ExpressionContext);
    }
    public RBRACK(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.RBRACK, 0);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_assignable;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterAssignable) {
             listener.enterAssignable(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitAssignable) {
             listener.exitAssignable(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitAssignable) {
            return visitor.visitAssignable(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ArrayInitializationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_arrayInitialization;
    }
    public override copyFrom(ctx: ArrayInitializationContext): void {
        super.copyFrom(ctx);
    }
}
export class RangeArrayContext extends ArrayInitializationContext {
    public _from_?: ExpressionContext;
    public _to?: ExpressionContext;
    public constructor(ctx: ArrayInitializationContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ARR(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.ARR, 0)!;
    }
    public LBRACK(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LBRACK, 0)!;
    }
    public TO(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.TO, 0)!;
    }
    public RBRACK(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RBRACK, 0)!;
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public NL(): antlr.TerminalNode[];
    public NL(i: number): antlr.TerminalNode | null;
    public NL(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NL);
    	} else {
    		return this.getToken(PseudocodeParser.NL, i);
    	}
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterRangeArray) {
             listener.enterRangeArray(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitRangeArray) {
             listener.exitRangeArray(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitRangeArray) {
            return visitor.visitRangeArray(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class SizeArrayContext extends ArrayInitializationContext {
    public _size?: ExpressionContext;
    public _defaultVal?: ExpressionContext;
    public constructor(ctx: ArrayInitializationContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ARR(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.ARR, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RPAREN, 0)!;
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public NL(): antlr.TerminalNode[];
    public NL(i: number): antlr.TerminalNode | null;
    public NL(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NL);
    	} else {
    		return this.getToken(PseudocodeParser.NL, i);
    	}
    }
    public COMMA(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.COMMA, 0);
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterSizeArray) {
             listener.enterSizeArray(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitSizeArray) {
             listener.exitSizeArray(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitSizeArray) {
            return visitor.visitSizeArray(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class ValueArrayContext extends ArrayInitializationContext {
    public constructor(ctx: ArrayInitializationContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ARR(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.ARR, 0)!;
    }
    public LBRACK(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LBRACK, 0)!;
    }
    public expressionList(): ExpressionListContext {
        return this.getRuleContext(0, ExpressionListContext)!;
    }
    public RBRACK(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RBRACK, 0)!;
    }
    public NL(): antlr.TerminalNode[];
    public NL(i: number): antlr.TerminalNode | null;
    public NL(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NL);
    	} else {
    		return this.getToken(PseudocodeParser.NL, i);
    	}
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterValueArray) {
             listener.enterValueArray(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitValueArray) {
             listener.exitValueArray(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitValueArray) {
            return visitor.visitValueArray(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MetadataContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public AT(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.AT, 0)!;
    }
    public ID(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.ID, 0)!;
    }
    public LT(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LT, 0)!;
    }
    public GT(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.GT, 0)!;
    }
    public metadataParams(): MetadataParamsContext | null {
        return this.getRuleContext(0, MetadataParamsContext);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_metadata;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterMetadata) {
             listener.enterMetadata(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitMetadata) {
             listener.exitMetadata(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitMetadata) {
            return visitor.visitMetadata(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MetadataParamsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public metadataParam(): MetadataParamContext[];
    public metadataParam(i: number): MetadataParamContext | null;
    public metadataParam(i?: number): MetadataParamContext[] | MetadataParamContext | null {
        if (i === undefined) {
            return this.getRuleContexts(MetadataParamContext);
        }

        return this.getRuleContext(i, MetadataParamContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.COMMA);
    	} else {
    		return this.getToken(PseudocodeParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_metadataParams;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterMetadataParams) {
             listener.enterMetadataParams(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitMetadataParams) {
             listener.exitMetadataParams(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitMetadataParams) {
            return visitor.visitMetadataParams(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MetadataParamContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public ID(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.ID, 0);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.INT, 0);
    }
    public FLOAT(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.FLOAT, 0);
    }
    public STRING(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.STRING, 0);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_metadataParam;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterMetadataParam) {
             listener.enterMetadataParam(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitMetadataParam) {
             listener.exitMetadataParam(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitMetadataParam) {
            return visitor.visitMetadataParam(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class BlockContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public statement(): StatementContext[];
    public statement(i: number): StatementContext | null;
    public statement(i?: number): StatementContext[] | StatementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StatementContext);
        }

        return this.getRuleContext(i, StatementContext);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_block;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterBlock) {
             listener.enterBlock(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitBlock) {
             listener.exitBlock(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitBlock) {
            return visitor.visitBlock(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class FunctionDeclContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public FUN(): antlr.TerminalNode[];
    public FUN(i: number): antlr.TerminalNode | null;
    public FUN(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.FUN);
    	} else {
    		return this.getToken(PseudocodeParser.FUN, i);
    	}
    }
    public ID(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.ID, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RPAREN, 0)!;
    }
    public COLON(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.COLON, 0)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public END(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.END, 0)!;
    }
    public paramList(): ParamListContext | null {
        return this.getRuleContext(0, ParamListContext);
    }
    public NL(): antlr.TerminalNode[];
    public NL(i: number): antlr.TerminalNode | null;
    public NL(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NL);
    	} else {
    		return this.getToken(PseudocodeParser.NL, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_functionDecl;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterFunctionDecl) {
             listener.enterFunctionDecl(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitFunctionDecl) {
             listener.exitFunctionDecl(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitFunctionDecl) {
            return visitor.visitFunctionDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ParamListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public param(): ParamContext[];
    public param(i: number): ParamContext | null;
    public param(i?: number): ParamContext[] | ParamContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ParamContext);
        }

        return this.getRuleContext(i, ParamContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.COMMA);
    	} else {
    		return this.getToken(PseudocodeParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_paramList;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterParamList) {
             listener.enterParamList(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitParamList) {
             listener.exitParamList(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitParamList) {
            return visitor.visitParamList(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ParamContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public ID(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.ID, 0)!;
    }
    public metadata(): MetadataContext[];
    public metadata(i: number): MetadataContext | null;
    public metadata(i?: number): MetadataContext[] | MetadataContext | null {
        if (i === undefined) {
            return this.getRuleContexts(MetadataContext);
        }

        return this.getRuleContext(i, MetadataContext);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_param;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterParam) {
             listener.enterParam(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitParam) {
             listener.exitParam(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitParam) {
            return visitor.visitParam(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ForEachLoopContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public FOR(): antlr.TerminalNode[];
    public FOR(i: number): antlr.TerminalNode | null;
    public FOR(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.FOR);
    	} else {
    		return this.getToken(PseudocodeParser.FOR, i);
    	}
    }
    public ID(): antlr.TerminalNode[];
    public ID(i: number): antlr.TerminalNode | null;
    public ID(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.ID);
    	} else {
    		return this.getToken(PseudocodeParser.ID, i);
    	}
    }
    public IN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.IN, 0)!;
    }
    public COLON(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.COLON, 0)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public END(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.END, 0)!;
    }
    public metadata(): MetadataContext[];
    public metadata(i: number): MetadataContext | null;
    public metadata(i?: number): MetadataContext[] | MetadataContext | null {
        if (i === undefined) {
            return this.getRuleContexts(MetadataContext);
        }

        return this.getRuleContext(i, MetadataContext);
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.LPAREN, 0);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.RPAREN, 0);
    }
    public NL(): antlr.TerminalNode[];
    public NL(i: number): antlr.TerminalNode | null;
    public NL(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NL);
    	} else {
    		return this.getToken(PseudocodeParser.NL, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_forEachLoop;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterForEachLoop) {
             listener.enterForEachLoop(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitForEachLoop) {
             listener.exitForEachLoop(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitForEachLoop) {
            return visitor.visitForEachLoop(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ForLoopContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public FOR(): antlr.TerminalNode[];
    public FOR(i: number): antlr.TerminalNode | null;
    public FOR(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.FOR);
    	} else {
    		return this.getToken(PseudocodeParser.FOR, i);
    	}
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LPAREN, 0)!;
    }
    public assignment(): AssignmentContext[];
    public assignment(i: number): AssignmentContext | null;
    public assignment(i?: number): AssignmentContext[] | AssignmentContext | null {
        if (i === undefined) {
            return this.getRuleContexts(AssignmentContext);
        }

        return this.getRuleContext(i, AssignmentContext);
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RPAREN, 0)!;
    }
    public COLON(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.COLON, 0)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public END(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.END, 0)!;
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.COMMA);
    	} else {
    		return this.getToken(PseudocodeParser.COMMA, i);
    	}
    }
    public SEMI(): antlr.TerminalNode[];
    public SEMI(i: number): antlr.TerminalNode | null;
    public SEMI(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.SEMI);
    	} else {
    		return this.getToken(PseudocodeParser.SEMI, i);
    	}
    }
    public metadata(): MetadataContext[];
    public metadata(i: number): MetadataContext | null;
    public metadata(i?: number): MetadataContext[] | MetadataContext | null {
        if (i === undefined) {
            return this.getRuleContexts(MetadataContext);
        }

        return this.getRuleContext(i, MetadataContext);
    }
    public NL(): antlr.TerminalNode[];
    public NL(i: number): antlr.TerminalNode | null;
    public NL(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NL);
    	} else {
    		return this.getToken(PseudocodeParser.NL, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_forLoop;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterForLoop) {
             listener.enterForLoop(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitForLoop) {
             listener.exitForLoop(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitForLoop) {
            return visitor.visitForLoop(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class WhileLoopContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public WHILE(): antlr.TerminalNode[];
    public WHILE(i: number): antlr.TerminalNode | null;
    public WHILE(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.WHILE);
    	} else {
    		return this.getToken(PseudocodeParser.WHILE, i);
    	}
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public COLON(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.COLON, 0)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public END(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.END, 0)!;
    }
    public LPAREN(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.LPAREN, 0);
    }
    public RPAREN(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.RPAREN, 0);
    }
    public NL(): antlr.TerminalNode[];
    public NL(i: number): antlr.TerminalNode | null;
    public NL(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NL);
    	} else {
    		return this.getToken(PseudocodeParser.NL, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_whileLoop;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterWhileLoop) {
             listener.enterWhileLoop(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitWhileLoop) {
             listener.exitWhileLoop(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitWhileLoop) {
            return visitor.visitWhileLoop(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class DoWhileLoopContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public DO(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.DO, 0)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public WHILE(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.WHILE, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LPAREN, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RPAREN, 0)!;
    }
    public COLON(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.COLON, 0);
    }
    public NL(): antlr.TerminalNode[];
    public NL(i: number): antlr.TerminalNode | null;
    public NL(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NL);
    	} else {
    		return this.getToken(PseudocodeParser.NL, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_doWhileLoop;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterDoWhileLoop) {
             listener.enterDoWhileLoop(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitDoWhileLoop) {
             listener.exitDoWhileLoop(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitDoWhileLoop) {
            return visitor.visitDoWhileLoop(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class IfStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IF(): antlr.TerminalNode[];
    public IF(i: number): antlr.TerminalNode | null;
    public IF(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.IF);
    	} else {
    		return this.getToken(PseudocodeParser.IF, i);
    	}
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public COLON(): antlr.TerminalNode[];
    public COLON(i: number): antlr.TerminalNode | null;
    public COLON(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.COLON);
    	} else {
    		return this.getToken(PseudocodeParser.COLON, i);
    	}
    }
    public block(): BlockContext[];
    public block(i: number): BlockContext | null;
    public block(i?: number): BlockContext[] | BlockContext | null {
        if (i === undefined) {
            return this.getRuleContexts(BlockContext);
        }

        return this.getRuleContext(i, BlockContext);
    }
    public END(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.END, 0)!;
    }
    public LPAREN(): antlr.TerminalNode[];
    public LPAREN(i: number): antlr.TerminalNode | null;
    public LPAREN(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.LPAREN);
    	} else {
    		return this.getToken(PseudocodeParser.LPAREN, i);
    	}
    }
    public RPAREN(): antlr.TerminalNode[];
    public RPAREN(i: number): antlr.TerminalNode | null;
    public RPAREN(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.RPAREN);
    	} else {
    		return this.getToken(PseudocodeParser.RPAREN, i);
    	}
    }
    public NL(): antlr.TerminalNode[];
    public NL(i: number): antlr.TerminalNode | null;
    public NL(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NL);
    	} else {
    		return this.getToken(PseudocodeParser.NL, i);
    	}
    }
    public ELSEIF(): antlr.TerminalNode[];
    public ELSEIF(i: number): antlr.TerminalNode | null;
    public ELSEIF(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.ELSEIF);
    	} else {
    		return this.getToken(PseudocodeParser.ELSEIF, i);
    	}
    }
    public ELSE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.ELSE, 0);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_ifStatement;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterIfStatement) {
             listener.enterIfStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitIfStatement) {
             listener.exitIfStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitIfStatement) {
            return visitor.visitIfStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class FunctionCallStmtContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public ID(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.ID, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RPAREN, 0)!;
    }
    public expressionList(): ExpressionListContext | null {
        return this.getRuleContext(0, ExpressionListContext);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_functionCallStmt;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterFunctionCallStmt) {
             listener.enterFunctionCallStmt(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitFunctionCallStmt) {
             listener.exitFunctionCallStmt(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitFunctionCallStmt) {
            return visitor.visitFunctionCallStmt(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ReturnStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public RETURN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RETURN, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public metadata(): MetadataContext[];
    public metadata(i: number): MetadataContext | null;
    public metadata(i?: number): MetadataContext[] | MetadataContext | null {
        if (i === undefined) {
            return this.getRuleContexts(MetadataContext);
        }

        return this.getRuleContext(i, MetadataContext);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_returnStatement;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterReturnStatement) {
             listener.enterReturnStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitReturnStatement) {
             listener.exitReturnStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitReturnStatement) {
            return visitor.visitReturnStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class BreakStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public BREAK(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.BREAK, 0)!;
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_breakStatement;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterBreakStatement) {
             listener.enterBreakStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitBreakStatement) {
             listener.exitBreakStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitBreakStatement) {
            return visitor.visitBreakStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ContinueStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public CONTINUE(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.CONTINUE, 0)!;
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_continueStatement;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterContinueStatement) {
             listener.enterContinueStatement(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitContinueStatement) {
             listener.exitContinueStatement(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitContinueStatement) {
            return visitor.visitContinueStatement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ExpressionListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.COMMA);
    	} else {
    		return this.getToken(PseudocodeParser.COMMA, i);
    	}
    }
    public NL(): antlr.TerminalNode[];
    public NL(i: number): antlr.TerminalNode | null;
    public NL(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NL);
    	} else {
    		return this.getToken(PseudocodeParser.NL, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_expressionList;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterExpressionList) {
             listener.enterExpressionList(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitExpressionList) {
             listener.exitExpressionList(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitExpressionList) {
            return visitor.visitExpressionList(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ExpressionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public logicalOrExpression(): LogicalOrExpressionContext {
        return this.getRuleContext(0, LogicalOrExpressionContext)!;
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_expression;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterExpression) {
             listener.enterExpression(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitExpression) {
             listener.exitExpression(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitExpression) {
            return visitor.visitExpression(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class LogicalOrExpressionContext extends antlr.ParserRuleContext {
    public _left?: LogicalAndExpressionContext;
    public _OR?: Token | null;
    public _op: antlr.Token[] = [];
    public _logicalAndExpression?: LogicalAndExpressionContext;
    public _right: LogicalAndExpressionContext[] = [];
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public logicalAndExpression(): LogicalAndExpressionContext[];
    public logicalAndExpression(i: number): LogicalAndExpressionContext | null;
    public logicalAndExpression(i?: number): LogicalAndExpressionContext[] | LogicalAndExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(LogicalAndExpressionContext);
        }

        return this.getRuleContext(i, LogicalAndExpressionContext);
    }
    public OR(): antlr.TerminalNode[];
    public OR(i: number): antlr.TerminalNode | null;
    public OR(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.OR);
    	} else {
    		return this.getToken(PseudocodeParser.OR, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_logicalOrExpression;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterLogicalOrExpression) {
             listener.enterLogicalOrExpression(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitLogicalOrExpression) {
             listener.exitLogicalOrExpression(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitLogicalOrExpression) {
            return visitor.visitLogicalOrExpression(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class LogicalAndExpressionContext extends antlr.ParserRuleContext {
    public _left?: ComparisonExpressionContext;
    public _AND?: Token | null;
    public _op: antlr.Token[] = [];
    public _comparisonExpression?: ComparisonExpressionContext;
    public _right: ComparisonExpressionContext[] = [];
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public comparisonExpression(): ComparisonExpressionContext[];
    public comparisonExpression(i: number): ComparisonExpressionContext | null;
    public comparisonExpression(i?: number): ComparisonExpressionContext[] | ComparisonExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ComparisonExpressionContext);
        }

        return this.getRuleContext(i, ComparisonExpressionContext);
    }
    public AND(): antlr.TerminalNode[];
    public AND(i: number): antlr.TerminalNode | null;
    public AND(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.AND);
    	} else {
    		return this.getToken(PseudocodeParser.AND, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_logicalAndExpression;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterLogicalAndExpression) {
             listener.enterLogicalAndExpression(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitLogicalAndExpression) {
             listener.exitLogicalAndExpression(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitLogicalAndExpression) {
            return visitor.visitLogicalAndExpression(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ComparisonExpressionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_comparisonExpression;
    }
    public override copyFrom(ctx: ComparisonExpressionContext): void {
        super.copyFrom(ctx);
    }
}
export class CompareExprContext extends ComparisonExpressionContext {
    public _left?: AdditiveExpressionContext;
    public _EQEQ?: Token | null;
    public _op: antlr.Token[] = [];
    public _NOTEQ?: Token | null;
    public _LESS_EQ?: Token | null;
    public _GREATER_EQ?: Token | null;
    public _LT?: Token | null;
    public _GT?: Token | null;
    public __tset653?: Token | null;
    public _additiveExpression?: AdditiveExpressionContext;
    public _right: AdditiveExpressionContext[] = [];
    public constructor(ctx: ComparisonExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public additiveExpression(): AdditiveExpressionContext[];
    public additiveExpression(i: number): AdditiveExpressionContext | null;
    public additiveExpression(i?: number): AdditiveExpressionContext[] | AdditiveExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(AdditiveExpressionContext);
        }

        return this.getRuleContext(i, AdditiveExpressionContext);
    }
    public EQEQ(): antlr.TerminalNode[];
    public EQEQ(i: number): antlr.TerminalNode | null;
    public EQEQ(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.EQEQ);
    	} else {
    		return this.getToken(PseudocodeParser.EQEQ, i);
    	}
    }
    public NOTEQ(): antlr.TerminalNode[];
    public NOTEQ(i: number): antlr.TerminalNode | null;
    public NOTEQ(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.NOTEQ);
    	} else {
    		return this.getToken(PseudocodeParser.NOTEQ, i);
    	}
    }
    public LESS_EQ(): antlr.TerminalNode[];
    public LESS_EQ(i: number): antlr.TerminalNode | null;
    public LESS_EQ(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.LESS_EQ);
    	} else {
    		return this.getToken(PseudocodeParser.LESS_EQ, i);
    	}
    }
    public GREATER_EQ(): antlr.TerminalNode[];
    public GREATER_EQ(i: number): antlr.TerminalNode | null;
    public GREATER_EQ(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.GREATER_EQ);
    	} else {
    		return this.getToken(PseudocodeParser.GREATER_EQ, i);
    	}
    }
    public LT(): antlr.TerminalNode[];
    public LT(i: number): antlr.TerminalNode | null;
    public LT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.LT);
    	} else {
    		return this.getToken(PseudocodeParser.LT, i);
    	}
    }
    public GT(): antlr.TerminalNode[];
    public GT(i: number): antlr.TerminalNode | null;
    public GT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.GT);
    	} else {
    		return this.getToken(PseudocodeParser.GT, i);
    	}
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterCompareExpr) {
             listener.enterCompareExpr(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitCompareExpr) {
             listener.exitCompareExpr(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitCompareExpr) {
            return visitor.visitCompareExpr(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AdditiveExpressionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_additiveExpression;
    }
    public override copyFrom(ctx: AdditiveExpressionContext): void {
        super.copyFrom(ctx);
    }
}
export class AddExprContext extends AdditiveExpressionContext {
    public _left?: MultiplicativeExpressionContext;
    public _PLUS?: Token | null;
    public _op: antlr.Token[] = [];
    public _MINUS?: Token | null;
    public __tset700?: Token | null;
    public _multiplicativeExpression?: MultiplicativeExpressionContext;
    public _right: MultiplicativeExpressionContext[] = [];
    public constructor(ctx: AdditiveExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public multiplicativeExpression(): MultiplicativeExpressionContext[];
    public multiplicativeExpression(i: number): MultiplicativeExpressionContext | null;
    public multiplicativeExpression(i?: number): MultiplicativeExpressionContext[] | MultiplicativeExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(MultiplicativeExpressionContext);
        }

        return this.getRuleContext(i, MultiplicativeExpressionContext);
    }
    public PLUS(): antlr.TerminalNode[];
    public PLUS(i: number): antlr.TerminalNode | null;
    public PLUS(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.PLUS);
    	} else {
    		return this.getToken(PseudocodeParser.PLUS, i);
    	}
    }
    public MINUS(): antlr.TerminalNode[];
    public MINUS(i: number): antlr.TerminalNode | null;
    public MINUS(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.MINUS);
    	} else {
    		return this.getToken(PseudocodeParser.MINUS, i);
    	}
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterAddExpr) {
             listener.enterAddExpr(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitAddExpr) {
             listener.exitAddExpr(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitAddExpr) {
            return visitor.visitAddExpr(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MultiplicativeExpressionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_multiplicativeExpression;
    }
    public override copyFrom(ctx: MultiplicativeExpressionContext): void {
        super.copyFrom(ctx);
    }
}
export class MulExprContext extends MultiplicativeExpressionContext {
    public _left?: PowerExpressionContext;
    public _STAR?: Token | null;
    public _op: antlr.Token[] = [];
    public _SLASH?: Token | null;
    public _MOD?: Token | null;
    public __tset731?: Token | null;
    public _powerExpression?: PowerExpressionContext;
    public _right: PowerExpressionContext[] = [];
    public constructor(ctx: MultiplicativeExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public powerExpression(): PowerExpressionContext[];
    public powerExpression(i: number): PowerExpressionContext | null;
    public powerExpression(i?: number): PowerExpressionContext[] | PowerExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(PowerExpressionContext);
        }

        return this.getRuleContext(i, PowerExpressionContext);
    }
    public STAR(): antlr.TerminalNode[];
    public STAR(i: number): antlr.TerminalNode | null;
    public STAR(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.STAR);
    	} else {
    		return this.getToken(PseudocodeParser.STAR, i);
    	}
    }
    public SLASH(): antlr.TerminalNode[];
    public SLASH(i: number): antlr.TerminalNode | null;
    public SLASH(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.SLASH);
    	} else {
    		return this.getToken(PseudocodeParser.SLASH, i);
    	}
    }
    public MOD(): antlr.TerminalNode[];
    public MOD(i: number): antlr.TerminalNode | null;
    public MOD(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.MOD);
    	} else {
    		return this.getToken(PseudocodeParser.MOD, i);
    	}
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterMulExpr) {
             listener.enterMulExpr(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitMulExpr) {
             listener.exitMulExpr(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitMulExpr) {
            return visitor.visitMulExpr(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class PowerExpressionContext extends antlr.ParserRuleContext {
    public _left?: UnaryExpressionContext;
    public _POWER?: Token | null;
    public _op: antlr.Token[] = [];
    public _unaryExpression?: UnaryExpressionContext;
    public _right: UnaryExpressionContext[] = [];
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public unaryExpression(): UnaryExpressionContext[];
    public unaryExpression(i: number): UnaryExpressionContext | null;
    public unaryExpression(i?: number): UnaryExpressionContext[] | UnaryExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(UnaryExpressionContext);
        }

        return this.getRuleContext(i, UnaryExpressionContext);
    }
    public POWER(): antlr.TerminalNode[];
    public POWER(i: number): antlr.TerminalNode | null;
    public POWER(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(PseudocodeParser.POWER);
    	} else {
    		return this.getToken(PseudocodeParser.POWER, i);
    	}
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_powerExpression;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterPowerExpression) {
             listener.enterPowerExpression(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitPowerExpression) {
             listener.exitPowerExpression(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitPowerExpression) {
            return visitor.visitPowerExpression(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class UnaryExpressionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_unaryExpression;
    }
    public override copyFrom(ctx: UnaryExpressionContext): void {
        super.copyFrom(ctx);
    }
}
export class UnaryMinusExprContext extends UnaryExpressionContext {
    public constructor(ctx: UnaryExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public MINUS(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.MINUS, 0)!;
    }
    public unaryExpression(): UnaryExpressionContext {
        return this.getRuleContext(0, UnaryExpressionContext)!;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterUnaryMinusExpr) {
             listener.enterUnaryMinusExpr(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitUnaryMinusExpr) {
             listener.exitUnaryMinusExpr(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitUnaryMinusExpr) {
            return visitor.visitUnaryMinusExpr(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class PrimaryExprContext extends UnaryExpressionContext {
    public constructor(ctx: UnaryExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public primaryExpression(): PrimaryExpressionContext {
        return this.getRuleContext(0, PrimaryExpressionContext)!;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterPrimaryExpr) {
             listener.enterPrimaryExpr(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitPrimaryExpr) {
             listener.exitPrimaryExpr(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitPrimaryExpr) {
            return visitor.visitPrimaryExpr(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class PrimaryExpressionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_primaryExpression;
    }
    public override copyFrom(ctx: PrimaryExpressionContext): void {
        super.copyFrom(ctx);
    }
}
export class ParenExpressionContext extends PrimaryExpressionContext {
    public constructor(ctx: PrimaryExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LPAREN, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RPAREN, 0)!;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterParenExpression) {
             listener.enterParenExpression(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitParenExpression) {
             listener.exitParenExpression(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitParenExpression) {
            return visitor.visitParenExpression(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class FunctionCallExpressionContext extends PrimaryExpressionContext {
    public constructor(ctx: PrimaryExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ID(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.ID, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LPAREN, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RPAREN, 0)!;
    }
    public expressionList(): ExpressionListContext | null {
        return this.getRuleContext(0, ExpressionListContext);
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterFunctionCallExpression) {
             listener.enterFunctionCallExpression(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitFunctionCallExpression) {
             listener.exitFunctionCallExpression(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitFunctionCallExpression) {
            return visitor.visitFunctionCallExpression(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class ArrayAccessExpressionContext extends PrimaryExpressionContext {
    public constructor(ctx: PrimaryExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public ID(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.ID, 0)!;
    }
    public LBRACK(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.LBRACK, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public RBRACK(): antlr.TerminalNode {
        return this.getToken(PseudocodeParser.RBRACK, 0)!;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterArrayAccessExpression) {
             listener.enterArrayAccessExpression(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitArrayAccessExpression) {
             listener.exitArrayAccessExpression(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitArrayAccessExpression) {
            return visitor.visitArrayAccessExpression(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
export class AtomExpressionContext extends PrimaryExpressionContext {
    public constructor(ctx: PrimaryExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public atom(): AtomContext {
        return this.getRuleContext(0, AtomContext)!;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterAtomExpression) {
             listener.enterAtomExpression(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitAtomExpression) {
             listener.exitAtomExpression(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitAtomExpression) {
            return visitor.visitAtomExpression(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AtomContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public ID(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.ID, 0);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.INT, 0);
    }
    public FLOAT(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.FLOAT, 0);
    }
    public STRING(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.STRING, 0);
    }
    public TRUE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.TRUE, 0);
    }
    public FALSE(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.FALSE, 0);
    }
    public NULL_VAL(): antlr.TerminalNode | null {
        return this.getToken(PseudocodeParser.NULL_VAL, 0);
    }
    public override get ruleIndex(): number {
        return PseudocodeParser.RULE_atom;
    }
    public override enterRule(listener: PseudocodeListener): void {
        if(listener.enterAtom) {
             listener.enterAtom(this);
        }
    }
    public override exitRule(listener: PseudocodeListener): void {
        if(listener.exitAtom) {
             listener.exitAtom(this);
        }
    }
    public override accept<Result>(visitor: PseudocodeVisitor<Result>): Result | null {
        if (visitor.visitAtom) {
            return visitor.visitAtom(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}

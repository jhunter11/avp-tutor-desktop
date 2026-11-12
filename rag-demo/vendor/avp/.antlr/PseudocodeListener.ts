
import { ErrorNode, ParseTreeListener, ParserRuleContext, TerminalNode } from "antlr4ng";


import { ProgramContext } from "./PseudocodeParser.js";
import { StatementContext } from "./PseudocodeParser.js";
import { AssignmentContext } from "./PseudocodeParser.js";
import { AssignableContext } from "./PseudocodeParser.js";
import { RangeArrayContext } from "./PseudocodeParser.js";
import { SizeArrayContext } from "./PseudocodeParser.js";
import { ValueArrayContext } from "./PseudocodeParser.js";
import { MetadataContext } from "./PseudocodeParser.js";
import { MetadataParamsContext } from "./PseudocodeParser.js";
import { MetadataParamContext } from "./PseudocodeParser.js";
import { BlockContext } from "./PseudocodeParser.js";
import { FunctionDeclContext } from "./PseudocodeParser.js";
import { ParamListContext } from "./PseudocodeParser.js";
import { ParamContext } from "./PseudocodeParser.js";
import { ForEachLoopContext } from "./PseudocodeParser.js";
import { ForLoopContext } from "./PseudocodeParser.js";
import { WhileLoopContext } from "./PseudocodeParser.js";
import { DoWhileLoopContext } from "./PseudocodeParser.js";
import { IfStatementContext } from "./PseudocodeParser.js";
import { FunctionCallStmtContext } from "./PseudocodeParser.js";
import { ReturnStatementContext } from "./PseudocodeParser.js";
import { BreakStatementContext } from "./PseudocodeParser.js";
import { ContinueStatementContext } from "./PseudocodeParser.js";
import { ExpressionListContext } from "./PseudocodeParser.js";
import { ExpressionContext } from "./PseudocodeParser.js";
import { LogicalOrExpressionContext } from "./PseudocodeParser.js";
import { LogicalAndExpressionContext } from "./PseudocodeParser.js";
import { CompareExprContext } from "./PseudocodeParser.js";
import { AddExprContext } from "./PseudocodeParser.js";
import { MulExprContext } from "./PseudocodeParser.js";
import { PowerExpressionContext } from "./PseudocodeParser.js";
import { UnaryMinusExprContext } from "./PseudocodeParser.js";
import { PrimaryExprContext } from "./PseudocodeParser.js";
import { ParenExpressionContext } from "./PseudocodeParser.js";
import { FunctionCallExpressionContext } from "./PseudocodeParser.js";
import { ArrayAccessExpressionContext } from "./PseudocodeParser.js";
import { AtomExpressionContext } from "./PseudocodeParser.js";
import { AtomContext } from "./PseudocodeParser.js";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `PseudocodeParser`.
 */
export class PseudocodeListener implements ParseTreeListener {
    /**
     * Enter a parse tree produced by `PseudocodeParser.program`.
     * @param ctx the parse tree
     */
    enterProgram?: (ctx: ProgramContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.program`.
     * @param ctx the parse tree
     */
    exitProgram?: (ctx: ProgramContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.statement`.
     * @param ctx the parse tree
     */
    enterStatement?: (ctx: StatementContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.statement`.
     * @param ctx the parse tree
     */
    exitStatement?: (ctx: StatementContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.assignment`.
     * @param ctx the parse tree
     */
    enterAssignment?: (ctx: AssignmentContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.assignment`.
     * @param ctx the parse tree
     */
    exitAssignment?: (ctx: AssignmentContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.assignable`.
     * @param ctx the parse tree
     */
    enterAssignable?: (ctx: AssignableContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.assignable`.
     * @param ctx the parse tree
     */
    exitAssignable?: (ctx: AssignableContext) => void;
    /**
     * Enter a parse tree produced by the `RangeArray`
     * labeled alternative in `PseudocodeParser.arrayInitialization`.
     * @param ctx the parse tree
     */
    enterRangeArray?: (ctx: RangeArrayContext) => void;
    /**
     * Exit a parse tree produced by the `RangeArray`
     * labeled alternative in `PseudocodeParser.arrayInitialization`.
     * @param ctx the parse tree
     */
    exitRangeArray?: (ctx: RangeArrayContext) => void;
    /**
     * Enter a parse tree produced by the `SizeArray`
     * labeled alternative in `PseudocodeParser.arrayInitialization`.
     * @param ctx the parse tree
     */
    enterSizeArray?: (ctx: SizeArrayContext) => void;
    /**
     * Exit a parse tree produced by the `SizeArray`
     * labeled alternative in `PseudocodeParser.arrayInitialization`.
     * @param ctx the parse tree
     */
    exitSizeArray?: (ctx: SizeArrayContext) => void;
    /**
     * Enter a parse tree produced by the `ValueArray`
     * labeled alternative in `PseudocodeParser.arrayInitialization`.
     * @param ctx the parse tree
     */
    enterValueArray?: (ctx: ValueArrayContext) => void;
    /**
     * Exit a parse tree produced by the `ValueArray`
     * labeled alternative in `PseudocodeParser.arrayInitialization`.
     * @param ctx the parse tree
     */
    exitValueArray?: (ctx: ValueArrayContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.metadata`.
     * @param ctx the parse tree
     */
    enterMetadata?: (ctx: MetadataContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.metadata`.
     * @param ctx the parse tree
     */
    exitMetadata?: (ctx: MetadataContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.metadataParams`.
     * @param ctx the parse tree
     */
    enterMetadataParams?: (ctx: MetadataParamsContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.metadataParams`.
     * @param ctx the parse tree
     */
    exitMetadataParams?: (ctx: MetadataParamsContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.metadataParam`.
     * @param ctx the parse tree
     */
    enterMetadataParam?: (ctx: MetadataParamContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.metadataParam`.
     * @param ctx the parse tree
     */
    exitMetadataParam?: (ctx: MetadataParamContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.block`.
     * @param ctx the parse tree
     */
    enterBlock?: (ctx: BlockContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.block`.
     * @param ctx the parse tree
     */
    exitBlock?: (ctx: BlockContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.functionDecl`.
     * @param ctx the parse tree
     */
    enterFunctionDecl?: (ctx: FunctionDeclContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.functionDecl`.
     * @param ctx the parse tree
     */
    exitFunctionDecl?: (ctx: FunctionDeclContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.paramList`.
     * @param ctx the parse tree
     */
    enterParamList?: (ctx: ParamListContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.paramList`.
     * @param ctx the parse tree
     */
    exitParamList?: (ctx: ParamListContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.param`.
     * @param ctx the parse tree
     */
    enterParam?: (ctx: ParamContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.param`.
     * @param ctx the parse tree
     */
    exitParam?: (ctx: ParamContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.forEachLoop`.
     * @param ctx the parse tree
     */
    enterForEachLoop?: (ctx: ForEachLoopContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.forEachLoop`.
     * @param ctx the parse tree
     */
    exitForEachLoop?: (ctx: ForEachLoopContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.forLoop`.
     * @param ctx the parse tree
     */
    enterForLoop?: (ctx: ForLoopContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.forLoop`.
     * @param ctx the parse tree
     */
    exitForLoop?: (ctx: ForLoopContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.whileLoop`.
     * @param ctx the parse tree
     */
    enterWhileLoop?: (ctx: WhileLoopContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.whileLoop`.
     * @param ctx the parse tree
     */
    exitWhileLoop?: (ctx: WhileLoopContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.doWhileLoop`.
     * @param ctx the parse tree
     */
    enterDoWhileLoop?: (ctx: DoWhileLoopContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.doWhileLoop`.
     * @param ctx the parse tree
     */
    exitDoWhileLoop?: (ctx: DoWhileLoopContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.ifStatement`.
     * @param ctx the parse tree
     */
    enterIfStatement?: (ctx: IfStatementContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.ifStatement`.
     * @param ctx the parse tree
     */
    exitIfStatement?: (ctx: IfStatementContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.functionCallStmt`.
     * @param ctx the parse tree
     */
    enterFunctionCallStmt?: (ctx: FunctionCallStmtContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.functionCallStmt`.
     * @param ctx the parse tree
     */
    exitFunctionCallStmt?: (ctx: FunctionCallStmtContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.returnStatement`.
     * @param ctx the parse tree
     */
    enterReturnStatement?: (ctx: ReturnStatementContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.returnStatement`.
     * @param ctx the parse tree
     */
    exitReturnStatement?: (ctx: ReturnStatementContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.breakStatement`.
     * @param ctx the parse tree
     */
    enterBreakStatement?: (ctx: BreakStatementContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.breakStatement`.
     * @param ctx the parse tree
     */
    exitBreakStatement?: (ctx: BreakStatementContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.continueStatement`.
     * @param ctx the parse tree
     */
    enterContinueStatement?: (ctx: ContinueStatementContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.continueStatement`.
     * @param ctx the parse tree
     */
    exitContinueStatement?: (ctx: ContinueStatementContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.expressionList`.
     * @param ctx the parse tree
     */
    enterExpressionList?: (ctx: ExpressionListContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.expressionList`.
     * @param ctx the parse tree
     */
    exitExpressionList?: (ctx: ExpressionListContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.expression`.
     * @param ctx the parse tree
     */
    enterExpression?: (ctx: ExpressionContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.expression`.
     * @param ctx the parse tree
     */
    exitExpression?: (ctx: ExpressionContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.logicalOrExpression`.
     * @param ctx the parse tree
     */
    enterLogicalOrExpression?: (ctx: LogicalOrExpressionContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.logicalOrExpression`.
     * @param ctx the parse tree
     */
    exitLogicalOrExpression?: (ctx: LogicalOrExpressionContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.logicalAndExpression`.
     * @param ctx the parse tree
     */
    enterLogicalAndExpression?: (ctx: LogicalAndExpressionContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.logicalAndExpression`.
     * @param ctx the parse tree
     */
    exitLogicalAndExpression?: (ctx: LogicalAndExpressionContext) => void;
    /**
     * Enter a parse tree produced by the `CompareExpr`
     * labeled alternative in `PseudocodeParser.comparisonExpression`.
     * @param ctx the parse tree
     */
    enterCompareExpr?: (ctx: CompareExprContext) => void;
    /**
     * Exit a parse tree produced by the `CompareExpr`
     * labeled alternative in `PseudocodeParser.comparisonExpression`.
     * @param ctx the parse tree
     */
    exitCompareExpr?: (ctx: CompareExprContext) => void;
    /**
     * Enter a parse tree produced by the `AddExpr`
     * labeled alternative in `PseudocodeParser.additiveExpression`.
     * @param ctx the parse tree
     */
    enterAddExpr?: (ctx: AddExprContext) => void;
    /**
     * Exit a parse tree produced by the `AddExpr`
     * labeled alternative in `PseudocodeParser.additiveExpression`.
     * @param ctx the parse tree
     */
    exitAddExpr?: (ctx: AddExprContext) => void;
    /**
     * Enter a parse tree produced by the `MulExpr`
     * labeled alternative in `PseudocodeParser.multiplicativeExpression`.
     * @param ctx the parse tree
     */
    enterMulExpr?: (ctx: MulExprContext) => void;
    /**
     * Exit a parse tree produced by the `MulExpr`
     * labeled alternative in `PseudocodeParser.multiplicativeExpression`.
     * @param ctx the parse tree
     */
    exitMulExpr?: (ctx: MulExprContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.powerExpression`.
     * @param ctx the parse tree
     */
    enterPowerExpression?: (ctx: PowerExpressionContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.powerExpression`.
     * @param ctx the parse tree
     */
    exitPowerExpression?: (ctx: PowerExpressionContext) => void;
    /**
     * Enter a parse tree produced by the `UnaryMinusExpr`
     * labeled alternative in `PseudocodeParser.unaryExpression`.
     * @param ctx the parse tree
     */
    enterUnaryMinusExpr?: (ctx: UnaryMinusExprContext) => void;
    /**
     * Exit a parse tree produced by the `UnaryMinusExpr`
     * labeled alternative in `PseudocodeParser.unaryExpression`.
     * @param ctx the parse tree
     */
    exitUnaryMinusExpr?: (ctx: UnaryMinusExprContext) => void;
    /**
     * Enter a parse tree produced by the `PrimaryExpr`
     * labeled alternative in `PseudocodeParser.unaryExpression`.
     * @param ctx the parse tree
     */
    enterPrimaryExpr?: (ctx: PrimaryExprContext) => void;
    /**
     * Exit a parse tree produced by the `PrimaryExpr`
     * labeled alternative in `PseudocodeParser.unaryExpression`.
     * @param ctx the parse tree
     */
    exitPrimaryExpr?: (ctx: PrimaryExprContext) => void;
    /**
     * Enter a parse tree produced by the `ParenExpression`
     * labeled alternative in `PseudocodeParser.primaryExpression`.
     * @param ctx the parse tree
     */
    enterParenExpression?: (ctx: ParenExpressionContext) => void;
    /**
     * Exit a parse tree produced by the `ParenExpression`
     * labeled alternative in `PseudocodeParser.primaryExpression`.
     * @param ctx the parse tree
     */
    exitParenExpression?: (ctx: ParenExpressionContext) => void;
    /**
     * Enter a parse tree produced by the `FunctionCallExpression`
     * labeled alternative in `PseudocodeParser.primaryExpression`.
     * @param ctx the parse tree
     */
    enterFunctionCallExpression?: (ctx: FunctionCallExpressionContext) => void;
    /**
     * Exit a parse tree produced by the `FunctionCallExpression`
     * labeled alternative in `PseudocodeParser.primaryExpression`.
     * @param ctx the parse tree
     */
    exitFunctionCallExpression?: (ctx: FunctionCallExpressionContext) => void;
    /**
     * Enter a parse tree produced by the `ArrayAccessExpression`
     * labeled alternative in `PseudocodeParser.primaryExpression`.
     * @param ctx the parse tree
     */
    enterArrayAccessExpression?: (ctx: ArrayAccessExpressionContext) => void;
    /**
     * Exit a parse tree produced by the `ArrayAccessExpression`
     * labeled alternative in `PseudocodeParser.primaryExpression`.
     * @param ctx the parse tree
     */
    exitArrayAccessExpression?: (ctx: ArrayAccessExpressionContext) => void;
    /**
     * Enter a parse tree produced by the `AtomExpression`
     * labeled alternative in `PseudocodeParser.primaryExpression`.
     * @param ctx the parse tree
     */
    enterAtomExpression?: (ctx: AtomExpressionContext) => void;
    /**
     * Exit a parse tree produced by the `AtomExpression`
     * labeled alternative in `PseudocodeParser.primaryExpression`.
     * @param ctx the parse tree
     */
    exitAtomExpression?: (ctx: AtomExpressionContext) => void;
    /**
     * Enter a parse tree produced by `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    enterAtom?: (ctx: AtomContext) => void;
    /**
     * Exit a parse tree produced by `PseudocodeParser.atom`.
     * @param ctx the parse tree
     */
    exitAtom?: (ctx: AtomContext) => void;

    visitTerminal(node: TerminalNode): void {}
    visitErrorNode(node: ErrorNode): void {}
    enterEveryRule(node: ParserRuleContext): void {}
    exitEveryRule(node: ParserRuleContext): void {}
}


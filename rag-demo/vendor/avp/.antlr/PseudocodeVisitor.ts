
import { AbstractParseTreeVisitor } from "antlr4ng";


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
 * This interface defines a complete generic visitor for a parse tree produced
 * by `PseudocodeParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export class PseudocodeVisitor<Result> extends AbstractParseTreeVisitor<Result> {
    /**
     * Visit a parse tree produced by `PseudocodeParser.program`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitProgram?: (ctx: ProgramContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.statement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitStatement?: (ctx: StatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.assignment`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAssignment?: (ctx: AssignmentContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.assignable`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAssignable?: (ctx: AssignableContext) => Result;
    /**
     * Visit a parse tree produced by the `RangeArray`
     * labeled alternative in `PseudocodeParser.arrayInitialization`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitRangeArray?: (ctx: RangeArrayContext) => Result;
    /**
     * Visit a parse tree produced by the `SizeArray`
     * labeled alternative in `PseudocodeParser.arrayInitialization`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitSizeArray?: (ctx: SizeArrayContext) => Result;
    /**
     * Visit a parse tree produced by the `ValueArray`
     * labeled alternative in `PseudocodeParser.arrayInitialization`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitValueArray?: (ctx: ValueArrayContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.metadata`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMetadata?: (ctx: MetadataContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.metadataParams`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMetadataParams?: (ctx: MetadataParamsContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.metadataParam`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMetadataParam?: (ctx: MetadataParamContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.block`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBlock?: (ctx: BlockContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.functionDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFunctionDecl?: (ctx: FunctionDeclContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.paramList`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitParamList?: (ctx: ParamListContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.param`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitParam?: (ctx: ParamContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.forEachLoop`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitForEachLoop?: (ctx: ForEachLoopContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.forLoop`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitForLoop?: (ctx: ForLoopContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.whileLoop`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitWhileLoop?: (ctx: WhileLoopContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.doWhileLoop`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDoWhileLoop?: (ctx: DoWhileLoopContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.ifStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitIfStatement?: (ctx: IfStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.functionCallStmt`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFunctionCallStmt?: (ctx: FunctionCallStmtContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.returnStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitReturnStatement?: (ctx: ReturnStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.breakStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBreakStatement?: (ctx: BreakStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.continueStatement`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitContinueStatement?: (ctx: ContinueStatementContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.expressionList`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitExpressionList?: (ctx: ExpressionListContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitExpression?: (ctx: ExpressionContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.logicalOrExpression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitLogicalOrExpression?: (ctx: LogicalOrExpressionContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.logicalAndExpression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitLogicalAndExpression?: (ctx: LogicalAndExpressionContext) => Result;
    /**
     * Visit a parse tree produced by the `CompareExpr`
     * labeled alternative in `PseudocodeParser.comparisonExpression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitCompareExpr?: (ctx: CompareExprContext) => Result;
    /**
     * Visit a parse tree produced by the `AddExpr`
     * labeled alternative in `PseudocodeParser.additiveExpression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAddExpr?: (ctx: AddExprContext) => Result;
    /**
     * Visit a parse tree produced by the `MulExpr`
     * labeled alternative in `PseudocodeParser.multiplicativeExpression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMulExpr?: (ctx: MulExprContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.powerExpression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitPowerExpression?: (ctx: PowerExpressionContext) => Result;
    /**
     * Visit a parse tree produced by the `UnaryMinusExpr`
     * labeled alternative in `PseudocodeParser.unaryExpression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitUnaryMinusExpr?: (ctx: UnaryMinusExprContext) => Result;
    /**
     * Visit a parse tree produced by the `PrimaryExpr`
     * labeled alternative in `PseudocodeParser.unaryExpression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitPrimaryExpr?: (ctx: PrimaryExprContext) => Result;
    /**
     * Visit a parse tree produced by the `ParenExpression`
     * labeled alternative in `PseudocodeParser.primaryExpression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitParenExpression?: (ctx: ParenExpressionContext) => Result;
    /**
     * Visit a parse tree produced by the `FunctionCallExpression`
     * labeled alternative in `PseudocodeParser.primaryExpression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFunctionCallExpression?: (ctx: FunctionCallExpressionContext) => Result;
    /**
     * Visit a parse tree produced by the `ArrayAccessExpression`
     * labeled alternative in `PseudocodeParser.primaryExpression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitArrayAccessExpression?: (ctx: ArrayAccessExpressionContext) => Result;
    /**
     * Visit a parse tree produced by the `AtomExpression`
     * labeled alternative in `PseudocodeParser.primaryExpression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAtomExpression?: (ctx: AtomExpressionContext) => Result;
    /**
     * Visit a parse tree produced by `PseudocodeParser.atom`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAtom?: (ctx: AtomContext) => Result;
}


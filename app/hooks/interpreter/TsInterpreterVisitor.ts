import { AbstractParseTreeVisitor } from 'antlr4ng';
import { PseudocodeVisitor } from './.antlr/PseudocodeVisitor';
import type {
  AssignmentContext,
  ForEachLoopContext,
  FunctionDeclContext,
  IfStatementContext,
  ProgramContext,
  ReturnStatementContext,
  AtomExpressionContext,
  RangeArrayContext,
  SizeArrayContext,
  ValueArrayContext,
  WhileLoopContext,
  CompareExprContext,
  AddExprContext,
  MulExprContext,
  UnaryMinusExprContext,
  ParenExpressionContext,
  FunctionCallExpressionContext,
  ArrayAccessExpressionContext,
  ExpressionListContext,
  FunctionCallStmtContext,
  BlockContext,
  StatementContext,
  PowerExpressionContext,
  LogicalAndExpressionContext,
  LogicalOrExpressionContext, 
  ForLoopContext,
  DoWhileLoopContext,
  BreakStatementContext
} from './.antlr/PseudocodeParser';

export default class TsInterpreterVisitor
  extends AbstractParseTreeVisitor<string>
  implements PseudocodeVisitor<string> {
  private indentLevel = 0;

  protected defaultResult(): string { return ''; }
  private indent(): string { return '  '.repeat(this.indentLevel); }

  protected aggregateResult(aggregate: any, nextResult: any): any {
    if (aggregate !== null && aggregate !== undefined && aggregate !== '') return aggregate;
    return nextResult;
  }

  visitBlock(ctx: BlockContext): string {
    this.indentLevel++;
    let blockContent = '';
    const statements = ctx.statement();
    if (statements) {
      blockContent = statements.map(stmt => this.visit(stmt)).join('');
    }
    this.indentLevel--;
    return blockContent;
  }

  visitProgram(ctx: ProgramContext): string {
    let programCode = '';
    const statements = ctx.statement();
    if (statements) {
      programCode = statements.map(stmt => this.visit(stmt)).join('');
    }
    return programCode;
  }

  visitStatement(ctx: StatementContext): string {
    if (ctx.assignment()) return this.visit(ctx.assignment()!) ?? '';
    if (ctx.functionDecl()) return this.visit(ctx.functionDecl()!) ?? '';
    if (ctx.functionCallStmt()) return this.visit(ctx.functionCallStmt()!) ?? '';
    if (ctx.forEachLoop()) return this.visit(ctx.forEachLoop()!) ?? '';
    if (ctx.whileLoop()) return this.visit(ctx.whileLoop()!) ?? '';
    if (ctx.ifStatement()) return this.visit(ctx.ifStatement()!) ?? '';
    if (ctx.returnStatement()) return this.visit(ctx.returnStatement()!) ?? '';
    if (ctx.forLoop()) return this.visit(ctx.forLoop()!) ?? '';
    if (ctx.doWhileLoop()) return this.visit(ctx.doWhileLoop()!) ?? '';
    if (ctx.breakStatement()) return this.visit(ctx.breakStatement()!) ?? '';
    return '';
  }

  visitBreakStatement(ctx: BreakStatementContext): string {
    return `${this.indent()}break;\n`;
  }
  
  visitAssignment(ctx: AssignmentContext): string {
    const assignableText = ctx.assignable().getText();
    const value = ctx.expression() ? this.visit(ctx.expression()!) : this.visit(ctx.arrayInitialization()!);
    const op = ctx.EQ() ? '=' : (ctx.PLUS_EQ() ? '+=' : '-=');
    const isArrayAccess = assignableText.includes('[');
    const prefix = isArrayAccess ? '' : 'let ';
    return `${this.indent()}${prefix}${assignableText} ${op} ${value};\n`;
  }

  visitRangeArray(ctx: RangeArrayContext): string {
    const from = this.visit(ctx._from_!);
    const to = this.visit(ctx._to!);
    return `Array.from({length: (${to}) - (${from}) + 1}, (_, i) => (${from}) + i)`;
  }

  visitSizeArray(ctx: SizeArrayContext): string {
    const size = this.visit(ctx._size!);
    let defaultVal = '0';
    if (ctx._defaultVal) {
      defaultVal = this.visit(ctx._defaultVal)!;
    }
    return `new Array(${size}).fill(${defaultVal})`;
  }

  visitValueArray(ctx: ValueArrayContext): string {
    const elements = this.visit(ctx.expressionList()!);
    return `[${elements}]`;
  }

  visitFunctionDecl(ctx: FunctionDeclContext): string {
    const funcName = ctx.ID().getText();
    const paramList = ctx.paramList();
    let params = '';
    if (paramList) {
      const paramCtxs = paramList.param();
      if (paramCtxs) params = paramCtxs.map((p: any) => p.ID().getText()).join(', ');
    }
    const body = this.visitBlock(ctx.block()!);
    return `${this.indent()}function ${funcName}(${params}) {\n${body}${this.indent()}}\n`;
  }

  visitForLoop(ctx: ForLoopContext): string {
    const initRaw = this.visit(ctx.assignment(0)!) ?? '';
    let init = initRaw.trim().replace(/;$/, '');
    if (init.startsWith('let ')) init = init.substring(4); 
    
    const cond = this.visit(ctx.expression()!) ?? '';
    
    const updateRaw = this.visit(ctx.assignment(1)!) ?? '';
    let update = updateRaw.trim().replace(/;$/, '');
    if (update.startsWith('let ')) update = update.substring(4);

    const body = this.visitBlock(ctx.block()!);
    return `${this.indent()}for (let ${init}; ${cond}; ${update}) {\n${body}${this.indent()}}\n`;
  }

  visitDoWhileLoop(ctx: DoWhileLoopContext): string {
    const body = this.visitBlock(ctx.block()!);
    const cond = this.visit(ctx.expression()!);
    return `${this.indent()}do {\n${body}${this.indent()}} while (${cond});\n`;
  }

  visitForEachLoop(ctx: ForEachLoopContext): string {
    const varName = ctx.ID(0)!.getText();
    const arrayName = ctx.ID(1)!.getText();
    const body = this.visitBlock(ctx.block()!);
    return `${this.indent()}for (const ${varName} of ${arrayName}) {\n${body}${this.indent()}}\n`;
  }

  visitWhileLoop(ctx: WhileLoopContext): string {
    const condition = this.visit(ctx.expression()!);
    const body = this.visitBlock(ctx.block()!);
    return `${this.indent()}while (${condition}) {\n${body}${this.indent()}}\n`;
  }

  visitIfStatement(ctx: IfStatementContext): string {
    const condition = this.visit(ctx.expression(0)!);
    const body = this.visitBlock(ctx.block(0)!);
    return `${this.indent()}if (${condition}) {\n${body}${this.indent()}}\n`;
  }

  visitReturnStatement(ctx: ReturnStatementContext): string {
    return `${this.indent()}return ${this.visit(ctx.expression()!)};\n`;
  }

  visitAtomExpression(ctx: AtomExpressionContext): string { 
    return ctx.atom().getText(); 
  }

  visitLogicalOrExpression(ctx: LogicalOrExpressionContext): string {
    let left = this.visit(ctx._left!) as string;
    const rights = ctx._right;
    if (!rights || (Array.isArray(rights) && rights.length === 0)) return left;
    const rightArray = Array.isArray(rights) ? rights : [rights];
    for (let i = 0; i < rightArray.length; i++) left = `${left} || ${this.visit(rightArray[i])}`;
    return left;
  }

  visitLogicalAndExpression(ctx: LogicalAndExpressionContext): string {
    let left = this.visit(ctx._left!) as string;
    const rights = ctx._right;
    if (!rights || (Array.isArray(rights) && rights.length === 0)) return left;
    const rightArray = Array.isArray(rights) ? rights : [rights];
    for (let i = 0; i < rightArray.length; i++) left = `${left} && ${this.visit(rightArray[i])}`;
    return left;
  }

  visitCompareExpr(ctx: CompareExprContext): string {
    let left = this.visit(ctx._left!) as string;
    const rights = ctx._right;
    const ops = ctx._op;
    
    if (!rights || (Array.isArray(rights) && rights.length === 0)) return left;
    
    const rightArray = Array.isArray(rights) ? rights : [rights];
    const opArray = Array.isArray(ops) ? ops : [ops];

    for (let i = 0; i < rightArray.length; i++) {
      const right = this.visit(rightArray[i]);
      const opText = opArray[i].text!;
      const jsOp = opText === '==' ? '===' : opText;
      left = `${left} ${jsOp} ${right}`;
    }
    return left;
  }

  visitAddExpr(ctx: AddExprContext): string {
    let left = this.visit(ctx._left!) as string;
    const rights = ctx._right;
    const ops = ctx._op;
    if (!rights || (Array.isArray(rights) && rights.length === 0)) return left;
    const rightArray = Array.isArray(rights) ? rights : [rights];
    const opArray = Array.isArray(ops) ? ops : [ops];
    for (let i = 0; i < rightArray.length; i++) left = `${left} ${opArray[i].text!} ${this.visit(rightArray[i])}`;
    return left;
  }

  visitMulExpr(ctx: MulExprContext): string {
    let left = this.visit(ctx._left!) as string;
    const rights = ctx._right;
    const ops = ctx._op;
    if (!rights || (Array.isArray(rights) && rights.length === 0)) return left;
    const rightArray = Array.isArray(rights) ? rights : [rights];
    const opArray = Array.isArray(ops) ? ops : [ops];
    for (let i = 0; i < rightArray.length; i++) left = `${left} ${opArray[i].text!} ${this.visit(rightArray[i])}`;
    return left;
  }

  visitPowerExpression(ctx: PowerExpressionContext): string {
    let left = this.visit(ctx._left!) as string;
    const rights = ctx._right;
    if (!rights || (Array.isArray(rights) && rights.length === 0)) return left;
    const rightArray = Array.isArray(rights) ? rights : [rights];
    for (let i = 0; i < rightArray.length; i++) left = `Math.pow(${left}, ${this.visit(rightArray[i])})`;
    return left;
  }

  visitParenExpression(ctx: ParenExpressionContext): string { 
    return `(${this.visit(ctx.expression()!)})`; 
  }
  
  visitUnaryMinusExpr(ctx: UnaryMinusExprContext): string { 
    return `-${this.visit(ctx.unaryExpression()!)}`; 
  }

  visitFunctionCallExpression(ctx: FunctionCallExpressionContext): string {
    const funcName = ctx.ID().getText();
    let args = '';
    const list = ctx.expressionList();
    if (list) args = this.visit(list)!;

    if ((funcName === 'size' || funcName === 'length')) return `${args}.length`;
    if (funcName === 'floor') return `Math.floor(${args})`;
    return `${funcName}(${args})`;
  }

  visitExpressionList(ctx: ExpressionListContext): string {
    const expressions = ctx.expression();
    if (expressions) return expressions.map(expr => this.visit(expr)).join(', ');
    return '';
  }

  visitArrayAccessExpression(ctx: ArrayAccessExpressionContext): string {
    const arrayName = ctx.ID().getText();
    const index = this.visit(ctx.expression()!);
    return `${arrayName}[${index}]`;
  }

  visitFunctionCallStmt(ctx: FunctionCallStmtContext): string {
    const funcName = ctx.ID().getText();
    const exprList = ctx.expressionList();
    
    // JS Compile: Destructure arrays so that swap actually mutates memory
    if (funcName === 'swap' && exprList) {
        const exprs = exprList.expression();
        if (exprs.length === 2) {
            const arg1 = this.visit(exprs[0]);
            const arg2 = this.visit(exprs[1]);
            return `${this.indent()}[${arg1}, ${arg2}] = [${arg2}, ${arg1}];\n`;
        }
    }

    const args = exprList ? this.visit(exprList) : '';
    return `${this.indent()}${funcName}(${args});\n`;
  }
}

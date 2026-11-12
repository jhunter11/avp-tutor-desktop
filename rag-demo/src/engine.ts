import { CharStream, CommonTokenStream, BaseErrorListener, type ParseTree } from 'antlr4ng';
import { PseudocodeLexer } from '../vendor/avp/.antlr/PseudocodeLexer';
import { PseudocodeParser } from '../vendor/avp/.antlr/PseudocodeParser';
import TraceInterpreterVisitor from '../vendor/avp/TraceInterpreterVisitor';
import type { TraceStep } from '../vendor/avp/TraceType';

export type Configuration = {id?:string; input:number[]; target?:number; low?:number; high?:number};
export type Algorithm = {id:string; title:string; kind:string; entry:string; reference_path:string; precondition:string; cases:Configuration[]; notes:string[]; question_ladder:string[]};
export type Execution = {steps:TraceStep[]; globals:Record<string,unknown>; result:unknown; visits:number};
class SyntaxErrors extends BaseErrorListener {
  errors:string[]=[];
  override syntaxError(_recognizer:any,_symbol:any,line:number,column:number,message:string):void { this.errors.push(`AVP syntax ${line}:${column}: ${message}`); }
}
class BoundedVisitor extends TraceInterpreterVisitor {
  visits=0;
  override visit(tree:ParseTree):any {
    if (++this.visits>150000 || this.steps.length>6000) throw new Error('AVP execution budget exceeded. Use a smaller input or check loop progress.');
    return super.visit(tree);
  }
}
export function execute(source:string):Execution {
  if (source.length>32000) throw new Error('Source limit is 32,000 characters.');
  const errors=new SyntaxErrors();
  const lexer=new PseudocodeLexer(CharStream.fromString(source));
  lexer.removeErrorListeners(); lexer.addErrorListener(errors);
  const parser=new PseudocodeParser(new CommonTokenStream(lexer));
  parser.removeErrorListeners(); parser.addErrorListener(errors);
  const tree=parser.program();
  if(errors.errors.length)throw new Error(errors.errors.join('\n'));
  const visitor=new BoundedVisitor(); visitor.visit(tree);
  const globals=Object.fromEntries(Reflect.get(visitor,'globalScope') as Map<string,unknown>);
  if(visitor.steps.some(s=>s.actions.some(a=>a.cmd==='vis_log'&&a.params.level==='error'))) throw new Error('AVP execution produced an undefined-value error.');
  return structuredClone({steps:visitor.steps,globals,result:globals.result,visits:visitor.visits});
}
export function checkConfiguration(a:Pick<Algorithm,'kind'|'id'>,c:Configuration):void {
  if(!Array.isArray(c.input)||c.input.length>32||c.input.some(v=>!Number.isSafeInteger(v)||Math.abs(v)>10000))throw new Error('Use at most 32 integers between -10,000 and 10,000.');
  if(a.kind==='search'&&!Number.isSafeInteger(c.target))throw new Error('A search requires an integer target.');
  if(a.id==='binary_search'&&c.input.some((v,i)=>i>0&&v<c.input[i-1]))throw new Error('Binary Search requires ascending sorted input.');
  if(a.kind==='lomuto'||a.kind==='hoare'){
    if(!c.input.length||!Number.isInteger(c.low)||!Number.isInteger(c.high)||c.low!<0||c.high!>=c.input.length||c.low!>c.high!)throw new Error('Partition requires a nonempty array and 0 <= low <= high < length.');
  }
}
export function makeSource(a:Algorithm,c:Configuration,program:string):string {
  checkConfiguration(a,c);
  const init=c.input.length?`a = arr[${c.input.join(', ')}]`:'a = arr(0)';
  const extra=a.kind==='search'?`\nkey = ${c.target}`:(a.kind==='lomuto'||a.kind==='hoare')?`\nlow = ${c.low}\nhigh = ${c.high}`:'';
  return `${init}${extra}\n\n${program.trim()}\n\n${a.entry}\n`;
}
export function stateAt(steps:TraceStep[],count:number){
  const variables:Record<string,unknown>={}; let array:unknown[]=[];
  for(const step of steps.slice(0,count))for(const action of step.actions){
    const p=action.params;
    if(action.cmd==='var_add'&&p.name) variables[p.name]=structuredClone(p.value);
    if(action.cmd==='var_delete'&&p.name)delete variables[p.name];
    if(action.cmd==='vis_init'&&Array.isArray(p.data))array=[...p.data];
    if(action.cmd==='vis_update'&&p.index!==undefined)array[p.index]=p.value;
    if(action.cmd==='vis_swap'&&p.index!==undefined&&p.index2!==undefined)[array[p.index],array[p.index2]]=[array[p.index2],array[p.index]];
  }
  return {variables,array};
}

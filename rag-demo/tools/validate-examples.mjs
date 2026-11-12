import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execute,makeSource,checkConfiguration} from '../.generated/engine.mjs';
const library=JSON.parse(await readFile('public/library.json','utf8'));
assert.throws(()=>execute('fun broken(:\nreturn 1\nend fun'),/syntax/i);
assert.throws(()=>execute('while (true):\n x = 1\nend while'),/budget|limit/i);
assert.throws(()=>checkConfiguration({kind:'search',id:'binary_search'},{input:[4,1],target:1}),/sorted/i);
assert.throws(()=>checkConfiguration({kind:'hoare',id:'hoare_partition'},{input:[],low:0,high:-1}),/nonempty/i);
assert.throws(()=>checkConfiguration({kind:'sort',id:'bubble_sort'},{input:[NaN]}),/integer/i);
const hash=s=>createHash('sha256').update(s).digest('hex');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function oracle(a,c,run){
 const out=run.result, original=c.input;
 if(a.kind==='sort'){
  const expected=[...original].sort((x,y)=>x-y); return {pass:same(out,expected),expected};
 }
 if(a.kind==='unique'){const expected=Number(new Set(original).size===original.length);return {pass:out===expected,expected};}
 if(a.kind==='search'){
  const expected=original.indexOf(c.target);
  return {pass:a.id==='linear_search'?out===expected:(expected===-1?out===-1:Number.isInteger(out)&&out>=0&&out<original.length&&original[out]===c.target),expected:a.id==='binary_search'&&expected!==-1?'any valid matching index':expected};
 }
 const result=run.globals.a,lo=c.low,hi=c.high,pivot=original[a.kind==='lomuto'?hi:lo];
 const unchanged=Array.isArray(result)&&same(original.slice(0,lo),result.slice(0,lo))&&same(original.slice(hi+1),result.slice(hi+1));
 const permutation=unchanged&&same(original.slice(lo,hi+1).sort((x,y)=>x-y),result.slice(lo,hi+1).sort((x,y)=>x-y));
 let invariant=false;
 if(permutation&&Number.isInteger(out)){
  if(a.kind==='lomuto')invariant=out>=lo&&out<=hi&&result[out]===pivot&&result.slice(lo,out).every(v=>v<pivot)&&result.slice(out+1,hi+1).every(v=>v>=pivot);
  else invariant=out>=lo&&(lo===hi?out===lo:out<hi)&&result.slice(lo,out+1).every(v=>v<=pivot)&&result.slice(out+1,hi+1).every(v=>v>=pivot);
 }
 return {pass:permutation&&invariant,expected:{permutation:true,outside_interval_unchanged:true,partition_invariant:true,pivot_value:pivot},array:result};
}
let seed=61112;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed;};
const entries=[];
for(const a of library){
 const program=await readFile(`public/${a.reference_path}`,'utf8');
 const tests=[...a.cases.map(c=>({...c,suite:'explicit-config'}))];
 for(let n=0;n<40;n++){
  const length=(a.kind==='lomuto'||a.kind==='hoare')?1+random()%9:random()%10;
  let input=Array.from({length},()=>Number(random()%15)-7);
  if(a.id==='binary_search')input.sort((x,y)=>x-y);
  const c={id:`seeded-${n}`,input,suite:'seeded-check'};
  if(a.kind==='search')c.target=random()%3===0?99:input.length?input[random()%input.length]:1;
  if(a.kind==='lomuto'||a.kind==='hoare'){c.low=random()%input.length;c.high=c.low+random()%(input.length-c.low);}
  tests.push(c);
 }
 const results=[];
 for(const c of tests){
  try{const run=execute(makeSource(a,c,program));const judged=oracle(a,c,run);results.push({...c,...judged,actual:run.result,trace_steps:run.steps.length});}
  catch(error){results.push({...c,pass:false,error:error.message});}
 }
 const passed=results.filter(c=>c.pass).length;
 entries.push({id:a.id,title:a.title,program_sha256:hash(program),configuration_sha256:hash(JSON.stringify(a)),explicit_cases:a.cases.length,seeded_cases:40,passed,total:results.length,status:passed===results.length?'machine-validated':'failed',human_review:'pending',results});
 console.log(`${a.id}: ${passed}/${results.length}`);
}
const practice=JSON.parse(await readFile('public/practice.json','utf8'));const practiceChecks=[];
for(const p of practice){const a=library.find(x=>x.id===p.algorithm);try{const run=execute(makeSource(a,p.configuration,p.program));const judged=oracle(a,p.configuration,run);practiceChecks.push({algorithm:a.id,detected:!judged.pass,observed:run.result,misconception:p.misconception});}catch(error){practiceChecks.push({algorithm:a.id,detected:true,execution_error:error.message,misconception:p.misconception});}}
assert.ok(practiceChecks.every(x=>x.detected),'A deliberately faulty exercise was not detected.');
const vendor=JSON.parse(await readFile('docs/UPSTREAM.json','utf8'));
const interpreterFiles={};for(const name of Object.keys(vendor.files))interpreterFiles[name]=hash(await readFile(name));interpreterFiles['src/engine.ts']=hash(await readFile('src/engine.ts'));
const report={interpreter_files:interpreterFiles,generated_at:new Date().toISOString(),scope:'Finite deterministic checks under the pinned trace interpreter; not a proof for all inputs or a human review.',upstream_revision:vendor.revision,engine_sha256:hash(await readFile('.generated/engine.mjs')),guard_checks:5,practice_checks:practiceChecks,algorithms:entries,total:entries.reduce((n,a)=>n+a.total,0),passed:entries.reduce((n,a)=>n+a.passed,0)};
await writeFile('reports/validation.json',JSON.stringify(report,null,2)+'\n');
await writeFile('public/validation.json',JSON.stringify(report,null,2)+'\n');
assert.equal(report.passed,report.total,'Reference/configuration failures: inspect reports/validation.json');
console.log(`Validated ${report.passed}/${report.total} cases across ${entries.length} algorithms; five guard checks.`);

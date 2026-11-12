import './style.css';
import {makeSource,stateAt,checkConfiguration,type Algorithm,type Configuration,type Execution} from './engine';
type Turn={role:'user'|'assistant';content:string};
type Practice={algorithm:string;configuration:Configuration;program:string;misconception:string};
const $=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
const code=$<HTMLTextAreaElement>('code'),question=$<HTMLTextAreaElement>('question');
let library:Algorithm[]=[],practice:Practice[]=[],teachingNotes:any[]=[],report:any,algorithm:Algorithm,reference='',configuration:Configuration;
let run:Execution|null=null,executedSource='',executionError='',view=0,history:Turn[]=[],controller:AbortController|null=null,requestSerial=0,runSerial=0,selectionSerial=0,programWorker:Worker|null=null;
const headers={'Content-Type':'application/json','X-Tutor-Client':'web-v1'};
const nice=(value:unknown)=>JSON.stringify(value,null,2)??'undefined';
const status=(message:string,error=false)=>{$('status').textContent=message;$('status').classList.toggle('error',error);};
const setError=(message:string)=>{$('tutor-error').textContent=message;};
function stopRequest(){requestSerial++;controller?.abort();controller=null;setPending(false);}
function setPending(value:boolean){$('pending').hidden=!value;$<HTMLButtonElement>('ask').disabled=value;$<HTMLSelectElement>('mode').disabled=value;$('cancel').hidden=!value;question.disabled=value;}
function clearConversation(){stopRequest();history=[];$('conversation').replaceChildren();const p=document.createElement('p');p.className='empty';p.textContent='Ask about the current code or the step you are viewing.';$('conversation').append(p);$('retrieved-notes').textContent='Ask a question to inspect retrieval.';setError('');}
function appendTurn(role:'user'|'assistant',text:string){$('conversation').querySelector('.empty')?.remove();const el=document.createElement('div');el.className=`turn ${role}`;const who=document.createElement('span');who.className='role';who.textContent=role==='user'?'Student':'Tutor';const content=document.createElement('span');content.textContent=text;el.append(who,content);$('conversation').append(el);$('conversation').scrollTop=$('conversation').scrollHeight;}
function readConfiguration():Configuration {
 const c:Configuration={input:JSON.parse($<HTMLInputElement>('array-input').value)};
 if(algorithm.kind==='search')c.target=Number($<HTMLInputElement>('target-input').value);
 if(['lomuto','hoare'].includes(algorithm.kind)){c.low=Number($<HTMLInputElement>('low-input').value);c.high=Number($<HTMLInputElement>('high-input').value);}
 checkConfiguration(algorithm,c);return c;
}
function showConfiguration(c:Configuration){configuration=structuredClone(c);$<HTMLInputElement>('array-input').value=JSON.stringify(c.input);$<HTMLInputElement>('target-input').value=String(c.target??7);$<HTMLInputElement>('low-input').value=String(c.low??0);$<HTMLInputElement>('high-input').value=String(c.high??Math.max(0,c.input.length-1));}
function loadReference(){try{const c=readConfiguration();code.value=makeSource(algorithm,c,reference);configuration=c;clearConversation();void executeStudent();}catch(e){status(String(e),true);}}
function loadPractice(){const p=practice.find(x=>x.algorithm===algorithm.id)!;showConfiguration(p.configuration);code.value=makeSource(algorithm,p.configuration,p.program);$<HTMLSelectElement>('config-select').value='practice';clearConversation();void executeStudent();}
async function choose(a:Algorithm){
 const selected=++selectionSerial;stopRequest();programWorker?.terminate();const loaded=await (await fetch('/'+a.reference_path)).text();if(selected!==selectionSerial)return;algorithm=a;reference=loaded;
 $('title').textContent=a.title;$('kind').textContent=a.kind==='sort'?'SORTING':a.kind==='search'?'SEARCH':a.kind==='unique'?'DUPLICATE DETECTION':'PARTITIONING';$('precondition').textContent=a.precondition;
 document.querySelectorAll('.algorithm').forEach(x=>x.classList.toggle('active',x.getAttribute('data-id')===a.id));
 const checked=report.algorithms.find((x:any)=>x.id===a.id);$('reference-status').textContent=`${checked.passed}/${checked.total} reference checks`;
 $('target-wrap').hidden=a.kind!=='search';$('low-wrap').hidden=$('high-wrap').hidden=!['lomuto','hoare'].includes(a.kind);
 const select=$<HTMLSelectElement>('config-select');select.replaceChildren();
 for(const [value,label] of [['practice','Practice task'],...a.cases.map(c=>[c.id!,c.id!])]){const option=document.createElement('option');option.value=value;option.textContent=label;select.append(option);}
 $('note-list').replaceChildren();a.notes.forEach((text,i)=>addNote($('note-list'),`${a.id}.note.${i+1}`,text));$('reference-code').textContent=reference;loadPractice();
}
function addNote(parent:HTMLElement,id:string,text:string){const p=document.createElement('div');p.className='note';const strong=document.createElement('strong');strong.textContent=id;const body=document.createElement('span');body.textContent=text;p.append(strong,body);parent.append(p);}
function outcome(execution:Execution):string {
 const out=execution.result,c=configuration;
 const initial=execution.steps.flatMap(s=>s.actions).find(a=>a.cmd==='var_add'&&a.params.name==='a')?.params.value;
 if(JSON.stringify(initial)!==JSON.stringify(c.input))return 'Editor input differs from the selected configuration; the reference oracle was not applied.';
 if(algorithm.kind==='sort'){const expected=[...c.input].sort((a,b)=>a-b);return JSON.stringify(out)===JSON.stringify(expected)?'Matches the sorting oracle for this input.':'Does not match ascending sorted input. This practice task needs a change.';}
 if(algorithm.kind==='unique'){const expected=Number(new Set(c.input).size===c.input.length);return out===expected?'Matches the uniqueness oracle for this input.':'Does not match the duplicate check for this input.';}
 if(algorithm.kind==='search'){const idx=c.input.indexOf(c.target!);const valid=algorithm.id==='linear_search'?out===idx:idx===-1?out===-1:Number.isInteger(out)&&c.input[out as number]===c.target;return valid?'Matches the search oracle for this input.':'Does not match the search result for this input.';}
 const values=execution.globals.a as number[],lo=c.low!,hi=c.high!,p=out as number,pivot=c.input[algorithm.kind==='lomuto'?hi:lo];
 const permutation=Array.isArray(values)&&JSON.stringify([...values].sort((a,b)=>a-b))===JSON.stringify([...c.input].sort((a,b)=>a-b));
 const valid=permutation&&Number.isInteger(p)&&p>=lo&&p<=hi&&(algorithm.kind==='lomuto'?values[p]===pivot&&values.slice(lo,p).every(v=>v<pivot)&&values.slice(p+1,hi+1).every(v=>v>=pivot):(lo===hi?p===lo:p<hi)&&values.slice(lo,p+1).every(v=>v<=pivot)&&values.slice(p+1,hi+1).every(v=>v>=pivot));
 return valid?'Partition invariant holds for this input; the two sides need not be sorted.':'The returned split or partition invariant is incorrect for this input.';
}
async function executeStudent(){
 const serial=++runSerial;stopRequest();programWorker?.terminate();const source=code.value;const button=$<HTMLButtonElement>('run');button.disabled=true;status('Running AVP in a bounded worker…');
 try{
  const result=await new Promise<Execution>((resolve,reject)=>{
   const worker=new Worker(new URL('./worker.ts',import.meta.url),{type:'module'});programWorker=worker;
   const timeout=setTimeout(()=>{worker.terminate();reject(new Error('Execution time limit exceeded.'));},5000);
   worker.onmessage=e=>{clearTimeout(timeout);worker.terminate();e.data.ok?resolve(e.data.execution):reject(new Error(e.data.error));};
   worker.onerror=()=>{clearTimeout(timeout);worker.terminate();reject(new Error('The AVP worker failed.'));};worker.postMessage(source);
  });
  if(serial!==runSerial)return;
  if(code.value!==source){status('Code changed during execution. Run the current version again.',true);return;}
  run=result;executedSource=source;executionError='';view=Math.min(8,run.steps.length);status(`Returned ${nice(run.result)}. ${outcome(run)}`);
 }catch(error){if(serial!==runSerial)return;run=null;executedSource=source;executionError=error instanceof Error?error.message:String(error);view=0;status(executionError,true);}
 finally{if(serial===runSerial){button.disabled=false;renderStep();}}
}
function renderStep(){
 const steps=run?.steps??[];view=Math.max(0,Math.min(view,steps.length));const range=$<HTMLInputElement>('step');range.max=String(steps.length);range.value=String(view);$('step-label').textContent=`Step ${view} / ${steps.length}`;
 const state=stateAt(steps,view),last=steps[view-1];$('variables').textContent=nice(state.variables);$('code-state').textContent=code.value===executedSource?(executionError?'Last run failed':'Editor matches run'):'Edited since last run';
 const canvas=$<HTMLCanvasElement>('snapshot'),ctx=canvas.getContext('2d')!;ctx.fillStyle='#fafcf8';ctx.fillRect(0,0,720,260);ctx.fillStyle='#294c35';ctx.font='bold 20px sans-serif';ctx.fillText(algorithm?.title??'AVP',22,35);ctx.font='15px sans-serif';ctx.fillStyle='#6b7f69';ctx.fillText(last?`Viewed step ${view} · source line ${Array.isArray(last.line)?last.line.join('–'):last.line}`:'Run the code, then step through it.',22,65);
 const values=state.array.length?state.array:configuration?.input??[];const width=Math.min(65,650/Math.max(1,values.length));
 values.forEach((value,index)=>{const x=22+index*width;ctx.fillStyle='#e1eddd';ctx.fillRect(x,95,width-5,52);ctx.fillStyle='#294c35';ctx.font='bold 19px monospace';ctx.fillText(String(value).slice(0,6),x+9,128);ctx.fillStyle='#7a8976';ctx.font='12px monospace';ctx.fillText(String(index),x+width/2-5,168);});
 if(!values.length){ctx.font='18px sans-serif';ctx.fillText('Empty array',22,125);}
 ctx.font='13px monospace';ctx.fillStyle='#486747';const small=Object.entries(state.variables).filter(([,v])=>!Array.isArray(v)).map(([k,v])=>`${k}=${JSON.stringify(v)}`).join('  ');ctx.fillText(small.slice(0,83),22,218);
 if(code.value!==executedSource){ctx.fillStyle='#99512b';ctx.fillText('Trace belongs to the earlier executed code.',22,245);}
}
async function ask(event:SubmitEvent){
 event.preventDefault();const text=question.value.trim();if(!text||controller)return;if(!executedSource){setError('Run the example before asking about its execution.');return;}
 const serial=++requestSerial;controller=new AbortController();const active=controller;const timer=setTimeout(()=>active.abort(),135000);const capturedCode=code.value,capturedView=view;
 const steps=run?.steps??[],state=stateAt(steps,view),last=steps[view-1];
 const payload={schema_version:'1',request_id:crypto.randomUUID(),question:text,mode:$<HTMLSelectElement>('mode').value,history:history.slice(-10),context:{algorithm:algorithm.id,student_code:capturedCode,executed_code:executedSource,viewed_state:{step:view,total_steps:steps.length,highlighted_lines:last?.line??null,variables:state.variables,last_step:{...(last??{}),execution_status:executionError?'failed':'completed',error:executionError||null},code_matches_execution:capturedCode===executedSource},screenshots:[{label:'Viewed array and variables',data_url:$<HTMLCanvasElement>('snapshot').toDataURL('image/png')}]}};
 setError('');setPending(true);appendTurn('user',text);
 try{
  const response=await fetch('/api/tutor',{method:'POST',headers,body:JSON.stringify(payload),signal:active.signal});const body=await response.json();
  if(serial!==requestSerial)return;
  if(Object.keys(body).sort().join(',')!=='answer,error,request_id,schema_version'||body.schema_version!=='1'||body.request_id!==payload.request_id)throw new Error('The backend returned an incompatible API response.');
  if(!response.ok||body.error)throw new Error(body.error?.message??'The tutor request failed.');
  if(typeof body.answer!=='string'||!body.answer.trim())throw new Error('The tutor returned no answer.');
  let answer=body.answer;if(code.value!==capturedCode||view!==capturedView)answer='Reply to the earlier captured view:\n\n'+answer;
  appendTurn('assistant',answer);history.push({role:'user',content:text},{role:'assistant',content:body.answer});history=history.slice(-10);question.value='';
  const supplied=body.answer.match(/References supplied: ([^\n]+)/)?.[1].split(',').map((s:string)=>s.trim())??[];
  $('retrieved-notes').replaceChildren();for(const id of supplied){const note=teachingNotes.find(x=>x.id===id);if(note)addNote($('retrieved-notes'),id,note.text);}
  if(!supplied.length)$('retrieved-notes').textContent='No matching checked references were supplied.';
 }catch(error){if(serial===requestSerial)setError(active.signal.aborted?'Request stopped. Your question is preserved; retry when ready.':error instanceof Error?error.message:String(error));}
 finally{clearTimeout(timer);if(serial===requestSerial){controller=null;setPending(false);question.focus();}}
}
$('run').addEventListener('click',()=>void executeStudent());$('load-reference').addEventListener('click',loadReference);$('load-practice').addEventListener('click',loadPractice);$('clear').addEventListener('click',clearConversation);$('ask-form').addEventListener('submit',e=>void ask(e as SubmitEvent));$('cancel').addEventListener('click',()=>{stopRequest();setError('Request stopped. Your question is preserved.');});
$('previous').addEventListener('click',()=>{view--;renderStep();});$('next').addEventListener('click',()=>{view++;renderStep();});$('step').addEventListener('input',()=>{view=Number($<HTMLInputElement>('step').value);renderStep();});code.addEventListener('input',()=>renderStep());
$('config-select').addEventListener('change',()=>{const id=$<HTMLSelectElement>('config-select').value;if(id==='practice'){loadPractice();return;}showConfiguration(algorithm.cases.find(c=>c.id===id)!);loadReference();});
async function init(){
 [library,practice,report,teachingNotes]=await Promise.all(['/library.json','/practice.json','/validation.json','/teaching-notes.json'].map(async p=>{const r=await fetch(p);if(!r.ok)throw new Error('Missing demo data: '+p);return r.json();}));
 $('algorithm-count').textContent=String(library.length);$('config-count').textContent=String(library.reduce((n,a)=>n+a.cases.length,0));$('check-count').textContent=`${report.passed}/${report.total}`;
 for(const a of library){const b=document.createElement('button');b.className='algorithm';b.setAttribute('data-id',a.id);const dot=document.createElement('span');dot.className='dot';b.append(dot,document.createTextNode(a.title));b.addEventListener('click',()=>void choose(a));$('algorithms').append(b);}
 try{const health=await (await fetch('/health')).json();$('provider').textContent=health.mode==='live'?'Live model · free-only backend':'Scripted preview · no model calls';}catch{$('provider').textContent='Backend unavailable';}
 await choose(library.find(a=>a.id==='linear_search')!);
}
init().catch(error=>status(error.message,true));

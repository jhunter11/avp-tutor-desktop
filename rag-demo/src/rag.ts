import './rag.css';
import {compareVectors} from './vector-math';
const el=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
const question=el<HTMLTextAreaElement>('rag-question'),button=el<HTMLButtonElement>('rag-ask');
type Scenario={title:string;question:string;expected_sources:string[]};
let scenarios:Scenario[]=[],controller:AbortController|null=null,serial=0;
let inspected:any=null;
function showInspector(value:string){
 const select=el<HTMLSelectElement>('inspector-view');select.value=value;
 document.querySelectorAll<HTMLElement>('[data-view]').forEach(section=>section.hidden=section.dataset.view!==value);
 el('inspector-title').textContent=select.selectedOptions[0].textContent;
 if(value!=='walkthrough')el<HTMLVideoElement>('rag-walkthrough-video').pause();
 document.querySelector<HTMLElement>('.inspector-body')!.scrollTop=0;
}
function heatmap(id:string,values:number[]){
 el(id).replaceChildren();values.forEach((value,i)=>{const cell=document.createElement('span');cell.style.background=value>=0?`rgba(35,99,76,${Math.min(1,.12+Math.abs(value)*5)})`:`rgba(183,99,49,${Math.min(1,.12+Math.abs(value)*5)})`;cell.title=`Dimension ${i+1}: ${value.toFixed(6)}`;el(id).append(cell);});
}
function compareSource(){
 if(!inspected)return;const selected=el<HTMLSelectElement>('compare-source').value;
 const source=inspected.retrieval.vector_comparisons?.find((m:any)=>m.id===selected);
 if(!source){heatmap('source-vector',[]);el('source-vector-label').textContent='No retrieved source';el('cosine-score').textContent='—';el('cosine-equation').textContent='No source vector to compare.';el('full-vector').textContent=JSON.stringify({question_vector:inspected.retrieval.query_vector,source_vector:null},null,2);el('contribution-chart').replaceChildren();el('comparison-check').textContent='No retrieved source is available to compare.';return;}
 try{
 const result=compareVectors(inspected.retrieval.query_vector,source.vector);
 const ranked=inspected.matches.find((m:any)=>m.id===selected);
 heatmap('source-vector',source.vector);el('source-vector-label').textContent=selected;el('cosine-score').textContent=result.score.toFixed(6);
 el('cosine-equation').textContent=`sum of 384 products = ${result.score.toFixed(6)}`;
 const chart=el('contribution-chart');chart.replaceChildren();const max=Math.max(...result.groups.map(g=>Math.abs(g.value)),.000001);
 result.groups.forEach(group=>{const column=document.createElement('span');column.className='contribution-column';const bar=document.createElement('i');bar.className=group.value>=0?'positive':'negative';bar.style.height=`${Math.abs(group.value)/max*48}%`;column.title=`Dimensions ${group.start+1}–${group.end}: ${group.value.toFixed(8)}`;column.append(bar);chart.append(column);});
 el('comparison-check').textContent=`Source length ${result.sourceNorm.toFixed(6)} · ${Math.abs(result.score-ranked.score)<=.000001?'Matches the backend score within rounding.':'The displayed and backend scores differ; inspect this result.'}`;
 el('full-vector').textContent=JSON.stringify({question_vector:inspected.retrieval.query_vector,source_id:selected,source_vector:source.vector,component_products:result.products,cosine:result.score},null,2);
 }catch(error){el('comparison-check').textContent=error instanceof Error?error.message:String(error);}
}
function sourceText(container:HTMLElement,text:string){
 container.replaceChildren();const pattern=/```[\w-]*\r?\n([\s\S]*?)```/g;let end=0;
 for(const match of text.matchAll(pattern)){container.append(document.createTextNode(text.slice(end,match.index)));const pre=document.createElement('pre'),code=document.createElement('code');code.textContent=match[1];pre.append(code);container.append(pre);end=match.index!+match[0].length;}
 container.append(document.createTextNode(text.slice(end)));
}
function pending(value:boolean){button.disabled=value;question.disabled=value;el<HTMLButtonElement>('clear-chat').disabled=value;el('rag-pending').hidden=!value;el('rag-cancel').hidden=!value;document.querySelectorAll<HTMLButtonElement>('.examples button').forEach(b=>b.disabled=value);}
function metadata(data:any){el('indexed').textContent=data.indexed_chunks;el('eligible').textContent=data.answer_passages;el('algorithm-count').textContent=data.algorithms;el('rag-metadata').textContent=JSON.stringify(data,null,2);}
async function json(response:Response){const data=await response.json();if(!response.ok)throw new Error(data.error??'The local retrieval request failed.');return data;}
function inspect(data:any){
 inspected=data;
 metadata(data.retrieval);el('inspection-question').textContent=data.question;el('answer-time').textContent=`${data.retrieval.elapsed_ms} ms · source extraction`;el('match-count').textContent=`${data.matches.length} passages · cutoff ${data.retrieval.threshold}`;
 const scenario=scenarios.find(s=>s.question===data.question);el('demo-result').textContent=scenario?(scenario.expected_sources.length?(scenario.expected_sources.every(id=>data.matches.some((m:any)=>m.id===id))?'Prepared source found: '+scenario.expected_sources.join(', '):'Expected passage was not retrieved; inspect the matches.'):(data.citations.length?'This outside-corpus question quoted an answer; review it.':'Outside-corpus demo: no answer quoted.')):'';
 el('matches').replaceChildren();
 if(!data.matches.length){const p=document.createElement('p');p.className='empty';p.textContent='No eligible passage cleared the retrieval cutoff. These cutoffs need evaluation on course questions.';el('matches').append(p);}
 data.matches.forEach((match:any,i:number)=>{
  const article=document.createElement('article');article.className='match';const top=document.createElement('div');top.className='match-top';const title=document.createElement('strong');title.textContent=`${i+1}. ${match.title}`;const score=document.createElement('span');score.className='score';score.textContent=`cosine ${match.score.toFixed(3)}`;top.append(title,score);
  const bar=document.createElement('div');bar.className='similarity-track';const fill=document.createElement('span');fill.style.width=`${Math.max(0,Math.min(1,match.score))*100}%`;bar.append(fill);
  const id=document.createElement('p');id.className='source-id';id.textContent=`${match.id} · ${match.kind.replaceAll('_',' ')}`;const used=document.createElement('span');used.className=data.citations.includes(match.id)?'quote-state quoted':'quote-state related';used.textContent=data.citations.includes(match.id)?'Quoted in reply':'Retrieved only';top.append(used);const text=document.createElement('blockquote');sourceText(text,match.text);
  const source=document.createElement('details'),summary=document.createElement('summary');summary.textContent='Source and review record';const record=document.createElement('pre');record.textContent=JSON.stringify({source_path:match.source_path,source_revision:match.source_revision,locator:match.locator,source_sha256:match.source_sha256,encoded_tokens:match.encoded_tokens,chunking:match.chunking,source_range:match.source_range,license:match.license,program_sha256:match.program_sha256,execution_status:match.validation_status,prose_review:match.human_review},null,2);source.append(summary,record);article.append(top,bar,id,text,source);el('matches').append(article);
 });
 const vector:number[]=data.retrieval.query_vector;heatmap('vector-grid',vector);
 el('vector-info').textContent=`${vector.length} dimensions · length ${data.retrieval.query_norm.toFixed(6)}`;
 const select=el<HTMLSelectElement>('compare-source');select.replaceChildren();for(const match of data.retrieval.vector_comparisons??[]){const option=document.createElement('option');option.value=match.id;option.textContent=match.id;select.append(option);}select.disabled=!select.options.length;compareSource();
}
function turn(role:'user'|'assistant',text:string,data?:any){
 const log=el('chat-log');log.querySelector('.welcome')?.remove();const article=document.createElement('article');article.className=`turn ${role}`;const label=document.createElement('span');label.className='turn-label';label.textContent=role==='user'?'You':'Corpus · offline extract';const body=document.createElement('div');sourceText(body,text);article.append(label,body);
 if(data){
  const quoted=data.citations.map((id:string)=>data.matches.find((m:any)=>m.id===id)).filter(Boolean);
  if(quoted.length>1){sourceText(body,`[${quoted[0].id}]\n${quoted[0].text}`);const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent=`More retrieved passages (${quoted.length-1})`;const extra=document.createElement('div');sourceText(extra,quoted.slice(1).map((doc:any)=>`[${doc.id}]\n${doc.text}`).join('\n\n'));details.append(summary,extra);body.append(details);}
  const cited=document.createElement('p');cited.className='citation';cited.textContent=data.citations.length?'Sources: '+data.citations.join(' · '):'No source quoted.';const inspectButton=document.createElement('button');inspectButton.type='button';inspectButton.className='inspect-reply';inspectButton.textContent='Inspect this reply →';inspectButton.addEventListener('click',()=>inspect(data));article.append(cited,inspectButton);}
 log.append(article);log.scrollTop=log.scrollHeight;
}
async function ask(event?:Event){
 event?.preventDefault();const submitted=question.value.trim();if(!submitted||controller)return;if(el<HTMLSelectElement>('inspector-view').value==='walkthrough')showInspector('sources');const current=++serial;controller=new AbortController();const active=controller;pending(true);el('rag-error').textContent='';turn('user',submitted);
 const timeout=setTimeout(()=>active.abort(),60000);
 try{const data=await json(await fetch('/api/rag/query',{method:'POST',headers:{'Content-Type':'application/json','X-RAG-Client':'demo-v1'},body:JSON.stringify({question:submitted}),signal:active.signal}));if(current===serial){turn('assistant',data.answer,data);inspect(data);question.value='';}}
 catch(error){if(current===serial)el('rag-error').textContent=active.signal.aborted?'Request cancelled. You can retry.':error instanceof Error?error.message:String(error);}
 finally{clearTimeout(timeout);if(current===serial){controller=null;pending(false);}}
}
el('rag-form').addEventListener('submit',ask);el('rag-cancel').addEventListener('click',()=>controller?.abort());
el('clear-chat').addEventListener('click',()=>{serial++;controller?.abort();controller=null;inspected=null;el('chat-log').replaceChildren();el('matches').textContent='Send a question to inspect its sources.';el('match-count').textContent='Top 3 above the cutoff';el('inspection-question').textContent='Send a question to inspect its retrieval.';heatmap('vector-grid',[]);heatmap('source-vector',[]);el('contribution-chart').replaceChildren();el('source-vector-label').textContent='No source yet';el('cosine-score').textContent='—';el('cosine-equation').textContent='sum(question[i] × source[i])';el('comparison-check').textContent='Waiting for vectors.';el<HTMLSelectElement>('compare-source').replaceChildren();el<HTMLSelectElement>('compare-source').disabled=true;el('full-vector').textContent='Ask a question first.';el('vector-info').textContent='No query vector yet.';el('demo-result').textContent='';el('rag-error').textContent='';el('answer-time').textContent='Waiting for a question';pending(false);});
el('compare-source').addEventListener('change',compareSource);
el<HTMLSelectElement>('inspector-view').addEventListener('change',event=>showInspector((event.target as HTMLSelectElement).value));
el('open-walkthrough').addEventListener('click',()=>showInspector('walkthrough'));
el('return-to-demo').addEventListener('click',()=>{showInspector('sources');question.focus();});
fetch('/demo-scenarios.json').then(json).then((loaded:Scenario[])=>{scenarios=loaded;const examples=document.querySelector('.examples')!;examples.replaceChildren();for(const scenario of scenarios){const sample=document.createElement('button');sample.type='button';sample.textContent=scenario.title;sample.title=scenario.question;sample.addEventListener('click',()=>{question.value=scenario.question;void ask();});examples.append(sample);}}).catch(error=>{el('rag-error').textContent=error.message;});
fetch('/api/rag/status').then(json).then(metadata).catch(error=>{el('rag-error').textContent=error.message;});

import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execute} from '../.generated/engine.mjs';
const path='sources/avp-syntax.json',raw=await readFile(path,'utf8');
const hash=text=>createHash('sha256').update(text).digest('hex');
const results=[];
for(const passage of JSON.parse(raw).passages){
 const snippets=[...passage.text.matchAll(/```avp\n([\s\S]*?)```/g)];
 assert.equal(snippets.length,1,`Expected one checked snippet in ${passage.id}`);
 const execution=execute(snippets[0][1]);
 assert.deepEqual(execution.result,passage.expected_result,passage.id);
 for(const [name,value] of Object.entries(passage.expected_globals??{}))assert.deepEqual(execution.globals[name],value,passage.id);
 results.push({id:'avp-syntax.'+passage.id,passed:true,expected_result:passage.expected_result,actual_result:execution.result,code_sha256:hash(snippets[0][1])});
}
for(const source of ['for (i = 0; i < 3; i += 1):\n x = i\n','fun Twice(x):\n return x * 2\n','a = [1, 2]\n','if (x = 5):\n result = 1\nend if\n'])assert.throws(()=>execute(source),/syntax/);
const report={recorded_at:new Date().toISOString(),source_path:path,source_sha256:hash(raw),grammar_sha256:hash(await readFile('vendor/avp/Pseudocode.g4','utf8')),scope:'Four small syntax snippets executed against the pinned AVP interpreter; not prose review or a full language conformance test.',passed:results.length,total:results.length,invalid_snippets_rejected:4,results};
await writeFile('reports/syntax-validation.json',JSON.stringify(report,null,2)+'\n');
console.log(`Checked ${results.length}/${results.length} AVP syntax snippets; rejected four invalid forms.`);

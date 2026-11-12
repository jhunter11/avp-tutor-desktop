import {test} from 'node:test';
import assert from 'node:assert/strict';
import {compareVectors} from '../src/vector-math.ts';

test('all 384 dimensions contribute, including a negative contribution and the final component',()=>{
 const query=Array(384).fill(0),source=Array(384).fill(0);
 query[0]=.6;query[383]=.8;source[0]=-.8;source[383]=.6;
 const result=compareVectors(query,source);
 assert.equal(result.groups.length,24);
 assert.ok(Math.abs(result.score)<1e-12);
 assert.equal(result.groups[0].value,-.48);
 assert.equal(result.groups[23].value,.48);
 assert.equal(result.groups.reduce((sum,g)=>sum+g.value,0),result.score);
});
test('identical unit vectors have cosine one; scaling is rejected rather than mislabelled cosine',()=>{
 assert.equal(compareVectors([.6,.8],[.6,.8]).score,1);
 for(const source of [[1],[NaN,1],[0,0],[6,8]])assert.throws(()=>compareVectors([.6,.8],source));
});

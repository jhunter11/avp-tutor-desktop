export function compareVectors(query:number[],source:number[],groupSize=16){
 if(!query.length||query.length!==source.length||!Number.isInteger(groupSize)||groupSize<1||[...query,...source].some(x=>!Number.isFinite(x)))throw new Error('Cannot compare incomplete or invalid vectors.');
 const queryNorm=Math.hypot(...query),sourceNorm=Math.hypot(...source);
 if(Math.abs(queryNorm-1)>.001||Math.abs(sourceNorm-1)>.001)throw new Error('The comparison requires unit vectors.');
 const products=query.map((x,i)=>x*source[i]),groups=[] as {start:number;end:number;value:number}[];
 for(let start=0;start<products.length;start+=groupSize)groups.push({start,end:Math.min(start+groupSize,products.length),value:products.slice(start,start+groupSize).reduce((a,b)=>a+b,0)});
 return {score:products.reduce((a,b)=>a+b,0),queryNorm,sourceNorm,products,groups};
}

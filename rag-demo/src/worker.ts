import {execute} from './engine';
self.onmessage=(event:MessageEvent<string>)=>{try{self.postMessage({ok:true,execution:execute(event.data)});}catch(error){self.postMessage({ok:false,error:error instanceof Error?error.message:'Execution failed.'});}};

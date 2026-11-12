import { build } from 'vite';
import { resolve } from 'node:path';
await build({configFile:false,logLevel:'warn',publicDir:false,build:{outDir:'.generated',emptyOutDir:true,minify:false,target:'es2022',lib:{entry:resolve('src/engine.ts'),formats:['es'],fileName:()=> 'engine.mjs'}}});

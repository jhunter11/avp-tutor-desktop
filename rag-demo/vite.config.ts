import {defineConfig} from 'vite';
export default defineConfig({server:{host:'127.0.0.1',port:5192,strictPort:true,proxy:{'/api':{target:'http://127.0.0.1:8783'},'/health':{target:'http://127.0.0.1:8783'}}},build:{target:'es2022'}});

const express = require('express');
const path = require('node:path');
const {createStore} = require('./demo');
function createApp(store) {
 const app=express();app.disable('x-powered-by');
 app.use((req,res,next)=>{
  const host=req.headers.host||'';
  if(!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host))return res.status(403).json({error:'Demonstração disponível apenas em localhost.'});
  if(req.method!=='GET' && req.headers.origin && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(req.headers.origin))return res.status(403).json({error:'Origem não permitida.'});
  res.set('X-Content-Type-Options','nosniff');res.set('Referrer-Policy','strict-origin-when-cross-origin');next();
 });
 app.use(express.json({limit:'8kb'}));
 app.get('/api/demo',(_req,res)=>{res.set('Cache-Control','no-store');res.json(store.read());});
 const run=fn=>(req,res)=>{try{res.json(fn(req));}catch(e){res.status(400).json({error:e.message});}};
 app.post('/api/demo/simulate',run(()=>store.simulate()));
 app.post('/api/demo/events/:id/resolve',run(req=>store.resolve(req.params.id)));
 app.post('/api/demo/sources/:id/toggle',run(req=>store.toggle(req.params.id)));
 app.get('/health',(_req,res)=>res.json({ok:true,mode:'demo'}));
 app.use('/api',(_req,res)=>res.status(404).json({error:'Endpoint indisponível nesta demonstração.'}));
 app.use(express.static(path.join(__dirname,'../dist')));
 app.use((err,req,res,next)=>res.status(400).json({error:'Requisição inválida.'}));
 return app;
}
if(require.main===module){const port=Number(process.env.PORT||3000);createApp(createStore(path.join(__dirname,'../data/demo.json'))).listen(port,'127.0.0.1',()=>console.log(`Olho de Deus: http://localhost:${port} — demonstração local, sem chaves de API.`));}
module.exports={createApp};

const express=require('express');const path=require('node:path');const {createLiveService}=require('./live');
function createApp(service=createLiveService()){
 const app=express();app.disable('x-powered-by');
 app.use((req,res,next)=>{if(!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(req.headers.host||''))return res.status(403).json({error:'Acesso somente pelo computador local.'});res.set('X-Content-Type-Options','nosniff');res.set('Referrer-Policy','strict-origin-when-cross-origin');next();});
 app.get('/api/public',async(_req,res)=>{try{res.set('Cache-Control','no-store');res.json(await service.refresh());}catch{res.status(503).json({error:'Falha ao consultar fontes.'});}});
 app.get('/health',(_req,res)=>res.json({ok:true,mode:'public-sources',connection:service.snapshot().connection.status}));
 app.use('/api',(_req,res)=>res.status(404).json({error:'Endpoint indisponível.'}));
 app.use(express.static(path.join(__dirname,'../dist')));return app;
}
if(require.main===module){const port=Number(process.env.PORT||3000);createApp().listen(port,'127.0.0.1',()=>console.log(`Olho de Deus: http://localhost:${port} — fontes públicas reais. Sem chaves de API.`));}
module.exports={createApp};

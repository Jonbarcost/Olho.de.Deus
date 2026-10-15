const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const sites = [
  ['Entrada principal', 'Vila Mariana', -23.589, -46.634],
  ['Sensor de portão', 'Mooca', -23.560, -46.598],
  ['Depósito', 'Ipiranga', -23.593, -46.608],
  ['Recepção', 'Pinheiros', -23.567, -46.693]
];
function seed(now = Date.now()) {
  const sources = sites.map(([name,area,lat,lng],i)=>({id:`demo-${i+1}`,name,area,lat,lng,active:true,demo:true}));
  const titles = ['Movimento no acesso','Sensor indisponível','Acesso ao depósito','Fluxo na entrada'];
  return {sources, events: sources.map((s,i)=>({id:crypto.randomUUID(),sourceId:s.id,title:titles[i],createdAt:new Date(now-i*3600000).toISOString(),status:'pendente',demo:true})),activity:[]};
}
function createStore(file) {
  let state = file && fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : seed();
  function save(next) { if(file){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file+'.tmp',JSON.stringify(next,null,2));fs.renameSync(file+'.tmp',file);}state=next; }
  function mutate(action, fn) { const next=structuredClone(state); const result=fn(next); next.activity.unshift({at:new Date().toISOString(),action});next.activity=next.activity.slice(0,100);save(next);return result; }
  return {
    read:()=>structuredClone(state),
    simulate:()=>mutate('Evento fictício gerado',s=>{const sources=s.sources.filter(x=>x.active);if(!sources.length)throw new Error('Ative pelo menos uma fonte para simular.');const source=sources[Math.floor(Math.random()*sources.length)];const event={id:crypto.randomUUID(),sourceId:source.id,title:'Movimento simulado',createdAt:new Date().toISOString(),status:'pendente',demo:true};s.events.unshift(event);s.events=s.events.slice(0,500);return event;}),
    resolve:id=>mutate('Ocorrência marcada como revisada',s=>{const e=s.events.find(x=>x.id===id);if(!e)throw new Error('Evento não encontrado.');e.status='revisado';return e;}),
    toggle:id=>mutate('Estado da fonte de demonstração alterado',s=>{const source=s.sources.find(x=>x.id===id);if(!source)throw new Error('Fonte não encontrada.');source.active=!source.active;return source;}),
  };
}
module.exports={createStore,seed};

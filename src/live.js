const {XMLParser,XMLValidator}=require('fast-xml-parser');
const {createHash}=require('node:crypto');
const FEED='https://cor.rio/feed/';
const INTERVAL=5*60*1000;
const states=[['AC','Acre'],['AL','Alagoas'],['AP','Amapá'],['AM','Amazonas'],['BA','Bahia'],['CE','Ceará'],['DF','Distrito Federal'],['ES','Espírito Santo'],['GO','Goiás'],['MA','Maranhão'],['MT','Mato Grosso'],['MS','Mato Grosso do Sul'],['MG','Minas Gerais'],['PA','Pará'],['PB','Paraíba'],['PR','Paraná'],['PE','Pernambuco'],['PI','Piauí'],['RJ','Rio de Janeiro'],['RN','Rio Grande do Norte'],['RS','Rio Grande do Sul'],['RO','Rondônia'],['RR','Roraima'],['SC','Santa Catarina'],['SP','São Paulo'],['SE','Sergipe'],['TO','Tocantins']].map(([id,name])=>({id,name}));
const catalog=[
{id:'cor-boletins',name:'COR-Rio · Boletins oficiais',state:'RJ',city:'Rio de Janeiro',type:'feed',url:'https://cor.rio/',feedUrl:FEED,mode:'Integração RSS',description:'Títulos, datas e links publicados pelo Centro de Operações e Resiliência. Não representa um fluxo completo de incidentes.'},
{id:'cor-cameras',name:'COR.Rio · Câmeras no aplicativo',state:'RJ',city:'Rio de Janeiro',type:'camera-portal',url:'https://cor.rio/centro-de-operacoes-e-resiliencia-da-prefeitura-do-rio-disponibiliza-nova-versao-do-aplicativo-cor-rio/',mode:'Acesso no serviço oficial',description:'O COR anuncia câmeras no aplicativo. Nenhuma transmissão individual foi validada para reprodução neste painel.'},
{id:'cor-radar',name:'Alerta Rio · Previsão e radar',state:'RJ',city:'Rio de Janeiro',type:'portal',url:'https://cor.rio/previsao-do-tempo/',mode:'Acesso no serviço oficial',description:'Previsão e radar meteorológico no portal do COR. Dados ainda não importados.'},
{id:'data-rio',name:'DATA.RIO · Dados abertos',state:'RJ',city:'Rio de Janeiro',type:'portal',url:'https://www.data.rio/',mode:'Acesso no serviço oficial',description:'Catálogo de dados da Prefeitura do Rio. Nenhuma base importada nesta versão.'}
];
function parseFeed(xml){
 if(typeof xml!=='string'||Buffer.byteLength(xml)>2_000_000||/<!DOCTYPE|<!ENTITY/i.test(xml)||XMLValidator.validate(xml)!==true)throw Error('Feed inválido.');
 const doc=new XMLParser({ignoreAttributes:true,parseTagValue:false,trimValues:true}).parse(xml);
 if(!doc.rss?.channel)throw Error('Resposta não é um feed RSS.');
 const raw=doc.rss.channel.item||[];const items=Array.isArray(raw)?raw:[raw];const seen=new Set();
 return items.slice(0,100).flatMap(item=>{if(typeof item.title!=='string'||typeof item.link!=='string')return[];let link;try{link=new URL(item.link);}catch{return[];}if(link.protocol!=='https:'||link.hostname!=='cor.rio'||link.username||link.password)return[];const date=new Date(item.pubDate);if(!Number.isFinite(date.getTime()))return[];const id=createHash('sha256').update(link.href).digest('hex');if(seen.has(id))return[];seen.add(id);return[{id,title:item.title.replace(/&#(x[0-9a-f]+|[0-9]+);/gi, (raw,n)=>{const code=n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n);return code>0&&code<=0x10ffff?String.fromCodePoint(code):raw;}).replace(/<[^>]*>/g,'').slice(0,500),url:link.href,publishedAt:date.toISOString(),sourceId:'cor-boletins',state:'RJ',city:'Rio de Janeiro',kind:'Publicação oficial',location:null}];}).sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
}
async function download(fetcher){const r=await fetcher(FEED,{redirect:'error',signal:AbortSignal.timeout(15000),headers:{Accept:'application/rss+xml, application/xml, text/xml','User-Agent':'OlhoDeDeus/0.3 public-feed-reader'}});if(!r.ok)throw Error(`HTTP ${r.status}`);if(Number(r.headers.get('content-length'))>2_000_000)throw Error('Feed excede o limite.');let size=0;const chunks=[];for await(const part of r.body){size+=part.length;if(size>2_000_000)throw Error('Feed excede o limite.');chunks.push(Buffer.from(part));}return Buffer.concat(chunks).toString('utf8');}
function createLiveService({fetcher=fetch,clock=()=>Date.now()}={}){
 let items=[],attempt=null,success=null,error=null,pending=null;
 function snapshot(){return {states,sources:catalog,items,connection:{status:error?(success!==null?'desatualizado':'indisponivel'):success!==null?'conectado':'nao_verificado',lastAttemptAt:attempt===null?null:new Date(attempt).toISOString(),lastSuccessAt:success===null?null:new Date(success).toISOString(),nextCheckAt:attempt===null?null:new Date(attempt+INTERVAL).toISOString(),error,intervalSeconds:INTERVAL/1000},cameras:[],cameraStatus:'Nenhuma transmissão individual validada para reprodução no painel.'};}
 async function refresh(){if(pending)return pending;if(attempt!==null&&clock()-attempt<INTERVAL)return snapshot();attempt=clock();pending=(async()=>{try{items=parseFeed(await download(fetcher));success=clock();error=null;}catch(e){error='Não foi possível atualizar o feed oficial. O serviço pode estar indisponível ou a rede pode impedir o acesso.';}finally{pending=null;}return snapshot();})();return pending;}
 return{snapshot,refresh};
}
module.exports={createLiveService,parseFeed,states,catalog};

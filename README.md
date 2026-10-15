# Olho de Deus — fontes públicas reais

Painel local Brasil → UF, com início no Rio de Janeiro. Sem chaves de API.
Não carrega dados simulados, não gera eventos e não lê o antigo data/demo.json.

## Ativação no Windows

Com Node.js 22+ instalado, abra `INICIAR.bat`. Ele instala as dependências, compila
a interface e inicia em http://localhost:3000. Mantenha a janela aberta. Se o
navegador abrir antes do servidor, atualize a página.

Ou execute `npm ci`, `npm run build`, `npm start`. `npm test` roda testes isolados.

## Integração efetiva

O servidor consulta https://cor.rio/feed/ e exibe títulos, datas originais e links
das publicações oficiais. Não importa o texto integral. Atualizações no máximo
uma vez a cada cinco minutos; chamadas simultâneas compartilham a mesma consulta.
Timeout de 15 segundos; limite de 2 MB; origem fixa, sem URLs fornecidas por usuários.

O painel distingue conexão verificada, indisponibilidade e conteúdo anterior após
falha. Não preenche lacunas com exemplos. Datas exibidas no fuso de Brasília.
O feed é um boletim de publicações, **não uma API de ocorrências em tempo real**.
Não são atribuídas coordenadas ou locais precisos quando a fonte não os informa.
Cache em memória; não é arquivo histórico permanente. Reiniciar limpa o cache.

## Câmeras e cobertura

27 UFs cadastradas para navegação. Apenas RJ possui feed integrado nesta versão.
As outras UFs mostram levantamento pendente. COR.Rio câmeras, radar e DATA.RIO
estão catalogados como links oficiais: não são transmissões ou bases integradas.
**Nenhuma câmera individual foi validada para reprodução no painel.** Não há
quantidades presumidas ou marcadores inventados. Não há monitoramento privado,
reconhecimento facial ou agentes de IA nesta entrega.

Servidor local em 127.0.0.1, sem autenticação multiusuário; não publicar na internet.
Código legado de IA permanece desconectado da execução. Não é necessário criar .env.

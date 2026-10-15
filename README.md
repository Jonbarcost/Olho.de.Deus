# Olho de Deus — demonstração local

Painel funcional com mapa, fontes fictícias, geração de ocorrências, filtros,
histórico e revisão. **Não exige chaves de API nem assinatura adicional.**

## Windows: abrir com dois cliques

1. Instale Node.js 22 ou superior (Jon já concluiu esta etapa).
2. Abra `INICIAR.bat` na pasta do projeto. A primeira execução precisa de internet
   para instalar as dependências. Mantenha a janela aberta enquanto usa o painel.
3. Acesse http://localhost:3000. Se o navegador abrir antes do servidor, atualize a página.

Alternativamente: `npm ci`, `npm run build`, `npm start`.
Teste: `npm test`. Desenvolvimento: execute `npm start` e, em outra janela, `npm run dev`.

## O que funciona

- Mapa de São Paulo com marcadores e detalhes de ocorrências fictícias.
- Busca por título, fonte e bairro; filtros de fonte, estado e data no histórico.
- Simular um evento, revisar ocorrência e pausar/ativar fontes fictícias.
- Persistência local em `data/demo.json`; até 500 eventos e 100 registros de atividade.
- Layout responsivo, navegação por teclado e detalhes em diálogo.
- Mapa usa tiles externos do OpenStreetMap, com atribuição. Se não carregarem,
  a lista e os detalhes continuam disponíveis. Não há geocodificação ou busca global de ruas.

## Limites explícitos

Esta é uma **demonstração de produto**, não o piloto de produção completo descrito
nas propostas anteriores. Todos os dados são simulados; nenhuma câmera, pessoa
ou veículo real é monitorado. Não há autenticação multiusuário, autorização de
fontes reais, PostGIS, auditoria inviolável, retenção legal ou agentes de IA.
Os nomes de locais são ilustrativos, não indicam câmeras instaladas nesses locais.

Servidor restrito a `127.0.0.1`, para um usuário local. Não publique na internet.
O JSON local pode ser alterado por quem tem acesso à pasta e não é uma trilha de
segurança. Não insira dados reais. Tiles de mapas fazem requisições a terceiros.

O código legado `src/services/aiOrchestrator.js` está preservado como referência,
mas não é importado nem exposto pelo servidor. Integração de IA exige etapa própria,
revisão dos modelos e credenciais. Os aplicativos ChatGPT e Claude não estão conectados.

## Próximas etapas

Autenticação e concessões por fonte; banco geográfico e migrações; auditoria e
retenção; conectores autorizados; agentes com escopo e evidências verificáveis.

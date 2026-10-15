# Ativação com fontes reais

Substitui a demonstração anterior por solicitação de Jon. Simulação, fontes
fictícias e seus endpoints foram removidos. Registros antigos não são migrados.

Fonte efetivamente consultada: https://cor.rio/feed/ (RSS público oficial).
Verificação de desenvolvimento: retornou 10 publicações, incluindo previsão de
chuvas e interdições de 14/10/2026. Isso não garante disponibilidade futura.

Critérios de ativação:
- inicializa sem chaves e consulta a origem oficial;
- exibe origem, publicação, última tentativa e último sucesso;
- erro inicial mantém lista vazia; erro posterior identifica cache desatualizado;
- estados sem integração permanecem pendentes;
- câmera exige validação de transmissão individual antes de aparecer reproduzível;
- não extrapola boletim para ocorrência em andamento ou posição geográfica precisa.

Layout mantém o sistema visual existente, substitui mapa fictício por navegação de
27 UFs, lista de publicações e diagnóstico de fonte. Links externos explicitamente
identificados. Nenhuma imagem conceitual serve como evidência de conexão.

Pendências: integração validada de câmeras; novas fontes/UFs; testes visuais em
navegador (ambiente anterior bloqueou sockets do Chromium); teste do launcher em Windows.

Validação realizada: conector Node consultou a origem real e recebeu 10 itens,
com status conectado em 15/10/2026 02:57 UTC. Quatro testes automatizados passaram
e o build de produção compilou. Testes usam fixtures isoladas, nunca dados do painel.

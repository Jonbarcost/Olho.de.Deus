# Entrega demonstrável — 15/10/2026

Jon solicitou desenvolvimento por um único agente, sem configurar o duo ou APIs.
Esta entrega reduz o primeiro incremento a uma demonstração local e mantém explícita
sua diferença em relação à arquitetura de produção anteriormente revisada.

Interface: sidebar navy, área branca, destaque teal, faixa âmbar de demonstração,
três métricas calculadas, mapa e lista, histórico e fontes. O conceito visual usa
números ilustrativos; a implementação mostra somente contagens calculadas.
Não implementamos itens extras gerados no conceito (configurações/sair), pois não
há login ou configuração de produção. Histórico acrescenta filtro de data.

Dados: quatro fontes fictícias, quatro eventos iniciais; novos eventos apenas de
fontes ativas. Alterações salvas atomicamente por rename no mesmo diretório, em um
processo Node. Acesso estritamente local. Nenhum cliente recebe credenciais de IA.

Critérios: inicia sem .env; filtra mapa e lista; abre detalhes; revisa evento;
pausa fontes; preserva estado ao reiniciar; informa falha nos tiles; funciona em mobile.

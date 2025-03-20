# Checklist Funcional do Projeto AstraMentor

| Seção | Requisito | Status | Observações |
|-------|-----------|--------|-------------|
| Página Principal (Lista de posts) | Exibir lista de posts disponíveis | Implementado | Componente PostCard e página feed implementados |
| Página Principal (Lista de posts) | Mostrar título, autor e descrição | Implementado | Implementado no componente PostCard |
| Página Principal (Lista de posts) | Campo de busca para filtrar posts | Implementado | Funcionalidade de busca conectada à API |
| Página de Leitura de Post | Exibir conteúdo completo do post | Implementado | Página post/[id] já implementada |
| Página de Leitura de Post | Permitir comentários (opcional) | Implementado | Sistema de comentários funcional e conectado à API |
| Página de Criação de Postagens | Formulário para criação | Implementado | Página create-post já existe |
| Página de Criação de Postagens | Campos para título, conteúdo e autor | Implementado | Formulário já contém os campos necessários |
| Página de Criação de Postagens | Botão para enviar ao servidor | Implementado | Funcionalidade de envio conectada à API |
| Página de Edição de Postagens | Formulário para edição | Implementado | Implementado em edit-post/[id] |
| Página de Edição de Postagens | Carregar dados atuais do post | Implementado | Carrega dados do post da API |
| Página de Edição de Postagens | Botão para salvar alterações | Implementado | Funcionalidade de salvar conectada à API |
| Página Administrativa | Lista de todas as postagens | Implementado | Implementado na página admin |
| Página Administrativa | Opções para editar e excluir | Implementado | Botões de edição e exclusão funcionais |
| Página Administrativa | Botões de ação | Implementado | Implementados com confirmação de exclusão |
| Autenticação e Autorização | Implementar login para professores | Implementado | Sistema de login funcional |
| Autenticação e Autorização | Proteção de rotas administrativas | Implementado | Middleware implementado para proteção de rotas |
| Desenvolvimento em React | Utilizar React | Implementado | Projeto usa Next.js (React framework) |
| Desenvolvimento em React | Hooks e componentes funcionais | Implementado | Todos os componentes são funcionais e usam hooks |
| Estilização e Responsividade | Método de estilização | Implementado | Usando Tailwind CSS e shadcn/ui |
| Estilização e Responsividade | Aplicação responsiva | Implementado | Design responsivo para mobile e desktop |
| Integração com Back-End | Chamadas aos endpoints REST | Implementado | API simulada implementada em lib/api.ts |
| Integração com Back-End | Gerenciar estado da aplicação | Implementado | Context API implementado para autenticação |
| Documentação | README detalhado | Implementado | README completo com instruções |
| Documentação | Arquitetura documentada | Implementado | Documentação de arquitetura criada |
| Documentação | Guia de uso | Implementado | Guia do usuário detalhado criado |
| Entrega | Repositório GitHub | Implementado | Projeto disponível no GitHub |
| Entrega | Dockerfiles | Implementado | Dockerfile e docker-compose.yml criados |
| Entrega | Scripts de CI/CD | Implementado | Workflow de GitHub Actions configurado |


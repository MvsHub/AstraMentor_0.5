# AstraMentor

AstraMentor é uma plataforma educacional que permite a publicação e gestão de conteúdos, integrando professores e alunos em um ambiente colaborativo.

## Funcionalidades

- **Autenticação e Autorização**: Sistema completo de login e registro com diferentes níveis de acesso para professores e alunos.
- **Publicação de Conteúdo**: Professores podem criar, editar e excluir conteúdo educacional.
- **Feed de Conteúdos**: Feed personalizado com busca avançada para encontrar conteúdos relevantes.
- **Interação Social**: Alunos podem interagir com o conteúdo através de curtidas e comentários.
- **Área Administrativa**: Painel exclusivo para professores gerenciarem suas publicações.
- **Design Responsivo**: Interface adaptável para dispositivos móveis e desktop.
- **Tema Claro/Escuro**: Suporte a preferências de tema do usuário.

## Tecnologias Utilizadas

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **Autenticação**: JWT (simulado)
- **Containerização**: Docker
- **CI/CD**: GitHub Actions

## Arquitetura

O projeto segue uma arquitetura de componentes React com o framework Next.js, utilizando o App Router para gerenciamento de rotas. A aplicação é dividida em:

- **Páginas**: Componentes que representam as diferentes telas da aplicação.
- **Componentes**: Elementos reutilizáveis da interface.
- **Contextos**: Gerenciamento de estado global da aplicação.
- **Lib**: Utilitários e serviços compartilhados.

### Diagrama de Arquitetura

```mermaid
graph TD
    A[Cliente] --> B[Next.js App]
    B --> C[App Router]
    C --> D[Páginas]
    C --> E[API Routes]
    D --> F[Componentes UI]
    D --> G[Hooks]
    D --> H[Contextos]
    E --> I[Serviços]
    I --> J[API Externa]


# Planejamento Tecnico do Projeto

## Contexto

Este projeto atende ao desafio tecnico de criar uma aplicacao web para cadastro de livros, autores e assuntos, seguindo o modelo de dados fornecido no enunciado.

A aplicacao deve possuir CRUD completo para as tres entidades principais, permitir relacionamento de livros com multiplos autores e multiplos assuntos, incluir um campo de valor em reais para o livro e disponibilizar um relatorio baseado em uma view criada no banco de dados.

## Stack Definida

- Next.js com App Router
- TypeScript
- Supabase como banco de dados PostgreSQL
- Prisma ORM para modelagem, migrations e camada de persistencia
- Tailwind CSS para estilos
- shadcn/ui para componentes de interface
- React Hook Form para formularios
- Zod para validacao de dados
- Server Actions para operacoes do lado servidor
- Vitest para testes unitarios
- Playwright para testes end-to-end
- Vercel para deploy da aplicacao

## Objetivos Tecnicos

- Criar uma estrutura de projeto limpa, escalavel e facil de apresentar tecnicamente.
- Separar responsabilidades entre interface, validacao, regras de negocio e persistencia.
- Manter o modelo do banco fiel ao desafio, adicionando apenas o campo de valor no livro.
- Usar migrations versionadas para demonstrar controle da evolucao do banco.
- Criar uma view SQL no Supabase para alimentar o relatorio obrigatorio.
- Aplicar formatacao adequada para moeda, ano de publicacao e mensagens de validacao.
- Implementar tratamento de erros especifico, principalmente para validacao e banco de dados.
- Incluir testes como diferencial tecnico.

## Arquitetura de Pastas

```txt
src/
  app/
    page.tsx
    layout.tsx
    livros/
      page.tsx
      novo/
        page.tsx
      [id]/
        editar/
          page.tsx
    autores/
      page.tsx
      novo/
        page.tsx
      [id]/
        editar/
          page.tsx
    assuntos/
      page.tsx
      novo/
        page.tsx
      [id]/
        editar/
          page.tsx
    relatorios/
      livros-por-autor/
        page.tsx

  components/
    layout/
      app-header.tsx
      app-sidebar.tsx
    ui/

  features/
    livros/
      actions.ts
      schemas.ts
      service.ts
      repository.ts
      components/
        livro-form.tsx
        livro-table.tsx
    autores/
      actions.ts
      schemas.ts
      service.ts
      repository.ts
      components/
        autor-form.tsx
        autor-table.tsx
    assuntos/
      actions.ts
      schemas.ts
      service.ts
      repository.ts
      components/
        assunto-form.tsx
        assunto-table.tsx
    relatorios/
      repository.ts
      components/
        livros-por-autor-report.tsx

  lib/
    prisma.ts
    formatters.ts
    errors.ts
    routes.ts

tests/
  unit/
  e2e/

prisma/
  schema.prisma
  migrations/
  seed.ts
```

## Responsabilidades por Camada

### `app/`

Responsavel pelas rotas, paginas e composicao visual da aplicacao usando o App Router do Next.js.

### `features/`

Responsavel por organizar cada dominio da aplicacao. Cada feature tera seus proprios componentes, validacoes, actions, servicos e repositorios.

### `actions.ts`

Responsavel por receber dados dos formularios, validar entradas, chamar os servicos e retornar mensagens de sucesso ou erro para a interface.

### `schemas.ts`

Responsavel pelas validacoes com Zod. As regras de entrada ficam centralizadas e reutilizaveis.

### `service.ts`

Responsavel pelas regras de negocio, validacoes de fluxo e coordenacao entre dados.

### `repository.ts`

Responsavel pelo acesso ao banco usando Prisma. Nenhuma pagina deve consultar o banco diretamente.

### `lib/`

Responsavel por utilitarios compartilhados, como cliente Prisma, formatadores de moeda e tratamento de erros.

## Modelo de Dados

O modelo original sera preservado, com a inclusao do campo `Valor` na tabela `Livro`.

Entidades principais:

- `Livro`
- `Autor`
- `Assunto`

Tabelas associativas:

- `Livro_Autor`
- `Livro_Assunto`

Relacionamentos:

- Um livro pode ter varios autores.
- Um autor pode estar associado a varios livros.
- Um livro pode ter varios assuntos.
- Um assunto pode estar associado a varios livros.

## Modelo SQL Base

```sql
CREATE TABLE "Livro" (
  "Codl" SERIAL PRIMARY KEY,
  "Titulo" VARCHAR(40) NOT NULL,
  "Editora" VARCHAR(40) NOT NULL,
  "Edicao" INTEGER NOT NULL,
  "AnoPublicacao" VARCHAR(4) NOT NULL,
  "Valor" NUMERIC(10, 2) NOT NULL
);

CREATE TABLE "Autor" (
  "CodAu" SERIAL PRIMARY KEY,
  "Nome" VARCHAR(40) NOT NULL
);

CREATE TABLE "Assunto" (
  "codAs" SERIAL PRIMARY KEY,
  "Descricao" VARCHAR(20) NOT NULL
);

CREATE TABLE "Livro_Autor" (
  "Livro_Codl" INTEGER NOT NULL REFERENCES "Livro"("Codl") ON DELETE CASCADE,
  "Autor_CodAu" INTEGER NOT NULL REFERENCES "Autor"("CodAu") ON DELETE RESTRICT,
  PRIMARY KEY ("Livro_Codl", "Autor_CodAu")
);

CREATE TABLE "Livro_Assunto" (
  "Livro_Codl" INTEGER NOT NULL REFERENCES "Livro"("Codl") ON DELETE CASCADE,
  "Assunto_codAs" INTEGER NOT NULL REFERENCES "Assunto"("codAs") ON DELETE RESTRICT,
  PRIMARY KEY ("Livro_Codl", "Assunto_codAs")
);
```

## View do Relatorio

O relatorio obrigatorio sera baseado em uma view criada no Supabase. A view deve retornar os dados das tabelas principais agrupaveis por autor, considerando que um livro pode ter mais de um autor.

```sql
CREATE VIEW "vw_livros_por_autor" AS
SELECT
  a."CodAu" AS "autor_id",
  a."Nome" AS "autor_nome",
  l."Codl" AS "livro_id",
  l."Titulo" AS "livro_titulo",
  l."Editora" AS "livro_editora",
  l."Edicao" AS "livro_edicao",
  l."AnoPublicacao" AS "ano_publicacao",
  l."Valor" AS "valor",
  STRING_AGG(s."Descricao", ', ' ORDER BY s."Descricao") AS "assuntos"
FROM "Autor" a
JOIN "Livro_Autor" la ON la."Autor_CodAu" = a."CodAu"
JOIN "Livro" l ON l."Codl" = la."Livro_Codl"
LEFT JOIN "Livro_Assunto" ls ON ls."Livro_Codl" = l."Codl"
LEFT JOIN "Assunto" s ON s."codAs" = ls."Assunto_codAs"
GROUP BY
  a."CodAu",
  a."Nome",
  l."Codl",
  l."Titulo",
  l."Editora",
  l."Edicao",
  l."AnoPublicacao",
  l."Valor";
```

## Supabase

O Supabase sera usado como banco PostgreSQL gerenciado.

Configuracoes previstas:

- Criar um projeto no Supabase.
- Copiar a connection string PostgreSQL.
- Configurar `DATABASE_URL` no ambiente local.
- Configurar `DATABASE_URL` nas variaveis de ambiente da Vercel.
- Executar migrations do Prisma contra o banco do Supabase.
- Criar a view do relatorio via migration SQL.

Variaveis de ambiente esperadas:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

Observacao: com Prisma e Supabase, `DATABASE_URL` pode usar o pooler do Supabase e `DIRECT_URL` pode apontar para a conexao direta usada em migrations.

## Vercel

A Vercel sera usada para hospedagem da aplicacao Next.js.

Fluxo previsto:

- Subir o projeto em um repositorio Git.
- Importar o repositorio na Vercel.
- Configurar as variaveis `DATABASE_URL` e `DIRECT_URL`.
- Rodar o build padrao do Next.js.
- Garantir que migrations sejam aplicadas antes ou durante o processo de deploy.

Comando de build esperado:

```bash
npm run build
```

## Funcionalidades

### Home

- Tela inicial simples com links ou cards para:
  - Livros
  - Autores
  - Assuntos
  - Relatorio de livros por autor

### CRUD de Autores

- Listar autores.
- Criar autor.
- Editar autor.
- Excluir autor quando nao houver restricao de relacionamento.
- Validar nome obrigatorio e tamanho maximo.

### CRUD de Assuntos

- Listar assuntos.
- Criar assunto.
- Editar assunto.
- Excluir assunto quando nao houver restricao de relacionamento.
- Validar descricao obrigatoria e tamanho maximo.

### CRUD de Livros

- Listar livros com autores e assuntos relacionados.
- Criar livro.
- Editar livro.
- Excluir livro.
- Selecionar um ou mais autores.
- Selecionar um ou mais assuntos.
- Validar titulo, editora, edicao, ano de publicacao e valor.
- Exibir valor formatado em reais.

### Relatorio

- Consultar dados da view `vw_livros_por_autor`.
- Agrupar visualmente os livros por autor.
- Exibir titulo, editora, edicao, ano, valor e assuntos.
- Permitir leitura clara para apresentacao tecnica.

## Validacoes

Regras principais:

- `Titulo`: obrigatorio, maximo de 40 caracteres.
- `Editora`: obrigatorio, maximo de 40 caracteres.
- `Edicao`: numero inteiro positivo.
- `AnoPublicacao`: quatro digitos.
- `Valor`: numero positivo, formatado como moeda brasileira.
- `Autor.Nome`: obrigatorio, maximo de 40 caracteres.
- `Assunto.Descricao`: obrigatorio, maximo de 20 caracteres.
- Livro deve ter pelo menos um autor.
- Livro deve ter pelo menos um assunto.

## Tratamento de Erros

O projeto deve evitar `try/catch` generico sem tratamento util.

Erros previstos:

- Erro de validacao de formulario.
- Registro nao encontrado.
- Restricao de chave estrangeira ao excluir autor ou assunto em uso.
- Erro de conexao com banco.
- Erro inesperado com mensagem controlada para o usuario.

## Testes

Testes planejados:

- Testes unitarios dos schemas Zod.
- Testes unitarios de services.
- Teste de criacao de livro com autores e assuntos.
- Teste de validacao de livro sem autor.
- Teste de validacao de livro sem assunto.
- Teste end-to-end do fluxo principal de CRUD.

## Ordem de Desenvolvimento

1. Criar projeto Next.js com TypeScript.
2. Configurar Tailwind CSS.
3. Configurar shadcn/ui.
4. Configurar Prisma.
5. Configurar conexao com Supabase.
6. Criar schema Prisma.
7. Criar migration inicial.
8. Criar migration da view `vw_livros_por_autor`.
9. Criar seed de dados.
10. Implementar layout base.
11. Implementar CRUD de autores.
12. Implementar CRUD de assuntos.
13. Implementar CRUD de livros.
14. Implementar relatorio por autor.
15. Adicionar formatadores de moeda e ano.
16. Adicionar testes unitarios.
17. Adicionar teste end-to-end principal.
18. Criar README com instrucoes de instalacao, banco, migrations e deploy.
19. Configurar deploy na Vercel.
20. Preparar roteiro de apresentacao tecnica.

## Criterios de Pronto

- CRUD de Livro, Autor e Assunto funcionando.
- Livro permitindo multiplos autores e multiplos assuntos.
- Campo de valor em reais implementado e formatado.
- Relatorio consumindo dados de uma view no banco.
- Scripts de banco versionados.
- Aplicacao pronta para deploy na Vercel.
- Variaveis de ambiente documentadas.
- README com passo a passo de execucao.
- Testes minimos implementados.

## Roteiro para Apresentacao

1. Explicar o desafio e os requisitos.
2. Apresentar a stack escolhida.
3. Mostrar o modelo relacional no Supabase.
4. Explicar as tabelas associativas.
5. Demonstrar as migrations.
6. Demonstrar o CRUD de autores.
7. Demonstrar o CRUD de assuntos.
8. Demonstrar o CRUD de livros.
9. Mostrar a selecao multipla de autores e assuntos.
10. Mostrar o campo de valor formatado em reais.
11. Apresentar a view SQL.
12. Demonstrar o relatorio agrupado por autor.
13. Explicar tratamento de erros.
14. Mostrar testes.
15. Explicar deploy na Vercel.


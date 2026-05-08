# TheLibary

Aplicacao web para cadastro de livros, autores e assuntos com relatorio agrupado por autor a partir de uma view do banco. Construida com Next.js, Supabase, Prisma e TypeScript.

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Supabase PostgreSQL** (banco gerenciado)
- **Prisma 7** (ORM e migrations versionadas)
- **Tailwind CSS v4** + **shadcn/ui** (UI)
- **Zod** (validacao e tipos derivados)
- **Vitest** (testes unitarios)

## Pre-requisitos

- Node.js 20 ou superior
- Conta no Supabase (free tier suficiente)
- Git

## Configuracao local

### 1. Clone e instale dependencias

```bash
git clone https://github.com/MaikonSebastiani/TheLibary.git
cd TheLibary
npm install
```

### 2. Configure as variaveis de ambiente

Copie o template:

```bash
cp .env.example .env
```

Preencha conforme o seu projeto Supabase:

| Variavel       | Uso                                                            |
|----------------|----------------------------------------------------------------|
| `DATABASE_URL` | Conexao runtime via connection pooler (porta 6543)             |
| `DIRECT_URL`   | Conexao direta (porta 5432) usada pelo Prisma para migrations  |

> **Atencao:** se a senha do banco contiver caracteres especiais (`@`, `#`, `%`, `+`, etc.), faca URL-encode antes de colar na variavel.

### 3. Gere o Prisma Client

```bash
npm run prisma:generate
```

### 4. Aplique as migrations

```bash
npm run prisma:deploy
```

Isso cria todas as tabelas e a view `vw_livros_por_autor` usada pelo relatorio.

### 5. (Opcional) Popule com dados de exemplo

```bash
npm run db:seed
```

O seed cria 9 autores, 7 assuntos e 10 livros, **incluindo dois livros com co-autoria** (`Boas Presagios` e `O Conde de Monte Cristo`) para demonstrar a regra de "um livro pode ter mais de um autor" no relatorio.

### 6. Rode a aplicacao

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Comandos disponiveis

| Comando                   | Descricao                                                   |
|---------------------------|-------------------------------------------------------------|
| `npm run dev`             | Servidor Next em modo desenvolvimento                       |
| `npm run build`           | Compila o projeto para producao                             |
| `npm run start`           | Inicia o servidor de producao apos o `build`                |
| `npm run lint`            | Executa o ESLint                                            |
| `npm run test`            | Roda os testes unitarios em modo watch                      |
| `npm run test:run`        | Roda os testes unitarios uma unica vez (uso em CI)          |
| `npm run prisma:generate` | Gera o Prisma Client a partir do schema                     |
| `npm run prisma:migrate`  | Cria uma nova migration em desenvolvimento                  |
| `npm run prisma:deploy`   | Aplica migrations pendentes (uso em CI/producao)            |
| `npm run prisma:studio`   | Abre o painel visual do banco                               |
| `npm run db:seed`         | Popula o banco com dados de exemplo                         |

## Estrutura de pastas

```
prisma/
  migrations/        # Migrations versionadas (DDL + view do relatorio)
  schema.prisma      # Modelo de dados
  seed.ts            # Carga inicial de exemplo

src/
  app/               # Rotas (App Router) + Server Actions
  components/
    layout/          # Sidebar, header, shell
    shared/          # Componentes reutilizaveis (busca, menu de acoes, etc.)
    ui/              # Componentes do shadcn/ui
  features/
    autores/         # CRUD de autores
    assuntos/        # CRUD de assuntos
    livros/          # CRUD de livros (relacao N:N com autores e assuntos)
    relatorios/      # Servico que consome a view e monta o relatorio
  lib/
    errors.ts        # Hierarquia de erros de dominio
    formatters.ts    # Formatacao de moeda e data
    prisma.ts        # Singleton do Prisma Client
    utils.ts         # Utilitarios gerais

tests/
  unit/              # Testes Vitest
```

Cada feature segue a mesma divisao em camadas:

```
schemas.ts    -> validacao Zod (regras de entrada)
repository.ts -> acesso ao banco (Prisma) e traducao de erros
service.ts    -> regras de negocio (pre-condicoes, deduplicacao, etc.)
actions.ts    -> Server Actions consumidas pela UI
components/   -> formularios, tabelas e dialogs da feature
```

Isso mantem regras de negocio fora da UI e isola o acesso ao banco.

## Banco de dados

### Modelo

O schema segue integralmente o modelo do desafio, mantendo os nomes originais via `@map`:

- **Livro** (`Codl`, `Titulo`, `Editora`, `Edicao`, `AnoPublicacao`, `Valor`)
- **Autor** (`CodAu`, `Nome`)
- **Assunto** (`codAs`, `Descricao`)
- **Livro_Autor** (`Livro_Codl`, `Autor_CodAu`) — relacao N:N
- **Livro_Assunto** (`Livro_Codl`, `Assunto_codAs`) — relacao N:N

Foreign keys:

- `ON DELETE CASCADE` no lado do `Livro` (excluir um livro derruba suas relacoes).
- `ON DELETE RESTRICT` no lado de `Autor` e `Assunto` (impede excluir uma entidade referenciada — o erro `P2003` do Prisma e capturado e traduzido em uma mensagem amigavel).

### View do relatorio

A pagina **Relatorio: Livros por Autor** consome a view `vw_livros_por_autor`, criada na migration `20260507025100_create_livros_por_autor_view`. A view faz o JOIN das tres tabelas, agrupa por autor/livro e concatena os assuntos com `STRING_AGG`.

Para inspecionar diretamente:

```sql
SELECT * FROM vw_livros_por_autor ORDER BY autor_nome, livro_titulo;
```

A deduplicacao do total geral (livros com mais de um autor sao contados uma unica vez no resumo) fica no servico em `src/features/relatorios/service.ts`.

## Tratamento de erros

Erros sao tratados em camadas, sem `try/catch` genericos:

- **Hierarquia de erros de dominio** (`src/lib/errors.ts`): `ApplicationError`, `NotFoundError`, `ConflictError`.
- **Repository**: intercepta `PrismaClientKnownRequestError` e traduz codigos especificos (`P2003` -> conflito de FK com mensagem contextual; `P2025` -> not found). Erros desconhecidos sao re-lancados.
- **Service**: valida pre-condicoes (existencia de autores/assuntos) antes de tocar no banco.
- **Actions**: distinguem erro de dominio (mensagem especifica para o usuario) de erro inesperado (mensagem generica, sem vazar detalhes tecnicos). Erros de validacao Zod vao por outro caminho e voltam para a UI campo a campo.

## Testes

A suite cobre as duas regras criticas do dominio:

- `tests/unit/livros-schema.test.ts` — validacoes do schema Zod do livro (titulo, ano, valor, relacionamentos obrigatorios).
- `tests/unit/relatorios-service.test.ts` — agrupamento e **deduplicacao do relatorio** quando um livro tem multiplos autores.

Execucao:

```bash
npm run test:run
```

## Troubleshooting

| Sintoma                                                  | Causa provavel                                                            | Solucao                                                                                |
|----------------------------------------------------------|---------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| `prisma migrate deploy` falha com erro de conexao        | `DATABASE_URL` aponta para o pooler (porta 6543), que nao suporta DDL     | Configure `DIRECT_URL` apontando para a conexao direta (porta 5432) e refaca o deploy  |
| `Error: P2021` (the table does not exist)                | Migrations nao aplicadas no banco apontado pelo `.env`                    | Rode `npm run prisma:deploy`                                                           |
| Senha com caracteres especiais quebra a URL de conexao   | Caracteres como `@`, `#`, `%`, `+` precisam ser escapados                 | URL-encode a senha antes de colocar nas variaveis (`encodeURIComponent`)               |
| Listagem nao reflete dados recem-cadastrados             | Cache do Next                                                             | Paginas usam `dynamic = "force-dynamic"`; force refresh com `Ctrl+Shift+R`             |
| Excluir um autor/assunto retorna mensagem de conflito    | O registro esta vinculado a um livro                                      | Comportamento esperado (`ON DELETE RESTRICT`); remova o vinculo no livro primeiro      |

## Licenca

MIT.

# TheLibary

Aplicacao web para cadastro de livros, autores e assuntos, desenvolvida com Next.js, Supabase, Prisma e TypeScript.

## Stack

- Next.js com App Router
- TypeScript
- Supabase PostgreSQL
- Prisma 7
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- Vitest
- Playwright
- Vercel

## Configuracao

1. Instale as dependencias:

```bash
npm install
```

2. Crie um projeto no Supabase e configure as variaveis:

```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

3. Gere o Prisma Client:

```bash
npm run prisma:generate
```

4. Aplique as migrations:

```bash
npm run prisma:deploy
```

5. Execute o seed, se desejar dados iniciais:

```bash
npm run db:seed
```

6. Rode a aplicacao localmente:

```bash
npm run dev
```

## Deploy na Vercel

Configure `DATABASE_URL` e `DIRECT_URL` nas variaveis de ambiente do projeto na Vercel.

Antes do deploy da aplicacao, garanta que as migrations foram aplicadas no banco do Supabase.

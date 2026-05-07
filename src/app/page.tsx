const modules = [
  {
    title: "Livros",
    description: "Cadastro de livros com autores, assuntos e valor em reais.",
    href: "/livros",
  },
  {
    title: "Autores",
    description: "Gerenciamento dos autores vinculados aos livros.",
    href: "/autores",
  },
  {
    title: "Assuntos",
    description: "Organizacao dos assuntos usados para classificar livros.",
    href: "/assuntos",
  },
  {
    title: "Relatorio",
    description: "Consulta baseada em view do banco, agrupada por autor.",
    href: "/relatorios/livros-por-autor",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Desafio tecnico
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
          TheLibary
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Aplicacao web para cadastro de livros, autores e assuntos,
          desenvolvida com Next.js, Supabase, Prisma e boas praticas de
          arquitetura.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {modules.map((module) => (
          <a
            key={module.href}
            href={module.href}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-slate-950">
              {module.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {module.description}
            </p>
          </a>
        ))}
      </section>
    </main>
  );
}

import Link from "next/link";

type PageShellProps = Readonly<{
  title: string;
  description: string;
  children?: React.ReactNode;
}>;

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <Link className="text-sm font-medium text-blue-600 hover:text-blue-700" href="/">
        Voltar para o inicio
      </Link>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          {description}
        </p>
      </section>

      {children}
    </main>
  );
}

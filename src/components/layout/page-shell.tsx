type PageShellProps = Readonly<{
  title: string;
  description: string;
  children?: React.ReactNode;
}>;

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <section className="flex w-full flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

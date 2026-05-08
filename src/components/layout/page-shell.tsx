type PageShellProps = Readonly<{
  title: string;
  description: string;
  children?: React.ReactNode;
}>;

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <section className="flex w-full flex-col gap-6 sm:gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
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

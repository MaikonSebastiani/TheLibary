"use client";

import {
  BookOpen,
  FileBarChart2,
  Home,
  Library,
  Tags,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navSections = [
  {
    title: undefined,
    items: [{ label: "Inicio", href: "/", icon: Home }],
  },
  {
    title: "Cadastros",
    items: [
      { label: "Livros", href: "/livros", icon: BookOpen },
      { label: "Autores", href: "/autores", icon: Users },
      { label: "Assuntos", href: "/assuntos", icon: Tags },
    ],
  },
  {
    title: "Relatorios",
    items: [
      {
        label: "Livros por autor",
        href: "/relatorios/livros-por-autor",
        icon: FileBarChart2,
      },
    ],
  },
] as const;

type SidebarNavProps = Readonly<{
  onNavigate?: () => void;
}>;

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Library className="size-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">TheLibary</span>
          <span className="text-xs text-sidebar-foreground/80">
            Acervo bibliografico
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        {navSections.map((section, index) => (
          <div
            className={cn("flex flex-col gap-1", index > 0 && "mt-6")}
            key={section.title ?? `section-${index}`}
          >
            {section.title ? (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/60">
                {section.title}
              </p>
            ) : null}

            <ul className="flex flex-col gap-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-white/5 hover:text-white"
                      )}
                      href={item.href}
                      onClick={onNavigate}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </>
  );
}

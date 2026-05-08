"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { SidebarNav } from "./sidebar-nav";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const drawer = (
    <>
      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-200 lg:hidden print:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
      />

      <aside
        aria-hidden={!open}
        aria-label="Menu de navegacao"
        aria-modal="true"
        className={cn(
          "fixed inset-y-0 left-0 z-[70] flex w-72 max-w-[85%] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-2xl transition-transform duration-300 ease-out lg:hidden print:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        id="mobile-sidebar"
        role="dialog"
      >
        <button
          aria-label="Fechar menu"
          className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-lg text-sidebar-foreground transition hover:bg-white/10 hover:text-white"
          onClick={() => setOpen(false)}
          type="button"
        >
          <X className="size-4" />
        </button>

        <SidebarNav onNavigate={() => setOpen(false)} />
      </aside>
    </>
  );

  return (
    <>
      <button
        aria-controls="mobile-sidebar"
        aria-expanded={open}
        aria-label="Abrir menu"
        className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition hover:bg-muted lg:hidden"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Menu className="size-5" />
      </button>

      {mounted ? createPortal(drawer, document.body) : null}
    </>
  );
}

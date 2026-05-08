"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintReportButton() {
  return (
    <Button
      className="print:hidden"
      onClick={() => window.print()}
      type="button"
      variant="outline"
    >
      <Printer className="size-4" />
      Imprimir
    </Button>
  );
}

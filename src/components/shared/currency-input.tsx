"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { currencyFormatter } from "@/lib/formatters";

type CurrencyInputProps = Readonly<{
  id?: string;
  name: string;
  defaultValue?: string | number;
  placeholder?: string;
  ariaInvalid?: boolean;
  className?: string;
}>;

function valueToDigits(value: string | number | undefined): string {
  if (value === undefined || value === "" || value === null) {
    return "";
  }

  const numeric = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return "";
  }

  return Math.round(numeric * 100).toString();
}

function digitsToNumber(digits: string): number {
  if (!digits) {
    return 0;
  }

  return Number(digits) / 100;
}

export function CurrencyInput({
  id,
  name,
  defaultValue,
  placeholder = "R$ 0,00",
  ariaInvalid,
  className,
}: CurrencyInputProps) {
  const [digits, setDigits] = useState(() => valueToDigits(defaultValue));

  const numericValue = digitsToNumber(digits);
  const display = digits ? currencyFormatter.format(numericValue) : "";
  const submittedValue = digits ? numericValue.toFixed(2) : "";

  return (
    <>
      <Input
        aria-invalid={ariaInvalid}
        autoComplete="off"
        className={className}
        id={id}
        inputMode="numeric"
        onChange={(event) => {
          const sanitized = event.target.value.replace(/\D/g, "");
          setDigits(sanitized);
        }}
        placeholder={placeholder}
        type="text"
        value={display}
      />
      <input name={name} type="hidden" value={submittedValue} />
    </>
  );
}

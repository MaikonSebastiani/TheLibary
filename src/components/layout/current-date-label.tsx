"use client";

import { useSyncExternalStore } from "react";

const formatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return formatter.format(new Date());
}

function getServerSnapshot() {
  return "";
}

export function CurrentDateLabel() {
  const label = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  return <span className="capitalize">{label}</span>;
}

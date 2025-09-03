"use client";

import { SessionProvider } from "./lib/SessionProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

"use client";

import { SessionProvider } from "./lib/authProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

import type { ReactNode } from "react";
import { Masthead } from "./Masthead";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export function Layout({ children, hideFooter = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Masthead />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}

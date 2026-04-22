import { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const InfoPageLayout = ({ title, subtitle, children }: Props) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-primary text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <h1 className="font-display text-4xl md:text-5xl">{title}</h1>
            {subtitle && <p className="mt-2 text-primary-foreground/80">{subtitle}</p>}
          </div>
        </div>
        <div className="container mx-auto px-4 py-12 max-w-3xl prose prose-neutral dark:prose-invert">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

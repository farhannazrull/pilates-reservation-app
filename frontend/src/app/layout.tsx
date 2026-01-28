import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diro Pilates",
  description: "Secure booking portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans tracking-tight">
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <main className="animate-fade-in">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
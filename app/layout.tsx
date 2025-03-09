import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "What Have I Learned Today",
  description: "Track and reflect on your daily learning journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <header className="border-b">
            <div className="container mx-auto py-4 px-4 flex justify-between items-center">
              <Link href="/" className="font-bold text-xl">
                What Have I Learned Today
              </Link>
              <nav className="flex items-center gap-4">
                <Link href="/entries" className="text-muted-foreground hover:text-foreground">
                  Entries
                </Link>
                <Link href="/tags" className="text-muted-foreground hover:text-foreground">
                  Tags
                </Link>
                <Button asChild size="sm">
                  <Link href="/new-entry">New Entry</Link>
                </Button>
              </nav>
            </div>
          </header>
          <div className="flex-1">
            {children}
          </div>
          <footer className="border-t py-6">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} What Have I Learned Today</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

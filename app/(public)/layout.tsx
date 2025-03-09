import { ThemeToggle } from '@/components/molecules'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Logo" width={32} height={32} />
              <span className="text-lg font-bold">What Have I Learned Today</span>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hover:cursor-pointer">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="hover:cursor-pointer">Sign Up</Button>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="flex-1 bg-background">
        {children}
      </main>
      <footer className="border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 px-4 md:flex-row md:px-6">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} What Have I Learned Today. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
} 
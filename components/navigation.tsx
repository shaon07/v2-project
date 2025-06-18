"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center space-x-8">
          <Link href="/" className="font-bold text-xl">
            Albums & Blogs
          </Link>
          <div className="flex space-x-6">
            <Link
              href="/albums"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/albums" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Albums
            </Link>
            <Link
              href="/blogs"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/blogs" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Blogs
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

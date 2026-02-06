"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FileText, List, Settings } from "lucide-react"

export function Header() {
    const pathname = usePathname()

    const navItems = [
        { name: "見積作成", href: "/quotes/new", icon: FileText },
        { name: "見積一覧", href: "/quotes", icon: List },
        { name: "設定", href: "/settings", icon: Settings },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="font-bold text-lg">見積管理システム</span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 transition-colors hover:text-foreground/80",
                                    pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
                                        ? "text-primary"
                                        : "text-foreground/60"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    )
}

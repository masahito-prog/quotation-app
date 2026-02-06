"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileText, PlusCircle, Settings, LogOut, User, List } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    const navItems = [
        { name: "見積一覧", href: "/quotes", icon: List },
        { name: "新規作成", href: "/quotes/new", icon: PlusCircle },
        { name: "設定", href: "/settings", icon: Settings },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center px-4">
                <div className="mr-8 flex items-center gap-2 font-bold text-lg">
                    <Link href="/" className="flex items-center gap-2">
                        <FileText className="h-6 w-6 text-primary" />
                        <span>見積管理システム</span>
                    </Link>
                </div>

                {user && (
                    <nav className="flex items-center gap-6 text-sm font-medium flex-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 transition-colors hover:text-primary",
                                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                )}

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mr-2">
                                <User className="h-4 w-4" />
                                <span className="hidden sm:inline">{user.email}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
                                <LogOut className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">ログアウト</span>
                            </Button>
                        </>
                    ) : (
                        <Link href="/login">
                            <Button variant="default" size="sm">
                                ログイン
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

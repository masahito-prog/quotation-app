"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/quotes");
            router.refresh();
        }
    };

    const handleSignUp = async () => {
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            alert("確認メールを送信しました。メールを確認してログインしてください。");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 px-4">
            <Card className="p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">見積管理システム</h1>
                    <p className="text-muted-foreground mt-2">ログインして利用を開始してください</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">メールアドレス</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">パスワード</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</p>
                    )}

                    <Button className="w-full" type="submit" disabled={loading}>
                        {loading ? "処理中..." : "ログイン"}
                    </Button>
                </form>

                <div className="mt-6 pt-6 border-t text-center">
                    <p className="text-sm text-muted-foreground mb-4">アカウントをお持ちでない場合</p>
                    <Button variant="outline" className="w-full" onClick={handleSignUp} disabled={loading}>
                        新規登録
                    </Button>
                </div>
            </Card>
        </div>
    );
}

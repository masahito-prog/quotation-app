"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, FileText, Pencil, Trash2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getQuotes, deleteQuote } from "@/lib/storage"
import { Quote } from "@/lib/types"

export default function QuotesPage() {
    const [quotes, setQuotes] = useState<Quote[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadQuotes = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await getQuotes()
            setQuotes(data)
        } catch (err: any) {
            setError(err.message || "読み込みに失敗しました")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadQuotes()
    }, [])

    const handleDelete = async (id: string) => {
        if (confirm("本当に削除しますか？")) {
            try {
                await deleteQuote(id)
                await loadQuotes()
            } catch (err) {
                alert("削除に失敗しました")
            }
        }
    }

    if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">データを読み込み中...</div>

    if (error) {
        return (
            <div className="p-8 text-center">
                <p className="text-destructive mb-4">エラーが発生しました: {error}</p>
                <p className="text-sm text-muted-foreground mb-4">環境変数が設定されていない可能性があります。</p>
                <Button onClick={loadQuotes} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" /> 再読み込み
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">見積一覧</h1>
                <Link href="/quotes/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        新規作成
                    </Button>
                </Link>
            </div>

            {quotes.length === 0 ? (
                <Card className="p-12 text-center text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">見積書がありません</p>
                    <p className="text-sm mb-6">新しい見積書を作成して、顧客に提案しましょう。</p>
                    <Link href="/quotes/new">
                        <Button variant="outline">最初の見積を作成</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {quotes.map((quote) => (
                        <Card key={quote.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                        {quote.quoteNumber}
                                    </span>
                                    {quote.status === "draft" ? (
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                                            下書き
                                        </span>
                                    ) : (
                                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-200">
                                            発行済
                                        </span>
                                    )}
                                    <span className="text-xs text-muted-foreground ml-auto md:ml-0">
                                        {quote.updatedAt ? new Date(quote.updatedAt).toLocaleDateString() : ""}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg">{quote.customerName} {quote.honorific}</h3>
                                <div className="text-sm text-muted-foreground">
                                    合計: ¥{quote.totalAmount.toLocaleString()} ({quote.items.length} 点)
                                </div>
                            </div>

                            <div className="flex items-center gap-2 justify-end">
                                <Link href={`/quotes/${quote.id}`}>
                                    <Button variant="outline" size="sm">
                                        <Pencil className="w-4 h-4 mr-2" />
                                        編集
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDelete(quote.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

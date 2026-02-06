"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { QuoteForm } from "@/components/quotes/QuoteForm"
import { getQuote } from "@/lib/storage"
import { Quote } from "@/lib/types"

export default function EditQuotePage() {
    const params = useParams()
    const router = useRouter()
    const [quote, setQuote] = useState<Quote | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchQuote = async () => {
            if (params.id) {
                try {
                    const data = await getQuote(params.id as string)
                    if (data) {
                        setQuote(data)
                    } else {
                        alert("見積データが見つかりません")
                        router.push("/quotes")
                    }
                } catch (err) {
                    console.error(err)
                    alert("読み込みエラー")
                    router.push("/quotes")
                } finally {
                    setLoading(false)
                }
            }
        }
        fetchQuote()
    }, [params.id, router])

    if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">読み込み中...</div>
    if (!quote) return null

    return <QuoteForm initialData={quote} />
}

"use client"

import React, { useState, useEffect } from "react"
import { Plus, Trash2, Eye, EyeOff, Save, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { QuotePreview } from "./QuotePreview"
import { cn } from "@/lib/utils"
// Import types and storage
import { Quote, QuoteItem, QuoteStatus } from "@/lib/types"
import { saveQuote, generateQuoteNumber } from "@/lib/storage"

function toISODate(value?: string) {
    if (!value) return null;

    // すでに YYYY-MM-DD ならそのまま
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

    // "2026年2月6日" → "2026-02-06"
    const m = value.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/);
    if (m) {
        const y = m[1];
        const mm = String(m[2]).padStart(2, "0");
        const dd = String(m[3]).padStart(2, "0");
        return `${y}-${mm}-${dd}`;
    }

    return null;
}

interface QuoteFormProps {
    initialData?: Quote
}

export function QuoteForm({ initialData }: QuoteFormProps) {
    const router = useRouter()

    // State
    const [id] = useState<string>(initialData?.id || "")
    const [quoteNumber, setQuoteNumber] = useState<string>(initialData?.quoteNumber || "")

    const [customerName, setCustomerName] = useState(initialData?.customerName || "")
    const [honorific, setHonorific] = useState(initialData?.honorific || "御中")
    const [issueDate, setIssueDate] = useState(initialData?.issueDate || "")
    const [expiryDate, setExpiryDate] = useState(initialData?.expiryDate || "")
    const [items, setItems] = useState<QuoteItem[]>(initialData?.items || [
        { id: "1", name: "Webサイト制作", spec: "コーポレートサイト", quantity: 1, unitPrice: 300000 },
    ])
    const [taxRate, setTaxRate] = useState(initialData?.taxRate ?? 10)
    const [showPreview, setShowPreview] = useState(false)
    const [, setIsMobile] = useState(false)
    const [saving, setSaving] = useState(false)
    const [remarks, setRemarks] = useState(initialData?.remarks || "")

    // Initialize date & resize listener
    useEffect(() => {
        if (!initialData) {
            const today = new Date()
            setIssueDate(today.toISOString().split("T")[0])


            // Set default expiry (2 weeks)
            const expiry = new Date()
            expiry.setDate(today.getDate() + 14)
            setExpiryDate(expiry.toISOString().split("T")[0])

            // Generate Number
            setQuoteNumber(generateQuoteNumber())
        }

        // Check mobile
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [initialData])

    // Calculations
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    const taxAmount = Math.floor(subtotal * (taxRate / 100))
    const totalAmount = subtotal + taxAmount

    // Data Saving Logic
    const handleSave = async (status: QuoteStatus) => {
        if (!customerName) {
            alert("顧客名を入力してください")
            return
        }

        setSaving(true)

        try {
            // Note: id is empty for new quotes, Supabase will generate UUID.
            // If editing, id has value.
            const quoteData: Quote = {
                id: id,
                quoteNumber: quoteNumber || generateQuoteNumber(),
                status: status,
                createdAt: initialData?.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                customerName,
                honorific,

                // ★ここを差し替え
                issueDate: toISODate(issueDate) || "",
                expiryDate: toISODate(expiryDate) || "",

                items,
                taxRate,
                subtotal,
                taxAmount,
                totalAmount,
                remarks,
            }


            await saveQuote(quoteData)

            if (status === 'draft') {
                alert("下書きを保存しました")
            } else {
                alert("見積書を発行しました")
            }

            router.push("/quotes")
        } catch (error: unknown) {
            console.error(error)
            let message = "";
            if (error instanceof Error) {
                message = error.message;
            } else {
                try {
                    message = JSON.stringify(error);
                } catch {
                    message = String(error);
                }
            }
            alert("保存に失敗しました。Supabaseの環境設定を確認してください。\nエラー: " + message)
        } finally {
            setSaving(false)
        }
    }

    // Handlers
    const addItem = () => {
        const newItem: QuoteItem = {
            id: Date.now().toString(),
            name: "",
            spec: "",
            quantity: 1,
            unitPrice: 0,
        }
        setItems([...items, newItem])
    }

    const removeItem = (id: string) => {
        if (items.length === 1) return // Prevent empty
        setItems(items.filter((item) => item.id !== id))
    }

    const updateItem = (id: string, field: keyof QuoteItem, value: string | number) => {
        setItems(
            items.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        {initialData ? "見積編集" : "見積作成"}
                    </h1>
                    <div className="text-sm text-muted-foreground font-mono">
                        {quoteNumber}
                    </div>
                </div>

                {/* Customer Info */}
                <Card>
                    <h2 className="text-lg font-semibold mb-6">顧客情報</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>顧客名 *</Label>
                            <Input
                                placeholder="例: 株式会社クライアント"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>敬称 *</Label>
                            <Select
                                value={honorific}
                                onChange={(e) => setHonorific(e.target.value)}
                            >
                                <option value="御中">御中</option>
                                <option value="様">様</option>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                            <Label>発行日</Label>
                            <Input
                                type="date"
                                value={toISODate(issueDate) || issueDate}
                                onChange={(e) => setIssueDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>有効期限</Label>
                            <Input
                                type="date"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="space-y-2">
                            <Label>消費税率</Label>
                            <Select
                                value={taxRate.toString()}
                                onChange={(e) => setTaxRate(parseInt(e.target.value))}
                            >
                                <option value="10">10%</option>
                                <option value="8">8% (軽減税率)</option>
                                <option value="0">0% (非課税)</option>
                            </Select>
                        </div>
                    </div>
                </Card>

                {/* Items */}
                <Card>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold">明細</h2>
                        <Button size="sm" onClick={addItem} variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            行を追加
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {/* Desktop Header */}
                        <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground mb-2 px-2">
                            <div className="col-span-4">品目名</div>
                            <div className="col-span-3">仕様</div>
                            <div className="col-span-2 text-right">数量</div>
                            <div className="col-span-2 text-right">単価</div>
                            <div className="col-span-1"></div>
                        </div>

                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start md:items-center p-4 md:p-2 bg-muted/30 md:bg-transparent rounded-lg border md:border-none"
                            >
                                <div className="col-span-4 space-y-1 md:space-y-0">
                                    <Label className="md:hidden text-xs text-muted-foreground">品目名</Label>
                                    <Input
                                        placeholder="品目名"
                                        value={item.name}
                                        onChange={(e) => updateItem(item.id, "name", e.target.value)}
                                    />
                                </div>
                                <div className="col-span-3 space-y-1 md:space-y-0">
                                    <Label className="md:hidden text-xs text-muted-foreground">仕様</Label>
                                    <Input
                                        placeholder="仕様・詳細"
                                        value={item.spec}
                                        onChange={(e) => updateItem(item.id, "spec", e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2 space-y-1 md:space-y-0">
                                    <Label className="md:hidden text-xs text-muted-foreground">数量</Label>
                                    <Input
                                        type="number"
                                        className="text-right"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="col-span-2 space-y-1 md:space-y-0">
                                    <Label className="md:hidden text-xs text-muted-foreground">単価</Label>
                                    <Input
                                        type="number"
                                        className="text-right"
                                        min="0"
                                        value={item.unitPrice}
                                        onChange={(e) => updateItem(item.id, "unitPrice", parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="col-span-1 flex justify-end md:justify-center pt-2 md:pt-0">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="text-muted-foreground hover:text-destructive"
                                        onClick={() => removeItem(item.id)}
                                        disabled={items.length === 1}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Total & Actions */}
                <Card className="bg-muted/50 border-muted">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">小計</span>
                            <span>¥{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">消費税 ({taxRate}%)</span>
                            <span>¥{taxAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold border-t border-muted-foreground/20 pt-2 mt-2">
                            <span>合計</span>
                            <span className="text-primary">¥{totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </Card>

                <Card>
                    <h2 className="text-lg font-semibold mb-4">備考・条件</h2>
                    <div className="space-y-2">
                        <Label>備考</Label>
                        <Input
                            placeholder="備考を入力してください"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />
                    </div>
                </Card>

                {/* Mobile Preview Toggle */}
                <div className="lg:hidden sticky bottom-4 z-40">
                    <Button
                        className="w-full shadow-lg"
                        size="lg"
                        onClick={() => setShowPreview(!showPreview)}
                    >
                        {showPreview ? (
                            <>
                                <EyeOff className="w-4 h-4 mr-2" /> プレビューを閉じる
                            </>
                        ) : (
                            <>
                                <Eye className="w-4 h-4 mr-2" /> プレビューを表示
                            </>
                        )}
                    </Button>
                </div>

                {/* Actions */}
                <div className="hidden lg:flex justify-end gap-4">
                    <Button variant="outline" onClick={() => handleSave('draft')} disabled={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? "保存中..." : "一時保存"}
                    </Button>
                    <Button onClick={() => handleSave('issued')} disabled={saving}>
                        <Send className="w-4 h-4 mr-2" />
                        {saving ? "処理中..." : "見積書を発行"}
                    </Button>
                </div>
            </div>

            {/* Preview Section */}
            <div className={cn(
                "lg:block",
                showPreview ? "block fixed inset-0 z-50 bg-background overflow-y-auto p-4 pt-16" : "hidden"
            )}>
                <div className="lg:sticky lg:top-20">
                    <div className="flex items-center justify-between mb-4 lg:mb-0">
                        <h2 className="text-lg font-semibold lg:hidden">プレビュー</h2>
                        {showPreview && (
                            <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)} className="lg:hidden">
                                閉じる
                            </Button>
                        )}
                    </div>

                    <div className="border rounded-lg shadow-sm overflow-hidden bg-white p-1">
                        <QuotePreview
                            customerName={customerName}
                            honorific={honorific}
                            items={items}
                            subtotal={subtotal}
                            taxRate={taxRate}
                            taxAmount={taxAmount}
                            totalAmount={totalAmount}
                            quoteNumber={quoteNumber}
                            issueDate={issueDate}
                            remarks={remarks}
                        />
                    </div>

                    <div className="mt-6 flex flex-col gap-3 lg:hidden">
                        <Button className="w-full" onClick={() => handleSave('issued')} disabled={saving}>
                            <Send className="w-4 h-4 mr-2" /> {saving ? "処理中..." : "発行する"}
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => handleSave('draft')} disabled={saving}>
                            <Save className="w-4 h-4 mr-2" /> {saving ? "保存中..." : "保存"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

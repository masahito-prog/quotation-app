import React from "react";
import { cn } from "@/lib/utils";

export interface QuoteItem {
    id: string;
    name: string;
    spec: string;
    quantity: number;
    unitPrice: number;
}

interface QuotePreviewProps {
    customerName: string;
    honorific: string;
    items: QuoteItem[];
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    totalAmount: number;
    isMobile?: boolean;
}

export function QuotePreview({
    customerName,
    honorific,
    items,
    subtotal,
    taxRate,
    taxAmount,
    totalAmount,
}: QuotePreviewProps) {
    const currentDate = new Date().toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div id="quote-preview" className="bg-white p-8 md:p-12 text-gray-900 font-sans leading-relaxed">
            {/* Title */}
            <h1 className="text-center text-2xl font-bold tracking-widest mb-12">
                御 見 積 書
            </h1>

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-12">
                {/* Left: Client & Info */}
                <div className="w-full md:w-3/5">
                    <div className="mb-6 border-b border-gray-800 inline-block min-w-[240px] pb-1">
                        <h2 className="text-lg font-bold">
                            {customerName || "（顧客名）"} <span className="text-sm font-normal">{honorific}</span>
                        </h2>
                    </div>
                    <div className="space-y-1 text-sm text-gray-700">
                        <p>件名：御見積の件</p>
                        <p>下記の通り、御見積申し上げます。</p>
                    </div>
                </div>

                {/* Right: Company Info */}
                <div className="w-full md:w-2/5 mt-8 md:mt-0 text-right md:text-left md:pl-8 text-sm text-gray-700">
                    <div className="mb-2">
                        <p>見積No. QUO-2026-000001</p>
                        <p>発行日: {currentDate}</p>
                    </div>

                    <div className="space-y-1 relative pt-2">
                        {/* Stamp Placeholder */}
                        <div className="absolute top-2 right-10 w-16 h-16 border border-red-500 rounded-full opacity-30 flex items-center justify-center text-red-500 text-xs select-none">
                            (印)
                        </div>

                        <p className="font-bold text-base text-gray-900">株式会社サンプル</p>
                        <p>〒150-0002</p>
                        <p>東京都渋谷区渋谷1-2-3</p>
                        <p>サンプルビル 5F</p>
                        <p>TEL: 03-1234-5678</p>
                        <p>Email: info@sample.co.jp</p>
                        <p>登録番号: T1234567890123</p>
                    </div>
                </div>
            </div>

            {/* Total Amount Box */}
            <div className="mb-10 text-center md:text-left">
                <span className="text-sm border-b border-gray-800 pb-1 inline-block mr-4">御見積金額</span>
                <span className="text-3xl font-bold border-b-2 border-gray-900 pb-1 tabular-nums">
                    ¥{totalAmount.toLocaleString()}
                </span>
                <span className="text-xs ml-2 text-gray-600">(税込)</span>
            </div>

            {/* Details Table */}
            <div className="mb-8">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="border-b-2 border-gray-800">
                            <th className="py-2 pl-2 w-12 font-semibold">No.</th>
                            <th className="py-2 pl-2 font-semibold">品名 / 仕様</th>
                            <th className="py-2 pr-2 w-20 text-right font-semibold">数量</th>
                            <th className="py-2 pr-2 w-28 text-right font-semibold">単価</th>
                            <th className="py-2 pr-2 w-32 text-right font-semibold">金額</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="py-3 pl-2 text-gray-600 tabular-nums">{index + 1}</td>
                                <td className="py-3 pl-2">
                                    <div className="font-medium text-gray-900">{item.name}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{item.spec}</div>
                                </td>
                                <td className="py-3 pr-2 text-right tabular-nums">{item.quantity}</td>
                                <td className="py-3 pr-2 text-right tabular-nums">¥{item.unitPrice.toLocaleString()}</td>
                                <td className="py-3 pr-2 text-right font-medium tabular-nums">¥{(item.quantity * item.unitPrice).toLocaleString()}</td>
                            </tr>
                        ))}
                        {/* Minimal spacing for empty area */}
                        {Array.from({ length: Math.max(0, 3 - items.length) }).map((_, i) => (
                            <tr key={`empty-${i}`} className="border-b border-gray-100 h-10">
                                <td colSpan={5}></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary Area */}
            <div className="flex justify-end mb-12">
                <div className="w-full md:w-1/3">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm font-medium">小計</span>
                        <span className="text-base tabular-nums">¥{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-sm font-medium">消費税 ({taxRate}%)</span>
                        <span className="text-base tabular-nums">¥{taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b-2 border-gray-900 mt-1">
                        <span className="text-base font-bold">合計</span>
                        <span className="text-lg font-bold tabular-nums">¥{totalAmount.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Remarks */}
            <div className="border-t border-gray-200 pt-4 text-sm text-gray-600">
                <h4 className="font-bold text-gray-800 mb-2">備考</h4>
                <p className="whitespace-pre-wrap leading-relaxed">
                    ・本見積書の有効期限は発行日より2週間とさせていただきます。<br />
                    ・お支払いは月末締め翌月末払いにてお願いいたします。<br />
                    ・ご不明な点がございましたら担当までご連絡ください。
                </p>
            </div>
        </div>
    );
}

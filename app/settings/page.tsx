import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">設定</h1>
            <Card>
                <h2 className="text-lg font-semibold mb-6">自社情報設定</h2>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>会社名</Label>
                        <Input defaultValue="株式会社サンプル" />
                    </div>
                    <div className="space-y-2">
                        <Label>住所</Label>
                        <Input defaultValue="東京都渋谷区渋谷1-2-3 サンプルビル5F" />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input defaultValue="info@sample-company.co.jp" />
                    </div>
                    <Button>保存</Button>
                </div>
            </Card>
        </div>
    );
}

"use client"

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getSettings, saveSettings } from "@/lib/storage";
import { CompanySettings } from "@/lib/types";

export default function SettingsPage() {
    const [settings, setSettings] = useState<CompanySettings>(() => getSettings());

    const handleSave = () => {
        saveSettings(settings);
        alert("設定を保存しました");
    };

    const handleChange = (field: string, value: string) => {
        setSettings({ ...settings, [field]: value });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">設定</h1>
            <Card>
                <h2 className="text-lg font-semibold mb-6">自社情報設定</h2>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>会社名</Label>
                        <Input
                            value={settings.companyName}
                            onChange={(e) => handleChange("companyName", e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>郵便番号</Label>
                            <Input
                                value={settings.zipCode}
                                onChange={(e) => handleChange("zipCode", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>電話番号</Label>
                            <Input
                                value={settings.tel}
                                onChange={(e) => handleChange("tel", e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>住所</Label>
                        <Input
                            value={settings.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            value={settings.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>適格請求書発行事業者登録番号</Label>
                        <Input
                            value={settings.registrationNumber}
                            onChange={(e) => handleChange("registrationNumber", e.target.value)}
                            placeholder="T1234567890123"
                        />
                    </div>
                    <Button onClick={handleSave}>保存</Button>
                </div>
            </Card>
        </div>
    );
}

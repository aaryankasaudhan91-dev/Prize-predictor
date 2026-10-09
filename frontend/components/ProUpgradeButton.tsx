"use client"
import { Zap } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { statusTranslations } from "@/lib/statusTranslations";
export default function ProUpgradeButton() {
 const { language } = useSettings();
 return <span className="flex items-center gap-2 text-xs" title={statusTranslations[language].comingSoon}><Zap aria-hidden="true" className="w-4 h-4" /><span className="hidden lg:inline">{statusTranslations[language].comingSoon}</span><span className="lg:hidden">Pro</span></span>;
}

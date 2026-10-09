"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building, MapPin, Home, ChevronDown, Calculator } from "lucide-react"
import { cn } from "@/lib/utils"
import axios from "axios"
import NavigationOptions from "./NavigationOptions"
import ProUpgradeButton from "./ProUpgradeButton"
import { useSettings } from "@/context/SettingsContext"
import { translations } from "@/lib/translations"

import { API_URL, waitForLocations } from "@/lib/backend"
import { statusTranslations } from "@/lib/statusTranslations"

export default function HousePricePredictor() {
    const { language } = useSettings()
    const t: Record<string, string> = { ...translations[language], ...statusTranslations[language] }

    const [locations, setLocations] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [prediction, setPrediction] = useState<number | null>(null)
    const [backendState, setBackendState] = useState<"waking" | "ready" | "offline">("waking")
    const [retryCount, setRetryCount] = useState(0)
    const [error, setError] = useState<"invalid" | "failed" | null>(null)
    const revision = useRef(0)
    const requestController = useRef<AbortController | null>(null)

    const [formData, setFormData] = useState({
        location: "",
        area_sqft: 1000,
        bhk: 2,
        bathrooms: 2,
        floor: 5,
        total_floors: 10,
        age_of_property: 5,
        parking: 1,
        lift: 1
    })

    const updateForm = (next: typeof formData) => {
        revision.current += 1;
        setFormData(next);
        setPrediction(null);
        setError(null);
    };
    const valid = locations.includes(formData.location) &&
        Object.entries(formData).every(([key, value]) => key === "location" || (typeof value === "number" && Number.isFinite(value))) &&
        formData.area_sqft > 0 && formData.bhk > 0 && formData.bathrooms > 0 &&
        Number.isInteger(formData.floor) && Number.isInteger(formData.total_floors) &&
        formData.floor >= 0 && formData.total_floors > 0 && formData.floor <= formData.total_floors && formData.age_of_property >= 0;

    useEffect(() => {
        const controller = new AbortController();
        waitForLocations(controller.signal).then(list => {
            if (controller.signal.aborted) return;
            setLocations(list);
            setFormData(prev => ({ ...prev, location: list.includes(prev.location) ? prev.location : list[0] }));
            setBackendState("ready");
        }).catch(() => { if (!controller.signal.aborted) setBackendState("offline"); });
        return () => controller.abort();
    }, [retryCount]);
    useEffect(() => () => requestController.current?.abort(), []);

    const handleSubmit = async () => {
        if (!valid) { setError("invalid"); return; }
        const submittedRevision = revision.current;
        const submitted = { ...formData };
        const controller = new AbortController();
        requestController.current?.abort();
        requestController.current = controller;
        setLoading(true);
        setPrediction(null);
        setError(null);
        setBackendState("waking");
        try {
            await waitForLocations(controller.signal);
            if (controller.signal.aborted) return;
            setBackendState("ready");
            const response = await axios.post(`${API_URL}/predict`, submitted, { signal: controller.signal, timeout: 30000 });
            const price = response.data.predicted_price;
            if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) throw new Error("invalid result");
            if (submittedRevision === revision.current) setPrediction(price);
        } catch {
            if (!controller.signal.aborted) {
                setError("failed");
                setBackendState("offline");
            }
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        if (price >= 10000000) {
            return `₹ ${(price / 10000000).toFixed(2)} Cr`
        } else if (price >= 100000) {
            return `₹ ${(price / 100000).toFixed(2)} L`
        }
        return `₹ ${price.toLocaleString('en-IN')}`
    }

    const formatValuePerSqft = (price: number, area: number) => {
        return (price / area).toLocaleString('en-IN', { maximumFractionDigits: 0 })
    }

    return (
        <div className="min-h-screen bg-page text-black font-mono selection:bg-red-primary/30">
            {/* Header */}
            <header className="fixed top-0 w-full h-20 px-4 sm:px-8 md:px-14 border-b-2 border-black bg-card flex items-center justify-between z-50">
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 shrink-0 rounded-full bg-red-primary border-2 border-black flex items-center justify-center">
                        <Building className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl sm:text-[24px] font-display font-bold tracking-tight">HouseVal</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-8">
                    <ProUpgradeButton />
                    <NavigationOptions />
                    <button onClick={() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' })} className="hidden md:block px-6 h-12 border-2 border-black bg-black text-white dark:bg-white dark:text-black dark:border-white text-sm font-display font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors uppercase rounded-none cursor-pointer">
                        {t.getValuation}
                    </button>
                </div>
            </header>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 space-y-48">
                <div role="status" aria-live="polite" className="border-2 border-black bg-card p-4">
                    {backendState === "waking" ? t.waking : backendState === "ready" ? t.ready : t.offline}
                    {backendState === "offline" && <button className="ml-4 underline" onClick={() => { setError(null); setBackendState("waking"); setRetryCount(n => n + 1); }}>{t.retry}</button>}
                </div>
                {/* Hero Section */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="min-h-[75vh] flex flex-col justify-center items-start space-y-8"
                >
                    <div className="space-y-6">
                        <div className="px-4 py-2 border-2 border-black bg-yellow-primary text-black text-sm font-mono font-bold tracking-[2px] uppercase w-fit">
                            {t.engineLabel}
                        </div>
                        <h1 className="text-6xl md:text-[5rem] font-display font-bold leading-[1.05] max-w-4xl tracking-tight text-black">
                            {t.heroTitle1} <span className="text-red-primary">{t.heroTitle2}</span> {t.heroTitle3 && <br />}{t.heroTitle3}
                        </h1>
                        <p className="max-w-xl text-lg text-gray-700 dark:text-gray-400 font-mono leading-relaxed font-medium">
                            {t.heroSub}
                        </p>
                    </div>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="pt-16 text-black"
                    >
                        <ChevronDown className="w-10 h-10 border-2 border-black rounded-full p-2 bg-white" />
                    </motion.div>
                </motion.section>

                {/* Location Section */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    className="grid md:grid-cols-2 gap-16 items-center"
                >
                    <div className="space-y-6">
                        <div className="w-12 h-12 rounded-full border-2 border-black bg-red-primary flex items-center justify-center text-white mb-8">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">{t.locationTitle}</h2>
                        <p className="text-gray-700 dark:text-gray-400 font-mono font-medium leading-relaxed max-w-md">
                            {t.locationDesc}
                        </p>
                    </div>
                    <div className="bg-card border-2 border-black p-8 relative">
                        <div className="space-y-4 relative z-10">
                            <label htmlFor="location" className="block text-sm font-mono font-bold tracking-[1px] text-black uppercase">{t.selectLocality}</label>
                            <div className="relative border-2 border-black bg-page">
                                <select
                                    id="location" disabled={backendState !== "ready"}
                                    value={formData.location}
                                    onChange={(e) => updateForm({ ...formData, location: e.target.value })}
                                    className="w-full appearance-none px-6 py-5 bg-transparent text-lg font-mono font-semibold text-black outline-none cursor-pointer rounded-none"
                                >
                                    {locations.map((loc) => (
                                        <option key={loc} value={loc} className="bg-white">{loc.charAt(0).toUpperCase() + loc.slice(1)}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-black pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Space & Layout section */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    className="grid md:grid-cols-2 gap-16 items-center"
                >
                    <div className="md:order-2 space-y-6">
                        <div className="w-12 h-12 border-2 border-black bg-blue-primary flex items-center justify-center text-white mb-8">
                            <Home className="w-6 h-6" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">{t.spaceTitle}</h2>
                        <p className="text-gray-700 dark:text-gray-400 font-mono font-medium leading-relaxed max-w-md">
                            {t.spaceDesc}
                        </p>
                    </div>
                    <div className="md:order-1 bg-card border-2 border-black p-8 space-y-12 relative">
                        <div className="space-y-6">
                            <label className="flex justify-between text-sm font-mono font-bold tracking-[1px] text-black uppercase">
                                <span>{t.totalArea}</span>
                                <span className="text-blue-primary">{formData.area_sqft} {t.sqft}</span>
                            </label>
                            <input
                                id="area" aria-label={t.totalArea} type="range" min="100" max="10000" step="10"
                                value={formData.area_sqft}
                                onChange={(e) => updateForm({ ...formData, area_sqft: Number(e.target.value) })}
                                className="w-full h-3 bg-page border-2 border-black appearance-none cursor-pointer rounded-none outline-none accent-blue-primary"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="block text-sm font-mono font-bold tracking-[1px] text-black uppercase">{t.configuration}</label>
                                <div className="flex flex-col gap-3">
                                    {[1, 2, 3, 4].map(num => (
                                        <button
                                            key={`bhk-${num}`} aria-pressed={formData.bhk === num}
                                            onClick={() => updateForm({ ...formData, bhk: num })}
                                            className={cn(
                                                "py-3 px-5 text-sm font-mono font-bold transition-all border-2 rounded-none text-left uppercase cursor-pointer",
                                                formData.bhk === num ? "bg-blue-primary border-black text-white" : "bg-white border-black text-black hover:bg-page"
                                            )}
                                        >
                                            {num} {t.bhk}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="block text-sm font-mono font-bold tracking-[1px] text-black uppercase">{t.bathrooms}</label>
                                <div className="flex flex-col gap-3">
                                    {[1, 2, 3, 4].map(num => (
                                        <button
                                            key={`bath-${num}`} aria-pressed={formData.bathrooms === num}
                                            onClick={() => updateForm({ ...formData, bathrooms: num })}
                                            className={cn(
                                                "py-3 px-5 text-sm font-mono font-bold transition-all border-2 rounded-none text-left uppercase cursor-pointer",
                                                formData.bathrooms === num ? "bg-blue-primary border-black text-white" : "bg-white border-black text-black hover:bg-page"
                                            )}
                                        >
                                            {num} {t.bath}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Building Profile */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    className="grid md:grid-cols-2 gap-16 items-center"
                >
                    <div className="space-y-6">
                        <div className="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[41px] border-b-yellow-primary mb-8 flex items-center justify-center relative drop-shadow-[0_2px_0_rgba(0,0,0,1)]" style={{ filter: 'drop-shadow(0px 2px 0px black)' }} />
                        <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">{t.buildingTitle}</h2>
                        <p className="text-gray-700 dark:text-gray-400 font-mono font-medium leading-relaxed max-w-md">
                            {t.buildingDesc}
                        </p>
                    </div>
                    <div className="bg-card border-2 border-black p-8 space-y-8 relative">
                        <div className="grid grid-cols-2 gap-6 relative z-10">
                            <div className="space-y-3">
                                <label htmlFor="floor" className="block text-sm font-mono font-bold tracking-[1px] text-black uppercase">{t.floorNumber}</label>
                                <input
                                    type="number" min="0"
                                    id="floor" value={formData.floor}
                                    onChange={(e) => updateForm({ ...formData, floor: Number(e.target.value) })}
                                    className="w-full bg-page border-2 border-black px-5 py-4 font-mono font-bold outline-none rounded-none focus:bg-yellow-primary/10"
                                />
                            </div>
                            <div className="space-y-3">
                                <label htmlFor="total_floors" className="block text-sm font-mono font-bold tracking-[1px] text-black uppercase">{t.totalFloors}</label>
                                <input
                                    type="number" min="1"
                                    id="total_floors" value={formData.total_floors}
                                    onChange={(e) => updateForm({ ...formData, total_floors: Math.max(1, Number(e.target.value)) })}
                                    className="w-full bg-page border-2 border-black px-5 py-4 font-mono font-bold outline-none rounded-none focus:bg-yellow-primary/10"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 relative z-10">
                            <label htmlFor="age_of_property" className="block text-sm font-mono font-bold tracking-[1px] text-black uppercase">{t.propertyAge}</label>
                            <input
                                type="number" min="0"
                                id="age_of_property" value={formData.age_of_property}
                                onChange={(e) => updateForm({ ...formData, age_of_property: Number(e.target.value) })}
                                className="w-full bg-page border-2 border-black px-5 py-4 font-mono font-bold outline-none rounded-none focus:bg-yellow-primary/10"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-4 relative z-10">
                            <button
                                aria-pressed={formData.parking === 1}
                                onClick={() => updateForm({ ...formData, parking: formData.parking === 1 ? 0 : 1 })}
                                className={cn(
                                    "p-5 border-2 transition-all flex items-center justify-center gap-3 cursor-pointer rounded-none",
                                    formData.parking === 1 ? "bg-yellow-primary border-black text-black" : "bg-white border-black text-black hover:bg-page"
                                )}
                            >
                                <div className="w-5 h-5 border-2 border-black flex items-center justify-center bg-white">
                                    {formData.parking === 1 && <div className="w-2.5 h-2.5 bg-black" />}
                                </div>
                                <span className="font-bold font-mono text-sm uppercase">{t.parking}</span>
                            </button>
                            <button
                                aria-pressed={formData.lift === 1}
                                onClick={() => updateForm({ ...formData, lift: formData.lift === 1 ? 0 : 1 })}
                                className={cn(
                                    "p-5 border-2 transition-all flex items-center justify-center gap-3 cursor-pointer rounded-none",
                                    formData.lift === 1 ? "bg-yellow-primary border-black text-black" : "bg-white border-black text-black hover:bg-page"
                                )}
                            >
                                <div className="w-5 h-5 border-2 border-black flex items-center justify-center bg-white">
                                    {formData.lift === 1 && <div className="w-2.5 h-2.5 bg-black" />}
                                </div>
                                <span className="font-bold font-mono text-sm uppercase">{t.lift}</span>
                            </button>
                        </div>
                    </div>
                </motion.section>

                {/* Valuation Engine */}
                <motion.section
                    id="result-section"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    className="py-32 scroll-mt-20"
                >
                    <div className="max-w-3xl mx-auto text-center space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tight">{t.readyFor} <span className="text-blue-primary">{t.valuation}</span></h2>
                        </div>

                        {!valid && backendState === "ready" && <p role="alert">{t.invalid}</p>}
                        {error && <p role="alert">{t[error]}</p>}
                        {backendState !== "ready" && <p role="status">{backendState === "waking" ? t.waking : t.offline}</p>}
                        <button
                            onClick={handleSubmit}
                            disabled={loading || backendState !== "ready" || !valid}
                            className="w-full md:w-auto mx-auto flex items-center justify-center gap-4 border-2 border-black bg-black hover:bg-gray-800 text-white px-12 py-6 font-display font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-none uppercase cursor-pointer"
                        >
                            {loading ? (
                                <><span role="status" className="sr-only">{t.loading}</span><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /></>
                            ) : (
                                <>
                                    <span>{t.generate}</span>
                                    <Calculator className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        <div className="min-h-[300px] mt-12 w-full max-w-xl mx-auto text-left">
                            <AnimatePresence mode="wait">
                                {prediction !== null && (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="bg-black border-2 border-black p-10 space-y-8 relative"
                                    >
                                        <div className="flex items-center gap-3 px-4 py-2 bg-white border-2 border-black w-fit">
                                            <div className="w-3 h-3 rounded-full bg-success opacity-100 animate-pulse border-2 border-black" />
                                            <span className="text-sm font-mono font-bold text-black tracking-[1px] uppercase">{t.computationComplete}</span>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-gray-600 font-mono text-sm font-bold tracking-[1px] uppercase">{t.estMarketPrice}</h3>
                                            <div className="text-6xl md:text-7xl font-display font-bold text-white tracking-tight">
                                                {formatPrice(prediction)}
                                            </div>
                                            <div className="text-sm font-mono font-medium text-gray-600 pt-2 uppercase">
                                                {t.valuedAt} {formatValuePerSqft(prediction, formData.area_sqft)} ₹/{t.sqft} {t.inLocation} {formData.location}
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600">{t.estimateNote}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.section>

                <footer className="py-12 border-t-2 border-black text-center font-mono font-bold text-xs tracking-[2px] uppercase">
                    {t.footerLine1}<br />
                    <span className="text-red-primary">{t.footerLine2}</span>
                </footer>
            </div>
        </div>
    )
}

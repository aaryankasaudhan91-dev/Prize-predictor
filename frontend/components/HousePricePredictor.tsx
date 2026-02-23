"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Home, MapPin, Building, Info, Calculator, CheckCircle2 } from "lucide-react"
import axios from "axios"
import { cn, formatPrice } from "@/lib/utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface FeatureCardProps {
    icon: React.ReactNode
    label: string
    value: string | number
}

const FeatureCard = ({ icon, label, value }: FeatureCardProps) => (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
        <div className="text-emerald-400">{icon}</div>
        <div className="text-xs text-slate-400 uppercase tracking-wider">{label}</div>
        <div className="text-lg font-bold text-white">{value}</div>
    </div>
)

export default function HousePricePredictor() {
    const [step, setStep] = useState(1)
    const [locations, setLocations] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [prediction, setPrediction] = useState<number | null>(null)

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

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get(`${API_URL}/locations`)
                setLocations(response.data.locations)
                if (response.data.locations.length > 0) {
                    setFormData(prev => ({ ...prev, location: response.data.locations[0] }))
                }
            } catch (error) {
                console.error("Error fetching locations:", error)
            }
        }
        fetchLocations()
    }, [])

    const steps = [
        { title: "Location", icon: <MapPin className="w-5 h-5" /> },
        { title: "Size", icon: <Home className="w-5 h-5" /> },
        { title: "Building", icon: <Building className="w-5 h-5" /> },
        { title: "Details", icon: <Info className="w-5 h-5" /> }
    ]

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4))
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const response = await axios.post(`${API_URL}/predict`, formData)
            setPrediction(response.data.predicted_price)
            setStep(5) // Prediction step
        } catch (error) {
            console.error("Error predicting price:", error)
            alert("Failed to get prediction. Ensure the backend is running.")
        } finally {
            setLoading(false)
        }
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-300">Select Locality</label>
                            <select
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                            >
                                {locations.map((loc) => (
                                    <option key={loc} value={loc}>{loc.charAt(0).toUpperCase() + loc.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                            <p className="text-sm text-emerald-400">Navi Mumbai has seen a steady appreciation in most localities. Airoli and Kharghar are currently high-demand areas.</p>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="flex justify-between text-sm font-medium text-slate-300">
                                <span>Total Area (Sq. Ft.)</span>
                                <span className="text-emerald-400 font-bold">{formData.area_sqft} sqft</span>
                            </label>
                            <input
                                type="range" min="100" max="10000" step="10"
                                value={formData.area_sqft}
                                onChange={(e) => setFormData({ ...formData, area_sqft: Number(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                                <span>100 SQFT</span>
                                <span>5000 SQFT</span>
                                <span>10000 SQFT</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">BHK</label>
                                <div className="flex items-center space-x-4 bg-slate-800 rounded-lg p-2 border border-slate-700">
                                    <button onClick={() => setFormData({ ...formData, bhk: Math.max(1, formData.bhk - 1) })} className="p-1 hover:text-emerald-400"><ChevronLeft /></button>
                                    <span className="flex-1 text-center font-bold">{formData.bhk}</span>
                                    <button onClick={() => setFormData({ ...formData, bhk: formData.bhk + 1 })} className="p-1 hover:text-emerald-400"><ChevronRight /></button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Bathrooms</label>
                                <div className="flex items-center space-x-4 bg-slate-800 rounded-lg p-2 border border-slate-700">
                                    <button onClick={() => setFormData({ ...formData, bathrooms: Math.max(1, formData.bathrooms - 1) })} className="p-1 hover:text-emerald-400"><ChevronLeft /></button>
                                    <span className="flex-1 text-center font-bold">{formData.bathrooms}</span>
                                    <button onClick={() => setFormData({ ...formData, bathrooms: formData.bathrooms + 1 })} className="p-1 hover:text-emerald-400"><ChevronRight /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Floor Number</label>
                                <input
                                    type="number"
                                    value={formData.floor}
                                    onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Total Floors</label>
                                <input
                                    type="number"
                                    value={formData.total_floors}
                                    onChange={(e) => setFormData({ ...formData, total_floors: Number(e.target.value) })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="flex justify-between text-sm font-medium text-slate-300">
                                <span>Property Age (Years)</span>
                                <span className="text-emerald-400 font-bold">{formData.age_of_property} Yrs</span>
                            </label>
                            <input
                                type="range" min="0" max="50" step="1"
                                value={formData.age_of_property}
                                onChange={(e) => setFormData({ ...formData, age_of_property: Number(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>
                    </div>
                )
            case 4:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setFormData({ ...formData, parking: formData.parking === 1 ? 0 : 1 })}
                                className={cn(
                                    "p-6 rounded-xl border transition-all flex flex-col items-center space-y-3",
                                    formData.parking === 1 ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                                )}
                            >
                                <Home className="w-8 h-8" />
                                <span className="font-semibold">Parking Included</span>
                            </button>
                            <button
                                onClick={() => setFormData({ ...formData, lift: formData.lift === 1 ? 0 : 1 })}
                                className={cn(
                                    "p-6 rounded-xl border transition-all flex flex-col items-center space-y-3",
                                    formData.lift === 1 ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                                )}
                            >
                                <Building className="w-8 h-8" />
                                <span className="font-semibold">Lift Available</span>
                            </button>
                        </div>
                        <div className="p-4 bg-slate-800/50 border border-dashed border-slate-700 rounded-lg text-xs text-slate-500 text-center italic">
                            Ready to find out the market value of this property? Our AI model will analyze 2500+ recent transactions in Navi Mumbai to give you an accurate estimate.
                        </div>
                    </div>
                )
            case 5:
                return (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center space-y-8 py-4"
                    >
                        <div className="inline-block p-4 rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
                            <CheckCircle2 className="w-12 h-12" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-medium text-slate-300 uppercase tracking-widest">Market Valuation</h2>
                            <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 py-2">
                                {prediction ? formatPrice(prediction) : "Calculating..."}
                            </div>
                            <p className="text-slate-400 text-sm">Estimated fair market price for your property</p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                            <FeatureCard icon={<MapPin className="w-4 h-4" />} label="Locality" value={formData.location} />
                            <FeatureCard icon={<Home className="w-4 h-4" />} label="Area" value={`${formData.area_sqft} sqft`} />
                            <FeatureCard icon={<Building className="w-4 h-4" />} label="BHK" value={formData.bhk} />
                            <FeatureCard icon={<Calculator className="w-4 h-4" />} label="Age" value={`${formData.age_of_property} yrs`} />
                        </div>

                        <button
                            onClick={() => setStep(1)}
                            className="mt-8 text-emerald-400 hover:text-emerald-300 font-medium underline-offset-4 hover:underline transition-all"
                        >
                            Start New Evaluation
                        </button>
                    </motion.div>
                )
        }
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="w-full max-w-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
                {step < 5 && (
                    <div className="px-8 pt-8 flex items-center justify-between border-b border-slate-800 pb-8">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight">Navi Mumbai <span className="text-emerald-400">HouseVal</span></h1>
                            <p className="text-slate-400 text-sm">Precise AI-powered real estate valuation</p>
                        </div>
                        <div className="hidden md:flex items-center space-x-2">
                            {steps.map((s, i) => (
                                <React.Fragment key={i}>
                                    <div className={cn(
                                        "flex flex-col items-center space-y-1",
                                        step === i + 1 ? "text-emerald-400" : i + 1 < step ? "text-slate-300" : "text-slate-600"
                                    )}>
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                                            step === i + 1 ? "border-emerald-500 bg-emerald-500/10" : i + 1 < step ? "border-slate-500 bg-slate-800" : "border-slate-800 bg-slate-900"
                                        )}>
                                            {i + 1 < step ? <CheckCircle2 className="w-5 h-5" /> : s.icon}
                                        </div>
                                    </div>
                                    {i < steps.length - 1 && <div className="w-4 h-[2px] bg-slate-800" />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )}

                <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderStep()}
                        </motion.div>
                    </AnimatePresence>

                    {step < 5 && (
                        <div className="mt-12 flex items-center justify-between">
                            <button
                                onClick={prevStep}
                                disabled={step === 1}
                                className={cn(
                                    "flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all",
                                    step === 1 ? "invisible" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                )}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span>Previous</span>
                            </button>

                            {step < 4 ? (
                                <button
                                    onClick={nextStep}
                                    className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-[#0f172a] px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    <span>Continue</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-[#0f172a] px-10 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-[#0f172a]/30 border-t-[#0f172a] rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Generate Valuation</span>
                                            <Calculator className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="px-8 py-4 bg-slate-950/50 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                    <span>ML ENGINE V1.0.4</span>
                    <span>&copy; 2026 HOUSE PRICE PREDICTOR</span>
                </div>
            </div>
        </div>
    )
}

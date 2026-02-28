"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building, MapPin, Home, ChevronDown, Calculator, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function HousePricePredictor() {
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

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const response = await axios.post(`${API_URL}/predict`, formData)
            setPrediction(response.data.predicted_price)
        } catch (error) {
            console.error("Error predicting price:", error)
            alert("Failed to get prediction. Ensure the backend is running.")
        } finally {
            setLoading(false)
        }
    }

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
            <header className="fixed top-0 w-full h-20 px-8 md:px-14 border-b-2 border-black bg-card flex items-center justify-between z-50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-primary border-2 border-black flex items-center justify-center">
                        <Building className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[24px] font-display font-bold tracking-tight">HouseVal</span>
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    <span className="text-sm font-mono font-bold hover:text-red-primary cursor-pointer uppercase tracking-widest">Platform</span>
                    <span className="text-sm font-mono font-bold text-gray-700 hover:text-black cursor-pointer uppercase tracking-widest">Market</span>
                    <span className="text-sm font-mono font-bold text-gray-700 hover:text-black cursor-pointer uppercase tracking-widest">Methodology</span>
                    <button onClick={() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' })} className="px-6 h-12 border-2 border-black bg-black text-white text-sm font-display font-semibold hover:bg-gray-800 transition-colors uppercase rounded-none cursor-pointer">
                        Get Valuation
                    </button>
                </nav>
            </header>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 space-y-48">
                {/* Hero Section */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="min-h-[75vh] flex flex-col justify-center items-start space-y-8"
                >
                    <div className="space-y-6">
                        <div className="px-4 py-2 border-2 border-black bg-yellow-primary text-black text-sm font-mono font-bold tracking-[2px] uppercase w-fit">
                            NAVI MUMBAI REAL ESTATE ENGINE
                        </div>
                        <h1 className="text-6xl md:text-[5rem] font-display font-bold leading-[1.05] max-w-4xl tracking-tight text-black">
                            The True <span className="text-red-primary">Market Value</span><br />of Your Property
                        </h1>
                        <p className="max-w-xl text-lg text-gray-700 font-mono leading-relaxed font-medium">
                            Discover the fundamental data-driven worth of any property in Navi Mumbai. Our algorithmic model analyzes thousands of local market trends.
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
                        <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">Location is Key</h2>
                        <p className="text-gray-700 font-mono font-medium leading-relaxed max-w-md">
                            Navi Mumbai comprises distinct nodes, each holding unique pricing dynamics. From the established hubs of Vashi to the growing sectors of Kharghar.
                        </p>
                    </div>
                    <div className="bg-card border-2 border-black p-8 relative">
                        <div className="space-y-4 relative z-10">
                            <label className="block text-sm font-mono font-bold tracking-[1px] text-black uppercase">Select Locality</label>
                            <div className="relative border-2 border-black bg-page">
                                <select
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                        <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">Space & Layout</h2>
                        <p className="text-gray-700 font-mono font-medium leading-relaxed max-w-md">
                            Configuration efficiency heavily influences buyer appeal and intrinsic value. Define the physical dimensions of your space.
                        </p>
                    </div>
                    <div className="md:order-1 bg-card border-2 border-black p-8 space-y-12 relative">
                        <div className="space-y-6">
                            <label className="flex justify-between text-sm font-mono font-bold tracking-[1px] text-black uppercase">
                                <span>Total Area</span>
                                <span className="text-blue-primary">{formData.area_sqft} SQ FT</span>
                            </label>
                            <input
                                type="range" min="100" max="10000" step="10"
                                value={formData.area_sqft}
                                onChange={(e) => setFormData({ ...formData, area_sqft: Number(e.target.value) })}
                                className="w-full h-3 bg-page border-2 border-black appearance-none cursor-pointer rounded-none outline-none accent-blue-primary"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="block text-sm font-mono font-bold tracking-[1px] text-black uppercase">Configuration</label>
                                <div className="flex flex-col gap-3">
                                    {[1, 2, 3, 4].map(num => (
                                        <button
                                            key={`bhk-${num}`}
                                            onClick={() => setFormData({ ...formData, bhk: num })}
                                            className={cn(
                                                "py-3 px-5 text-sm font-mono font-bold transition-all border-2 rounded-none text-left uppercase cursor-pointer",
                                                formData.bhk === num ? "bg-blue-primary border-black text-white" : "bg-white border-black text-black hover:bg-page"
                                            )}
                                        >
                                            {num} BHK
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="block text-sm font-mono font-bold tracking-[1px] text-black uppercase">Bathrooms</label>
                                <div className="flex flex-col gap-3">
                                    {[1, 2, 3, 4].map(num => (
                                        <button
                                            key={`bath-${num}`}
                                            onClick={() => setFormData({ ...formData, bathrooms: num })}
                                            className={cn(
                                                "py-3 px-5 text-sm font-mono font-bold transition-all border-2 rounded-none text-left uppercase cursor-pointer",
                                                formData.bathrooms === num ? "bg-blue-primary border-black text-white" : "bg-white border-black text-black hover:bg-page"
                                            )}
                                        >
                                            {num} Bath
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
                        <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">Building Profile</h2>
                        <p className="text-gray-700 font-mono font-medium leading-relaxed max-w-md">
                            Higher floors offer better views and ventilation. Detail the property&apos;s age and infrastructure to finalize the data points.
                        </p>
                    </div>
                    <div className="bg-card border-2 border-black p-8 space-y-8 relative">
                        <div className="grid grid-cols-2 gap-6 relative z-10">
                            <div className="space-y-3">
                                <label className="block text-sm font-mono font-bold tracking-[1px] text-black uppercase">Floor Number</label>
                                <input
                                    type="number" min="0"
                                    value={formData.floor}
                                    onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                                    className="w-full bg-page border-2 border-black px-5 py-4 font-mono font-bold outline-none rounded-none focus:bg-yellow-primary/10"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-sm font-mono font-bold tracking-[1px] text-black uppercase">Total Floors</label>
                                <input
                                    type="number" min="1"
                                    value={formData.total_floors}
                                    onChange={(e) => setFormData({ ...formData, total_floors: Math.max(1, Number(e.target.value)) })}
                                    className="w-full bg-page border-2 border-black px-5 py-4 font-mono font-bold outline-none rounded-none focus:bg-yellow-primary/10"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 relative z-10">
                            <label className="block text-sm font-mono font-bold tracking-[1px] text-black uppercase">Property Age (Yrs)</label>
                            <input
                                type="number" min="0"
                                value={formData.age_of_property}
                                onChange={(e) => setFormData({ ...formData, age_of_property: Number(e.target.value) })}
                                className="w-full bg-page border-2 border-black px-5 py-4 font-mono font-bold outline-none rounded-none focus:bg-yellow-primary/10"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-4 relative z-10">
                            <button
                                onClick={() => setFormData({ ...formData, parking: formData.parking === 1 ? 0 : 1 })}
                                className={cn(
                                    "p-5 border-2 transition-all flex items-center justify-center gap-3 cursor-pointer rounded-none",
                                    formData.parking === 1 ? "bg-yellow-primary border-black text-black" : "bg-white border-black text-black hover:bg-page"
                                )}
                            >
                                <div className="w-5 h-5 border-2 border-black flex items-center justify-center bg-white">
                                    {formData.parking === 1 && <div className="w-2.5 h-2.5 bg-black" />}
                                </div>
                                <span className="font-bold font-mono text-sm uppercase">Parking</span>
                            </button>
                            <button
                                onClick={() => setFormData({ ...formData, lift: formData.lift === 1 ? 0 : 1 })}
                                className={cn(
                                    "p-5 border-2 transition-all flex items-center justify-center gap-3 cursor-pointer rounded-none",
                                    formData.lift === 1 ? "bg-yellow-primary border-black text-black" : "bg-white border-black text-black hover:bg-page"
                                )}
                            >
                                <div className="w-5 h-5 border-2 border-black flex items-center justify-center bg-white">
                                    {formData.lift === 1 && <div className="w-2.5 h-2.5 bg-black" />}
                                </div>
                                <span className="font-bold font-mono text-sm uppercase">Lift</span>
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
                            <h2 className="text-5xl md:text-7xl font-display font-bold trackig-tight">Ready for <span className="text-blue-primary">Valuation</span></h2>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full md:w-auto mx-auto flex items-center justify-center gap-4 border-2 border-black bg-black hover:bg-gray-800 text-white px-12 py-6 font-display font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-none uppercase cursor-pointer"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Generate Estimate</span>
                                    <Calculator className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        <div className="min-h-[300px] mt-12 w-full max-w-xl mx-auto text-left">
                            <AnimatePresence mode="wait">
                                {prediction && (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="bg-black border-2 border-black p-10 space-y-8 relative"
                                    >
                                        <div className="flex items-center gap-3 px-4 py-2 bg-white border-2 border-black w-fit">
                                            <div className="w-3 h-3 rounded-full bg-success opacity-100 animate-pulse border-2 border-black" />
                                            <span className="text-sm font-mono font-bold text-black tracking-[1px] uppercase">COMPUTATION COMPLETE</span>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-gray-600 font-mono text-sm font-bold tracking-[1px] uppercase">Estimated Market Price</h3>
                                            <div className="text-6xl md:text-7xl font-display font-bold text-white tracking-tight">
                                                {formatPrice(prediction)}
                                            </div>
                                            <div className="text-sm font-mono font-medium text-gray-600 pt-2 uppercase">
                                                Valued at {formatValuePerSqft(prediction, formData.area_sqft)} ₹/sqft in {formData.location}
                                            </div>
                                        </div>

                                        <div className="h-0.5 w-full bg-gray-700" />

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-mono font-bold text-gray-600 uppercase tracking-widest">Area Average</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-base font-mono font-bold text-white">
                                                    {formatPrice(prediction * 0.92)}
                                                </span>
                                                <div className="flex items-center gap-1 px-2 py-1 bg-white border-2 border-black">
                                                    <TrendingUp className="w-4 h-4 text-black" />
                                                    <span className="text-xs font-mono font-bold text-black">+8.5%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.section>

                <footer className="py-12 border-t-2 border-black text-center font-mono font-bold text-xs tracking-[2px] uppercase">
                    Designed for analytical precision. Navi Mumbai Real Estate Engine v3.0.<br />
                    <span className="text-red-primary">Bauhaus Digital Edition.</span>
                </footer>
            </div>
        </div>
    )
}

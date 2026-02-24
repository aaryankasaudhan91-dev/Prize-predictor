"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { MapPin, Home, Building, Calculator, CheckCircle2, ChevronDown } from "lucide-react"
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
            setTimeout(() => {
                document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' })
            }, 100)
        } catch (error) {
            console.error("Error predicting price:", error)
            alert("Failed to get prediction. Ensure the backend is running.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white selection:bg-emerald-500/30">
            {/* Background effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-emerald-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 space-y-32">

                {/* Hero Section */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="min-h-[80vh] flex flex-col justify-center items-center text-center space-y-8"
                >
                    <div className="space-y-4">
                        <div className="inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium tracking-wide">
                            AI-Powered Real Estate Engine
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
                            Navi Mumbai <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">HouseVal</span>
                        </h1>
                        <p className="max-w-xl mx-auto text-lg text-slate-400 leading-relaxed mt-4">
                            Discover the true market value of any property in Navi Mumbai. Our machine learning model analyzes thousands of recent transactions to give you an accurate, unbiased estimate as you scroll.
                        </p>
                    </div>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="pt-12 text-slate-500"
                    >
                        <ChevronDown className="w-10 h-10 opacity-50" />
                    </motion.div>
                </motion.section>

                {/* Location Section */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    className="grid md:grid-cols-2 gap-12 items-center min-h-[60vh]"
                >
                    <div className="space-y-6">
                        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                            <MapPin className="w-8 h-8" />
                        </div>
                        <h2 className="text-4xl font-bold">Location is <span className="text-emerald-400">Everything</span></h2>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            Navi Mumbai is a city of nodes, each with its unique character and pricing dynamics. From the bustling commercial hub of Vashi to the rapidly appreciating sectors in Kharghar and the upcoming infrastructure in Panvel, the locality dictates the baseline value of your property.
                        </p>
                        <div className="p-4 bg-slate-900/50 border-l-4 border-emerald-500 rounded-r-xl">
                            <p className="text-sm text-slate-300 italic">"The right node can mean a 20% premium on your property's fundamental value."</p>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                        <div className="space-y-4 relative z-10">
                            <label className="block text-sm font-medium text-slate-300 uppercase tracking-wider">Select Locality</label>
                            <select
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-lg text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                            >
                                {locations.map((loc) => (
                                    <option key={loc} value={loc}>{loc.charAt(0).toUpperCase() + loc.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </motion.section>

                {/* Space & Layout */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    className="grid md:grid-cols-2 gap-12 items-center min-h-[60vh]"
                >
                    <div className="md:order-2 space-y-6">
                        <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
                            <Home className="w-8 h-8" />
                        </div>
                        <h2 className="text-4xl font-bold">Space & <span className="text-cyan-400">Configuration</span></h2>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            Beyond carpet area, the layout efficiency heavily influences buyer appeal. A well-planned 2 BHK often commands a higher per-square-foot rate than a poorly laid out 3 BHK. Select the physical dimensions of the space.
                        </p>
                    </div>
                    <div className="md:order-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-bl from-cyan-500/5 to-transparent pointer-events-none" />
                        <div className="space-y-4 relative z-10">
                            <label className="flex justify-between text-sm font-medium text-slate-300">
                                <span className="uppercase tracking-wider">Total Area</span>
                                <span className="text-cyan-400 font-bold text-lg">{formData.area_sqft} sqft</span>
                            </label>
                            <input
                                type="range" min="100" max="10000" step="10"
                                value={formData.area_sqft}
                                onChange={(e) => setFormData({ ...formData, area_sqft: Number(e.target.value) })}
                                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6 relative z-10">
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-slate-300 uppercase tracking-wider">BHK</label>
                                <div className="flex flex-col bg-slate-800 rounded-xl p-1 border border-slate-700">
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <button
                                            key={`bhk-${num}`}
                                            onClick={() => setFormData({ ...formData, bhk: num })}
                                            className={cn(
                                                "py-2 px-4 rounded-lg text-sm font-medium transition-all",
                                                formData.bhk === num ? "bg-cyan-500 text-[#0f172a] shadow-md shadow-cyan-500/20" : "text-slate-400 hover:bg-slate-700 hover:text-white"
                                            )}
                                        >
                                            {num} BHK
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-slate-300 uppercase tracking-wider">Baths</label>
                                <div className="flex flex-col bg-slate-800 rounded-xl p-1 border border-slate-700">
                                    {[1, 2, 3, 4].map(num => (
                                        <button
                                            key={`bath-${num}`}
                                            onClick={() => setFormData({ ...formData, bathrooms: num })}
                                            className={cn(
                                                "py-2 px-4 rounded-lg text-sm font-medium transition-all",
                                                formData.bathrooms === num ? "bg-cyan-500 text-[#0f172a] shadow-md shadow-cyan-500/20" : "text-slate-400 hover:bg-slate-700 hover:text-white"
                                            )}
                                        >
                                            {num} Bath{num > 1 ? 's' : ''}
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
                    className="grid md:grid-cols-2 gap-12 items-center min-h-[60vh]"
                >
                    <div className="space-y-6">
                        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                            <Building className="w-8 h-8" />
                        </div>
                        <h2 className="text-4xl font-bold">The Building <span className="text-emerald-400">Profile</span></h2>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            Higher floors offer better views, less noise, and superior ventilation, typically commanding a premium. Newer constructions employ modern building codes and amenities, holding their value remarkably better over time. Let's detail the building's characteristics to refine the estimate.
                        </p>
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                        <div className="grid grid-cols-2 gap-6 relative z-10">
                            <div className="space-y-2">
                                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Floor Number</label>
                                <input
                                    type="number" min="0"
                                    value={formData.floor}
                                    onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Total Floors</label>
                                <input
                                    type="number" min="1"
                                    value={formData.total_floors}
                                    onChange={(e) => setFormData({ ...formData, total_floors: Math.max(1, Number(e.target.value)) })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-slate-800 relative z-10">
                            <label className="flex justify-between text-sm font-medium text-slate-300">
                                <span className="uppercase tracking-wider">Property Age</span>
                                <span className="text-emerald-400 font-bold text-lg">{formData.age_of_property} Years</span>
                            </label>
                            <input
                                type="range" min="0" max="50" step="1"
                                value={formData.age_of_property}
                                onChange={(e) => setFormData({ ...formData, age_of_property: Number(e.target.value) })}
                                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 relative z-10">
                            <button
                                onClick={() => setFormData({ ...formData, parking: formData.parking === 1 ? 0 : 1 })}
                                className={cn(
                                    "p-4 rounded-xl border transition-all flex flex-col items-center space-y-2 cursor-pointer",
                                    formData.parking === 1 ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10" : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                                )}
                            >
                                <span className="font-semibold text-sm tracking-wide">Parking Included</span>
                            </button>
                            <button
                                onClick={() => setFormData({ ...formData, lift: formData.lift === 1 ? 0 : 1 })}
                                className={cn(
                                    "p-4 rounded-xl border transition-all flex flex-col items-center space-y-2 cursor-pointer",
                                    formData.lift === 1 ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10" : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                                )}
                            >
                                <span className="font-semibold text-sm tracking-wide">Lift Available</span>
                            </button>
                        </div>
                    </div>
                </motion.section>

                {/* Valuation Engine */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    className="py-24 relative"
                >
                    <div className="absolute inset-0 top-12 bottom-12 bg-gradient-to-b from-slate-900/0 via-emerald-900/20 to-slate-900/0 sm:mx-[-10vw] rounded-[100px] pointer-events-none blur-3xl z-[-1]" />

                    <div className="max-w-2xl mx-auto text-center space-y-10 relative z-10">
                        <div className="space-y-4">
                            <h2 className="text-5xl font-black">Ready for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Valuation</span></h2>
                            <p className="text-slate-400 text-lg leading-relaxed">All parameters logged. Our pipeline is ready to process the data against Navi Mumbai market trends to find the fair price.</p>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full relative group overflow-hidden flex items-center justify-center space-x-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 p-8 rounded-3xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-emerald-500/20"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            {loading ? (
                                <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span className="text-2xl text-white tracking-wide">Generate Neural Estimate</span>
                                    <Calculator className="w-8 h-8 text-emerald-400 group-hover:rotate-12 transition-transform" />
                                </>
                            )}
                        </button>

                        <div id="result-section" className="scroll-mt-32 min-h-[300px]">
                            <AnimatePresence>
                                {prediction && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        className="pt-16 space-y-8"
                                    >
                                        <div className="inline-flex items-center space-x-2 text-emerald-400 bg-emerald-500/10 px-5 py-2.5 rounded-full mb-4 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span className="font-bold text-sm tracking-widest">COMPUTATION COMPLETE</span>
                                        </div>

                                        <div className="space-y-4 bg-slate-900/90 backdrop-blur-xl p-12 rounded-[3rem] border border-slate-700 shadow-2xl shadow-emerald-500/10 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-cyan-500" />
                                            <h3 className="text-slate-400 uppercase tracking-widest text-sm font-semibold">Estimated Market Price</h3>
                                            <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 py-4 drop-shadow-sm">
                                                {formatPrice(prediction)}
                                            </div>
                                            <div className="inline-block px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium mt-4">
                                                Valued at {(prediction / formData.area_sqft).toFixed(0)} ₹/sqft in {formData.location.toUpperCase()}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.section>

                {/* Footer */}
                <footer className="py-12 text-center text-slate-500 text-sm tracking-wide">
                    <p>Designed for analytical precision. Navi Mumbai Real Estate Engine v1.0.</p>
                </footer>
            </div>
        </div>
    )
}

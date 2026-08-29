import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    LuBot,
    LuSparkles,
    LuCode,
    LuDatabase,
    LuBrain,
    LuBriefcase,
    LuArrowRight,
} from "react-icons/lu";

const roles = [
    { name: "Software Engineer", icon: LuCode },
    { name: "Frontend Developer", icon: LuCode },
    { name: "Backend Developer", icon: LuDatabase },
    { name: "AI / ML Engineer", icon: LuBrain },
    { name: "Full Stack Developer", icon: LuBriefcase },
];

const levels = ["Beginner", "Intermediate", "Advanced"];

export default function Interview() {
    const navigate = useNavigate();

    const [role, setRole] = useState("");
    const [level, setLevel] = useState("Intermediate");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const startInterview = async () => {
        if (!role) return;

        try {
            setLoading(true);
            setError("");

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/interview/generate-questions`,
                {
                    role: role,
                    experience: "2 years",
                    mode: level,
                    resumeTxt: "",
                    projects: [],
                    skills: [],
                },
                {
                    withCredentials: true,
                }
            );

            console.log("Interview response:", response.data);

            // Move to interview page and pass generated data
            navigate("/2", {
                state: response.data,
            });

        } catch (err) {
            console.error(
                "Failed to start interview:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                "Failed to start interview"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f7f7f6] px-5 py-16">
            <div className="mx-auto max-w-5xl">

                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-green-400 shadow-lg">
                        <LuBot size={24} />
                    </div>

                    <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
                        Start your AI interview
                    </h1>

                    <p className="mt-3 text-gray-500">
                        Choose your role and difficulty.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="mt-12 rounded-[32px] border border-gray-200/70 bg-white p-6 shadow-[0_25px_70px_-30px_rgba(0,0,0,0.18)] md:p-10"
                >

                    {/* Role */}
                    <div>
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Select role
                                </h2>

                                <p className="mt-1 text-sm text-gray-400">
                                    What are you preparing for?
                                </p>
                            </div>

                            <LuSparkles className="text-green-500" />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {roles.map((item) => {
                                const Icon = item.icon;
                                const active = role === item.name;

                                return (
                                    <button
                                        key={item.name}
                                        type="button"
                                        onClick={() => setRole(item.name)}
                                        className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${active
                                                ? "border-green-400 bg-green-50"
                                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active
                                                    ? "bg-green-500 text-white"
                                                    : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            <Icon size={19} />
                                        </div>

                                        <span className="text-sm font-medium">
                                            {item.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Difficulty */}
                    <div className="mt-10">
                        <div className="mb-5">
                            <h2 className="text-lg font-semibold">
                                Difficulty
                            </h2>

                            <p className="mt-1 text-sm text-gray-400">
                                Choose your interview level.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            {levels.map((item) => {
                                const active = level === item;

                                return (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => setLevel(item)}
                                        className={`rounded-2xl border px-5 py-4 text-sm font-medium transition ${active
                                                ? "border-green-400 bg-green-50 text-green-700"
                                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                                            }`}
                                    >
                                        {item}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="mt-10 rounded-2xl bg-[#f8faf9] p-5">
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-400">
                                    Interview
                                </p>

                                <p className="mt-1 font-semibold">
                                    {role || "Select a role"}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-xs uppercase tracking-wider text-gray-400">
                                    Level
                                </p>

                                <p className="mt-1 font-semibold">
                                    {level}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="mt-4 text-center text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    {/* Start */}
                    <button
                        type="button"
                        onClick={startInterview}
                        disabled={!role || loading}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {loading ? "Generating Questions..." : "Start AI Interview"}
                        {!loading && <LuArrowRight size={19} />}
                    </button>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 text-center text-xs text-gray-400"
                >
                    AI-generated questions • Real-time feedback • Personalized scoring
                </motion.p>
            </div>
        </main>
    );
}
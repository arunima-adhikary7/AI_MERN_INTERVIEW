import React from "react";
import { motion } from "framer-motion";
import {
    FileText,
    Code2,
    ArrowRight,
    BriefcaseBusiness,
    Target,
    Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const InterviewTemplate = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-10 flex items-center justify-center">
            <div className="w-full max-w-6xl">

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-100 mb-4">
                        <Sparkles
                            size={28}
                            className="text-green-600"
                        />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                        Choose Your Interview
                    </h1>

                    <p className="mt-3 text-gray-500 max-w-xl mx-auto">
                        Select how you want to practice for your interview.
                    </p>
                </motion.div>

                {/* OPTIONS */}
                <div className="grid md:grid-cols-2 gap-7">

                    {/* ================= CV WISE ================= */}

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 flex flex-col"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-6">
                            <FileText
                                size={32}
                                className="text-green-600"
                            />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800">
                            CV Wise Interview
                        </h2>

                        <p className="mt-3 text-gray-500 leading-relaxed">
                            Upload your CV and let AI generate personalized
                            interview questions based on your skills, projects,
                            experience, and background.
                        </p>

                        <div className="mt-7 space-y-4">

                            <div className="flex items-center gap-3">
                                <FileText
                                    size={18}
                                    className="text-green-600"
                                />

                                <span className="text-sm text-gray-600">
                                    Questions based on your CV
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <BriefcaseBusiness
                                    size={18}
                                    className="text-green-600"
                                />

                                <span className="text-sm text-gray-600">
                                    Based on your skills and experience
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Target
                                    size={18}
                                    className="text-green-600"
                                />

                                <span className="text-sm text-gray-600">
                                    Personalized interview experience
                                </span>
                            </div>

                        </div>

                        <button
                            onClick={() => navigate("/interview/cv")}
                            className="mt-9 w-full h-12 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2 transition duration-300 shadow-md cursor-pointer"
                        >
                            Continue with CV
                            <ArrowRight size={18} />
                        </button>
                    </motion.div>

                    {/* ================= TOPIC WISE ================= */}

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 flex flex-col"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                            <Code2
                                size={32}
                                className="text-blue-600"
                            />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800">
                            Topic Wise Interview
                        </h2>

                        <p className="mt-3 text-gray-500 leading-relaxed">
                            Select a specific technical topic and difficulty level.
                            AI will generate interview questions specifically for
                            your selected topic.
                        </p>

                        <div className="mt-7 space-y-4">

                            <div className="flex items-center gap-3">
                                <Code2
                                    size={18}
                                    className="text-blue-600"
                                />

                                <span className="text-sm text-gray-600">
                                    Choose your preferred topic
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Target
                                    size={18}
                                    className="text-blue-600"
                                />

                                <span className="text-sm text-gray-600">
                                    Select difficulty level
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Sparkles
                                    size={18}
                                    className="text-blue-600"
                                />

                                <span className="text-sm text-gray-600">
                                    AI-generated questions
                                </span>
                            </div>

                        </div>

                        <button
                            onClick={() => navigate("/interview/topic")}
                            className="mt-9 w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition duration-300 shadow-md cursor-pointer"
                        >
                            Choose Topic
                            <ArrowRight size={18} />
                        </button>
                    </motion.div>

                </div>

            </div>
        </div>
    );
};

export default InterviewTemplate;
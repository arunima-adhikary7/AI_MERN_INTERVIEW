import React from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

const InterviewerPanel = ({
    avatar,
    isSpeaking,
    voiceEnabled,
    onToggleVoice,
    showAvatar,
    onToggleAvatar,
}) => {
    return (
        <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 mb-5">

            {/* =====================================================
                AI AVATAR / VOICE ONLY
            ===================================================== */}

            {showAvatar ? (
                <div className="w-full h-full flex flex-col items-center justify-center">

                    <div className="relative">

                        {/* Speaking glow */}
                        <motion.div
                            animate={
                                isSpeaking
                                    ? {
                                        scale: [1, 1.12, 1],
                                        opacity: [0.25, 0.5, 0.25],
                                    }
                                    : {
                                        scale: 1,
                                        opacity: 0.2,
                                    }
                            }
                            transition={{
                                duration: 1,
                                repeat: isSpeaking ? Infinity : 0,
                            }}
                            className="absolute inset-[-18px] rounded-full bg-green-400 blur-xl"
                        />

                        {/* Avatar */}
                        <motion.div
                            animate={
                                isSpeaking
                                    ? {
                                        y: [0, -2, 0],
                                    }
                                    : {
                                        y: 0,
                                    }
                            }
                            transition={{
                                duration: 0.8,
                                repeat: isSpeaking ? Infinity : 0,
                            }}
                            className="relative w-36 h-36 rounded-full bg-gradient-to-br from-slate-700 via-slate-800 to-black shadow-2xl ring-4 ring-white overflow-hidden"
                        >

                            {/* Hair */}
                            <div className="absolute top-0 left-5 right-5 h-14 bg-gray-950 rounded-b-[45%]" />

                            {/* Face */}
                            <div className="absolute top-7 left-1/2 -translate-x-1/2 w-24 h-28 rounded-[45%] bg-gradient-to-b from-amber-100 to-orange-200">

                                {/* Ears */}
                                <div className="absolute left-[-6px] top-12 w-4 h-8 rounded-full bg-orange-200" />

                                <div className="absolute right-[-6px] top-12 w-4 h-8 rounded-full bg-orange-200" />

                                {/* Eyebrows */}
                                <div className="absolute top-9 left-5 w-7 h-1 bg-gray-700 rounded-full rotate-[-5deg]" />

                                <div className="absolute top-9 right-5 w-7 h-1 bg-gray-700 rounded-full rotate-[5deg]" />

                                {/* Left Eye */}
                                <motion.div
                                    animate={
                                        isSpeaking
                                            ? {
                                                scaleY: [1, 0.2, 1],
                                            }
                                            : {
                                                scaleY: 1,
                                            }
                                    }
                                    transition={{
                                        duration: 0.25,
                                        repeat: isSpeaking ? Infinity : 0,
                                        repeatDelay: 2.5,
                                    }}
                                    className="absolute top-12 left-7 w-2.5 h-2.5 rounded-full bg-gray-900"
                                />

                                {/* Right Eye */}
                                <motion.div
                                    animate={
                                        isSpeaking
                                            ? {
                                                scaleY: [1, 0.2, 1],
                                            }
                                            : {
                                                scaleY: 1,
                                            }
                                    }
                                    transition={{
                                        duration: 0.25,
                                        repeat: isSpeaking ? Infinity : 0,
                                        repeatDelay: 2.5,
                                    }}
                                    className="absolute top-12 right-7 w-2.5 h-2.5 rounded-full bg-gray-900"
                                />

                                {/* Nose */}
                                <div className="absolute top-14 left-1/2 -translate-x-1/2 w-2 h-6 rounded-full bg-orange-300" />

                                {/* Mouth */}
                                <motion.div
                                    animate={
                                        isSpeaking
                                            ? {
                                                scaleY: [
                                                    0.5,
                                                    1.4,
                                                    0.7,
                                                    1.2,
                                                    0.5,
                                                ],
                                                width: [
                                                    18,
                                                    24,
                                                    14,
                                                    22,
                                                    18,
                                                ],
                                            }
                                            : {
                                                scaleY: 0.4,
                                                width: 18,
                                            }
                                    }
                                    transition={{
                                        duration: 0.45,
                                        repeat: isSpeaking ? Infinity : 0,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute bottom-7 left-1/2 -translate-x-1/2 h-2 rounded-full bg-gray-800"
                                />

                                {/* Neck */}
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-10 h-12 bg-orange-200" />

                            </div>

                            {/* Shirt */}
                            <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 w-36 h-20 rounded-t-[50%] bg-gradient-to-r from-blue-600 to-indigo-700" />

                        </motion.div>


                        {/* Speaking indicator */}
                        {isSpeaking && (
                            <motion.div
                                initial={{
                                    scale: 0,
                                    opacity: 0,
                                }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                }}
                                className="absolute -right-2 bottom-1 w-9 h-9 rounded-full bg-green-500 flex items-center justify-center shadow-lg ring-4 ring-white"
                            >
                                <Volume2
                                    size={17}
                                    className="text-white"
                                />
                            </motion.div>
                        )}

                    </div>


                    {/* Sound bars */}
                    <div className="flex items-center gap-1 h-7 mt-3">

                        {[1, 2, 3, 4, 5, 6, 7].map(
                            (bar) => (
                                <motion.div
                                    key={bar}
                                    className="w-1.5 rounded-full bg-green-500"
                                    animate={
                                        isSpeaking
                                            ? {
                                                height: [
                                                    6,
                                                    18,
                                                    10,
                                                    25,
                                                    12,
                                                    6,
                                                ],
                                            }
                                            : {
                                                height: 6,
                                            }
                                    }
                                    transition={{
                                        duration: 0.5,
                                        repeat: isSpeaking
                                            ? Infinity
                                            : 0,
                                        repeatType: "mirror",
                                        delay: bar * 0.06,
                                    }}
                                />
                            )
                        )}

                    </div>


                    <p className="text-sm font-semibold text-gray-700 mt-1">
                        AI Interviewer
                    </p>

                    <p className="text-xs text-gray-400">
                        {isSpeaking
                            ? "Speaking..."
                            : "Ready"}
                    </p>

                </div>

            ) : (

                /* =================================================
                   VOICE ONLY MODE
                ================================================= */

                <div className="w-full h-full flex flex-col items-center justify-center">

                    <motion.div
                        animate={
                            isSpeaking
                                ? {
                                    scale: [1, 1.05, 1],
                                }
                                : {
                                    scale: 1,
                                }
                        }
                        transition={{
                            duration: 0.8,
                            repeat: isSpeaking
                                ? Infinity
                                : 0,
                        }}
                        className="w-32 h-32 rounded-full bg-white shadow-sm flex items-center justify-center"
                    >

                        <div className="flex items-center justify-center gap-2 h-20">

                            {[1, 2, 3, 4, 5].map(
                                (bar) => (
                                    <motion.div
                                        key={bar}
                                        className="w-3 rounded-full bg-black"
                                        animate={
                                            isSpeaking
                                                ? {
                                                    height: [
                                                        18,
                                                        45,
                                                        25,
                                                        55,
                                                        20,
                                                    ],
                                                }
                                                : {
                                                    height: 18,
                                                }
                                        }
                                        transition={{
                                            duration: 0.55,
                                            repeat: isSpeaking
                                                ? Infinity
                                                : 0,
                                            repeatType:
                                                "mirror",
                                            delay:
                                                bar * 0.08,
                                            ease: "easeInOut",
                                        }}
                                    />
                                )
                            )}

                        </div>

                    </motion.div>

                    <p className="mt-4 text-sm font-semibold text-gray-700">
                        AI Interviewer
                    </p>

                    <p className="text-xs text-gray-400">
                        {isSpeaking
                            ? "Speaking..."
                            : "Voice Only"}
                    </p>

                </div>
            )}


            {/* =====================================================
                AVATAR TOGGLE
            ===================================================== */}

            <button
                type="button"
                onClick={onToggleAvatar}
                className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm border border-gray-200 px-3 py-2 shadow-md hover:shadow-lg transition"
            >
                <span className="text-xs font-medium text-gray-600">
                    Avatar
                </span>

                <span
                    className={`relative w-10 h-5 rounded-full transition-colors ${showAvatar
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                >
                    <motion.span
                        animate={{
                            x: showAvatar
                                ? 20
                                : 2,
                        }}
                        transition={{
                            duration: 0.2,
                        }}
                        className="absolute top-0.5 left-0 w-4 h-4 rounded-full bg-white shadow"
                    />
                </span>
            </button>


            {/* =====================================================
                VOICE TOGGLE
            ===================================================== */}

            <button
                type="button"
                onClick={onToggleVoice}
                className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm border border-gray-200 px-3 py-2 shadow-md hover:shadow-lg transition"
            >

                {voiceEnabled ? (
                    <Volume2
                        size={16}
                        className="text-green-600"
                    />
                ) : (
                    <VolumeX
                        size={16}
                        className="text-gray-400"
                    />
                )}

                <span
                    className={`text-xs font-medium ${voiceEnabled
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                >
                    Voice
                </span>

                <span
                    className={`relative w-10 h-5 rounded-full ${voiceEnabled
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                >
                    <motion.span
                        animate={{
                            x: voiceEnabled
                                ? 20
                                : 2,
                        }}
                        transition={{
                            duration: 0.2,
                        }}
                        className="absolute top-0.5 left-0 w-4 h-4 rounded-full bg-white shadow"
                    />
                </span>

            </button>

        </div>
    );
};

export default InterviewerPanel;
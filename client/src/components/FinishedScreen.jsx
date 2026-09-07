import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import ScoreCard from "./ScoreCard";

const FinishedScreen = ({
    finalResult,
    onGoHome,
}) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
            <motion.div
                initial={{
                    opacity: 0,
                    scale: 0.95,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                }}
                className="bg-white rounded-3xl shadow-xl p-10 max-w-xl w-full text-center"
            >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2
                        size={35}
                        className="text-green-600"
                    />
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                    Interview Completed
                </h1>

                <p className="text-gray-500 mb-8">
                    Your interview has been evaluated successfully.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <ScoreCard
                        title="Final Score"
                        value={finalResult?.finalScore ?? 0}
                    />

                    <ScoreCard
                        title="Confidence"
                        value={finalResult?.confidence ?? 0}
                    />

                    <ScoreCard
                        title="Communication"
                        value={finalResult?.communication ?? 0}
                    />

                    <ScoreCard
                        title="Correctness"
                        value={finalResult?.correctness ?? 0}
                    />
                </div>

                <button
                    onClick={onGoHome}
                    className="w-full rounded-xl bg-black py-3.5 font-semibold text-white hover:bg-gray-800"
                >
                    Go Home
                </button>
            </motion.div>
        </div>
    );
};

export default FinishedScreen;
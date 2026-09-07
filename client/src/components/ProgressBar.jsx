import React from "react";
import { motion } from "framer-motion";

const ProgressBar = ({
    currentQuestion,
    totalQuestions,
}) => {
    const progress =
        totalQuestions > 0
            ? ((currentQuestion + 1) /
                totalQuestions) *
            100
            : 0;

    return (
        <div className="mt-5">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Interview Progress</span>
                <span>{Math.round(progress)}%</span>
            </div>

            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    animate={{
                        width: `${progress}%`,
                    }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-green-500 rounded-full"
                />
            </div>
        </div>
    );
};

export default ProgressBar;
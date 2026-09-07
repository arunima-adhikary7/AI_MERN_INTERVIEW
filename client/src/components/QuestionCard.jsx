import React from "react";
import { motion } from "framer-motion";

const QuestionCard = ({
    currentQuestion,
    totalQuestions,
    question,
    difficulty,
}) => {
    return (
        <motion.div
            key={currentQuestion}
            initial={{
                opacity: 0,
                y: 10,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            className="border border-gray-200 rounded-2xl p-6 mb-5 shadow-sm"
        >
            <p className="text-sm text-gray-500 mb-3">
                Question {currentQuestion + 1} of{" "}
                {totalQuestions}
            </p>

            <h2 className="text-lg md:text-xl font-semibold text-gray-800 leading-relaxed">
                {question}
            </h2>

            {difficulty && (
                <span className="inline-block mt-4 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                    {difficulty}
                </span>
            )}
        </motion.div>
    );
};

export default QuestionCard;
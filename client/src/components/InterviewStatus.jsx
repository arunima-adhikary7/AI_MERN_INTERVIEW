import React from "react";
import { Clock3 } from "lucide-react";

const InterviewStatus = ({
    isPaused,
    timeLeft,
    currentQuestion,
    totalQuestions,
    currentQuestionTime,
}) => {
    const progress =
        currentQuestionTime > 0
            ? (264 * timeLeft) / currentQuestionTime
            : 0;

    return (
        <div className="border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                    Interview Status
                </p>

                <span
                    className={`flex items-center gap-1.5 text-xs font-medium ${isPaused
                            ? "text-amber-600"
                            : "text-green-600"
                        }`}
                >
                    <span
                        className={`w-2 h-2 rounded-full ${isPaused
                                ? "bg-amber-500"
                                : "bg-green-500 animate-pulse"
                            }`}
                    />

                    {isPaused ? "Paused" : "Live"}
                </span>
            </div>

            <div className="border-t border-gray-100 pt-6">
                <div className="flex justify-center mb-6">
                    <div className="relative w-28 h-28">
                        <svg
                            className="w-28 h-28 -rotate-90"
                            viewBox="0 0 100 100"
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r="42"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="7"
                                className="text-gray-200"
                            />

                            <circle
                                cx="50"
                                cy="50"
                                r="42"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="7"
                                strokeLinecap="round"
                                className="text-green-500"
                                strokeDasharray="264"
                                strokeDashoffset={264 - progress}
                            />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span
                                className={`text-2xl font-semibold ${timeLeft <= 10
                                        ? "text-red-500"
                                        : "text-gray-700"
                                    }`}
                            >
                                {timeLeft}s
                            </span>

                            <Clock3
                                size={14}
                                className="text-gray-400 mt-1"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-2xl font-bold text-green-600">
                            {currentQuestion + 1}
                        </p>

                        <p className="text-xs text-gray-500">
                            Current Question
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                            {totalQuestions}
                        </p>

                        <p className="text-xs text-gray-500">
                            Total Questions
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewStatus;
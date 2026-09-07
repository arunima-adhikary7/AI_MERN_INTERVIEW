import React from "react";
import { Pause, Play } from "lucide-react";

const InterviewHeader = ({
    userName,
    isPaused,
    onPauseResume,
    disabled,
}) => {
    return (
        <div className="px-8 pt-6 pb-3">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-green-700">
                        AI Smart Interview
                    </h1>

                    {userName && (
                        <p className="mt-1 text-sm text-gray-500">
                            Candidate: {userName}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={onPauseResume}
                    disabled={disabled}
                    className={`shrink-0 h-11 px-5 rounded-full font-semibold text-sm flex items-center gap-2 transition shadow-sm ${isPaused
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-gray-900 hover:bg-gray-800 text-white"
                        } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                    {isPaused ? <Play size={16} /> : <Pause size={16} />}
                    {isPaused ? "Resume Interview" : "Pause Interview"}
                </button>
            </div>
        </div>
    );
};

export default InterviewHeader;
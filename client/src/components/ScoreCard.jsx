import React from "react";

const ScoreCard = ({ title, value }) => {
    return (
        <div className="rounded-2xl bg-gray-50 p-5">
            <p className="text-xs text-gray-400">
                {title}
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
                {value}
            </p>
        </div>
    );
};

export default ScoreCard;
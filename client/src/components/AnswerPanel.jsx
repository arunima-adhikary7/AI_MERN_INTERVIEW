import React from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  Mic,
  MicOff,
  Send,
} from "lucide-react";

const AnswerPanel = ({
  answer,
  setAnswer,
  answerMode,
  setAnswerMode,
  voiceAnswerEnabled,
  toggleVoiceAnswer,
  isListening,
  feedback,
  submitting,
  finishing,
  isPaused,
  isLastQuestion,
  onSubmit,
}) => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="inline-flex rounded-xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setAnswerMode("text")}
            disabled={submitting || isPaused}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              answerMode === "text"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Type Answer
          </button>

          <button
            type="button"
            onClick={toggleVoiceAnswer}
            disabled={submitting || isPaused}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
              answerMode === "voice"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {voiceAnswerEnabled ? (
              <MicOff size={15} />
            ) : (
              <Mic size={15} />
            )}

            {voiceAnswerEnabled
              ? "Stop Voice Answer"
              : "Voice Answer"}
          </button>
        </div>

        {voiceAnswerEnabled && (
          <span
            className={`text-xs ${
              isListening
                ? "text-red-500"
                : "text-gray-400"
            }`}
          >
            {isListening
              ? "Listening..."
              : "Voice mode enabled"}
          </span>
        )}
      </div>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={submitting || isPaused}
        placeholder={
          answerMode === "voice"
            ? "Your spoken answer will appear here..."
            : "Type your answer here..."
        }
        className="w-full flex-1 min-h-[330px] resize-none bg-gray-50 border border-gray-200 rounded-2xl p-6 text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
      />

      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl bg-green-50 border border-green-100 p-4"
        >
          <p className="text-xs font-semibold text-green-600 uppercase">
            AI Feedback
          </p>

          <p className="mt-1 text-sm text-gray-700">
            {feedback}
          </p>
        </motion.div>
      )}

      <div className="flex items-center gap-3 mt-5">
        {voiceAnswerEnabled && (
          <div className="h-14 px-4 rounded-full flex items-center gap-2 border border-gray-200 bg-gray-50">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isListening
                  ? "bg-red-500 animate-pulse"
                  : "bg-gray-400"
              }`}
            />

            <span className="text-sm font-medium">
              {isListening
                ? "Listening"
                : "Voice On"}
            </span>
          </div>
        )}

        <button
          onClick={() => onSubmit(false)}
          disabled={
            submitting ||
            finishing ||
            isPaused
          }
          className="flex-1 h-14 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold flex items-center justify-center gap-2"
        >
          {submitting || finishing ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              {finishing
                ? "Finishing..."
                : "Evaluating..."}
            </>
          ) : (
            <>
              <Send size={18} />

              {isLastQuestion
                ? "Finish Interview"
                : "Submit Answer"}
            </>
          )}
        </button>
      </div>

      {isListening && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-red-500 mt-3"
        >
          Listening... speak your answer
        </motion.p>
      )}

      {!isListening && (
        <p className="text-center text-xs text-gray-400 mt-3">
          {voiceAnswerEnabled
            ? "Voice Answer is enabled for the entire interview."
            : "Type your answer or enable Voice Answer."}
        </p>
      )}
    </div>
  );
};

export default AnswerPanel;
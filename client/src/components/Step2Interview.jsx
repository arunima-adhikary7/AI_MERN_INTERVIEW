import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Mic,
  MicOff,
  Send,
  Clock3,
  CheckCircle2,
  Volume2,
  Loader2,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const Step2Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Data received from Step 1
  const interviewData = location.state;

  const {
    interviewId,
    userName,
    questions = [],
  } = interviewData || {};

  const TOTAL_QUESTIONS = questions.length;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const [feedback, setFeedback] = useState("");
  const [answers, setAnswers] = useState([]);

  const [finished, setFinished] = useState(false);
  const [finalResult, setFinalResult] = useState(null);

  const recognitionRef = useRef(null);

  // ---------------------------------------------------------
  // NO INTERVIEW DATA
  // ---------------------------------------------------------

  useEffect(() => {
    if (!interviewData || !interviewId || !questions.length) {
      navigate("/interview", { replace: true });
    }
  }, [interviewData, interviewId, questions.length, navigate]);

  // ---------------------------------------------------------
  // CURRENT QUESTION
  // ---------------------------------------------------------

  const currentQuestionData = questions[currentQuestion];

  const currentQuestionText =
    currentQuestionData?.question || "Loading question...";

  const currentQuestionTime =
    currentQuestionData?.timeLimit || 30;

  // ---------------------------------------------------------
  // RESET TIMER
  // ---------------------------------------------------------

  useEffect(() => {
    if (!currentQuestionData || finished) return;

    setTimeLeft(currentQuestionTime);
    setAnswer("");
    setFeedback("");
  }, [currentQuestion, currentQuestionTime, finished, currentQuestionData]);

  // ---------------------------------------------------------
  // TIMER
  // ---------------------------------------------------------

  useEffect(() => {
    if (finished || submitting || !currentQuestionData) return;

    if (timeLeft <= 0) {
      handleSubmitAnswer(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, finished, submitting, currentQuestionData]);

  // ---------------------------------------------------------
  // SPEECH RECOGNITION
  // ---------------------------------------------------------

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setAnswer((previous) => {
          const separator =
            previous.trim() ? " " : "";

          return (
            previous +
            separator +
            finalTranscript
          );
        });
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  // ---------------------------------------------------------
  // MICROPHONE
  // ---------------------------------------------------------

  const toggleMicrophone = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported. Please use Google Chrome."
      );
      return;
    }

    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Microphone error:", error);
      }
    }
  };

  // ---------------------------------------------------------
  // TEXT TO SPEECH
  // ---------------------------------------------------------

  const speakQuestion = () => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(
      currentQuestionText
    );

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onstart = () => {
      setIsSpeaking(true);
    };

    speech.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(speech);
  };

  // ---------------------------------------------------------
  // SUBMIT ANSWER
  // ---------------------------------------------------------

  const handleSubmitAnswer = async (automatic = false) => {
    if (submitting || finishing || !currentQuestionData) {
      return;
    }

    if (
      isListening &&
      recognitionRef.current
    ) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const trimmedAnswer = answer.trim();

    const timeTaken = currentQuestionTime - timeLeft;

    try {
      setSubmitting(true);

      const payload = {
        interviewId,
        questionIndex: currentQuestion,
        answer: trimmedAnswer,
        timeTaken,
      };

      // console.log(
      //   "Submitting answer:",
      //   payload
      // );

      const response = await axios.post(
        `${API_URL}/api/interview/submit-answer`,
        {
          interviewId,
          questionIndex: currentQuestion,
          answer: answer.trim(),
          timeTaken: currentQuestionTime - timeLeft,
        },
        {
          withCredentials: true,
        }
      );

      // console.log(
      //   "Submit answer response:",
      //   response.data
      // );

      const newAnswer = {
        questionNumber: currentQuestion + 1,
        question: currentQuestionText,
        answer: trimmedAnswer,
        timeTaken,
        automaticallySubmitted: automatic,
        feedback: response.data.feedback || "",
      };

      const updatedAnswers = [
        ...answers,
        newAnswer,
      ];

      setAnswers(updatedAnswers);

      setFeedback(
        response.data.feedback || ""
      );

      // -----------------------------------------------------
      // LAST QUESTION
      // -----------------------------------------------------

      if (
        currentQuestion ===
        TOTAL_QUESTIONS - 1
      ) {
        await finishInterview();
        return;
      }

      // -----------------------------------------------------
      // NEXT QUESTION
      // -----------------------------------------------------

      setCurrentQuestion(
        (previous) => previous + 1
      );
    } catch (error) {
      console.error(
        "Submit answer failed:",
        error.response?.data || error.message
      );

      // alert(
      //   error.response?.data?.message ||
      //   "Failed to submit answer."
      // );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------
  // FINISH INTERVIEW
  // ---------------------------------------------------------

  const finishInterview = async () => {
    try {
      setFinishing(true);

      const response = await axios.post(
        `${API_URL}/api/interview/finish`,
        {
          interviewId,
        },
        {
          withCredentials: true,
        }
      );

      // console.log(
      //   "Final interview result:",
      //   response.data
      // );

      setFinalResult(response.data);
      navigate("/3", {
        state: {
          interviewId,
        },
      });
      setFinished(true);

    } catch (error) {
      console.error(
        "Finish interview failed:",
        error.response?.data || error.message
      );

      // alert(
      //   error.response?.data?.message ||
      //   "Failed to finish interview."
      // );
    } finally {
      setFinishing(false);
    }
  };

  // ---------------------------------------------------------
  // FORMAT TIME
  // ---------------------------------------------------------

  const formatTime = (seconds) => {
    return `${seconds}s`;
  };

  // ---------------------------------------------------------
  // PROGRESS
  // ---------------------------------------------------------

  const progress =
    TOTAL_QUESTIONS > 0
      ? ((currentQuestion + 1) /
        TOTAL_QUESTIONS) *
      100
      : 0;

  // ---------------------------------------------------------
  // FINISHED SCREEN
  // ---------------------------------------------------------

  if (finished) {
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

          {/* Final Score */}
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
            onClick={() => navigate("/")}
            className="w-full rounded-xl bg-black py-3.5 font-semibold text-white hover:bg-gray-800"
          >
            Go Home
          </button>
        </motion.div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // MAIN
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="px-8 pt-6 pb-3">
          <h1 className="text-xl md:text-2xl font-bold text-green-700">
            AI Smart Interview
          </h1>

          {userName && (
            <p className="mt-1 text-sm text-gray-500">
              Candidate: {userName}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-[420px_1fr] min-h-[720px]">

          {/* LEFT */}
          <div className="border-r border-gray-100 p-6">

            {/* AI VIDEO */}
            <div className="w-full h-64 rounded-2xl overflow-hidden bg-gray-100 mb-5">
              <video
                src="/Videos/female-ai.mp4"
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>

            {/* STATUS */}
            <div className="border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  Interview Status
                </p>

                <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live
                </span>
              </div>

              <div className="border-t border-gray-100 pt-6">

                {/* TIMER */}
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
                        strokeDashoffset={
                          264 -
                          (264 * timeLeft) /
                          currentQuestionTime
                        }
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span
                        className={`text-2xl font-semibold ${timeLeft <= 10
                            ? "text-red-500"
                            : "text-gray-700"
                          }`}
                      >
                        {formatTime(timeLeft)}
                      </span>

                      <Clock3
                        size={14}
                        className="text-gray-400 mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* QUESTION COUNT */}
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
                      {TOTAL_QUESTIONS}
                    </p>

                    <p className="text-xs text-gray-500">
                      Total Questions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PROGRESS */}
            <div className="mt-5">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>
                  Interview Progress
                </span>

                <span>
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  animate={{
                    width: `${progress}%`,
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                  className="h-full bg-green-500 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="p-6 md:p-8 flex flex-col">

            {/* QUESTION */}
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
              <div className="flex items-center justify-between mb-3">

                <p className="text-sm text-gray-500">
                  Question{" "}
                  {currentQuestion + 1} of{" "}
                  {TOTAL_QUESTIONS}
                </p>

                <button
                  onClick={speakQuestion}
                  disabled={submitting}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition ${isSpeaking
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-600"
                    }`}
                >
                  <Volume2 size={17} />
                </button>
              </div>

              <h2 className="text-lg md:text-xl font-semibold text-gray-800 leading-relaxed">
                {currentQuestionText}
              </h2>

              {/* Difficulty */}
              {currentQuestionData?.difficulty && (
                <span className="inline-block mt-4 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                  {currentQuestionData.difficulty}
                </span>
              )}
            </motion.div>

            {/* ANSWER */}
            <div className="flex-1 flex flex-col">

              <textarea
                value={answer}
                onChange={(e) =>
                  setAnswer(e.target.value)
                }
                disabled={submitting}
                placeholder="Type your answer here..."
                className="w-full flex-1 min-h-[330px] resize-none bg-gray-50 border border-gray-200 rounded-2xl p-6 text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
              />

              {/* FEEDBACK */}
              {feedback && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
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

              {/* BUTTONS */}
              <div className="flex items-center gap-3 mt-5">

                {/* MICROPHONE */}
                <button
                  onClick={toggleMicrophone}
                  disabled={submitting}
                  className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center text-white shadow-md transition ${isListening
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-black hover:bg-gray-800"
                    }`}
                >
                  {isListening ? (
                    <MicOff size={21} />
                  ) : (
                    <Mic size={21} />
                  )}
                </button>

                {/* SUBMIT */}
                <button
                  onClick={() =>
                    handleSubmitAnswer(false)
                  }
                  disabled={
                    submitting ||
                    finishing
                  }
                  className="flex-1 h-14 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold shadow-md transition flex items-center justify-center gap-2"
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

                      {currentQuestion ===
                        TOTAL_QUESTIONS - 1
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
                  Type your answer or use the microphone.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function ScoreCard({ title, value }) {
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
}

export default Step2Interview;
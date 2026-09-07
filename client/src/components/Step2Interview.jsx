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
  VolumeX,
  Loader2,
  Pause,
  Play,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;


// =========================================================
// AVATAR SELECTION
// Same avatar remains throughout one interview
// =========================================================

const getAvatarStyle = (topic = "", difficulty = "") => {
  const value = `${topic}-${difficulty}`.toLowerCase();

  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }

  const avatarNumber = Math.abs(hash) % 4;

  const avatars = [
    {
      gradient: "from-blue-500 to-indigo-600",
      ring: "ring-blue-200",
      glow: "bg-blue-400",
    },
    {
      gradient: "from-purple-500 to-violet-600",
      ring: "ring-purple-200",
      glow: "bg-purple-400",
    },
    {
      gradient: "from-emerald-500 to-teal-600",
      ring: "ring-emerald-200",
      glow: "bg-emerald-400",
    },
    {
      gradient: "from-orange-500 to-rose-600",
      ring: "ring-orange-200",
      glow: "bg-orange-400",
    },
  ];

  return avatars[avatarNumber];
};


const Step2Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // =========================================================
  // DATA RECEIVED FROM STEP 1
  // =========================================================

  const interviewData = location.state;

  const {
    interviewId,
    userName,
    questions = [],

    // New
    interviewerMode = "voice",
  } = interviewData || {};


  const interviewTopic =
    interviewData?.topic ||
    interviewData?.role ||
    "General";


  const interviewDifficulty =
    interviewData?.difficulty ||
    interviewData?.experience ||
    "Intermediate";


  // Avatar is selected ONCE using topic + difficulty
  const avatar = getAvatarStyle(
    interviewTopic,
    interviewDifficulty
  );


  const TOTAL_QUESTIONS = questions.length;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Master voice control for the whole interview
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Candidate answer input mode
  const [answerMode, setAnswerMode] = useState("text");

  const [submitting, setSubmitting] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const [feedback, setFeedback] = useState("");
  const [answers, setAnswers] = useState([]);

  const [finished, setFinished] = useState(false);
  const [finalResult, setFinalResult] = useState(null);

  // Pause/resume interview without losing the current question or time.
  const [isPaused, setIsPaused] = useState(false);

  const recognitionRef = useRef(null);
  const voiceTextRef = useRef("");
  const pausedRef = useRef(false);
  const submittingRef = useRef(false);
  const pausedDuringSpeakingRef = useRef(false);
  const [voiceAnswerEnabled, setVoiceAnswerEnabled] = useState(false);


  // =========================================================
  // NO INTERVIEW DATA
  // =========================================================

  // useEffect(() => {
  //   if (!interviewData || !interviewId || !questions.length) {
  //     navigate("/interview", { replace: true });
  //   }
  // }, [
  //   interviewData,
  //   interviewId,
  //   questions.length,
  //   navigate,
  // ]);


  // =========================================================
  // CURRENT QUESTION
  // =========================================================

  const currentQuestionData = questions[currentQuestion];

  const currentQuestionText =
    currentQuestionData?.question ||
    "Loading question...";

  const currentQuestionTime =
    currentQuestionData?.timeLimit || 30;


  // =========================================================
  // RESET TIMER / QUESTION
  // =========================================================

  useEffect(() => {
    if (!currentQuestionData || finished) return;

    // Stop question speech when question changes
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);

    setTimeLeft(currentQuestionTime);
    setAnswer("");
    setFeedback("");
    voiceTextRef.current = "";

  }, [
    currentQuestion,
    currentQuestionTime,
    finished,
    currentQuestionData,
  ]);


  // =========================================================
  // TIMER
  // =========================================================

  useEffect(() => {
    if (
      finished ||
      submitting ||
      isPaused ||
      !currentQuestionData
    ) {
      return;
    }

    if (timeLeft <= 0) {
      handleSubmitAnswer(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);

  }, [
    timeLeft,
    finished,
    submitting,
    isPaused,
    currentQuestionData,
  ]);


  // =========================================================
  // VOICE TO TEXT
  // =========================================================

  // =========================================================
  // VOICE TO TEXT
  // =========================================================

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("[Speech] Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      console.log("[Speech] Listening");
    };

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }

      // Save confirmed speech
      if (finalText.trim()) {
        voiceTextRef.current =
          `${voiceTextRef.current} ${finalText}`.trim();
      }

      // Show confirmed + currently spoken text
      const displayText =
        `${voiceTextRef.current} ${interimText}`.trim();

      setAnswer(displayText);

      console.log("[Speech] TEXT:", displayText);
    };

    recognition.onerror = (event) => {
      console.error("[Speech] Error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (_) { }

      recognitionRef.current = null;
    };
  }, []);


  const startVoiceAnswer = () => {
    if (!recognitionRef.current) return;
    if (pausedRef.current || submittingRef.current) return;

    setAnswerMode("voice");
    setVoiceAnswerEnabled(true);

    // Keep already typed/spoken answer
    voiceTextRef.current = answer.trim();

    try {
      recognitionRef.current.start();
    } catch (_) {
      // Already running
    }
  };


  const stopVoiceAnswer = () => {
    setVoiceAnswerEnabled(false);
    setIsListening(false);

    try {
      recognitionRef.current?.stop();
    } catch (_) { }
  };


  const toggleVoiceAnswer = () => {
    if (voiceAnswerEnabled) {
      stopVoiceAnswer();
    } else {
      startVoiceAnswer();
    }
  };

  // =========================================================
  // TEXT TO SPEECH
  // =========================================================

  const speakQuestion = () => {
    if (!voiceEnabled) return;
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    stopVoiceAnswer();

    const speech = new SpeechSynthesisUtterance(currentQuestionText);
    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onstart = () => {
      setIsSpeaking(true);
      stopVoiceAnswer();
    };

    const resumeRecognition = () => {
      setIsSpeaking(false);

      if (
        !voiceAnswerEnabled ||
        submittingRef.current ||
        finished ||
        pausedRef.current
      ) {
        return;
      }

      setTimeout(() => {
        if (
          voiceAnswerEnabled &&
          !submittingRef.current &&
          !finished &&
          !pausedRef.current
        ) {
          startVoiceAnswer();
        }
      }, 300);
    };

    speech.onend = resumeRecognition;
    speech.onerror = resumeRecognition;

    window.speechSynthesis.speak(speech);
  };

  // Read each new question automatically while Voice is ON.
  useEffect(() => {
    if (!currentQuestionData || finished || isPaused) return;

    stopVoiceAnswer();

    if (!voiceEnabled) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }

    const timer = setTimeout(() => {
      speakQuestion();
    }, 350);

    return () => clearTimeout(timer);
  }, [currentQuestion, voiceEnabled, finished]);

  // =========================================================
  // PAUSE / RESUME INTERVIEW
  // =========================================================

  const pauseInterview = () => {
    if (finished || submitting || finishing || isPaused) return;

    pausedDuringSpeakingRef.current =
      isSpeaking || window.speechSynthesis?.speaking === true;

    pausedRef.current = true;
    setIsPaused(true);

    stopVoiceAnswer();

    try {
      window.speechSynthesis?.cancel();
    } catch (_) { }

    setIsSpeaking(false);
    setIsListening(false);
  };

  const resumeInterview = () => {
    if (finished || submitting || finishing || !isPaused) return;

    pausedRef.current = false;
    setIsPaused(false);

    // If the interview was paused while the AI was asking the question,
    // replay the question before opening the microphone.
    if (pausedDuringSpeakingRef.current && voiceEnabled) {
      pausedDuringSpeakingRef.current = false;
      setTimeout(() => {
        if (!pausedRef.current && !finished) {
          speakQuestion();
        }
      }, 150);
      return;
    }

    pausedDuringSpeakingRef.current = false;

    if (voiceAnswerEnabled && answerMode === "voice") {
      setTimeout(() => {
        if (!pausedRef.current && !finished) {
          startVoiceAnswer();
        }
      }, 150);
    }
  };

  // =========================================================
  // SUBMIT ANSWER
  // =========================================================

  const handleSubmitAnswer = async (
    automatic = false
  ) => {

    if (
      submitting ||
      finishing ||
      !currentQuestionData
    ) {
      return;
    }

    submittingRef.current = true;
    stopVoiceAnswer();

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const trimmedAnswer =
      answer.trim();

    const timeTaken =
      currentQuestionTime - timeLeft;

    try {

      setSubmitting(true);

      const response = await axios.post(
        `${API_URL}/api/interview/submit-answer`,
        {
          interviewId,
          questionIndex: currentQuestion,
          answer: answer.trim(),
          timeTaken:
            currentQuestionTime - timeLeft,
        },
        {
          withCredentials: true,
        }
      );

      const newAnswer = {
        questionNumber:
          currentQuestion + 1,

        question:
          currentQuestionText,

        answer:
          trimmedAnswer,

        timeTaken,

        automaticallySubmitted:
          automatic,

        feedback:
          response.data.feedback || "",
      };

      const updatedAnswers = [
        ...answers,
        newAnswer,
      ];

      setAnswers(updatedAnswers);

      setFeedback(
        response.data.feedback || ""
      );


      // =====================================================
      // LAST QUESTION
      // =====================================================

      if (
        currentQuestion ===
        TOTAL_QUESTIONS - 1
      ) {
        await finishInterview();
        return;
      }


      // =====================================================
      // NEXT QUESTION
      // =====================================================

      setCurrentQuestion(
        (previous) => previous + 1
      );

    } catch (error) {

      console.error(
        "Submit answer failed:",
        error.response?.data ||
        error.message
      );

    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };


  // =========================================================
  // FINISH INTERVIEW
  // =========================================================

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

      setFinalResult(
        response.data
      );

      navigate("/3", {
        state: {
          interviewId,
        },
      });

      setFinished(true);

    } catch (error) {

      console.error(
        "Finish interview failed:",
        error.response?.data ||
        error.message
      );

    } finally {

      setFinishing(false);

    }
  };


  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (seconds) => {
    return `${seconds}s`;
  };


  // =========================================================
  // PROGRESS
  // =========================================================

  const progress =
    TOTAL_QUESTIONS > 0
      ? ((currentQuestion + 1) /
        TOTAL_QUESTIONS) *
      100
      : 0;


  // =========================================================
  // FINISHED SCREEN
  // =========================================================

  useEffect(() => {
    if (!finished) return;

    stopVoiceAnswer();

    try {
      window.speechSynthesis?.cancel();
    } catch (error) {
      // Ignore cleanup errors.
    }
  }, [finished]);

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

          <div className="grid grid-cols-2 gap-4 mb-6">

            <ScoreCard
              title="Final Score"
              value={
                finalResult?.finalScore ?? 0
              }
            />

            <ScoreCard
              title="Confidence"
              value={
                finalResult?.confidence ?? 0
              }
            />

            <ScoreCard
              title="Communication"
              value={
                finalResult?.communication ?? 0
              }
            />

            <ScoreCard
              title="Correctness"
              value={
                finalResult?.correctness ?? 0
              }
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


  // =========================================================
  // MAIN
  // =========================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-6 flex items-center justify-center">

      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden">

        {isPaused && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-center gap-2 text-sm text-amber-800 font-medium">
            <Pause size={15} />
            Interview paused. Your current question and remaining time are preserved.
          </div>
        )}

        {/* HEADER */}

        <div className="px-8 pt-6 pb-3">

          <h1 className="text-xl md:text-2xl font-bold text-green-700">
            AI Smart Interview
          </h1>

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
              onClick={isPaused ? resumeInterview : pauseInterview}
              disabled={submitting || finishing || finished}
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


        <div className="grid lg:grid-cols-[420px_1fr] min-h-[720px]">


          {/* =====================================================
              LEFT
          ===================================================== */}

          <div className="border-r border-gray-100 p-6">


            {/* =================================================
                AI INTERVIEWER
            ================================================= */}

            <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-gray-100 mb-5">

              {interviewerMode === "avatar" ? (

                /* =================================================
                   AVATAR MODE
                ================================================= */

                <div className="w-full h-full flex flex-col items-center justify-center">

                  {/* Avatar circle */}

                  <div className="relative">

                    <motion.div
                      animate={
                        isSpeaking
                          ? {
                            scale: [
                              1,
                              1.03,
                              1,
                            ],
                          }
                          : {
                            scale: 1,
                          }
                      }
                      transition={{
                        duration: 0.8,
                        repeat:
                          isSpeaking
                            ? Infinity
                            : 0,
                      }}
                      className={`
                        w-32
                        h-32
                        rounded-full
                        bg-gradient-to-br
                        ${avatar.gradient}
                        ring-8
                        ${avatar.ring}
                        shadow-lg
                        flex
                        items-center
                        justify-center
                      `}
                    >

                      {/* Simple professional avatar icon */}

                      <div className="relative">

                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">

                          <div className="flex gap-3">

                            <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />

                            <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />

                          </div>

                        </div>

                        <motion.div
                          animate={
                            isSpeaking
                              ? {
                                width: [
                                  18,
                                  28,
                                  12,
                                  24,
                                ],
                              }
                              : {
                                width: 18,
                              }
                          }
                          transition={{
                            duration: 0.35,
                            repeat:
                              isSpeaking
                                ? Infinity
                                : 0,
                          }}
                          className="absolute left-1/2 -translate-x-1/2 bottom-3 h-1.5 rounded-full bg-gray-600"
                        />

                      </div>

                    </motion.div>


                    {/* Speaking indicator */}

                    {isSpeaking && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          scale: 0.8,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        className={`
                          absolute
                          -right-2
                          -bottom-1
                          w-9
                          h-9
                          rounded-full
                          ${avatar.glow}
                          flex
                          items-center
                          justify-center
                          shadow-md
                        `}
                      >
                        <Volume2
                          size={17}
                          className="text-white"
                        />
                      </motion.div>
                    )}

                  </div>


                  {/* Sound bars */}

                  <div className="flex items-center gap-1 h-7 mt-5">

                    {[1, 2, 3, 4, 5, 6, 7].map(
                      (bar) => (
                        <motion.div
                          key={bar}
                          className="w-1.5 rounded-full bg-green-500"
                          animate={
                            isSpeaking
                              ? {
                                height: [
                                  7,
                                  20,
                                  10,
                                  27,
                                  12,
                                  7,
                                ],
                              }
                              : {
                                height: 7,
                              }
                          }
                          transition={{
                            duration: 0.55,
                            repeat:
                              isSpeaking
                                ? Infinity
                                : 0,
                            repeatType:
                              "mirror",
                            delay:
                              bar * 0.06,
                          }}
                        />
                      )
                    )}

                  </div>


                  <p className="text-sm font-semibold text-gray-700 mt-2">
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
                          scale: [
                            1,
                            1.04,
                            1,
                          ],
                        }
                        : {
                          scale: 1,
                        }
                    }
                    transition={{
                      duration: 0.8,
                      repeat:
                        isSpeaking
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
                              repeat:
                                isSpeaking
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

              {/* MASTER QUESTION VOICE TOGGLE */}

              <button
                type="button"
                onClick={() => {
                  const nextValue = !voiceEnabled;
                  setVoiceEnabled(nextValue);

                  if (!nextValue) {
                    window.speechSynthesis?.cancel();
                    setIsSpeaking(false);
                  }
                }}
                className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm border border-gray-200 px-3 py-2 shadow-md hover:shadow-lg transition"
                title={
                  voiceEnabled
                    ? "Turn question voice off"
                    : "Turn question voice on"
                }
              >
                {voiceEnabled ? (
                  <Volume2 size={16} className="text-green-600" />
                ) : (
                  <VolumeX size={16} className="text-gray-400" />
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
                  className={`relative w-10 h-5 rounded-full transition-colors ${voiceEnabled ? "bg-green-500" : "bg-gray-300"
                    }`}
                >
                  <motion.span
                    animate={{ x: voiceEnabled ? 20 : 2 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-0.5 left-0 w-4 h-4 rounded-full bg-white shadow"
                  />
                </span>
              </button>

            </div>


            {/* =================================================
                STATUS
            ================================================= */}

            <div className="border border-gray-200 rounded-2xl p-6 shadow-sm">

              <div className="flex items-center justify-between mb-4">

                <p className="text-sm text-gray-500">
                  Interview Status
                </p>

                <span className={`flex items-center gap-1.5 text-xs font-medium ${isPaused ? "text-amber-600" : "text-green-600"
                  }`}>

                  <span className={`w-2 h-2 rounded-full ${isPaused ? "bg-amber-500" : "bg-green-500 animate-pulse"
                    }`} />

                  {isPaused ? "Paused" : "Live"}

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


            {/* =================================================
                PROGRESS
            ================================================= */}

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


          {/* =====================================================
              RIGHT
          ===================================================== */}

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


                {/* Question voice is controlled by the left-side master switch. */}
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

              {/* ANSWER INPUT MODE */}

              <div className="flex items-center justify-between mb-3">

                <div className="inline-flex rounded-xl bg-gray-100 p-1">

                  <button
                    type="button"
                    onClick={() => {
                      stopVoiceAnswer();
                      setAnswerMode("text");
                    }}
                    disabled={submitting || isPaused}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${answerMode === "text"
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
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${answerMode === "voice"
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
                    className={`text-xs font-medium ${isListening
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


                {voiceAnswerEnabled && (
                  <div
                    className={`h-14 px-4 shrink-0 rounded-full flex items-center gap-2 border ${isListening
                      ? "border-red-200 bg-red-50 text-red-600"
                      : "border-gray-200 bg-gray-50 text-gray-500"
                      }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${isListening
                        ? "bg-red-500 animate-pulse"
                        : "bg-gray-400"
                        }`}
                    />
                    <span className="text-sm font-medium">
                      {isListening ? "Listening" : "Voice On"}
                    </span>
                  </div>
                )}

                {/* SUBMIT */}

                <button
                  onClick={() =>
                    handleSubmitAnswer(false)
                  }
                  disabled={
                    submitting ||
                    finishing ||
                    isPaused
                  }
                  className="flex-1 h-14 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold shadow-md transition flex items-center justify-center gap-2"
                >

                  {submitting ||
                    finishing ? (
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
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
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

          </div>

        </div>

      </div>

    </div>
  );
};


// =========================================================
// SCORE CARD
// =========================================================

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
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Send,
  Clock3,
  CheckCircle2,
  Volume2,
} from "lucide-react";

const Step2Interview = ({ interviewData, onComplete }) => {
  // =========================================================
  // DATA RECEIVED FROM STEP 1
  // =========================================================

  const {
    role = "",
    experience = "",
    interviewType = "Technical Interview",
    projects = [],
    skills = [],
  } = interviewData || {};

  // =========================================================
  // INTERVIEW SETTINGS
  // =========================================================

  const TOTAL_QUESTIONS = 5;
  const QUESTION_TIME = 30;

  // =========================================================
  // STATE
  // =========================================================

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answer, setAnswer] = useState("");

  const [timeLeft, setTimeLeft] =
    useState(QUESTION_TIME);

  const [isListening, setIsListening] =
    useState(false);

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const [answers, setAnswers] = useState([]);

  const [finished, setFinished] =
    useState(false);

  const recognitionRef = useRef(null);

  // =========================================================
  // GENERATE QUESTIONS
  // =========================================================

  const generateQuestions = () => {
    const firstProject =
      projects.length > 0
        ? projects[0]
        : "one of your projects";

    const firstSkill =
      skills.length > 0
        ? skills[0]
        : "your technical skills";

    const secondSkill =
      skills.length > 1
        ? skills[1]
        : firstSkill;

    // =======================================================
    // HR INTERVIEW
    // =======================================================

    if (interviewType === "HR Interview") {
      return [
        `Can you tell me about yourself and why you want to work as a ${role}?`,

        `Why are you interested in the ${role} position at our company?`,

        `Tell me about a challenge you faced while working on ${firstProject} and how you handled it.`,

        `What are your strengths and how will they help you succeed as a ${role}?`,

        `Where do you see yourself growing in the next few years?`,
      ];
    }

    // =======================================================
    // BEHAVIORAL INTERVIEW
    // =======================================================

    if (interviewType === "Behavioral Interview") {
      return [
        `Tell me about a difficult problem you solved while working as a ${role}.`,

        `Tell me about a time when you had to learn something quickly.`,

        `Describe a situation where you made a mistake in a project and how you fixed it.`,

        `Tell me about a time you worked with a team to complete a project.`,

        `How do you handle pressure when you have an important deadline?`,
      ];
    }

    // =======================================================
    // MIXED INTERVIEW
    // =======================================================

    if (interviewType === "Mixed Interview") {
      return [
        `Can you tell me about yourself and why you want to become a ${role}?`,

        `Explain how you used ${firstSkill} in ${firstProject}.`,

        `What was the most difficult technical problem you faced in ${firstProject}?`,

        `How would you improve ${firstProject} if you had more time?`,

        `What are your strongest technical skills, especially ${secondSkill}, and how have you applied them?`,
      ];
    }

    // =======================================================
    // TECHNICAL INTERVIEW
    // =======================================================

    return [
      `Can you explain your experience as a ${role} and the technologies you are most comfortable with?`,

      `Can you explain how you used ${firstSkill} in ${firstProject}?`,

      `What was the biggest technical challenge you faced while working on ${firstProject}, and how did you solve it?`,

      `How would you improve the architecture, performance, or scalability of ${firstProject}?`,

      `Can you explain the difference between ${firstSkill} and ${secondSkill}, and when you would use each one?`,
    ];
  };

  const questions = generateQuestions();

  const currentQuestionText =
    questions[currentQuestion];

  // =========================================================
  // TIMER
  // =========================================================

  useEffect(() => {
    if (finished) return;

    if (timeLeft <= 0) {
      handleSubmitAnswer(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, finished]);

  // =========================================================
  // RESET TIMER WHEN QUESTION CHANGES
  // =========================================================

  useEffect(() => {
    setTimeLeft(QUESTION_TIME);
    setAnswer("");
  }, [currentQuestion]);

  // =========================================================
  // SPEECH RECOGNITION
  // =========================================================

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition =
      new SpeechRecognition();

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
      console.error(
        "Speech recognition error:",
        event.error
      );

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
            previous.trim().length > 0
              ? " "
              : "";

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

  // =========================================================
  // MICROPHONE
  // =========================================================

  const toggleMicrophone = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser. Please use Google Chrome."
      );

      return;
    }

    if (!recognitionRef.current) {
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.log(
          "Microphone error:",
          error
        );
      }
    }
  };

  // =========================================================
  // TEXT TO SPEECH
  // =========================================================

  const speakQuestion = () => {
    if (!window.speechSynthesis) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(
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

  // =========================================================
  // SUBMIT ANSWER
  // =========================================================

  const handleSubmitAnswer = (automatic = false) => {
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

    const newAnswer = {
      questionNumber: currentQuestion + 1,
      question: currentQuestionText,
      answer: answer.trim(),
      timeUsed:
        QUESTION_TIME - timeLeft,
      automaticallySubmitted:
        automatic,
    };

    const updatedAnswers = [
      ...answers,
      newAnswer,
    ];

    setAnswers(updatedAnswers);

    // =======================================================
    // LAST QUESTION
    // =======================================================

    if (
      currentQuestion ===
      TOTAL_QUESTIONS - 1
    ) {
      setFinished(true);

      if (onComplete) {
        onComplete({
          role,
          experience,
          interviewType,
          projects,
          skills,
          answers: updatedAnswers,
        });
      }

      return;
    }

    // =======================================================
    // NEXT QUESTION
    // =======================================================

    setCurrentQuestion(
      (previous) => previous + 1
    );
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
    ((currentQuestion + 1) /
      TOTAL_QUESTIONS) *
    100;

  // =========================================================
  // FINISHED SCREEN
  // =========================================================

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
          className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center"
        >

          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2
              size={35}
              className="text-green-600"
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Interview Completed!
          </h1>

          <p className="text-gray-500 mb-6">
            Great job! Your interview has been
            completed successfully.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 text-left">

            <p className="text-sm text-gray-500">
              Role
            </p>

            <p className="font-semibold text-gray-800 mb-3">
              {role}
            </p>

            <p className="text-sm text-gray-500">
              Questions Answered
            </p>

            <p className="font-semibold text-gray-800">
              {answers.length} /{" "}
              {TOTAL_QUESTIONS}
            </p>

          </div>

        </motion.div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-6 flex items-center justify-center">

      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="px-8 pt-6 pb-3">

          <h1 className="text-xl md:text-2xl font-bold text-green-700">
            AI Smart Interview
          </h1>

        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid lg:grid-cols-[420px_1fr] min-h-[720px]">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="border-r border-gray-100 p-6">

            {/* =================================================
                AI FEMALE VIDEO
            ================================================= */}

            <div className="w-full h-64 rounded-2xl overflow-hidden bg-gray-100 mb-5">

   <div className="w-full h-64 rounded-2xl overflow-hidden bg-gray-100 mb-5">
<video
  src="../public/Videos/female-ai.mp4"
  className="w-full h-full object-cover"
  autoPlay
  loop
  muted
  playsInline
/>
</div>
            </div>

            {/* =================================================
                INTERVIEW STATUS
            ================================================= */}

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
                          (264 *
                            timeLeft) /
                            QUESTION_TIME
                        }
                      />

                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">

                      <span
                        className={`text-2xl font-semibold ${
                          timeLeft <= 10
                            ? "text-red-500"
                            : "text-gray-700"
                        }`}
                      >
                        {formatTime(
                          timeLeft
                        )}
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
                  initial={{
                    width: 0,
                  }}
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

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="p-6 md:p-8 flex flex-col">

            {/* =================================================
                QUESTION
            ================================================= */}

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

                {/* SPEAK QUESTION */}

                <button
                  onClick={speakQuestion}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                    isSpeaking
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-600"
                  }`}
                  title="Read question aloud"
                >

                  <Volume2 size={17} />

                </button>

              </div>

              <h2 className="text-lg md:text-xl font-semibold text-gray-800 leading-relaxed">
                {currentQuestionText}
              </h2>

            </motion.div>

            {/* =================================================
                ANSWER
            ================================================= */}

            <div className="flex-1 flex flex-col">

              <textarea
                value={answer}
                onChange={(e) =>
                  setAnswer(e.target.value)
                }
                placeholder="Type your answer here..."
                className="w-full flex-1 min-h-[330px] resize-none bg-gray-50 border border-gray-200 rounded-2xl p-6 text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
              />

              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="flex items-center gap-3 mt-5">

                {/* MICROPHONE */}

                <button
                  onClick={
                    toggleMicrophone
                  }
                  className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center text-white shadow-md transition ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-black hover:bg-gray-800"
                  }`}
                  title={
                    isListening
                      ? "Stop recording"
                      : "Start voice input"
                  }
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
                  className="flex-1 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold shadow-md transition flex items-center justify-center gap-2"
                >

                  <Send size={18} />

                  {currentQuestion ===
                  TOTAL_QUESTIONS - 1
                    ? "Finish Interview"
                    : "Submit Answer"}

                </button>

              </div>

              {/* =================================================
                  MICROPHONE STATUS
              ================================================= */}

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
                  You can type your answer or use the
                  microphone to speak.
                </p>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Step2Interview;
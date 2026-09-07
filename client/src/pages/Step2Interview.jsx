import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import { speakWithElevenLabs, stopElevenLabsSpeech } from "../services/elevenLabsSpeech"; 
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import InterviewHeader from "../components/InterviewHeader";
import InterviewerPanel from "../components/InterviewerPanel";
import InterviewStatus from "../components/InterviewStatus";
import ProgressBar from "../components/ProgressBar";
import QuestionCard from "../components/QuestionCard";
import AnswerPanel from "../components/AnswerPanel";
import FinishedScreen from "../components/FinishedScreen";

const API_URL = import.meta.env.VITE_API_URL;


// =========================================================
// AVATAR SELECTION
// =========================================================

const getAvatarStyle = (
  topic = "",
  difficulty = ""
) => {
  const value =
    `${topic}-${difficulty}`.toLowerCase();

  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash =
      value.charCodeAt(i) +
      ((hash << 5) - hash);
  }

  const avatarNumber =
    Math.abs(hash) % 4;

  const avatars = [
    {
      gradient:
        "from-blue-500 to-indigo-600",
      ring: "ring-blue-200",
      glow: "bg-blue-400",
    },

    {
      gradient:
        "from-purple-500 to-violet-600",
      ring: "ring-purple-200",
      glow: "bg-purple-400",
    },

    {
      gradient:
        "from-emerald-500 to-teal-600",
      ring: "ring-emerald-200",
      glow: "bg-emerald-400",
    },

    {
      gradient:
        "from-orange-500 to-rose-600",
      ring: "ring-orange-200",
      glow: "bg-orange-400",
    },
  ];

  return avatars[avatarNumber];
};


// =========================================================
// MAIN COMPONENT
// =========================================================

const Step2Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // =========================================================
  // DATA RECEIVED FROM STEP 1 / TOPIC SETUP
  // =========================================================

  const interviewData = location.state;
  const {
    interviewId,
    userName,
    questions = [],
    interviewerMode = "voice",
  } = interviewData || {};

  const [showAvatar, setShowAvatar] = useState(
    interviewerMode === "avatar"
  );
  const interviewTopic =
    interviewData?.topic ||
    interviewData?.role ||
    "General";

  const interviewDifficulty =
    interviewData?.difficulty ||
    interviewData?.experience ||
    "Intermediate";

  const avatar = getAvatarStyle(
    interviewTopic,
    interviewDifficulty
  );

  const TOTAL_QUESTIONS =
    questions.length;


  // =========================================================
  // INTERVIEW STATE
  // =========================================================

  const [
    currentQuestion,
    setCurrentQuestion,
  ] = useState(0);

  const [
    answer,
    setAnswer,
  ] = useState("");

  const [
    timeLeft,
    setTimeLeft,
  ] = useState(30);

  const [
    isListening,
    setIsListening,
  ] = useState(false);

  const [
    isSpeaking,
    setIsSpeaking,
  ] = useState(false);


  // AI question voice
  const [
    voiceEnabled,
    setVoiceEnabled,
  ] = useState(true);


  // Candidate answer mode
  const [
    answerMode,
    setAnswerMode,
  ] = useState("text");


  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    finishing,
    setFinishing,
  ] = useState(false);

  const [
    feedback,
    setFeedback,
  ] = useState("");

  const [
    answers,
    setAnswers,
  ] = useState([]);

  const answerRef = useRef("");

  const [
    finished,
    setFinished,
  ] = useState(false);

  const [
    finalResult,
    setFinalResult,
  ] = useState(null);


  // Pause / resume
  const [
    isPaused,
    setIsPaused,
  ] = useState(false);


  // =========================================================
  // VOICE REFS
  // =========================================================

  const recognitionRef =
    useRef(null);

  const voiceTextRef =
    useRef("");

  const pausedRef =
    useRef(false);

  const submittingRef =
    useRef(false);

  const pausedDuringSpeakingRef =
    useRef(false);

  const lipSyncRef = useRef({
    active: false,
    frames: [],
    startedAt: 0,
    frameRate: 60,
    audio: null,
  });

  const [
    voiceAnswerEnabled,
    setVoiceAnswerEnabled,
  ] = useState(false);


  // =========================================================
  // CURRENT QUESTION
  // =========================================================

  const currentQuestionData =
    questions[currentQuestion];

  const currentQuestionText =
    currentQuestionData?.question ||
    "Loading question...";

  const currentQuestionTime =
    currentQuestionData?.timeLimit ||
    30;


  // =========================================================
  // CHECK INTERVIEW DATA
  // =========================================================

  useEffect(() => {
    if (
      !interviewData ||
      !interviewId ||
      !questions.length
    ) {
      navigate("/interview", {
        replace: true,
      });
    }
  }, [
    interviewData,
    interviewId,
    questions.length,
    navigate,
  ]);


  // =========================================================
  // RESET QUESTION
  // =========================================================

  useEffect(() => {
    if (!currentQuestionData || finished) {
      return;
    }

    answerRef.current = "";
    voiceTextRef.current = "";

    submittingRef.current = false;

    stopElevenLabsSpeech(lipSyncRef);

    setIsSpeaking(false);

    setTimeLeft(currentQuestionTime);

    setAnswer("");

    setFeedback("");
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
      isPaused ||
      !currentQuestionData ||
      submittingRef.current
    ) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        // When timer reaches 0, submit THIS question
        if (previous <= 1) {
          clearInterval(timer);

          handleSubmitAnswer(true);

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [
    currentQuestion,
    finished,
    isPaused,
    currentQuestionData,
  ]);


  // =========================================================
  // VOICE TO TEXT
  // =========================================================

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn(
        "[Speech] Speech recognition not supported"
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang =
      "en-IN";

    recognition.continuous =
      true;

    recognition.interimResults =
      true;


    // -----------------------------
    // START
    // -----------------------------

    recognition.onstart = () => {
      setIsListening(true);

      console.log(
        "[Speech] Listening"
      );
    };


    // -----------------------------
    // RESULT
    // -----------------------------

    recognition.onresult =
      (event) => {
        let finalText = "";
        let interimText = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          const transcript =
            event.results[i][0]
              .transcript;

          if (
            event.results[i].isFinal
          ) {
            finalText += transcript;
          } else {
            interimText += transcript;
          }
        }


        // Save confirmed speech.
        if (finalText.trim()) {
          voiceTextRef.current =
            `${voiceTextRef.current} ${finalText}`.trim();
        }


        // Display confirmed +
        // currently spoken text.
        const displayText =
          `${voiceTextRef.current} ${interimText}`.trim();
        answerRef.current = displayText;
        setAnswer(
          displayText
        );

        console.log(
          "[Speech] TEXT:",
          displayText
        );
      };


    // -----------------------------
    // ERROR
    // -----------------------------

    recognition.onerror =
      (event) => {
        console.error(
          "[Speech] Error:",
          event.error
        );

        setIsListening(false);
      };


    // -----------------------------
    // END
    // -----------------------------

    recognition.onend = () => {
      setIsListening(false);
    };


    recognitionRef.current =
      recognition;


    // -----------------------------
    // CLEANUP
    // -----------------------------

    return () => {
      try {
        recognition.stop();
      } catch (_) { }

      recognitionRef.current =
        null;
    };

  }, []);


  // =========================================================
  // START VOICE ANSWER
  // =========================================================

  const startVoiceAnswer = () => {
    if (!recognitionRef.current) {
      return;
    }

    if (
      pausedRef.current ||
      submittingRef.current
    ) {
      return;
    }


    setAnswerMode("voice");

    setVoiceAnswerEnabled(
      true
    );


    // Keep already typed/spoken answer.
    voiceTextRef.current =
      answer.trim();


    try {
      recognitionRef.current.start();
    } catch (_) {
      // Recognition is
      // already running.
    }
  };


  // =========================================================
  // STOP VOICE ANSWER
  // =========================================================

  const stopVoiceAnswer = () => {
    setVoiceAnswerEnabled(
      false
    );

    setIsListening(false);

    try {
      recognitionRef.current?.stop();
    } catch (_) { }
  };


  // =========================================================
  // TOGGLE VOICE ANSWER
  // =========================================================

  const toggleVoiceAnswer = () => {
    if (voiceAnswerEnabled) {
      stopVoiceAnswer();
    } else {
      startVoiceAnswer();
    }
  };


  // =========================================================
  // AI TEXT TO SPEECH
  // =========================================================

  const speakQuestion = async () => {
    if (!voiceEnabled) return;
    if (!currentQuestionText) return;

    // Stop candidate microphone
    stopVoiceAnswer();

    // Stop previous Azure speech
    stopElevenLabsSpeech(lipSyncRef);

    try {
      await speakWithElevenLabs(
        currentQuestionText,
        lipSyncRef,
        {
          onStart: () => {
            setIsSpeaking(true);
            stopVoiceAnswer();
          },

          onEnd: () => {
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
          },

          onError: (error) => {
            console.error("[Azure Speech] Error:", error);
            setIsSpeaking(false);
          },
        }
      );
    } catch (error) {
      console.error("[Azure Speech] Failed:", error);
      setIsSpeaking(false);
    }
  };


  // =========================================================
  // AUTOMATICALLY SPEAK NEW QUESTION
  // =========================================================

  useEffect(() => {
    if (
      !currentQuestionData ||
      finished ||
      isPaused
    ) {
      return;
    }


    // Stop candidate voice while
    // AI is asking question.
    stopVoiceAnswer();


    // Voice disabled.
    if (!voiceEnabled) {
      stopElevenLabsSpeech(lipSyncRef);
      setIsSpeaking(false);
      return;
    }


    const timer =
      setTimeout(() => {
        speakQuestion();
      }, 350);


    return () =>
      clearTimeout(timer);

  }, [
    currentQuestion,
    voiceEnabled,
    finished,
  ]);


  // =========================================================
  // PAUSE INTERVIEW
  // =========================================================

  const pauseInterview = () => {
    if (
      finished ||
      submitting ||
      finishing ||
      isPaused
    ) {
      return;
    }


    // Remember whether AI was speaking.
    pausedDuringSpeakingRef.current =
      isSpeaking ||
      lipSyncRef.current.active;


    pausedRef.current = true;

    setIsPaused(true);


    // Stop microphone.
    stopVoiceAnswer();


    // Stop AI voice.
    try {
      stopElevenLabsSpeech(lipSyncRef);
    } catch (_) { }


    setIsSpeaking(false);

    setIsListening(false);
  };


  // =========================================================
  // RESUME INTERVIEW
  // =========================================================

  const resumeInterview = () => {
    if (
      finished ||
      submitting ||
      finishing ||
      !isPaused
    ) {
      return;
    }


    pausedRef.current = false;

    setIsPaused(false);


    // If AI was speaking when paused,
    // replay the question.
    if (
      pausedDuringSpeakingRef.current &&
      voiceEnabled
    ) {
      pausedDuringSpeakingRef.current =
        false;


      setTimeout(() => {
        if (
          !pausedRef.current &&
          !finished
        ) {
          speakQuestion();
        }
      }, 150);

      return;
    }


    pausedDuringSpeakingRef.current =
      false;


    // Restart candidate voice.
    if (
      voiceAnswerEnabled &&
      answerMode === "voice"
    ) {
      setTimeout(() => {
        if (
          !pausedRef.current &&
          !finished
        ) {
          startVoiceAnswer();
        }
      }, 150);
    }
  };


  // =========================================================
  // SUBMIT ANSWER
  // =========================================================

  const handleSubmitAnswer = async (automatic = false) => {
    // Prevent duplicate submission
    if (
      finishing ||
      !currentQuestionData ||
      submittingRef.current
    ) {
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);

    // IMPORTANT:
    // Capture everything BEFORE changing currentQuestion
    const submittedQuestionIndex = currentQuestion;
    const submittedQuestionText = currentQuestionText;
    const submittedAnswer = answerRef.current.trim();

    const submittedTimeTaken = Math.max(
      0,
      currentQuestionTime - timeLeft
    );

    // Stop candidate voice
    stopVoiceAnswer();

    // Stop AI voice
    try {
      stopElevenLabsSpeech(lipSyncRef);
    } catch (_) { }

    setIsSpeaking(false);

    try {
      const response = await axios.post(
        `${API_URL}/api/interview/submit-answer`,
        {
          interviewId,

          questionIndex:
            submittedQuestionIndex,

          answer:
            submittedAnswer,

          timeTaken:
            submittedTimeTaken,
        },
        {
          withCredentials: true,
        }
      );

      // Save submitted answer locally
      const newAnswer = {
        questionNumber:
          submittedQuestionIndex + 1,

        question:
          submittedQuestionText,

        answer:
          submittedAnswer,

        timeTaken:
          submittedTimeTaken,

        automaticallySubmitted:
          automatic,

        feedback:
          response.data?.feedback || "",
      };

      setAnswers((previous) => [
        ...previous,
        newAnswer,
      ]);

      setFeedback(
        response.data?.feedback || ""
      );

      // LAST QUESTION
      if (
        submittedQuestionIndex ===
        TOTAL_QUESTIONS - 1
      ) {
        await finishInterview();
        return;
      }

      // IMPORTANT:
      // Clear answer BEFORE moving to next question
      answerRef.current = "";
      voiceTextRef.current = "";

      setAnswer("");
      setFeedback("");

      // Move to next question
      setCurrentQuestion(
        submittedQuestionIndex + 1
      );

    } catch (error) {
      console.error(
        "Submit answer failed:",
        error.response?.data ||
        error.message
      );

      // Allow retry if request failed
      submittingRef.current = false;

    } finally {
      setSubmitting(false);
    }
  };


  // =========================================================
  // FINISH INTERVIEW
  // =========================================================

  const finishInterview =
    async () => {

      try {
        setFinishing(true);


        const response =
          await axios.post(
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


        // Go to report page.
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
  // CLEANUP WHEN INTERVIEW FINISHES
  // =========================================================

  useEffect(() => {
    if (!finished) {
      return;
    }


    stopVoiceAnswer();


    try {
      stopElevenLabsSpeech(lipSyncRef);
    } catch (_) { }

  }, [finished]);


  // =========================================================
  // FINISHED SCREEN
  // =========================================================

  if (finished) {
    return (
      <FinishedScreen
        finalResult={
          finalResult
        }
        onGoHome={() =>
          navigate("/")
        }
      />
    );
  }


  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-6 flex items-center justify-center">

      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden">


        {/* ================================================
            PAUSED MESSAGE
        ================================================= */}

        {isPaused && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-center text-sm text-amber-800 font-medium">
            Interview paused. Your current question and remaining time are preserved.
          </div>
        )}


        {/* ================================================
            HEADER
        ================================================= */}

        <InterviewHeader
          userName={userName}
          isPaused={isPaused}
          onPauseResume={
            isPaused
              ? resumeInterview
              : pauseInterview
          }
          disabled={
            submitting ||
            finishing ||
            finished
          }
        />


        {/* ================================================
            MAIN GRID
        ================================================= */}

        <div className="grid lg:grid-cols-[420px_1fr] min-h-[720px]">


          {/* ==============================================
              LEFT SIDE
          =============================================== */}

          <div className="border-r border-gray-100 p-6">


            {/* AI INTERVIEWER */}

            <InterviewerPanel
              interviewerMode={interviewerMode}

              avatar={avatar}
              lipSyncRef={lipSyncRef}
              isSpeaking={isSpeaking}

              voiceEnabled={voiceEnabled}

              onToggleVoice={() => {
                const nextValue = !voiceEnabled;

                setVoiceEnabled(nextValue);

                if (!nextValue) {
                  stopElevenLabsSpeech(lipSyncRef);
                  setIsSpeaking(false);
                }
              }}

              showAvatar={showAvatar}

              onToggleAvatar={() => {
                setShowAvatar((previous) => !previous);
              }}
            />


            {/* INTERVIEW STATUS */}

            <InterviewStatus
              isPaused={isPaused}

              timeLeft={
                timeLeft
              }

              currentQuestion={
                currentQuestion
              }

              totalQuestions={
                TOTAL_QUESTIONS
              }

              currentQuestionTime={
                currentQuestionTime
              }
            />


            {/* PROGRESS */}

            <ProgressBar
              currentQuestion={
                currentQuestion
              }

              totalQuestions={
                TOTAL_QUESTIONS
              }
            />

          </div>


          {/* ==============================================
              RIGHT SIDE
          =============================================== */}

          <div className="p-6 md:p-8 flex flex-col">


            {/* QUESTION */}

            <QuestionCard
              currentQuestion={
                currentQuestion
              }

              totalQuestions={
                TOTAL_QUESTIONS
              }

              question={
                currentQuestionText
              }

              difficulty={
                currentQuestionData?.difficulty
              }
            />


            {/* ANSWER */}

            <AnswerPanel
              answer={answer}

              setAnswer={(value) => {
                const nextValue =
                  typeof value === "function"
                    ? value(answerRef.current)
                    : value;

                answerRef.current = nextValue;
                setAnswer(nextValue);
              }}

              answerMode={answerMode}

              setAnswerMode={setAnswerMode}

              voiceAnswerEnabled={voiceAnswerEnabled}

              toggleVoiceAnswer={toggleVoiceAnswer}

              isListening={isListening}

              feedback={feedback}

              submitting={submitting}

              finishing={finishing}

              isPaused={isPaused}

              isLastQuestion={
                currentQuestion ===
                TOTAL_QUESTIONS - 1
              }

              onSubmit={handleSubmitAnswer}
            />

          </div>

        </div>

      </div>

    </div>
  );
};


export default Step2Interview;
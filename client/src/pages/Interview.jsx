import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    LuBot,
    LuSparkles,
    LuCode,
    LuBrain,
    LuBriefcaseBusiness,
    LuUsers,
    LuNetwork,
    LuBookOpen,
    LuBrackets,
    LuGitBranch,
    LuContainer,
    LuCloud,
    LuArrowRight,
    LuCheck,
    LuClock3,
    LuListChecks,
    LuSettings2,
    LuLightbulb,
    LuX,
    LuLoaderCircle,
} from "react-icons/lu";

import { setUserData } from "../redux/userSlice";


const API_URL = import.meta.env.VITE_API_URL;


/* =========================================================
   INTERVIEW TYPES
========================================================= */

const interviewTypes = [
    {
        name: "Technical",
        description: "Technical concepts and problem solving",
        icon: LuCode,
    },
    {
        name: "HR",
        description: "HR and common interview questions",
        icon: LuUsers,
    },
    {
        name: "Behavioral",
        description: "Situational and behavioral questions",
        icon: LuBriefcaseBusiness,
    },
    {
        name: "System Design",
        description: "Architecture and system design",
        icon: LuNetwork,
    },
    {
        name: "General Knowledge",
        description: "Conceptual and knowledge-based questions",
        icon: LuBookOpen,
    },
    {
        name: "Custom",
        description: "Create your own interview",
        icon: LuSparkles,
    },
];


/* =========================================================
   DIFFICULTY
========================================================= */

const levels = [
    {
        name: "Beginner",
        description: "Fundamentals",
    },
    {
        name: "Intermediate",
        description: "Practical knowledge",
    },
    {
        name: "Advanced",
        description: "Deep concepts",
    },
    {
        name: "Expert",
        description: "Professional level",
    },
];


/* =========================================================
   TOPIC PRESETS
========================================================= */

const topicPresets = [
    {
        name: "Docker",
        icon: LuContainer,
    },
    {
        name: "CI/CD",
        icon: LuCloud,
    },
    {
        name: "Git",
        icon: LuGitBranch,
    },
    {
        name: "JavaScript",
        icon: LuCode,
    },
    {
        name: "Python",
        icon: LuCode,
    },
    {
        name: "Machine Learning",
        icon: LuBrain,
    },
    {
        name: "System Design",
        icon: LuNetwork,
    },
    {
        name: "DSA",
        icon: LuBrackets,
    },
];


/* =========================================================
   QUESTION COUNT
========================================================= */

const questionCounts = [5, 10, 15, 20];


/* =========================================================
   TIME PER QUESTION
========================================================= */

const timeOptions = [30, 60, 90, 120];


export default function Interview() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userData } = useSelector(
        (state) => state.user
    );


    /* =====================================================
       STATE
    ===================================================== */

    const [interviewType, setInterviewType] =
        useState("Technical");

    const [topic, setTopic] =
        useState("");

    const [level, setLevel] =
        useState("Intermediate");

    const [questionCount, setQuestionCount] =
        useState(10);

    const [timePerQuestion, setTimePerQuestion] =
        useState(60);

    const [customInstructions, setCustomInstructions] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    /* =====================================================
       SELECT TOPIC PRESET
    ===================================================== */

    const selectTopic = (value) => {
        setTopic(value);
        setError("");
    };


    /* =====================================================
       START INTERVIEW
    ===================================================== */

    const startInterview = async () => {

        /* -----------------------------------------------
           VALIDATION
        ------------------------------------------------ */

        if (!topic.trim()) {
            setError(
                "Please enter a topic for the interview."
            );
            return;
        }

        if (!interviewType) {
            setError(
                "Please select an interview type."
            );
            return;
        }

        if (!level) {
            setError(
                "Please select a difficulty level."
            );
            return;
        }


        /* -----------------------------------------------
           CREDIT CHECK
        ------------------------------------------------ */

        if (
            userData &&
            userData.credits < 50
        ) {
            setError(
                "Not enough credits. Minimum 50 credits required."
            );
            return;
        }


        try {

            setLoading(true);
            setError("");


            /* -------------------------------------------
               REQUEST PAYLOAD
            -------------------------------------------- */

            const payload = {

                /*
                 * New general interview fields
                 */
                topic: topic.trim(),

                interviewType: interviewType,

                difficulty: level,

                questionCount: questionCount,

                timePerQuestion: timePerQuestion,

                customInstructions:
                    customInstructions.trim(),


                /*
                 * Existing backend fields
                 *
                 * These keep this request compatible
                 * with your current API.
                 */
                role: topic.trim(),

                experience: level,

                mode: interviewType,

                resumeTxt: "",

                projects: [],

                skills: [],
            };


            // console.log(
            //     "Generating interview:",
            //     payload
            // );


            /* -------------------------------------------
               GENERATE QUESTIONS
            -------------------------------------------- */

            const response = await axios.post(
                `${API_URL}/api/interview/generate-topic-questions`,
                payload,
                { withCredentials: true }
            );


            // console.log(
            //     "Interview response:",
            //     response.data
            // );


            /* -------------------------------------------
               VALIDATE RESPONSE
            -------------------------------------------- */

            if (!response.data) {
                throw new Error(
                    "Invalid response from server."
                );
            }


            if (!response.data.interviewId) {
                throw new Error(
                    "Interview ID was not returned by server."
                );
            }


            if (
                !Array.isArray(
                    response.data.questions
                )
            ) {
                throw new Error(
                    "Questions were not returned by server."
                );
            }


            if (
                response.data.questions.length === 0
            ) {
                throw new Error(
                    "No questions were generated."
                );
            }


            /* -------------------------------------------
               UPDATE USER CREDITS
            -------------------------------------------- */

            if (
                userData &&
                response.data.creditsLeft !==
                undefined
            ) {

                dispatch(
                    setUserData({
                        ...userData,

                        credits:
                            response.data.creditsLeft,
                    })
                );

            }


            /* -------------------------------------------
               GO TO ACTIVE INTERVIEW
            -------------------------------------------- */

            navigate("/2", {
                state: {

                    /*
                     * Backend response
                     */
                    ...response.data,

                    /*
                     * Interview configuration
                     */
                    interviewType,

                    topic: topic.trim(),

                    difficulty: level,

                    questionCount,

                    timePerQuestion,
                },
            });


        } catch (err) {

            console.error(
                "Failed to generate interview:",
                err.response?.data ||
                err.message
            );


            /* -------------------------------------------
               AUTHENTICATION ERROR
            -------------------------------------------- */

            if (
                err.response?.status === 401
            ) {

                setError(
                    "You are not authenticated. Please login again."
                );

                return;
            }


            /* -------------------------------------------
               CREDIT ERROR
            -------------------------------------------- */

            if (
                err.response?.status === 402
            ) {

                setError(
                    err.response?.data?.message ||
                    "Not enough credits."
                );

                return;
            }


            /* -------------------------------------------
               SERVER ERROR
            -------------------------------------------- */

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to generate interview."
            );

        } finally {

            setLoading(false);

        }
    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <main className="min-h-screen bg-[#f5f7f6] px-4 py-10 md:px-6">

            <div className="mx-auto max-w-6xl">


                {/* =================================================
                    HEADER
                ================================================= */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: -25,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    className="text-center"
                >

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-green-400 shadow-xl">
                        <LuBot size={27} />
                    </div>


                    <div className="mt-6 flex items-center justify-center gap-2">

                        <LuSparkles
                            size={17}
                            className="text-green-500"
                        />

                        <span className="text-sm font-medium text-green-600">
                            AI Interview Studio
                        </span>

                    </div>


                    <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                        Build your interview
                    </h1>


                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-500 md:text-base">
                        Choose any topic, difficulty and interview
                        style. AI will generate a personalized
                        interview for you.
                    </p>

                </motion.div>


                {/* =================================================
                    MAIN CARD
                ================================================= */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 35,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.7,
                        delay: 0.15,
                    }}
                    className="mt-12 overflow-hidden rounded-[32px] border border-gray-200/80 bg-white shadow-[0_30px_90px_-35px_rgba(0,0,0,0.2)]"
                >

                    <div className="grid lg:grid-cols-[1fr_340px]">


                        {/* =================================================
                            LEFT SIDE
                        ================================================= */}

                        <div className="p-6 md:p-10">


                            {/* =================================================
                                INTERVIEW TYPE
                            ================================================= */}

                            <section>

                                <div className="mb-5">

                                    <div className="flex items-center gap-2">

                                        <LuSettings2
                                            size={19}
                                            className="text-green-500"
                                        />

                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Interview type
                                        </h2>

                                    </div>


                                    <p className="mt-1 text-sm text-gray-400">
                                        Select the style of your interview.
                                    </p>

                                </div>


                                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">

                                    {interviewTypes.map(
                                        (item) => {

                                            const Icon =
                                                item.icon;

                                            const active =
                                                interviewType ===
                                                item.name;

                                            return (

                                                <button
                                                    key={
                                                        item.name
                                                    }
                                                    type="button"
                                                    disabled={
                                                        loading
                                                    }
                                                    onClick={() =>
                                                        setInterviewType(
                                                            item.name
                                                        )
                                                    }
                                                    className={`rounded-2xl border p-4 text-left transition ${active
                                                        ? "border-green-400 bg-green-50 shadow-sm"
                                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                                        }`}
                                                >

                                                    <div className="flex items-center justify-between">

                                                        <div
                                                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${active
                                                                ? "bg-green-500 text-white"
                                                                : "bg-gray-100 text-gray-500"
                                                                }`}
                                                        >
                                                            <Icon
                                                                size={
                                                                    19
                                                                }
                                                            />
                                                        </div>


                                                        {active && (

                                                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">

                                                                <LuCheck
                                                                    size={
                                                                        12
                                                                    }
                                                                />

                                                            </div>

                                                        )}

                                                    </div>


                                                    <p
                                                        className={`mt-3 text-sm font-semibold ${active
                                                            ? "text-green-700"
                                                            : "text-gray-800"
                                                            }`}
                                                    >
                                                        {
                                                            item.name
                                                        }
                                                    </p>


                                                    <p className="mt-1 text-xs leading-5 text-gray-400">
                                                        {
                                                            item.description
                                                        }
                                                    </p>

                                                </button>

                                            );
                                        }
                                    )}

                                </div>

                            </section>


                            {/* =================================================
                                TOPIC
                            ================================================= */}

                            <section className="mt-10">

                                <div className="mb-5">

                                    <div className="flex items-center gap-2">

                                        <LuLightbulb
                                            size={19}
                                            className="text-green-500"
                                        />

                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Interview topic
                                        </h2>

                                    </div>


                                    <p className="mt-1 text-sm text-gray-400">
                                        Enter any topic you want to practice.
                                    </p>

                                </div>


                                <div className="relative">

                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => {

                                            setTopic(
                                                e.target.value
                                            );

                                            setError("");

                                        }}
                                        disabled={loading}
                                        placeholder="Docker, CI/CD, Git commands, Valorant, React..."
                                        className="h-14 w-full rounded-2xl border border-gray-200 bg-white px-5 pr-12 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-400 focus:ring-4 focus:ring-green-50 disabled:bg-gray-100"
                                    />


                                    {topic &&
                                        !loading && (

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setTopic(
                                                        ""
                                                    )
                                                }
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                <LuX
                                                    size={18}
                                                />
                                            </button>

                                        )}

                                </div>


                                {/* TOPIC PRESETS */}

                                <div className="mt-4">

                                    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                                        Popular topics
                                    </p>


                                    <div className="flex flex-wrap gap-2">

                                        {topicPresets.map(
                                            (item) => {

                                                const Icon =
                                                    item.icon;

                                                const active =
                                                    topic.toLowerCase() ===
                                                    item.name.toLowerCase();

                                                return (

                                                    <button
                                                        key={
                                                            item.name
                                                        }
                                                        type="button"
                                                        disabled={
                                                            loading
                                                        }
                                                        onClick={() =>
                                                            selectTopic(
                                                                item.name
                                                            )
                                                        }
                                                        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition ${active
                                                            ? "border-green-400 bg-green-50 text-green-700"
                                                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                                            }`}
                                                    >

                                                        <Icon
                                                            size={
                                                                14
                                                            }
                                                        />

                                                        {
                                                            item.name
                                                        }

                                                    </button>

                                                );
                                            }
                                        )}

                                    </div>

                                </div>

                            </section>


                            {/* =================================================
                                DIFFICULTY
                            ================================================= */}

                            <section className="mt-10">

                                <div className="mb-5">

                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Difficulty
                                    </h2>


                                    <p className="mt-1 text-sm text-gray-400">
                                        Choose how challenging the interview should be.
                                    </p>

                                </div>


                                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

                                    {levels.map(
                                        (item) => {

                                            const active =
                                                level ===
                                                item.name;

                                            return (

                                                <button
                                                    key={
                                                        item.name
                                                    }
                                                    type="button"
                                                    disabled={
                                                        loading
                                                    }
                                                    onClick={() =>
                                                        setLevel(
                                                            item.name
                                                        )
                                                    }
                                                    className={`rounded-2xl border p-4 text-left transition ${active
                                                        ? "border-green-400 bg-green-50"
                                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                                        }`}
                                                >

                                                    <div className="flex items-center justify-between">

                                                        <span
                                                            className={`text-sm font-semibold ${active
                                                                ? "text-green-700"
                                                                : "text-gray-700"
                                                                }`}
                                                        >
                                                            {
                                                                item.name
                                                            }
                                                        </span>


                                                        {active && (

                                                            <LuCheck
                                                                size={
                                                                    16
                                                                }
                                                                className="text-green-600"
                                                            />

                                                        )}

                                                    </div>


                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {
                                                            item.description
                                                        }
                                                    </p>

                                                </button>

                                            );
                                        }
                                    )}

                                </div>

                            </section>


                            {/* =================================================
                                QUESTIONS + TIME
                            ================================================= */}

                            <section className="mt-10 grid gap-8 md:grid-cols-2">


                                {/* QUESTIONS */}

                                <div>

                                    <div className="mb-4 flex items-center gap-2">

                                        <LuListChecks
                                            size={18}
                                            className="text-green-500"
                                        />

                                        <div>

                                            <h2 className="text-sm font-semibold">
                                                Number of questions
                                            </h2>

                                            <p className="text-xs text-gray-400">
                                                Interview length
                                            </p>

                                        </div>

                                    </div>


                                    <div className="grid grid-cols-4 gap-2">

                                        {questionCounts.map(
                                            (count) => {

                                                const active =
                                                    questionCount ===
                                                    count;

                                                return (

                                                    <button
                                                        key={
                                                            count
                                                        }
                                                        type="button"
                                                        disabled={
                                                            loading
                                                        }
                                                        onClick={() =>
                                                            setQuestionCount(
                                                                count
                                                            )
                                                        }
                                                        className={`rounded-xl border py-3 text-sm font-semibold transition ${active
                                                            ? "border-green-400 bg-green-50 text-green-700"
                                                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                                                            }`}
                                                    >
                                                        {
                                                            count
                                                        }
                                                    </button>

                                                );
                                            }
                                        )}

                                    </div>

                                </div>


                                {/* TIME */}

                                <div>

                                    <div className="mb-4 flex items-center gap-2">

                                        <LuClock3
                                            size={18}
                                            className="text-green-500"
                                        />

                                        <div>

                                            <h2 className="text-sm font-semibold">
                                                Time per question
                                            </h2>

                                            <p className="text-xs text-gray-400">
                                                Maximum answer time
                                            </p>

                                        </div>

                                    </div>


                                    <div className="grid grid-cols-4 gap-2">

                                        {timeOptions.map(
                                            (time) => {

                                                const active =
                                                    timePerQuestion ===
                                                    time;

                                                return (

                                                    <button
                                                        key={
                                                            time
                                                        }
                                                        type="button"
                                                        disabled={
                                                            loading
                                                        }
                                                        onClick={() =>
                                                            setTimePerQuestion(
                                                                time
                                                            )
                                                        }
                                                        className={`rounded-xl border py-3 text-sm font-semibold transition ${active
                                                            ? "border-green-400 bg-green-50 text-green-700"
                                                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                                                            }`}
                                                    >
                                                        {
                                                            time
                                                        }s
                                                    </button>

                                                );
                                            }
                                        )}

                                    </div>

                                </div>

                            </section>


                            {/* =================================================
                                CUSTOM INSTRUCTIONS
                            ================================================= */}

                            <section className="mt-10">

                                <div className="mb-4">

                                    <h2 className="text-lg font-semibold text-gray-900">

                                        Additional instructions

                                        <span className="ml-2 text-xs font-normal text-gray-400">
                                            Optional
                                        </span>

                                    </h2>


                                    <p className="mt-1 text-sm text-gray-400">
                                        Give the AI additional instructions for your interview.
                                    </p>

                                </div>


                                <textarea
                                    value={
                                        customInstructions
                                    }
                                    onChange={(e) =>
                                        setCustomInstructions(
                                            e.target.value
                                        )
                                    }
                                    disabled={loading}
                                    rows={4}
                                    placeholder="Example: Ask practical Docker questions and include command-based scenarios. Do not ask purely theoretical questions."
                                    className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-50 disabled:opacity-60"
                                />

                            </section>


                            {/* =================================================
                                ERROR
                            ================================================= */}

                            <AnimatePresence>

                                {error && (

                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: -5,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -5,
                                        }}
                                        className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-500"
                                    >
                                        {error}
                                    </motion.div>

                                )}

                            </AnimatePresence>


                            {/* =================================================
                                START BUTTON
                            ================================================= */}

                            <button
                                type="button"
                                onClick={
                                    startInterview
                                }
                                disabled={
                                    !topic.trim() ||
                                    loading
                                }
                                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-black font-semibold text-white shadow-lg transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                            >

                                {loading ? (

                                    <>
                                        <LuLoaderCircle
                                            size={20}
                                            className="animate-spin"
                                        />

                                        Generating Interview...
                                    </>

                                ) : (

                                    <>
                                        Start AI Interview

                                        <LuArrowRight
                                            size={19}
                                        />
                                    </>

                                )}

                            </button>

                        </div>


                        {/* =================================================
                            RIGHT SIDE
                        ================================================= */}

                        <div className="border-t border-gray-100 bg-[#f8faf9] p-6 md:p-8 lg:border-l lg:border-t-0">

                            <div className="sticky top-8">


                                {/* HEADER */}

                                <div className="flex items-center gap-2">

                                    <LuSparkles
                                        size={18}
                                        className="text-green-500"
                                    />

                                    <h2 className="font-semibold text-gray-900">
                                        Interview Preview
                                    </h2>

                                </div>


                                <p className="mt-2 text-sm leading-6 text-gray-400">
                                    Review your interview configuration before starting.
                                </p>


                                {/* CONFIGURATION */}

                                <div className="mt-7 overflow-hidden rounded-2xl border border-gray-200 bg-white">


                                    {/* TOPIC */}

                                    <div className="border-b border-gray-100 p-5">

                                        <p className="text-xs uppercase tracking-wider text-gray-400">
                                            Topic
                                        </p>


                                        <p className="mt-2 break-words text-lg font-bold text-gray-900">
                                            {topic ||
                                                "No topic selected"}
                                        </p>

                                    </div>


                                    {/* DETAILS */}

                                    <div className="divide-y divide-gray-100">


                                        <div className="flex items-center justify-between gap-4 p-4">

                                            <span className="text-sm text-gray-500">
                                                Type
                                            </span>

                                            <span className="text-right text-sm font-semibold text-gray-800">
                                                {
                                                    interviewType
                                                }
                                            </span>

                                        </div>


                                        <div className="flex items-center justify-between gap-4 p-4">

                                            <span className="text-sm text-gray-500">
                                                Difficulty
                                            </span>

                                            <span className="text-sm font-semibold text-gray-800">
                                                {
                                                    level
                                                }
                                            </span>

                                        </div>


                                        <div className="flex items-center justify-between gap-4 p-4">

                                            <span className="text-sm text-gray-500">
                                                Questions
                                            </span>

                                            <span className="text-sm font-semibold text-gray-800">
                                                {
                                                    questionCount
                                                }
                                            </span>

                                        </div>


                                        <div className="flex items-center justify-between gap-4 p-4">

                                            <span className="text-sm text-gray-500">
                                                Time / question
                                            </span>

                                            <span className="text-sm font-semibold text-gray-800">
                                                {
                                                    timePerQuestion
                                                }s
                                            </span>

                                        </div>


                                        <div className="flex items-center justify-between gap-4 p-4">

                                            <span className="text-sm text-gray-500">
                                                Total time
                                            </span>

                                            <span className="text-sm font-semibold text-green-600">

                                                {Math.ceil(
                                                    (
                                                        questionCount *
                                                        timePerQuestion
                                                    ) / 60
                                                )}

                                                {" "}min

                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {/* AI FEATURES */}

                                <div className="mt-5 rounded-2xl border border-green-100 bg-green-50 p-5">

                                    <div className="flex items-center gap-2">

                                        <LuBot
                                            size={18}
                                            className="text-green-600"
                                        />

                                        <p className="text-sm font-semibold text-green-700">
                                            AI will generate
                                        </p>

                                    </div>


                                    <ul className="mt-4 space-y-3">


                                        <li className="flex gap-2 text-xs leading-5 text-green-700">

                                            <LuCheck
                                                size={14}
                                                className="mt-0.5 shrink-0"
                                            />

                                            Questions specifically about your topic

                                        </li>


                                        <li className="flex gap-2 text-xs leading-5 text-green-700">

                                            <LuCheck
                                                size={14}
                                                className="mt-0.5 shrink-0"
                                            />

                                            Questions matched to difficulty

                                        </li>


                                        <li className="flex gap-2 text-xs leading-5 text-green-700">

                                            <LuCheck
                                                size={14}
                                                className="mt-0.5 shrink-0"
                                            />

                                            Real-time answer evaluation

                                        </li>


                                        <li className="flex gap-2 text-xs leading-5 text-green-700">

                                            <LuCheck
                                                size={14}
                                                className="mt-0.5 shrink-0"
                                            />

                                            Performance report after completion

                                        </li>

                                    </ul>

                                </div>


                                {/* ANY TOPIC */}

                                <div className="mt-5 flex gap-3 rounded-2xl border border-gray-200 bg-white p-4">

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100">

                                        <LuLightbulb
                                            size={17}
                                            className="text-gray-500"
                                        />

                                    </div>


                                    <div>

                                        <p className="text-xs font-semibold text-gray-700">
                                            No topic restrictions
                                        </p>


                                        <p className="mt-1 text-xs leading-5 text-gray-400">
                                            Docker, Kubernetes,
                                            Git, CI/CD, Valorant,
                                            mathematics, history,
                                            networking, Python or
                                            anything else.
                                        </p>

                                    </div>

                                </div>


                                {/* CREDIT INFO */}

                                {userData && (

                                    <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4">

                                        <div className="flex items-center justify-between">

                                            <span className="text-sm text-gray-500">
                                                Available credits
                                            </span>

                                            <span className="font-semibold text-gray-800">
                                                {
                                                    userData.credits ??
                                                    0
                                                }
                                            </span>

                                        </div>


                                        <p className="mt-2 text-xs text-gray-400">
                                            Starting an interview requires
                                            at least 50 credits.
                                        </p>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                </motion.div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    transition={{
                        delay: 0.8,
                    }}
                    className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-400"
                >

                    <span>
                        AI-generated questions
                    </span>

                    <span>•</span>

                    <span>
                        Real-time evaluation
                    </span>

                    <span>•</span>

                    <span>
                        Personalized scoring
                    </span>

                </motion.div>

            </div>

        </main>
    );
}
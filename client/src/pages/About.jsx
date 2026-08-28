import { motion } from "framer-motion";
import {
    LuBot,
    LuBrain,
    LuTarget,
    LuMessageSquareText,
    LuChartNoAxesColumnIncreasing,
    LuSparkles,
    LuArrowRight,
} from "react-icons/lu";
import { Link } from "react-router-dom";

const features = [
    {
        icon: LuBrain,
        title: "AI-Powered",
        text: "Adaptive interview conversations.",
    },
    {
        icon: LuTarget,
        title: "Role Focused",
        text: "Questions matched to your target role.",
    },
    {
        icon: LuMessageSquareText,
        title: "Real Feedback",
        text: "Actionable feedback after every session.",
    },
    {
        icon: LuChartNoAxesColumnIncreasing,
        title: "Track Progress",
        text: "Measure improvement over time.",
    },
];

export default function About() {
    return (
        <main className="min-h-screen bg-[#f7f7f6] px-5 py-16">
            <div className="mx-auto max-w-6xl">

                {/* Hero */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center"
                >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-green-400 shadow-lg">
                        <LuBot size={28} />
                    </div>

                    <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-green-500">
                        About InterviewIQ.AI
                    </p>

                    <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
                        Practice smarter.
                        <br />
                        <span className="text-green-500">Interview better.</span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-500">
                        An AI-powered platform built to help you practice realistic
                        interviews, improve weak areas, and become more confident.
                    </p>
                </motion.section>

                {/* Mission */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="mt-24 rounded-[36px] bg-white p-8 shadow-sm sm:p-12"
                >
                    <div className="grid items-center gap-12 md:grid-cols-2">

                        <div>
                            <span className="text-sm font-bold uppercase tracking-wider text-green-500">
                                Our idea
                            </span>

                            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                                Less theory.
                                <br />
                                More practice.
                            </h2>

                            <p className="mt-5 leading-7 text-gray-500">
                                Most interview preparation stops at reading questions.
                                InterviewIQ.AI focuses on actually answering them.
                            </p>

                            <p className="mt-4 leading-7 text-gray-500">
                                You practice. AI evaluates. You improve.
                            </p>

                            <Link
                                to="/interview"
                                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
                            >
                                Start practicing
                                <LuArrowRight size={18} />
                            </Link>
                        </div>

                        {/* Visual */}
                        <div className="flex justify-center">
                            <div className="relative flex h-72 w-72 items-center justify-center rounded-full bg-green-50">
                                <div className="absolute h-56 w-56 rounded-full border border-green-100" />
                                <div className="absolute h-40 w-40 rounded-full border border-green-200" />

                                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-black text-green-400 shadow-xl">
                                    <LuSparkles size={42} />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Features */}
                <section className="mt-24">
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Built for better interviews
                        </h2>

                        <p className="mt-3 text-gray-500">
                            Everything in one place.
                        </p>
                    </motion.div>

                    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;

                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                    }}
                                    viewport={{ once: true }}
                                    className="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-500">
                                        <Icon size={22} />
                                    </div>

                                    <h3 className="mt-5 font-semibold">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-gray-500">
                                        {feature.text}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* Simple flow */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="mt-24"
                >
                    <div className="rounded-[36px] bg-[#101412] px-8 py-14 text-white sm:px-14">
                        <div className="max-w-xl">
                            <p className="text-sm font-semibold uppercase tracking-wider text-green-400">
                                Simple workflow
                            </p>

                            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                                Practice → Feedback → Improve
                            </h2>
                        </div>

                        <div className="mt-12 grid gap-4 md:grid-cols-3">
                            {[
                                ["01", "Choose", "Pick your role."],
                                ["02", "Practice", "Take the interview."],
                                ["03", "Improve", "Use the feedback."],
                            ].map(([number, title, text]) => (
                                <div
                                    key={number}
                                    className="rounded-3xl border border-white/10 bg-white/5 p-6"
                                >
                                    <span className="text-sm text-green-400">
                                        {number}
                                    </span>

                                    <h3 className="mt-6 text-lg font-semibold">
                                        {title}
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-400">
                                        {text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Final CTA */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="py-24 text-center"
                >
                    <h2 className="text-3xl font-bold sm:text-4xl">
                        Ready to practice?
                    </h2>

                    <Link
                        to="/interview"
                        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 font-semibold text-black transition hover:bg-green-400"
                    >
                        <LuSparkles size={18} />
                        Start AI Interview
                    </Link>
                </motion.section>
            </div>
        </main>
    );
}
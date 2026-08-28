import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    LuBot,
    LuSparkles,
    LuTarget,
    LuChartNoAxesColumnIncreasing,
    LuTrophy,
    LuFileText,
    LuArrowRight,
    LuBrain,
    LuCheck,
} from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: "easeOut",
        },
    },
};

const stagger = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#f7f7f6] text-gray-900">
            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute left-[10%] top-[20%] h-72 w-72 rounded-full bg-green-100/40 blur-3xl" />
                    <div className="absolute right-[5%] top-[30%] h-96 w-96 rounded-full bg-green-100/50 blur-3xl" />
                </div>

                <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 md:grid-cols-2 md:py-32">

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <motion.p
                            variants={fadeUp}
                            className="mb-5 flex items-center gap-2 text-sm font-semibold text-green-600"
                        >
                            <LuSparkles />
                            AI Interview Practice
                        </motion.p>

                        <motion.h1
                            variants={fadeUp}
                            className="max-w-xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
                        >
                            Practice.
                            <br />
                            Improve.
                            <br />
                            <span className="text-green-500">Succeed.</span>
                        </motion.h1>

                        <motion.p
                            variants={fadeUp}
                            className="mt-7 max-w-md text-lg text-gray-500"
                        >
                            Smarter interview practice powered by AI.
                        </motion.p>
        
                        <motion.div
                            variants={fadeUp}
                            className="mt-9 flex flex-col gap-3 sm:flex-row"
                        >
                            <Link
                                to="/interview"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d9fbe9] px-6 py-3.5 font-semibold text-green-600 shadow-sm transition hover:bg-[#c8f7dd]"
                            >
                                <LuSparkles size={18} />
                                Start AI Interview
                            </Link>

                            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-medium shadow-sm transition hover:bg-gray-50">
                                <FcGoogle size={20} />
                                Continue with Google
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* Hero Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0 rounded-[40px] bg-green-100/50 blur-3xl" />

                        <div className="relative mx-auto max-w-lg rounded-[32px] border border-white bg-white p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.2)]">

                            <div className="flex items-center gap-3">
                                <div className="h-3 w-3 rounded-full bg-green-400" />
                                <span className="text-sm font-medium">
                                    Good luck, Alex!
                                </span>
                            </div>

                            <div className="flex min-h-[380px] flex-col items-center justify-center">

                                <div className="relative flex h-52 w-52 items-center justify-center rounded-full bg-green-50">
                                    <div className="absolute h-40 w-40 rounded-full border-[18px] border-green-100" />

                                    <div className="absolute h-24 w-24 rounded-full border border-green-200 bg-white shadow-lg" />

                                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-green-400">
                                        <LuBot size={30} />
                                    </div>
                                </div>

                                <div className="mt-10 flex items-center gap-2">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
                                        <motion.div
                                            key={bar}
                                            animate={{ height: [10, 28, 15, 35, 10] }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                delay: bar * 0.08,
                                            }}
                                            className="w-1 rounded-full bg-green-400"
                                        />
                                    ))}
                                </div>

                                <p className="mt-4 text-sm text-gray-400">
                                    Listening...
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="px-6 py-24">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                    className="mx-auto max-w-7xl rounded-[36px] bg-white px-8 py-16 shadow-sm md:px-16"
                >
                    <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
                        Everything you need
                    </h2>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="mt-14 grid gap-12 md:grid-cols-3"
                    >
                        <Feature
                            icon={<LuTarget />}
                            title="AI Mock Interviews"
                            text="Role-specific practice."
                        />

                        <Feature
                            icon={<LuChartNoAxesColumnIncreasing />}
                            title="Instant Feedback"
                            text="Know exactly what to improve."
                        />

                        <Feature
                            icon={<LuTrophy />}
                            title="Track Progress"
                            text="See your improvement over time."
                        />
                    </motion.div>
                </motion.div>
            </section>

            {/* How it works */}
            <section id="how-it-works" className="px-6 py-24">
                <div className="mx-auto max-w-7xl">
                    <motion.h2
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center text-3xl font-bold"
                    >
                        How it works
                    </motion.h2>

                    <div className="mt-16 grid gap-12 md:grid-cols-3">
                        <Step
                            number="01"
                            icon={<LuFileText />}
                            title="Choose a role"
                            text="Pick what you want to practice."
                        />

                        <Step
                            number="02"
                            icon={<LuBot />}
                            title="Take AI Interview"
                            text="Answer realistic questions."
                        />

                        <Step
                            number="03"
                            icon={<LuChartNoAxesColumnIncreasing />}
                            title="Improve"
                            text="Get feedback and repeat."
                        />
                    </div>
                </div>
            </section>

            {/* Why AI */}
            <section id="why-ai" className="px-6 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2"
                >
                    <div className="flex justify-center">
                        <div className="relative flex h-[320px] w-[320px] items-center justify-center rounded-full bg-green-50">
                            <div className="absolute h-64 w-64 rounded-full border border-green-100" />
                            <div className="absolute h-48 w-48 rounded-full border border-green-200" />

                            <LuBrain
                                size={150}
                                strokeWidth={1}
                                className="text-green-400"
                            />
                        </div>
                    </div>

                    <div>
                        <span className="text-sm font-bold uppercase tracking-wider text-green-500">
                            Why AI?
                        </span>

                        <h2 className="mt-3 max-w-lg text-4xl font-bold tracking-tight">
                            Smarter practice.
                            <br />
                            Better results.
                        </h2>

                        <p className="mt-5 max-w-md text-gray-500">
                            AI analyzes your answers and adapts to your performance.
                        </p>

                        <Link
                            to="/about"
                            className="mt-7 inline-flex items-center gap-2 font-semibold"
                        >
                            Learn more
                            <LuArrowRight size={18} />
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* CTA */}
            <section className="px-6 pb-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-7xl overflow-hidden rounded-[38px] bg-[#0d1210] px-8 py-20 text-center text-white"
                >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-400 text-black shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                        <LuBot size={27} />
                    </div>

                    <h2 className="mt-7 text-3xl font-bold md:text-4xl">
                        Ready to practice?
                    </h2>

                    <p className="mt-3 text-gray-400">
                        Your next interview starts here.
                    </p>

                    <Link
                        to="/interview"
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-black transition hover:bg-gray-100"
                    >
                        <LuSparkles size={18} />
                        Start AI Interview
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}

/* Feature Card */

function Feature({ icon, title, text }) {
    return (
        <motion.div
            variants={fadeUp}
            className="text-center"
        >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-500">
                {icon}
            </div>

            <h3 className="mt-5 font-semibold">{title}</h3>

            <p className="mt-2 text-sm text-gray-500">{text}</p>
        </motion.div>
    );
}

/* Step */

function Step({ number, icon, title, text }) {
    return (
        <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
        >
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-sm font-semibold text-green-600">
                {number}
            </div>

            <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                {icon}
            </div>

            <h3 className="mt-5 font-semibold">{title}</h3>

            <p className="mt-2 text-sm text-gray-500">{text}</p>
        </motion.div>
    );
}
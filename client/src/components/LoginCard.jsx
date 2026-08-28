import { useState } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { LuBot, LuMail, LuLock } from "react-icons/lu";

export default function LoginCard() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
    };

    return (
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.2)]">
            <div className="mb-7 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
                    <LuBot size={24} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Login to your InterviewIQ.AI account
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-black"
                    />
                </div>

                <div className="relative">
                    <LuLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-black"
                    />
                </div>

                <div className="flex justify-end">
                    <Link
                        to="/forgot-password"
                        className="text-sm text-gray-500 hover:text-black"
                    >
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    className="w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-gray-800"
                >
                    Login
                </button>
            </form>

            <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-sm text-gray-400">or</span>
                <div className="h-px flex-1 bg-gray-200" />
            </div>

            <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 py-3 font-medium text-gray-700 hover:bg-gray-50">
                <FcGoogle size={21} />
                Continue with Google
            </button>

            <p className="mt-6 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link to="/signup" className="font-semibold text-black hover:underline">
                    Sign up
                </Link>
            </p>
        </div>
    );
}
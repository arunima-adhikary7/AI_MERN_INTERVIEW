import { useState } from "react";
import { Link } from "react-router-dom";
import { LuBot, LuMail, LuArrowLeft } from "react-icons/lu";

export default function ForgotPasswordCard() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // Connect your forgot-password API here
        console.log("Reset email:", email);
    };

    return (
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.2)]">
            {/* Header */}
            <div className="mb-7 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
                    <LuBot size={24} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900">
                    Forgot password?
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                    Enter your email and we'll send you a reset link.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <LuMail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-black"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-gray-800"
                >
                    Send reset link
                </button>
            </form>

            {/* Back to Login */}
            <Link
                to="/login"
                className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-black"
            >
                <LuArrowLeft size={16} />
                Back to login
            </Link>
        </div>
    );
}
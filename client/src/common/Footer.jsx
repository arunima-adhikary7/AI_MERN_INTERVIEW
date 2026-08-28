import { Link } from "react-router-dom";
import { LuBot, LuGithub, LuLinkedin } from "react-icons/lu";

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

                    {/* Brand */}
                    <div>
                        <Link to="/" className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                                <LuBot size={21} />
                            </div>

                            <span className="text-lg font-bold">
                                InterviewIQ<span className="text-green-500">.AI</span>
                            </span>
                        </Link>

                        <p className="mt-3 text-sm text-gray-500">
                            AI-powered interview preparation.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                        <Link to="/" className="hover:text-black">
                            Home
                        </Link>
                        <Link to="/interview" className="hover:text-black">
                            Interview
                        </Link>
                        <Link to="/about" className="hover:text-black">
                            About
                        </Link>
                        <Link to="/privacy" className="hover:text-black">
                            Privacy
                        </Link>
                        <Link to="/terms" className="hover:text-black">
                            Terms
                        </Link>
                    </div>

                    {/* Social */}
                    <div className="flex gap-3">
                        <a
                            href="#"
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100"
                        >
                            <LuGithub size={18} />
                        </a>

                        <a
                            href="#"
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100"
                        >
                            <LuLinkedin size={18} />
                        </a>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-100 pt-6 text-center text-sm text-gray-400">
                    © {new Date().getFullYear()} InterviewIQ.AI. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
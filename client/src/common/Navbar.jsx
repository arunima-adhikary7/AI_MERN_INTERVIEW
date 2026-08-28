import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { LuBot, LuLogIn, LuUserPlus, LuUser } from "react-icons/lu";

export default function Navbar() {
    const { userData } = useSelector((state) => state.user);

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                        <LuBot size={22} />
                    </div>

                    <span className="text-xl font-bold text-gray-900">
                        InterviewIQ<span className="text-green-500">.AI</span>
                    </span>
                </Link>

                {/* Navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `text-sm font-medium ${isActive
                                ? "text-black"
                                : "text-gray-500 hover:text-black"
                            }`
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/interview"
                        className={({ isActive }) =>
                            `text-sm font-medium ${isActive
                                ? "text-black"
                                : "text-gray-500 hover:text-black"
                            }`
                        }
                    >
                        Interview
                    </NavLink>

                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            `text-sm font-medium ${isActive
                                ? "text-black"
                                : "text-gray-500 hover:text-black"
                            }`
                        }
                    >
                        About
                    </NavLink>
                </div>

                {/* Auth */}
                {userData ? (
                    <Link
                        to="/profile"
                        className="flex items-center justify-center"
                    >
                        {userData.profileImage ? (
                            <img
                                src={userData.profileImage}
                                alt="Profile"
                                className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                            />
                        ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                                <LuUser size={20} />
                            </div>
                        )}
                    </Link>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link
                            to="/login"
                            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            <LuLogIn size={17} />
                            Login
                        </Link>

                        <Link
                            to="/signup"
                            className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            <LuUserPlus size={17} />
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    LuUser,
    LuMail,
    LuBriefcaseBusiness,
    LuLogOut,
    LuArrowLeft,
    LuSettings,
    LuShieldCheck,
    LuLoaderCircle,
} from "react-icons/lu";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
    const dispatch = useDispatch();

    const [userData, setUserDataLocal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch current user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                setError("");

                const result = await axios.get(
                    `${API_URL}/api/user/current-user`,
                    {
                        withCredentials: true,
                    }
                );

                const user = result.data.user;

                setUserDataLocal(user);
                dispatch(setUserData(user));

            } catch (err) {
                console.error(
                    "Failed to fetch profile:",
                    err.response?.data || err.message
                );

                setError(
                    err.response?.data?.message ||
                    "Failed to load profile."
                );

                setUserDataLocal(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [dispatch]);

    // Logout
    const handleLogout = async () => {
        try {
            await axios.post(
                `${API_URL}/api/auth/logout`,
                {},
                {
                    withCredentials: true,
                }
            );

            setUserDataLocal(null);
            dispatch(setUserData(null));
            window.location.href = "/login";

        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Loading
    if (loading) {
        return (
            <main className="min-h-screen bg-[#f7f7f6] flex items-center justify-center">
                <div className="flex items-center gap-2 text-gray-500">
                    <LuLoaderCircle
                        size={20}
                        className="animate-spin"
                    />
                    Loading profile...
                </div>
            </main>
        );
    }

    // Error / not authenticated
    if (error || !userData) {
        return (
            <main className="min-h-screen bg-[#f7f7f6] flex items-center justify-center px-4">
                <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Unable to load profile
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        {error || "You are not logged in."}
                    </p>

                    <Link
                        to="/login"
                        className="mt-5 inline-block rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
                    >
                        Login
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f7f7f6] px-5 py-12">
            <div className="mx-auto max-w-3xl">

                {/* Back */}
                <Link
                    to="/"
                    className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black"
                >
                    <LuArrowLeft size={17} />
                    Back
                </Link>

                {/* Profile Card */}
                <div className="overflow-hidden rounded-[32px] bg-white shadow-[0_20px_60px_-30px_rgba(0,0,0,0.2)]">

                    {/* Header */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 px-8 py-12 text-center">

                        {userData.profileImage ? (
                            <img
                                src={userData.profileImage}
                                alt={userData.name || "Profile"}
                                className="mx-auto h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
                            />
                        ) : (
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gray-100 text-gray-500 shadow-md">
                                <LuUser size={38} />
                            </div>
                        )}

                        <h1 className="mt-5 text-2xl font-bold text-gray-900">
                            {userData.name || "User"}
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            {userData.email || "No email"}
                        </p>

                        {userData.authProvider && (
                            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-gray-600 shadow-sm">
                                <LuShieldCheck
                                    size={14}
                                    className="text-green-500"
                                />

                                {userData.authProvider === "google"
                                    ? "Google Account"
                                    : "Email Account"}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="p-8">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Account
                        </h2>

                        <div className="mt-5 space-y-3">
                            <ProfileRow
                                icon={<LuUser size={18} />}
                                label="Name"
                                value={userData.name || "Not provided"}
                            />

                            <ProfileRow
                                icon={<LuMail size={18} />}
                                label="Email"
                                value={userData.email || "Not provided"}
                            />

                            <ProfileRow
                                icon={<LuBriefcaseBusiness size={18} />}
                                label="Role"
                                value={userData.role || "User"}
                            />
                        </div>

                        {/* Actions */}
                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                            <Link
                                to="/settings"
                                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                <LuSettings size={17} />
                                Settings
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                            >
                                <LuLogOut size={17} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function ProfileRow({ icon, label, value }) {
    return (
        <div className="flex items-center gap-4 rounded-2xl bg-gray-50 px-4 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-xs text-gray-400">
                    {label}
                </p>

                <p className="mt-1 truncate text-sm font-medium text-gray-800">
                    {value}
                </p>
            </div>
        </div>
    );
}
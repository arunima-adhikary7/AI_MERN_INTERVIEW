import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    User,
    Mail,
    Coins,
    Trophy,
    Target,
    FileText,
    LogOut,
    Calendar,
    Briefcase,
    Clock,
    ChevronRight,
} from "lucide-react";

import { ServerURL } from "../App";
import { setUserData } from "../redux/userSlice";

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.user.userData);

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // =====================================================
    // GET CURRENT USER
    // =====================================================

    const getCurrentUser = async () => {
        try {
            const result = await axios.get(
                `${ServerURL}/api/user/current-user`,
                {
                    withCredentials: true,
                }
            );

            // Backend returns { user }
            dispatch(setUserData(result.data.user));
        } catch (error) {
            console.error(
                "Failed to fetch current user:",
                error
            );

            if (error.response?.status === 401) {
                dispatch(setUserData(null));
                navigate("/login");
            }
        }
    };

    // =====================================================
    // GET PREVIOUS INTERVIEWS
    // =====================================================

    const getInterviews = async () => {
        try {
            const result = await axios.get(
                `${ServerURL}/api/interview/get-interview`,
                {
                    withCredentials: true,
                }
            );

            // Backend directly returns the array
            setInterviews(result.data || []);
        } catch (error) {
            console.error(
                "Failed to fetch interviews:",
                error
            );

            setInterviews([]);
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = async () => {
        try {
            // Backend logout route is GET
            await axios.get(
                `${ServerURL}/api/auth/logout`,
                {
                    withCredentials: true,
                }
            );

            dispatch(setUserData(null));
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // =====================================================
    // FETCH DATA
    // =====================================================

    useEffect(() => {
        getCurrentUser();
        getInterviews();
    }, []);

    // =====================================================
    // STATS
    // =====================================================

    const scores = interviews
        .map((interview) => Number(interview.finalScore))
        .filter((score) => !Number.isNaN(score));

    const averageScore =
        scores.length > 0
            ? Math.round(
                scores.reduce(
                    (sum, score) => sum + score,
                    0
                ) / scores.length
            )
            : 0;

    const bestScore =
        scores.length > 0
            ? Math.max(...scores)
            : 0;

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="mx-auto max-w-6xl">

                {/* =====================================================
                    PROFILE
                ===================================================== */}

                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-5">

                            {/* Profile Image */}
                            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-2xl font-semibold text-white">

                                {userData?.profileImage ? (
                                    <img
                                        src={userData.profileImage}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    userData?.name
                                        ?.charAt(0)
                                        ?.toUpperCase() || "U"
                                )}

                            </div>

                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    {userData?.name || "User"}
                                </h1>

                                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                    <Mail size={16} />

                                    {userData?.email ||
                                        "No email"}
                                </div>

                                {userData?.authProvider && (
                                    <p className="mt-1 text-xs text-gray-400">
                                        Signed in with{" "}
                                        {userData.authProvider}
                                    </p>
                                )}
                            </div>

                        </div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                            <LogOut size={17} />
                            Logout
                        </button>

                    </div>
                </div>

                {/* =====================================================
                    STATS
                ===================================================== */}

                <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

                    {/* Credits */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                        <div className="rounded-lg bg-gray-100 p-2 w-fit">
                            <Coins size={20} />
                        </div>

                        <p className="mt-4 text-2xl font-semibold text-gray-900">
                            {userData?.credits ?? 0}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Credits
                        </p>

                    </div>

                    {/* Total Interviews */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                        <div className="rounded-lg bg-gray-100 p-2 w-fit">
                            <FileText size={20} />
                        </div>

                        <p className="mt-4 text-2xl font-semibold text-gray-900">
                            {interviews.length}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Total Interviews
                        </p>

                    </div>

                    {/* Average Score */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                        <div className="rounded-lg bg-gray-100 p-2 w-fit">
                            <Target size={20} />
                        </div>

                        <p className="mt-4 text-2xl font-semibold text-gray-900">
                            {averageScore}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Average Score
                        </p>

                    </div>

                    {/* Best Score */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                        <div className="rounded-lg bg-gray-100 p-2 w-fit">
                            <Trophy size={20} />
                        </div>

                        <p className="mt-4 text-2xl font-semibold text-gray-900">
                            {bestScore}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Best Score
                        </p>

                    </div>

                </div>

                {/* =====================================================
                    INTERVIEW HISTORY
                ===================================================== */}

                <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 p-6">

                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Previous Interviews
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Your interview history and performance
                            </p>
                        </div>

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                            {interviews.length}
                        </span>

                    </div>

                    {/* Loading */}
                    {loading ? (
                        <div className="p-10 text-center text-sm text-gray-500">
                            Loading interviews...
                        </div>
                    ) : interviews.length === 0 ? (

                        /* No Interviews */
                        <div className="p-10 text-center">

                            <FileText
                                size={40}
                                className="mx-auto text-gray-300"
                            />

                            <h3 className="mt-4 font-medium text-gray-900">
                                No interviews yet
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Start your first AI interview to see it here.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/interview")
                                }
                                className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                            >
                                Start Interview
                            </button>

                        </div>

                    ) : (

                        /* Interview List */
                        <div className="divide-y divide-gray-100">

                            {interviews.map((interview) => (

                                <div
                                    key={interview._id}
                                    className="flex flex-col gap-4 p-6 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
                                >

                                    {/* Interview Information */}
                                    <div className="flex items-start gap-4">

                                        <div className="rounded-xl bg-gray-100 p-3">
                                            <Briefcase size={20} />
                                        </div>

                                        <div>

                                            <h3 className="font-semibold text-gray-900">
                                                {interview.role ||
                                                    "AI Interview"}
                                            </h3>

                                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">

                                                <span className="flex items-center gap-1">
                                                    <User size={14} />

                                                    {interview.experience ||
                                                        "N/A"}
                                                </span>

                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />

                                                    {interview.mode ||
                                                        "N/A"}
                                                </span>

                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />

                                                    {interview.createdAt
                                                        ? new Date(
                                                            interview.createdAt
                                                        ).toLocaleDateString(
                                                            "en-IN",
                                                            {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                            }
                                                        )
                                                        : "N/A"}
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                    {/* Score / Status / View */}
                                    <div className="flex items-center justify-between gap-6 sm:justify-end">

                                        {/* Score */}
                                        <div className="text-right">

                                            <p className="text-2xl font-semibold text-gray-900">
                                                {interview.finalScore ??
                                                    "—"}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                Score
                                            </p>

                                        </div>

                                        {/* Status */}
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${interview.status ===
                                                    "completed"
                                                    ? "bg-green-100 text-green-700"
                                                    : interview.status ===
                                                        "failed"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {interview.status ||
                                                "Unknown"}
                                        </span>

                                        {/* View Report */}
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    "/interview/report",
                                                    {
                                                        state: {
                                                            interviewId:
                                                                interview._id,
                                                        },
                                                    }
                                                )
                                            }
                                            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
                                            title="View Report"
                                        >
                                            <ChevronRight
                                                size={20}
                                            />
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>
        </div>
    );
};

export default Profile;
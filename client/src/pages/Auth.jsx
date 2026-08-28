import { useLocation } from "react-router-dom";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";
import ForgotPasswordCard from "../components/ForgotPasswordCard";

export default function Auth() {
    const { pathname } = useLocation();

    if (pathname === "/signup") {
        return (
            <main className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
                <SignupCard />
            </main>
        );
    }

    if (pathname === "/forgot-password") {
        return (
            <main className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
                <ForgotPasswordCard />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
            <LoginCard />
        </main>
    );
}
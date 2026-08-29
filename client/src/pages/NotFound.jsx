import { Link } from "react-router-dom";
import { LuArrowLeft, LuHouse } from "react-icons/lu";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[#f7f7f6] flex items-center justify-center px-6">
            <div className="text-center">

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-500">
                    404 Error
                </p>

                <h1 className="mt-4 text-7xl font-bold tracking-tight text-gray-900">
                    404
                </h1>

                <h2 className="mt-4 text-2xl font-semibold text-gray-800">
                    Page not found
                </h2>

                <p className="mt-2 text-gray-500">
                    The page you're looking for doesn't exist.
                </p>

                <div className="mt-8 flex justify-center gap-3">
                    <Link
                        to="/"
                        className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                        <LuHouse size={17} />
                        Go Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        <LuArrowLeft size={17} />
                        Go Back
                    </button>
                </div>

            </div>
        </main>
    );
}
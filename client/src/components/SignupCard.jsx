
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  LuBot,
  LuUser,
  LuMail,
  LuLock,
} from "react-icons/lu";
import { auth } from "../utils/firebase";
import axios from "axios";
import { ServerURL } from "../App";

export default function SignupCard() {
  const navigate = useNavigate();

  // ================= FORM STATE =================
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // NORMAL SIGNUP
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const result = await axios.post(
        `${ServerURL}/api/auth/signup`,
        {
          name: form.name,
          email: form.email,
          password: form.password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Normal signup response:", result.data);

      // Backend stores JWT inside HTTP-only cookie.
      // No localStorage is required.

      console.log("Signup successful");

      // Redirect after signup
      navigate("/");

    } catch (error) {
      console.error("Normal signup error:", error);

      setError(
        error.response?.data?.message ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GOOGLE SIGNUP
  // =====================================================
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");

      // Create Google provider
      const provider = new GoogleAuthProvider();

      // Open Google popup
      const response = await signInWithPopup(
        auth,
        provider
      );

      const user = response.user;

      console.log("Firebase Google user:", user);

      // Get Google user information
      const name = user.displayName;
      const email = user.email;
      const googleId = user.uid;
      const profileImage = user.photoURL;

      // Send Google information to backend
      const result = await axios.post(
        `${ServerURL}/api/auth/google`,
        {
          name,
          email,
          googleId,
          profileImage,
        },
        {
          withCredentials: true,
        }
      );

      console.log(
        "Google signup response:",
        result.data
      );

      // Backend has already created the JWT
      // and stored it in an HTTP-only cookie.

      console.log("Google signup successful");

      // Redirect
      navigate("/");

    } catch (error) {
      console.error(
        "Google signup error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Google signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // UI
  // =====================================================
  return (
    <div
      className="
        w-full
        max-w-md
        rounded-3xl
        bg-white
        p-8
        shadow-[0_20px_50px_-20px_rgba(0,0,0,0.2)]
      "
    >
      {/* ================= HEADER ================= */}
      <div className="mb-7 text-center">

        <div
          className="
            mx-auto
            mb-4
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            bg-black
            text-white
          "
        >
          <LuBot size={24} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          Create account
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Start preparing with InterviewIQ.AI
        </p>

      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <div
          className="
            mb-4
            rounded-xl
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-600
          "
        >
          {error}
        </div>
      )}

      {/* ================= NORMAL SIGNUP ================= */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        {/* NAME */}
        <div className="relative">

          <LuUser
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              py-3
              pl-11
              pr-4
              outline-none
              transition
              focus:border-black
              disabled:cursor-not-allowed
              disabled:bg-gray-100
            "
          />

        </div>

        {/* EMAIL */}
        <div className="relative">

          <LuMail
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              py-3
              pl-11
              pr-4
              outline-none
              transition
              focus:border-black
              disabled:cursor-not-allowed
              disabled:bg-gray-100
            "
          />

        </div>

        {/* PASSWORD */}
        <div className="relative">

          <LuLock
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              py-3
              pl-11
              pr-4
              outline-none
              transition
              focus:border-black
              disabled:cursor-not-allowed
              disabled:bg-gray-100
            "
          />

        </div>

        {/* CREATE ACCOUNT */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            rounded-xl
            bg-black
            py-3
            font-semibold
            text-white
            transition
            hover:bg-gray-800
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading
            ? "Creating account..."
            : "Create account"}
        </button>

      </form>

      {/* ================= OR ================= */}
      <div className="my-6 flex items-center gap-3">

        <div className="h-px flex-1 bg-gray-200" />

        <span className="text-sm text-gray-400">
          or
        </span>

        <div className="h-px flex-1 bg-gray-200" />

      </div>

      {/* ================= GOOGLE SIGNUP ================= */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="
          flex
          w-full
          items-center
          justify-center
          gap-3
          rounded-xl
          border
          border-gray-200
          py-3
          font-medium
          text-gray-700
          transition
          hover:bg-gray-50
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >

        <FcGoogle size={21} />

        {loading
          ? "Signing in..."
          : "Sign up with Google"}

      </button>

      {/* ================= LOGIN ================= */}
      <p className="mt-6 text-center text-sm text-gray-500">

        Already have an account?{" "}

        <Link
          to="/login"
          className="
            font-semibold
            text-black
            hover:underline
          "
        >
          Login
        </Link>

      </p>

    </div>
  );
}


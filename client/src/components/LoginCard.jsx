import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { LuBot, LuMail, LuLock } from "react-icons/lu";
import { auth } from "../utils/firebase";
import axios from "axios";
import { ServerURL } from "../App";

export default function LoginCard() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // NORMAL LOGIN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const result = await axios.post(
        `${ServerURL}/api/auth/login`,
        {
          email: form.email,
          password: form.password,
        },
        {
          // IMPORTANT
          // Browser receives/stores HTTP-only cookie
          withCredentials: true,
        }
      );

      // console.log("Login response:", result.data);

      /*
        IMPORTANT:

        We DON'T read result.data.token.

        Backend stores JWT in HTTP-only cookie:

        res.cookie("token", token, ...)

        Browser automatically stores the cookie.
      */

      // console.log("Login successful");
      // console.log("Authentication cookie received.");

      navigate("/");
      window.location.reload();

    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const provider = new GoogleAuthProvider();

      // Firebase Google popup
      const response = await signInWithPopup(
        auth,
        provider
      );

      const user = response.user;

      console.log("Firebase Google user:", user);

      /*
        Your backend googleAuth controller currently expects:

        {
          name,
          email,
          googleId,
          profileImage
        }

        So send those fields.
      */

      const result = await axios.post(
        `${ServerURL}/api/auth/google`,
        {
          name: user.displayName,
          email: user.email,
          googleId: user.uid,
          profileImage: user.photoURL,
        },
        {
          // IMPORTANT
          // Backend sets HTTP-only cookie
          withCredentials: true,
        }
      );

      console.log(
        "Google login response:",
        result.data
      );

      /*
        DON'T do:

        const token = result.data.token;

        localStorage.setItem(...)

        Because your backend stores JWT
        inside an HTTP-only cookie.
      */

      // console.log(
      //   "Google login successful"
      // );

      // console.log(
      //   "Authentication cookie received."
      // );

      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error(
        "Google login error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Google login failed. Please try again."
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
          Welcome back
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Login to your InterviewIQ.AI account
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

      {/* ================= LOGIN FORM ================= */}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

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
              disabled:bg-gray-100
            "
          />

        </div>

        {/* FORGOT PASSWORD */}

        <div className="flex justify-end">

          <Link
            to="/forgot-password"
            className="
              text-sm
              text-gray-500
              hover:text-black
            "
          >
            Forgot password?
          </Link>

        </div>

        {/* LOGIN BUTTON */}

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
            ? "Logging in..."
            : "Login"}
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

      {/* ================= GOOGLE LOGIN ================= */}

      <button
        type="button"
        onClick={handleGoogleLogin}
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
          : "Continue with Google"}

      </button>

      {/* ================= SIGNUP ================= */}

      <p className="mt-6 text-center text-sm text-gray-500">

        Don't have an account?{" "}

        <Link
          to="/signup"
          className="
            font-semibold
            text-black
            hover:underline
          "
        >
          Sign up
        </Link>

      </p>

    </div>
  );
}
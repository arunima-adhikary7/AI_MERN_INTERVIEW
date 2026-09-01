import { useEffect } from "react";
import {
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";

import Auth from "./pages/Auth";
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";

import Step1SetUp from "./components/Step1SetUp";
import Step2Interview from "./components/Step2Interview";
import Step3Interview from "./components/Step3Interview";
import Pricing from "./components/Pricing";
import Profile from "./components/Profile";
import NotFound from "./pages/NotFound";

import { setUserData } from "./redux/userSlice";

export const ServerURL = import.meta.env.VITE_API_URL;

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // =====================================================
  // GET CURRENT USER
  // =====================================================

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(
          `${ServerURL}/api/user/current-user`,
          {
            withCredentials: true,
          }
        );

        dispatch(setUserData(result.data.user));
      } catch (err) {
        console.log(
          "User not authenticated:",
          err.response?.data?.message
        );

        dispatch(setUserData(null));
      }
    };

    getUser();
  }, [dispatch]);

  return (
    <Routes>

      {/* ================= PUBLIC ================= */}

      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/login"
        element={<Auth />}
      />

      <Route
        path="/signup"
        element={<Auth />}
      />

      <Route
        path="/forgot-password"
        element={<Auth />}
      />

      <Route
        path="/about"
        element={<About />}
      />


      {/* ================= PROFILE ================= */}

      <Route
        path="/profile"
        element={<Profile />}
      />


      {/* ================= INTERVIEW STEP 1 ================= */}

      <Route
        path="/interview"
        element={
          <Step1SetUp
            onStart={(data) => {
              navigate("/2", {
                state: data,
              });
            }}
          />
        }
      />


      {/* ================= INTERVIEW STEP 2 ================= */}

      <Route
        path="/2"
        element={<Step2Interview />}
      />


      {/* ================= INTERVIEW STEP 3 ================= */}

      <Route
        path="/3"
        element={<Step3Interview />}
      />


      {/* ================= INTERVIEW REPORT ================= */}

      <Route
        path="/interview/report"
        element={<Step3Interview />}
      />


      {/* ================= PAYMENT ================= */}

      <Route
        path="/payment"
        element={<Pricing />}
      />


      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

export default App;
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import axios from "axios";

import Auth from "./pages/Auth";
import LandingPage from "./pages/LandingPage";
import Interview from "./pages/Interview";
import About from "./pages/About";
import { setUserData } from "./redux/userSlice";
import { useDispatch } from "react-redux";
export const ServerURL = "http://localhost:8000";

function App() {

  const dispatch = useDispatch();
  useEffect(() => {

    const getUser = async () => {
      try {

        const result = await axios.get(
          ServerURL + "/api/user/current-user",
          {
            withCredentials: true
          }
         
        );
   dispatch(setUserData(result.data))
        console.log("Current user:", result.data);

      } catch (err) {

        console.error("Error fetching user:", err);
         dispatch(setUserData(null))

      }
    };

    getUser();

  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />
      <Route path="/forgot-password" element={<Auth />} />
      <Route path="/interview" element={<Interview />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;
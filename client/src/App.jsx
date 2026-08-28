import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import axios from "axios";

import Auth from "./pages/Auth";
import LandingPage from "./pages/LandingPage";
import Interview from "./pages/Interview";
import About from "./pages/About";
import { setUserData } from "./redux/userSlice";
import { useDispatch } from "react-redux";
import Step1SetUp from "./components/Step1SetUp" 
export const ServerURL = "http://localhost:8000";
import Step2Interview from  "./components/Step2Interview";
import Step3Interview from "./components/Step3Interview";
import Pricing from "./components/Pricing";

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
      <Route path='/1' element={<Step1SetUp/>}/>
      <Route path='/2' element={<Step2Interview/>}/>
      <Route path='/3' element={<Step3Interview/>}/>
      <Route path='/4' element ={<Pricing/>}/>


    </Routes>
  );
}

export default App;
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  UserRound,
  BriefcaseBusiness,
  Mic,
  ChartNoAxesColumnIncreasing,
  Upload,
  FileText,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Step1SetUp = ({ onStart }) => {
  const { userData } = useSelector((state) => state.user)
  const dispatch = useDispatch();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [experience, setExperience] = useState("");
  const [interviewType, setInterviewType] =
    useState("Technical Interview");

  const [resume, setResume] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // ==========================================
  // API URL
  // ==========================================

  const API_URL = import.meta.env.VITE_API_URL;

  // ==========================================
  // HANDLE RESUME SELECTION
  // ==========================================

  const handleResumeChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Allowed file types
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF, DOC, or DOCX file.");

      e.target.value = "";

      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert("Resume size should be less than 5MB.");

      e.target.value = "";

      return;
    }

    setResume(file);

    // Remove previous analysis
    setAnalysisResult(null);

    // Automatically analyze resume
    await handleUploadResume(file);
  };

  // ==========================================
  // UPLOAD RESUME
  // ==========================================

  const handleUploadResume = async (file) => {
    if (!file || analyzing) return;

    setAnalyzing(true);

    const formData = new FormData();

    // Must match multer field name
    formData.append("resume", file);

    try {
      console.log("Uploading resume...");
      console.log("API URL:", API_URL);

      const result = await axios.post(
        `${API_URL}/api/interview/resume`,
        formData,
        {
          // ==========================================
          // IMPORTANT
          // Send HTTP-only authentication cookie
          // ==========================================
          withCredentials: true,
        }
      );

      console.log(
        "Resume analysis response:",
        result.data
      );

      setAnalysisResult({
        projects: Array.isArray(result.data.projects)
          ? result.data.projects
          : [],

        skills: Array.isArray(result.data.skills)
          ? result.data.skills
          : [],
      });

    } catch (error) {
      console.error(
        "Resume upload failed:",
        error.response?.data || error.message
      );

      setAnalysisResult(null);

      // ==========================================
      // AUTHENTICATION ERROR
      // Cookie missing / expired / invalid
      // ==========================================

      if (error.response?.status === 401) {
        alert(
          "You are not authenticated. Please login again."
        );

        return;
      }

      // ==========================================
      // OTHER ERRORS
      // ==========================================

      alert(
        error.response?.data?.message ||
        "Failed to analyze resume. Please try again."
      );

    } finally {
      setAnalyzing(false);
    }
  };

  // ==========================================
  // START INTERVIEW
  // ==========================================

  const handleStart = async () => {
    if (!role.trim()) {
      alert("Please enter your role.");
      return;
    }

    if (!experience.trim()) {
      alert("Please enter your experience.");
      return;
    }

    if (analyzing) {
      alert("Please wait until resume analysis is completed.");
      return;
    }

    try {
      setLoading(true);

      const result = await axios.post(
        `${API_URL}/api/interview/generate-questions`,
        {
          role,
          experience,
          mode:interviewType,
          projects: analysisResult?.projects || [],
          skills: analysisResult?.skills || [],
        },
        {
          withCredentials: true, 
        }
      );

      if (userData) {
        dispatch(
          setUserData({
            ...userData,
            credits: result.data.creditsLeft,
          })
        );
      }

      onStart(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-gray-100
        to-gray-200
        px-4
        py-8
      "
    >

      <div
        className="
          w-full
          max-w-6xl
          bg-white
          rounded-3xl
          shadow-2xl
          grid
          md:grid-cols-2
          overflow-hidden
        "
      >

        {/* ==========================================
            LEFT SIDE
        ========================================== */}

        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="
            bg-gradient-to-br
            from-green-50
            to-emerald-100
            p-10
            md:p-12
            flex
            flex-col
            justify-center
          "
        >

          <h1
            className="
              text-3xl
              md:text-4xl
              font-bold
              text-gray-800
              mb-4
            "
          >
            Start Your AI Interview
          </h1>

          <p
            className="
              text-gray-600
              text-sm
              md:text-base
              leading-relaxed
              max-w-md
              mb-8
            "
          >
            Practice real interview scenarios powered by AI.
            Improve communication, technical skills, and confidence.
          </p>

          {/* ROLE & EXPERIENCE */}

          <div
            className="
              bg-white
              rounded-lg
              px-4
              py-3
              mb-4
              flex
              items-center
              gap-3
              shadow-sm
            "
          >

            <UserRound
              size={20}
              className="text-green-600"
            />

            <span
              className="
                text-sm
                font-medium
                text-gray-700
              "
            >
              Choose Role & Experience
            </span>

          </div>

          {/* VOICE INTERVIEW */}

          <div
            className="
              bg-white
              rounded-lg
              px-4
              py-3
              mb-4
              flex
              items-center
              gap-3
              shadow-sm
            "
          >

            <Mic
              size={20}
              className="text-green-600"
            />

            <span
              className="
                text-sm
                font-medium
                text-gray-700
              "
            >
              Smart Voice Interview
            </span>

          </div>

          {/* ANALYTICS */}

          <div
            className="
              bg-white
              rounded-lg
              px-4
              py-3
              flex
              items-center
              gap-3
              shadow-sm
            "
          >

            <ChartNoAxesColumnIncreasing
              size={20}
              className="text-green-600"
            />

            <span
              className="
                text-sm
                font-medium
                text-gray-700
              "
            >
              Performance Analytics
            </span>

          </div>

        </motion.div>

        {/* ==========================================
            RIGHT SIDE
        ========================================== */}

        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="
            p-10
            md:p-12
            flex
            flex-col
            justify-center
          "
        >

          <h2
            className="
              text-2xl
              md:text-3xl
              font-bold
              text-gray-800
              mb-6
            "
          >
            Interview Setup
          </h2>

          {/* ==========================================
              ROLE
          ========================================== */}

          <div className="relative mb-4">

            <UserRound
              size={18}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="Enter role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="
                w-full
                h-12
                pl-10
                pr-4
                border
                border-gray-200
                rounded-xl
                outline-none
                focus:border-green-500
                focus:ring-2
                focus:ring-green-100
                transition
              "
            />

          </div>

          {/* ==========================================
              EXPERIENCE
          ========================================== */}

          <div className="relative mb-4">

            <BriefcaseBusiness
              size={18}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="Experience (e.g. 2 years)"
              value={experience}
              onChange={(e) =>
                setExperience(e.target.value)
              }
              className="
                w-full
                h-12
                pl-10
                pr-4
                border
                border-gray-200
                rounded-xl
                outline-none
                focus:border-green-500
                focus:ring-2
                focus:ring-green-100
                transition
              "
            />

          </div>

          {/* ==========================================
              INTERVIEW TYPE
          ========================================== */}

          <div className="mb-4">

            <select
              value={interviewType}
              onChange={(e) =>
                setInterviewType(e.target.value)
              }
              className="
                w-full
                h-12
                px-4
                border
                border-gray-200
                rounded-xl
                outline-none
                focus:border-green-500
                focus:ring-2
                focus:ring-green-100
                transition
                bg-white
                text-gray-700
              "
            >

              <option>
                Technical Interview
              </option>

              <option>
                HR Interview
              </option>

              <option>
                Behavioral Interview
              </option>

              <option>
                Mixed Interview
              </option>

            </select>

          </div>

          {/* ==========================================
              RESUME UPLOAD
          ========================================== */}

          <label
            htmlFor="resume"
            className={`
              h-28
              border-2
              border-dashed
              rounded-xl
              flex
              flex-col
              items-center
              justify-center
              transition
              mb-5

              ${analyzing
                ? `
                    border-green-400
                    bg-green-50/30
                    cursor-wait
                  `
                : `
                    border-gray-200
                    hover:border-green-400
                    hover:bg-green-50/30
                    cursor-pointer
                  `
              }
            `}
          >

            <Upload
              size={25}
              className="
                text-green-600
                mb-2
              "
            />

            {analyzing ? (

              <div className="text-center">

                <span
                  className="
                    text-sm
                    text-green-600
                    font-medium
                  "
                >
                  Analyzing resume...
                </span>

                <p
                  className="
                    text-xs
                    text-gray-400
                    mt-1
                  "
                >
                  Extracting projects & skills
                </p>

              </div>

            ) : resume ? (

              <div
                className="
                  flex
                  flex-col
                  items-center
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-gray-700
                  "
                >

                  <FileText size={16} />

                  <span
                    className="
                      max-w-[250px]
                      truncate
                    "
                  >
                    {resume.name}
                  </span>

                </div>

                <span
                  className="
                    text-xs
                    text-green-600
                    mt-1
                  "
                >
                  Resume analyzed successfully
                </span>

              </div>

            ) : (

              <div className="text-center">

                <span
                  className="
                    text-sm
                    text-gray-600
                  "
                >
                  Click to upload resume (Optional)
                </span>

                <p
                  className="
                    text-xs
                    text-gray-400
                    mt-1
                  "
                >
                  PDF, DOC, DOCX • Max 5MB
                </p>

              </div>

            )}

            <input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              disabled={analyzing}
              className="hidden"
            />

          </label>

          {/* ==========================================
              RESUME ANALYSIS RESULT
          ========================================== */}

          {analysisResult && (

            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
              }}
              className="
                bg-gray-50
                border
                border-gray-200
                rounded-xl
                p-4
                mb-5
              "
            >

              <h3
                className="
                  font-semibold
                  text-gray-800
                  mb-4
                "
              >
                Resume Analysis Result
              </h3>

              {/* PROJECTS */}

              {analysisResult.projects.length > 0 && (

                <div className="mb-4">

                  <p
                    className="
                      font-medium
                      text-gray-700
                      mb-2
                    "
                  >
                    Projects:
                  </p>

                  <ul
                    className="
                      list-disc
                      ml-5
                      text-sm
                      text-gray-600
                      space-y-1
                    "
                  >

                    {analysisResult.projects.map(
                      (project, index) => (

                        <li key={index}>
                          {project}
                        </li>

                      )
                    )}

                  </ul>

                </div>

              )}

              {/* SKILLS */}

              {analysisResult.skills.length > 0 && (

                <div>

                  <p
                    className="
                      font-medium
                      text-gray-700
                      mb-2
                    "
                  >
                    Skills:
                  </p>

                  <div
                    className="
                      flex
                      flex-wrap
                      gap-2
                    "
                  >

                    {analysisResult.skills.map(
                      (skill, index) => (

                        <span
                          key={index}
                          className="
                            px-3
                            py-1
                            bg-green-100
                            text-green-700
                            rounded-full
                            text-xs
                            font-medium
                          "
                        >
                          {skill}
                        </span>

                      )
                    )}

                  </div>

                </div>

              )}

              {/* NOTHING FOUND */}

              {analysisResult.projects.length === 0 &&
                analysisResult.skills.length === 0 && (

                  <p
                    className="
                      text-sm
                      text-gray-500
                    "
                  >
                    No projects or skills could be
                    extracted from this resume.
                  </p>

                )}

            </motion.div>

          )}

          {/* ==========================================
              START INTERVIEW
          ========================================== */}

          <button
            onClick={handleStart}
            disabled={analyzing}
            className="
              w-full
              h-12
              cursor-pointer
              rounded-full
              bg-green-600
              hover:bg-green-700
              disabled:bg-gray-400
              disabled:cursor-not-allowed
              text-white
              font-semibold
              transition
              duration-300
              shadow-md
            "
          >
            {analyzing
              ? "Analyzing Resume..."
              : "Start Interview"}
          </button>

        </motion.div>

      </div>

    </motion.div>
  );
};

export default Step1SetUp;
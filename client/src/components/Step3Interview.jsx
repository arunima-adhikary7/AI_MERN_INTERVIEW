import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Download,
  Loader2,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getPerformanceMessage = (score) => {
  if (score >= 8) {
    return {
      title: "Excellent performance!",
      description:
        "You demonstrated strong interview skills.",
    };
  }

  if (score >= 6) {
    return {
      title: "Good performance.",
      description:
        "A few improvements can make your answers stronger.",
    };
  }

  if (score >= 4) {
    return {
      title: "Moderate performance.",
      description:
        "Keep practicing to improve your interview skills.",
    };
  }

  return {
    title: "Significant improvement required.",
    description:
      "Work on clarity, confidence and technical accuracy.",
  };
};

function Step3Interview() {
  const navigate = useNavigate();
  const location = useLocation();

  const interviewId = location.state?.interviewId;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH INTERVIEW REPORT
  // =====================================================

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchReport = async () => {
      if (!interviewId) {
        setError("Interview ID not found.");
        setLoading(false);
        return;
      }

      try {
        const result = await axios.get(
          `${API_URL}/api/interview/report/${interviewId}`,
          {
            withCredentials: true,
          }
        );

        // console.log("Interview report:", result.data);

        setReport(result.data);
      } catch (error) {
        console.error(
          "Failed to fetch interview report:",
          error.response?.data || error.message
        );

        setError(
          error.response?.data?.message ||
          "Failed to load interview report."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [interviewId]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4fbf8]">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2
            size={22}
            className="animate-spin"
          />
          Loading interview report...
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4fbf8] px-5">
        <div className="bg-white rounded-3xl shadow-sm p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-800">
            Unable to load report
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error || "Report not found."}
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // REPORT DATA
  // =====================================================

  const overallScore = Number(report.finalScore || 0);

  const message = getPerformanceMessage(
    overallScore
  );

  const skills = [
    {
      name: "Confidence",
      score: Number(report.confidence || 0),
    },
    {
      name: "Communication",
      score: Number(report.communication || 0),
    },
    {
      name: "Correctness",
      score: Number(report.correctness || 0),
    },
  ];

  const performanceData = (
    report.questionWiseScore || []
  ).map((item, index) => ({
    question: `Q${index + 1}`,
    score: Number(item.score || 0),
  }));

  // =====================================================
  // DOWNLOAD
  // =====================================================

  const handleDownloadPDF = () => {
    window.print();
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f4fbf8] text-[#172126]">

      {/* HEADER */}
      <header className="px-6 md:px-10 lg:px-14 pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

          <div className="flex items-start gap-5">

            <button
              onClick={() => navigate(-1)}
              className="mt-1 w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition"
            >
              <ArrowLeft size={23} />
            </button>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Interview Analytics Dashboard
              </h1>

              <p className="text-gray-500 mt-2 text-base">
                AI-powered performance insights
              </p>
            </div>

          </div>

          <button
            onClick={handleDownloadPDF}
            className="bg-[#08a878] hover:bg-[#078f67] text-white px-7 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 shadow-sm transition"
          >
            <Download size={20} />
            Download PDF
          </button>

        </div>
      </header>

      {/* MAIN */}
      <main className="px-5 md:px-8 lg:px-10 pb-12">

        <div className="grid grid-cols-1 xl:grid-cols-[525px_1fr] gap-7">

          {/* LEFT COLUMN */}
          <div className="space-y-7">

            {/* OVERALL PERFORMANCE */}
            <section className="bg-white rounded-[26px] shadow-[0_8px_30px_rgba(0,0,0,0.07)] px-8 py-9 text-center">

              <h2 className="text-lg font-medium text-gray-600 mb-7">
                Overall Performance
              </h2>

              <div className="relative w-32 h-32 mx-auto">

                <svg
                  viewBox="0 0 120 120"
                  className="w-full h-full -rotate-90"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />

                  <circle
                    cx="60"
                    cy="60"
                    r="46"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(overallScore / 10) * 289
                      } 289`}
                  />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-medium text-green-600">
                    {overallScore}/10
                  </span>
                </div>

              </div>

              <p className="text-sm text-gray-500 mt-3">
                Out of 10
              </p>

              <h3 className="font-semibold text-lg mt-8">
                {message.title}
              </h3>

              <p className="text-gray-500 mt-1">
                {message.description}
              </p>

            </section>

            {/* SKILLS */}
            <section className="bg-white rounded-[26px] shadow-[0_8px_30px_rgba(0,0,0,0.07)] px-8 py-8">

              <h2 className="text-xl font-semibold mb-8">
                Skill Evaluation
              </h2>

              <div className="space-y-6">

                {skills.map((skill) => {
                  const percentage =
                    (skill.score / 10) * 100;

                  return (
                    <div key={skill.name}>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-base font-medium">
                          {skill.name}
                        </span>

                        <span className="text-[#10a875] font-semibold">
                          {skill.score}
                        </span>
                      </div>

                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0ac878] rounded-full transition-all duration-700"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                    </div>
                  );
                })}

              </div>

            </section>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-7">

            {/* PERFORMANCE TREND */}
            <section className="bg-white rounded-[26px] shadow-[0_8px_30px_rgba(0,0,0,0.07)] p-7">

              <h2 className="text-xl font-semibold mb-5">
                Performance Trend
              </h2>

              <div className="w-full h-[310px]">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart
                    data={performanceData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 5,
                    }}
                  >

                    <CartesianGrid
                      stroke="#d9dfdc"
                      strokeDasharray="2 3"
                    />

                    <XAxis
                      dataKey="question"
                      tick={{
                        fill: "#6b7280",
                        fontSize: 14,
                      }}
                    />

                    <YAxis
                      domain={[0, 10]}
                      ticks={[0, 3, 6, 10]}
                    />

                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#13b875"
                      strokeWidth={3}
                      fill="url(#performanceGradient)"
                      dot={false}
                      activeDot={{ r: 5 }}
                    />

                    <defs>
                      <linearGradient
                        id="performanceGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#16c784"
                          stopOpacity={0.25}
                        />

                        <stop
                          offset="100%"
                          stopColor="#16c784"
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                    </defs>

                  </AreaChart>
                </ResponsiveContainer>

              </div>

            </section>

            {/* AI INSIGHTS */}
            <section className="bg-white rounded-[26px] shadow-[0_8px_30px_rgba(0,0,0,0.07)] p-7">

              <h2 className="text-xl font-semibold mb-5">
                AI Performance Insights
              </h2>

              <div className="grid md:grid-cols-2 gap-5">

                <div className="rounded-2xl bg-[#effbf6] p-5">
                  <p className="text-sm font-semibold text-[#079669] mb-2">
                    Strengths
                  </p>

                  <p className="text-gray-600 leading-7">
                    {report.communication >= report.confidence
                      ? "Your communication was one of your stronger areas."
                      : "You demonstrated reasonable confidence during the interview."}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#fff8ed] p-5">
                  <p className="text-sm font-semibold text-orange-500 mb-2">
                    Areas to Improve
                  </p>

                  <p className="text-gray-600 leading-7">
                    {report.correctness < 5
                      ? "Focus on improving technical accuracy and completeness."
                      : report.confidence < 5
                        ? "Focus on delivering answers with more confidence and structure."
                        : "Continue practicing to make your answers more precise."}
                  </p>
                </div>

              </div>

            </section>

            {/* QUESTIONS */}
            <section className="bg-white rounded-[26px] shadow-[0_8px_30px_rgba(0,0,0,0.07)] p-7">

              <h2 className="text-xl font-semibold mb-6">
                Questions & Scores
              </h2>

              <div className="space-y-3">

                {(report.questionWiseScore || []).map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-2xl bg-[#f7faf9] px-5 py-4 border border-gray-100 hover:bg-[#f1faf6] transition"
                    >

                      <div className="flex items-center gap-4 min-w-0">

                        <div className="w-10 h-10 rounded-full bg-[#e9f9f3] text-[#08a878] flex items-center justify-center font-semibold shrink-0">
                          {index + 1}
                        </div>

                        <div className="min-w-0">
                          <p className="font-medium text-gray-800">
                            Question {index + 1}
                          </p>

                          <p className="text-sm text-gray-500 truncate">
                            {item.question}
                          </p>

                          {item.feedback && (
                            <p className="text-xs text-gray-400 mt-1">
                              {item.feedback}
                            </p>
                          )}
                        </div>

                      </div>

                      <div className="text-right ml-4 shrink-0">
                        <p className="text-lg font-bold text-[#08a878]">
                          {item.score || 0}/10
                        </p>

                        <p className="text-xs text-gray-400">
                          Score
                        </p>
                      </div>

                    </div>
                  )
                )}

              </div>

            </section>

          </div>
        </div>
      </main>

      {/* PRINT */}
      <style>
        {`
          @media print {
            body {
              background: white !important;
            }

            button {
              display: none !important;
            }

            section {
              box-shadow: none !important;
              break-inside: avoid;
            }
          }
        `}
      </style>

    </div>
  );
}

export default Step3Interview;
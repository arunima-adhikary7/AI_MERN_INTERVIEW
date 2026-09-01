import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import axios from "axios";
const ServerURL = import.meta.env.VITE_API_URL;
const plans = [
  {
    id: "free",
    name: "Free",
    badge: "Default",
    badgeStyle: "bg-slate-100 text-slate-500",
    price: "₹0",
    credits: "100 Credits",
    description: "Perfect for beginners starting interview preparation.",
    features: [
      "100 AI Interview Credits",
      "Basic Performance Report",
      "Voice Interview Access",
      "Limited History Tracking",
    ],
  },
  {
    id: "starter",
    name: "Starter Pack",
    price: "₹100",
    credits: "150 Credits",
    description: "Great for focused practice and skill improvement.",
    features: [
      "150 AI Interview Credits",
      "Detailed Feedback",
      "Performance Analytics",
      "Full Interview History",
    ],
  },
  {
    id: "pro",
    name: "Pro Pack",
    badge: "Best Value",
    badgeStyle: "bg-emerald-600 text-white",
    price: "₹500",
    credits: "650 Credits",
    description: "Best value for serious job preparation.",
    features: [
      "650 AI Interview Credits",
      "Advanced AI Feedback",
      "Skill Trend Analysis",
      "Priority AI Processing",
    ],
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("starter");
  const dispatch = useDispatch();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handlePayment = async (plan) => {
    if (plan.id === "free") {
      return;
    }

    try {
      setLoadingPlan(plan.id);

      const amount =
        plan.id === "starter"
          ? 100
          : plan.id === "pro"
            ? 500
            : 0;

      const credits =
        plan.id === "starter"
          ? 150
          : plan.id === "pro"
            ? 650
            : 0;

      // Create order
      const result = await axios.post(
        `${ServerURL}/api/payment/order`,
        {
          planId: plan.id,
          amount,
          credits,
        },
        {
          withCredentials: true,
        }
      );

      const order = result.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "InterviewIQ.AI",
        description: `${plan.name} ${credits} Credits`,
        order_id: order.id,

        handler: async function (response) {
          try {
            console.log("Razorpay success response:", response);

            const verifyPay = await axios.post(
              `${ServerURL}/api/payment/verify`,
              response,
              {
                withCredentials: true,
              }
            );

            console.log("Backend verification:", verifyPay.data);

            if (verifyPay.data.success) {
              dispatch(setUserData(verifyPay.data.user));

              alert("Payment successful!");
              navigate("/");
            } else {
              alert("Payment verification failed!");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed!");
          }
        },

        theme: {
          color: "#10b981",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        alert("Payment failed");
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert(
        error.response?.data?.message ||
        "Something went wrong while creating payment"
      );
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4faf7] px-5 py-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition hover:shadow-md"
        >
          <ArrowLeft size={19} />
        </button>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Choose Your Plan
          </h1>

          <p className="mt-3 text-sm text-slate-500 md:text-base">
            Flexible pricing to match your interview preparation goals.
          </p>
        </div>

        {/* Plans */}
        <div className="grid items-stretch gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const selected = selectedPlan === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative flex cursor-pointer flex-col rounded-[28px] bg-white p-7 transition-all duration-300 ${selected
                    ? "border border-emerald-300 shadow-[0_15px_40px_-15px_rgba(16,185,129,0.28)]"
                    : "border border-transparent shadow-[0_8px_30px_-18px_rgba(0,0,0,0.18)] hover:-translate-y-1 hover:shadow-lg"
                  }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-800">
                    {plan.name}
                  </h2>

                  {plan.badge && (
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-medium ${plan.badgeStyle}`}
                    >
                      {plan.badge}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mt-5">
                  <div className="text-4xl font-extrabold tracking-tight text-emerald-600">
                    {plan.price}
                  </div>

                  <p className="mt-1 text-sm text-slate-400">
                    {plan.credits}
                  </p>
                </div>

                {/* Description */}
                <p className="mt-5 min-h-[48px] text-sm leading-6 text-slate-500">
                  {plan.description}
                </p>

                {/* Features */}
                <div className="mt-6 flex-1">
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-sm text-slate-600"
                      >
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                          <Check size={10} strokeWidth={3} />
                        </span>

                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Button */}
                <button
                  onClick={(e) => {                    
                    e.stopPropagation();
                    if (!selected)
                      setSelectedPlan(plan.id);
                    else
                      handlePayment(plan)
                  }}
                  className={`mt-8 w-full rounded-xl py-3.5 text-sm font-semibold transition ${selected
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                >
                  {selected ? "Proceed to Pay" : "Select Plan"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <p className="mt-8 text-center text-xs text-slate-400">
          Secure payments · Instant credit activation
        </p>
      </div>
    </main>
  );
}
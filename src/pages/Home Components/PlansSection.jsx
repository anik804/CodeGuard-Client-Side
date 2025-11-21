import React from "react";
import { useNavigate } from "react-router";

const PlansSection = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Premium Individual",
      price: "FREE",
      bg: "bg-pink-100",
      border: "border-pink-500",
      text: "Try free for 1 month",
      buttonBg: "bg-pink-500",
      features: [
        "1 Premium account",
        "Cancel anytime",
        "15 hours/month of listening time from our catalog",
      ],
    },
    {
      name: "Premium Duo",
      price: "$14.99",
      bg: "bg-yellow-100",
      border: "border-yellow-500",
      text: "Get Premium Duo",
      buttonBg: "bg-yellow-500",
      features: [
        "2 Premium accounts",
        "Cancel anytime",
        "15 hours/month of listening time (plan manager only)",
      ],
    },
    {
      name: "Premium Family",
      price: "$16.99",
      bg: "bg-blue-100",
      border: "border-blue-500",
      text: "Get Premium Family",
      buttonBg: "bg-blue-500",
      features: [
        "Up to 6 Premium or Kids accounts",
        "Block explicit music",
        "Access to Kids mode",
        "Cancel anytime",
        "15 hours/month of listening time (plan manager only)",
      ],
    },
  ];

  return (
    <div className=" py-10 px-4">
      <h2 className="text-3xl font-bold text-cyan-700 text-center mb-8">
        Choose Your Premium Plan
      </h2>
      <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 md:grid-cols-3">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-lg border ${plan.bg} ${plan.border} shadow-lg flex flex-col justify-between`}
          >
            <div>
              <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {plan.price === "FREE" ? "Free For 1 Month" : `${plan.price} / month`}
              </p>
              <ul className="mb-6 text-gray-800 text-sm list-disc pl-5 space-y-1">
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
            <button
               onClick={() => navigate("/subscription")}
              className={`${plan.buttonBg} hover:opacity-90 text-white font-semibold py-2 px-4 rounded`}
            >
              {plan.text}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlansSection;

// update
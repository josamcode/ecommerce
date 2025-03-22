"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import useTranslation from "@/app/hooks/useTranslation";
import { useLanguage } from "@/app/context/LanguageContext";

const faqKeys = [
  {
    questionKey: "ShippingTimeQuestion",
    answerKey: "ShippingTimeAnswer",
  },
  {
    questionKey: "PaymentMethodsQuestion",
    answerKey: "PaymentMethodsAnswer",
  },
  {
    questionKey: "ReturnPolicyQuestion",
    answerKey: "ReturnPolicyAnswer",
  },
  {
    questionKey: "ProductAuthenticityQuestion",
    answerKey: "ProductAuthenticityAnswer",
  },
];

export default function FAQSection() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-10 bg-gray-900 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold">{t.FAQTitle}</h2>
        <p className="text-gray-300 mb-8 mt-2">{t.FAQSubtitle}</p>
      </div>
      <div className="max-w-3xl mx-auto">
        {faqKeys.map((faq, index) => (
          <div
            key={index}
            className="mb-4 border-b border-gray-700"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center py-4 text-lg font-semibold text-left"
            >
              {t[faq.questionKey]}
              <span className="text-gray-400">
                {openIndex === index ? "-" : "+"}
              </span>
            </button>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: openIndex === index ? "auto" : 0,
                opacity: openIndex === index ? 1 : 0,
              }}
              className="overflow-hidden text-gray-300"
            >
              <p className={`py-2 px-0`}>
                {t[faq.answerKey]}
              </p>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

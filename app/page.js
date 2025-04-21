"use client";

import { useEffect, useState } from "react";
import BestSellers from "@/app/shop/page";
import Collections from "./collections/page";
import DealsOffers from "@/components/DealsOffers";
import FAQSection from "@/components/FAQSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import useTranslation from "./hooks/useTranslation";
import { useLanguage } from "./context/LanguageContext";

export default function Home() {
  const { language } = useLanguage();
  const t = useTranslation(language);

  const [clientLanguage, setClientLanguage] = useState(null);

  useEffect(() => {
    setClientLanguage(language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    fetch("https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/visits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page: "home" }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Visit count:", data.visits);
      })
      .catch((err) => console.error("Error tracking visit:", err));
  }, []);

  if (!clientLanguage) return null;

  return (
    <div className={clientLanguage === "ar" ? "text-right" : "text-left"}>
      <Header lang={clientLanguage} />
      <HeroSection lang={clientLanguage} t={t} />
      <Collections lang={clientLanguage} type="section" t={t} />
      <FeaturedProducts lang={clientLanguage} t={t} />
      <BestSellers lang={clientLanguage} type="section" t={t} />
      <FAQSection lang={clientLanguage} t={t} />
      <DealsOffers lang={clientLanguage} t={t} />
      <Footer lang={clientLanguage} t={t} />
    </div>
  );
}

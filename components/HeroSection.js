"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import useTranslation from "@/app/hooks/useTranslation";
import { useLanguage } from "@/app/context/LanguageContext";

export default function HeroSection() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  

  return (
    <section
      
      className={`relative w-full py-24 px-4 sm:px-6 flex flex-col items-center justify-center text-white overflow-hidden bg-[#0F0F0F] ${
        language === "ar" ? "font-cairo" : ""
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(17, 92, 255, 0.5),_transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(37,99,235,0.5),_transparent)]"></div>
        <div className="absolute w-full h-full bg-grid-white/[0.05]"></div>
      </div>
      {/* Animated Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="pb-2 text-5xl md:text-7xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-cyan-100"
      >
        {t.hero_title}
      </motion.h1>
      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-lg text-gray-300 mt-4 max-w-2xl text-center"
      >
        {t.hero_subtitle}
      </motion.p>
      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className={`relative z-10 flex space-x-4 ${
          language === "ar" ? "space-x-reverse gap-3" : ""
        } mt-6`}
      >
        <Link
          href="/shop"
          className="px-6 py-3 bg-cyan-500 text-white rounded-full font-bold hover:bg-cyan-600 transition duration-300 cursor-pointer no-underline hover:no-underline"
        >
          {t.shop_now}
        </Link>
        <Link
          href="/collections"
          className="px-6 py-3 border border-white rounded-full font-bold hover:bg-white hover:text-black transition duration-300 cursor-pointer no-underline hover:no-underline"
        >
          {t.explore}
        </Link>
      </motion.div>
    </section>
  );
}

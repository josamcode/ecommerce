"use client";
import { useState, createContext, useContext } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Check if localStorage exists before using it.
  const initialLanguage =
    typeof window !== "undefined" && localStorage.getItem("language")
      ? localStorage.getItem("language")
      : "en";

  const [language, setLanguage] = useState(initialLanguage);

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "ar" : "en";
    setLanguage(newLanguage);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLanguage);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

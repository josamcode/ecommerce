import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

// Defining paths for local files
const locales = {
  en: () => import("../locales/en.json"),
  ar: () => import("../locales/ar.json"),
};

export default function useTranslation() {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState(null);

  useEffect(() => {
    locales[language || "en"]()
      .then((module) => {
        setTranslations(module.default);
      })
      .catch((error) => {
        console.error("Error loading translations:", error);
        setTranslations({});
      });
  }, [language]);

  return translations || {};
}

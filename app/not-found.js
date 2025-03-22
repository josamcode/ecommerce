"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import { useLanguage } from "./context/LanguageContext";
import useTranslation from "./hooks/useTranslation";

export default function NotFound() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center py-40 text-center px-4">
        <h1 className="text-6xl font-bold text-blue-600">404</h1>
        <p className="text-gray-800 text-lg mt-2">
          {t.notFound}
        </p>

        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-500 transition"
          >
            {t.home}
          </Link>
          <Link
            href="/collections"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-500 transition"
          >
            {t.CollectionsLink}
          </Link>
          <Link
            href="/about"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-500 transition"
          >
            {t.about}
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-500 transition"
          >
            {t.contact}
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

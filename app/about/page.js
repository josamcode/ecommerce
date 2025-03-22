"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import useTranslation from "@/app/hooks/useTranslation";
import { useLanguage } from "@/app/context/LanguageContext";

const routes = [
  { nameKey: "home", path: "/" },
  { nameKey: "shop", path: "/shop" },
  { nameKey: "CollectionsLink", path: "/collections" },
  { nameKey: "about", path: "/about" },
  { nameKey: "contact", path: "/contact" },
];

export default function About({ type }) {
  const { language } = useLanguage();
  const t = useTranslation(language);

  return (
    <>
      <Header />
      <section className="w-full my-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Title */}
            <h2 className="sm:text-2xl lg:text-4xl font-bold text-blue-600">
              {t.AboutUsTitle}
            </h2>
            {/* Description */}
            <p className="text-gray-500 mt-4 text-lg">{t.AboutUsDescription}</p>
          </div>

          {/* Quick Links */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-700">
              {t.QuickLinksTitle}
            </h3>
            <ul className="mt-4 space-y-2">
              {routes.map((route) => (
                <li key={route.path}>
                  <Link
                    href={route.path}
                    className="text-blue-600 hover:underline text-lg"
                  >
                    {t[route.nameKey]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

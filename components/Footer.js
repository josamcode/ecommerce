"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import useTranslation from "@/app/hooks/useTranslation";
import { useLanguage } from "@/app/context/LanguageContext";

export default function Footer() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  

  return (
    <footer className="bg-gray-900 text-white py-20 bottom-0 w-full">
      <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            <span className="text-blue-500">E-Shop</span>
          </h2>
          <p className="text-gray-400">{t.FooterDescription}</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {t.QuickLinksTitle}
          </h3>
          <ul className="text-gray-400 space-y-3">
            <li>
              <Link href="/" className="hover:text-blue-400 transition">
                {t.home}
              </Link>
            </li>
            <li>
              <Link
                href="/collections"
                className="hover:text-blue-400 transition"
              >
                {t.CollectionsLink}
              </Link>
            </li>
            <li>
              <Link href="/deals" className="hover:text-blue-400 transition">
                {t.DealsOffersLink}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-400 transition">
                {t.contact}
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {t.CustomerSupportTitle}
          </h3>
          <p className="text-gray-400">{t.CustomerSupportEmail}</p>
          <p className="text-gray-400 mt-2">{t.CustomerSupportAddress}</p>
          <p className="text-gray-400 mt-2">{t.CustomerSupportPhone}</p>
          <p className="text-gray-400 mt-2">{t.CustomerSupportHours}</p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {t.FollowUsTitle}
          </h3>
          <div className="flex flex-col">
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition flex items-center"
            >
              <Facebook className="w-5 h-5 mr-2" /> {t.FacebookLink}
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition flex items-center"
            >
              <Instagram className="w-5 h-5 mr-2" /> {t.InstagramLink}
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition flex items-center"
            >
              <Twitter className="w-5 h-5 mr-2" /> {t.TwitterLink}
            </a>
          </div>
        </div>
      </div>

      {/* Extra Sections */}
      <div className="container mx-auto px-6 lg:px-12 mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Newsletter Subscription */}
        <div >
          <h3 className="text-lg font-semibold text-white mb-4">
            {t.NewsletterTitle}
          </h3>
          <p className="text-gray-400 mb-4">{t.NewsletterDescription}</p>
          <form className="flex">
            <input
              type="email"
              placeholder={t.NewsletterPlaceholder}
              className="w-full p-3 rounded-l bg-gray-800 text-white focus:outline-none"
            />
            <button className="bg-blue-500 px-4 py-3 rounded-r text-white hover:bg-blue-600 transition">
              {t.NewsletterButton}
            </button>
          </form>
        </div>

        {/* Payment Methods */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {t.PaymentMethodsTitle}
          </h3>
          <p className="text-gray-400">{t.PaymentMethodsDescription}</p>
          <div className="flex space-x-4 mt-3">
            <span className="bg-gray-800 px-4 py-2 rounded">
              {t.PaymentMethodVisa}
            </span>
            <span className="bg-gray-800 px-4 py-2 rounded">
              {t.PaymentMethodMasterCard}
            </span>
            <span className="bg-gray-800 px-4 py-2 rounded">
              {t.PaymentMethodPayPal}
            </span>
          </div>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {t.PoliciesTitle}
          </h3>
          <ul className="text-gray-400 space-y-3">
            <li>
              <Link
                href="/privacy-policy"
                className="hover:text-blue-400 transition"
              >
                {t.PrivacyPolicyLink}
              </Link>
            </li>
            <li>
              <Link
                href="/terms-of-service"
                className="hover:text-blue-400 transition"
              >
                {t.TermsOfServiceLink}
              </Link>
            </li>
            <li>
              <Link
                href="/return-policy"
                className="hover:text-blue-400 transition"
              >
                {t.ReturnPolicyLink}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div
        
        className="text-center text-gray-500 mt-12 border-t border-gray-700 pt-6"
      >
        {t.Copyright}
      </div>
    </footer>
  );
}

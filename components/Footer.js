"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, Clock } from "lucide-react";
import useTranslation from "@/app/hooks/useTranslation";
import { useLanguage } from "@/app/context/LanguageContext";

export default function Footer() {
  const { language } = useLanguage();
  const t = useTranslation(language);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              <span className="text-blue-500">JO-SAM</span>
            </h2>
            <p className="text-gray-400">{t.FooterDescription}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.QuickLinksTitle}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-blue-400 transition">
                  {t.home}
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-gray-400 hover:text-blue-400 transition">
                  {t.CollectionsLink}
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-400 hover:text-blue-400 transition">
                  {t.DealsOffersLink}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-blue-400 transition">
                  {t.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.CustomerSupportTitle}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-blue-400 mr-2 mt-1" />
                <span className="text-gray-400">{t.CustomerSupportAddress}</span>
              </li>
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-blue-400 mr-2 mt-1" />
                <span className="text-gray-400">{t.CustomerSupportPhone}</span>
              </li>
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-blue-400 mr-2 mt-1" />
                <span className="text-gray-400">{t.CustomerSupportEmail}</span>
              </li>
              <li className="flex items-start">
                <Clock className="w-5 h-5 text-blue-400 mr-2 mt-1" />
                <span className="text-gray-400">{t.CustomerSupportHours}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t.NewsletterTitle}</h3>
            <p className="text-gray-400 mb-4">{t.NewsletterDescription}</p>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder={t.NewsletterPlaceholder}
                className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded transition">
                {t.NewsletterButton}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              {t.Copyright}
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-blue-400 text-sm transition">
                {t.PrivacyPolicyLink}
              </Link>
              <Link href="/terms-of-service" className="text-gray-400 hover:text-blue-400 text-sm transition">
                {t.TermsOfServiceLink}
              </Link>
              <Link href="/return-policy" className="text-gray-400 hover:text-blue-400 text-sm transition">
                {t.ReturnPolicyLink}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

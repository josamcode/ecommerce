"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";
import useTranslation from "@/app/hooks/useTranslation";
import { useLanguage } from "@/app/context/LanguageContext";
import {
  ShoppingBag,
  Users,
  Award,
  Heart,
  Shield,
  Truck,
  Clock,
  Star,
} from "lucide-react";

const routes = [
  { nameKey: "home", path: "/" },
  { nameKey: "shop", path: "/shop" },
  { nameKey: "CollectionsLink", path: "/collections" },
  { nameKey: "about", path: "/about" },
  { nameKey: "contact", path: "/contact" },
];

const features = [
  {
    icon: ShoppingBag,
    titleKey: "AboutWideSelection",
    descriptionKey: "AboutWideSelectionDesc",
  },
  {
    icon: Truck,
    titleKey: "AboutFastDelivery",
    descriptionKey: "AboutFastDeliveryDesc",
  },
  {
    icon: Shield,
    titleKey: "AboutSecurePayments",
    descriptionKey: "AboutSecurePaymentsDesc",
  },
  {
    icon: Heart,
    titleKey: "AboutCustomerCare",
    descriptionKey: "AboutCustomerCareDesc",
  },
];

const teamMembers = [
  { name: "John Doe", role: "CEO & Founder", image: "/team/member1.jpg" },
  {
    name: "Jane Smith",
    role: "Marketing Director",
    image: "/team/member2.jpg",
  },
  { name: "Mike Johnson", role: "CTO", image: "/team/member3.jpg" },
  {
    name: "Sarah Williams",
    role: "Customer Support Lead",
    image: "/team/member4.jpg",
  },
];

const values = [
  {
    icon: Award,
    titleKey: "AboutQualityFirst",
    descriptionKey: "AboutQualityFirstDesc",
  },
  {
    icon: Users,
    titleKey: "AboutCustomerFocus",
    descriptionKey: "AboutCustomerFocusDesc",
  },
  {
    icon: Star,
    titleKey: "AboutInnovation",
    descriptionKey: "AboutInnovationDesc",
  },
];

export default function About() {
  const { language } = useLanguage();
  const t = useTranslation(language);

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t.AboutUsTitle}
              </h1>
              <p className="text-xl text-blue-100">{t.AboutUsDescription}</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t.AboutFeaturesTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {t[feature.titleKey]}
                  </h3>
                  <p className="text-gray-600">{t[feature.descriptionKey]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                {t.AboutOurStory}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <p className="text-gray-600 mb-6">{t.AboutOurStoryDesc1}</p>
                  <p className="text-gray-600">{t.AboutOurStoryDesc2}</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-8">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600">
                        18+
                      </div>
                      <div className="text-gray-600">
                        {t.AboutHappyCustomers}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600">
                        40+
                      </div>
                      <div className="text-gray-600">{t.AboutProducts}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600">
                        2+
                      </div>
                      <div className="text-gray-600">{t.AboutCountries}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        {/* <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">{t.AboutOurTeam}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="h-64 bg-gray-200">
                    <div className="w-full h-full bg-gray-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-gray-600">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t.AboutOurValues}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <value.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {t[value.titleKey]}
                  </h3>
                  <p className="text-gray-600">{t[value.descriptionKey]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

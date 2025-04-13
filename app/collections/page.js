"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useTranslation from "../hooks/useTranslation";
import { useLanguage } from "@/app/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Collections({ type }) {
  const [collections, setCollections] = useState([]);
  const router = useRouter();
  const { language } = useLanguage();
  const t = useTranslation(language);

  useEffect(() => {
    fetch(`http://localhost:5000/api/collections?lang=${language}`)
      .then((res) => res.json())
      .then((data) => setCollections(data));
  }, [language]);

  const handleCollectionClick = (collectionValue) => {
    router.push(`/collections/${collectionValue}`);
  };

  return (
    <>
      {type === "section" ? null : <Header />}
      <section className="w-full my-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="sm:text-2xl lg:text-4xl font-bold text-blue-600">
              {t.our_collections}
            </h2>
            <p className="text-gray-400 mt-2">{t.discover_collections}</p>
          </div>

          {/* Collections Grid */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="relative group bg-white shadow-md rounded-md overflow-hidden cursor-pointer"
                onClick={() => handleCollectionClick(collection.value)}
              >
                <div className="relative w-full h-64">
                  <Image
                    src={
                      "http://localhost:5000/images/collections/" +
                      collection.image
                    }
                    alt={collection.name}
                    fill
                    sizes="100%"
                    priority
                    style={{ objectFit: "cover" }}
                    className="rounded-md transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-white p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h2 className="text-2xl font-semibold text-center">
                      {collection.name}
                    </h2>
                    <p className="text-sm mt-2">{collection.description}</p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-500 transition">
                      {t.shop_now}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {type === "section" ? null : <Footer />}
    </>
  );
}

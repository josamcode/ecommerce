"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Card from "./Card";
import useTranslation from "@/app/hooks/useTranslation";
import { useLanguage } from "@/app/context/LanguageContext";

export default function DealsOffers() {
  const { language } = useLanguage();
  const t = useTranslation(language);

  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        // Calculate discount percentage for each product
        const productsWithDiscount = data.data.map((product) => {
          const discountPercentage =
            product.price && product.discountPrice
              ? Math.round(
                  ((product.price - product.discountPrice) / product.price) *
                    100
                )
              : 0;
          return { ...product, discountPercentage };
        });

        // Sort products by discount percentage in descending order
        const sortedProducts = productsWithDiscount.sort(
          (a, b) => b.discountPercentage - a.discountPercentage
        );

        setDeals(sortedProducts);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching deals:", error));
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-400 py-16">{t.LoadingDealsOffers}</p>
    );
  }

  return (
    <section className="container mx-auto my-24 px-4 sm:px-6 lg:px-10 text-white">
      <div className="max-w-7xl mx-auto text-center">
        {/* Title */}
        <h2 className="sm:text-2xl lg:text-4xl font-bold text-blue-600">
          {t.DealsOffersTitle}
        </h2>
        {/* Subtitle */}
        <p className="text-gray-400 mt-2">{t.DealsOffersSubtitle}</p>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Display only the top 6 products with the highest discount */}
        {deals.slice(0, 3).map((product) => (
          <Card
            key={product._id}
            product={product}
            buttonText={t.AddToCart} // Use translated text for button
            theme="light"
          />
        ))}
      </div>
    </section>
  );
}

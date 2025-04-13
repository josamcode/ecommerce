"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Card from "./Card";
import ShowMore from "./ShowMore";
import useTranslation from "@/app/hooks/useTranslation";
import { useLanguage } from "@/app/context/LanguageContext";

export default function FeaturedProducts() {
  const { language } = useLanguage();
  const t = useTranslation(language);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        // Sort products by rating and review count
        const sortedProducts = data.data.sort((a, b) => {
          const weightA = a.rating * (a.reviewCount || 0);
          const weightB = b.rating * (b.reviewCount || 0);

          return weightB - weightA;
        });

        setProducts(sortedProducts);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-300 py-16">
        {t.LoadingFeaturedProducts}
      </p>
    );
  }

  return (
    <section className="bg-gray-900 text-white">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto text-center">
          {/* Title */}
          <h2 className="sm:text-2xl lg:text-4xl font-bold text-white">
            {t.FeaturedProductsTitle}
          </h2>
          {/* Subtitle */}
          <p className="text-gray-300 mt-2">{t.FeaturedProductsSubtitle}</p>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Display only the top 7 products */}
          {products.slice(0, 8).map((product) => (
            <Card
              key={product._id}
              product={product}
              buttonText={t.AddToCart} // Use translated text for button
              theme="dark"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

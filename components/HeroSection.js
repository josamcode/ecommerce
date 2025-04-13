"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import useTranslation from "@/app/hooks/useTranslation";
import { useLanguage } from "@/app/context/LanguageContext";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [products, setProducts] = useState([]);
  const [visibleImages, setVisibleImages] = useState([]);

  useEffect(() => {
    // Fetch products
    fetch("https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data || []);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    // Function to randomly show/hide images
    const updateVisibleImages = () => {
      const shuffledProducts = [...products].sort(() => Math.random() - 0.5);
      const visibleCount = Math.floor(Math.random() * 3) + 3; // Show 3-5 images
      setVisibleImages(shuffledProducts.slice(0, visibleCount));
    };

    // Initial update
    updateVisibleImages();

    // Set up interval for random updates
    const interval = setInterval(updateVisibleImages, 3000);

    return () => clearInterval(interval);
  }, [products]);

  return (
    <section
      className={`relative w-full min-h-[calc(100vh-theme(spacing.24))] py-10 flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-black ${
        language === "ar" ? "font-cairo" : ""
      }`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(30,64,175,0.1),_transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.1),_transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.1),_transparent)]"></div>
        <div className="absolute inset-0 grid-pattern opacity-5"></div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={`text-left ${language === "ar" ? "text-right" : ""}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                <span className="w-2 h-2 rounded-full bg-cyan-500 mr-2"></span>
                <span className="text-sm text-cyan-400">New Collection</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-white">{t.hero_title}</span>
                <span className="block text-3xl sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 pt-4 pb-2">
                  {t.hero_subtitle}
                </span>
              </h1>

              <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
                {t.hero_description}
              </p>

              <div
                className={`flex flex-wrap gap-4 ${
                  language === "ar" ? "justify-end" : ""
                }`}
              >
                <Link
                  href="/shop"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold overflow-hidden"
                >
                  <span className="relative z-10">{t.shop_now}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/collections"
                  className="group relative px-8 py-4 border border-white/20 text-white rounded-lg font-semibold overflow-hidden"
                >
                  <span className="relative z-10">{t.explore}</span>
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Premium Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px]"
          >
            {/* Main Showcase */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute top-0 right-0 w-full h-full"
            >
              <div className="relative w-full h-full rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10"></div>
                <div className="absolute inset-0 showcase-grid"></div>

                {/* Dynamic Product Images Grid */}
                <div className="absolute inset-0 grid grid-cols-3 gap-4 p-4">
                  {visibleImages.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className="relative rounded-xl overflow-hidden"
                      style={{
                        gridColumn: `span ${Math.floor(Math.random() * 2) + 1}`,
                        gridRow: `span ${Math.floor(Math.random() * 2) + 1}`,
                      }}
                    >
                      <Image
                        src={`https://eastern-maryjane-josamcode-baebec38.koyeb.app/images/products/${product.images[0]}`}
                        alt={product.name}
                        fill
                        sizes="100%"
                        className="object-cover transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </motion.div>
                  ))}
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-3xl"
                ></motion.div>

                <motion.div
                  animate={{
                    y: [0, 20, 0],
                    rotate: [0, -5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl blur-3xl"
                ></motion.div>

                {/* Premium Badge */}
                <div className="absolute top-8 right-8 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                  <span className="text-sm text-white font-medium">
                    Premium Collection
                  </span>
                </div>

                {/* Stats */}
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="text-2xl font-bold text-white">18+</div>
                    <div className="text-sm text-gray-400">Happy Customers</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="text-2xl font-bold text-white">40+</div>
                    <div className="text-sm text-gray-400">Products</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Card from "@/components/Card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/app/context/LanguageContext";
import useTranslation from "@/app/hooks/useTranslation";

export default function CollectionProducts() {
  const [products, setProducts] = useState([]);
  const { productCollection } = useParams();

  const { language } = useLanguage();
  const t = useTranslation(language);

  const formatCollectionName = (name) => {
    return name
      .split("_") // Split text by `_`
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "); // Regroup words with spaces
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/products");
        const data = await res.json();

        if (res.ok) {
          const filteredProducts = data.data.filter(
            (product) => product.productCollection === productCollection
          );
          setProducts(filteredProducts);
        } else {
          console.error("Failed to fetch products:", data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (productCollection) {
      fetchProducts();
    }
  }, [productCollection]);

  return (
    <>
      <Header />
      <section className="container mx-auto my-24 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="sm:text-2xl lg:text-4xl font-bold text-blue-600">
            {productCollection
              ? formatCollectionName(productCollection)
              : "Collection"}
          </h2>
          <p className="text-gray-600 mt-2">
            {productCollection
              ? `Discover our exclusive ${formatCollectionName(
                  productCollection
                )} collection`
              : "Discover our exclusive collections tailored just for you!"}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <Card
                key={product._id}
                product={product}
                buttonText="Add to cart"
                theme="light"
              />
            ))
          ) : (
            <p className="col-span-full text-center mt-6 text-gray-500">
              {t.NoProductsFound}
            </p>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

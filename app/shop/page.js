"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";
import Card from "../../components/Card";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ShowMore from "@/components/ShowMore";
import useTranslation from "@/app/hooks/useTranslation";
import { useLanguage } from "@/app/context/LanguageContext";

export default function BestSellers({ type }) {
  const { language } = useLanguage();
  const t = useTranslation(language);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortOption, setSortOption] = useState(
    type === "section" ? "popularity" : "default"
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const searchParams = useSearchParams();
  const collectionFilter = useMemo(
    () => searchParams.get("collection"),
    [searchParams]
  );

  const fetchUrl =
    "https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/products";

  useEffect(() => {
    fetch(fetchUrl)
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "success") {
          setProducts(response.data);
          setFilteredProducts(response.data);
        } else if (collectionFilter) {
          const filtered = response.data.filter(
            (product) => product.collection === collectionFilter
          );
          setProducts(filtered);
        } else {
          console.error("Failed to fetch products");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, [fetchUrl]);

  useEffect(() => {
    let updatedProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter by category
    if (category !== "all") {
      updatedProducts = updatedProducts.filter(
        (product) => product.category === category
      );
    }

    // Filter by price range
    if (priceRange !== "all") {
      updatedProducts = updatedProducts.filter((product) => {
        const price = product.discountPrice || product.price || 0;

        if (priceRange === "low") return price < 50;
        if (priceRange === "medium") return price >= 50 && price <= 150;
        if (priceRange === "high") return price > 150;

        return true;
      });
    }

    // Sorting
    switch (sortOption) {
      case "price-asc":
        updatedProducts.sort((a, b) => {
          const priceA = a.discountPrice || a.price || Infinity;
          const priceB = b.discountPrice || b.price || Infinity;
          return priceA - priceB;
        });
        break;

      case "price-desc":
        updatedProducts.sort((a, b) => {
          const priceA = a.discountPrice || a.price || 0;
          const priceB = b.discountPrice || b.price || 0;
          return priceB - priceA;
        });
        break;
      case "name-asc":
        updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        updatedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "popularity":
        updatedProducts.sort((a, b) => b.sold - a.sold);
        break;
      default:
        break;
    }

    setFilteredProducts(updatedProducts);
  }, [searchTerm, category, priceRange, sortOption, products]);

  if (loading) {
    return (
      <p className="text-center text-gray-500 py-16">
        {type === "section" ? t.LoadingBestSellers : t.LoadingProducts}
      </p>
    );
  }

  return (
    <>
      {type === "section" ? null : <Header />}
      <section className="container mx-auto my-24 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="sm:text-2xl lg:text-4xl font-bold text-blue-600">
            {type === "section" ? t.BestSellersTitle : t.OurProductsTitle}
          </h2>
          <p className="text-gray-600 mt-2">
            {type === "section" ? t.BestSellersSubtitle : t.OurProductsSubtitle}
          </p>
        </div>

        {/* Search and Filters */}
        {type === "section" ? null : (
          <div className="container mx-auto mt-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap justify-center items-center gap-4 w-full md:w-auto">
                <select
                  className="border rounded-lg px-4 py-2 bg-white text-gray-950 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="all">{t.AllCategories}</option>
                  <option value="Clothing">{t.ClothingCategory}</option>
                  <option value="fashion">{t.FashionCategory}</option>
                  <option value="Audio">{t.AudioCategory}</option>
                </select>
                <select
                  className="border rounded-lg px-4 py-2 bg-white text-gray-950 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="all">{t.AllPrices}</option>
                  <option value="low">{t.PriceBelow50}</option>
                  <option value="medium">{t.Price50To150}</option>
                  <option value="high">{t.PriceAbove150}</option>
                </select>
                <select
                  className="border rounded-lg px-4 py-2 bg-white text-gray-950 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="default">{t.SortBy}</option>
                  <option value="price-asc">{t.PriceLowToHigh}</option>
                  <option value="price-desc">{t.PriceHighToLow}</option>
                  <option value="name-asc">{t.NameAToZ}</option>
                  <option value="name-desc">{t.NameZToA}</option>
                  <option value="popularity">{t.MostPopular}</option>
                </select>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute right-3 top-2.5 text-gray-950 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t.SearchPlaceholder || "Search for a product..."}
                  className="w-full px-4 py-2 pl-3 border border-gray-300 text-gray-950 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            (type === "section"
              ? filteredProducts.slice(0, 7)
              : filteredProducts
            ).map((product) => (
              <Card
                key={product._id}
                product={product}
                buttonText={t.AddToCart}
                theme="light"
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              {t.NoProductsFound}
            </p>
          )}
          {type === "section" && filteredProducts.length >= 7 ? (
            <ShowMore route="/shop" />
          ) : null}
        </div>
      </section>
      {type === "section" ? null : <Footer />}
    </>
  );
}

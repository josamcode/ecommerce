"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaStarHalfAlt,
  FaRegStar,
  FaTrash,
} from "react-icons/fa";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/Card";
import NotificationCard from "@/components/NotificationCard";
import {
  addToCart,
  addToWishlist,
  removeFromCart,
  removeFromWishlist,
  checkProductStatus,
} from "@/utils/cartUtils";
import { useRouter } from "next/navigation";
import useTranslation from "@/app/hooks/useTranslation";
import { useLanguage } from "@/app/context/LanguageContext";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const router = useRouter();
  const [notification, setNotification] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const productId = product?.id || product?._id;

  const { language } = useLanguage();
  const t = useTranslation(language);

  useEffect(() => {
    if (!product) return;
    const productId = product?.id || product?._id;
    if (!productId) return;
    const { isInCart, isInWishlist } = checkProductStatus(productId);
    setIsInCart(isInCart);
    setIsInWishlist(isInWishlist);
    setProduct((prevProduct) => {
      if (prevProduct?.image) {
        const isImageAlreadyAdded = prevProduct.images?.includes(
          prevProduct.image
        );
        if (!isImageAlreadyAdded) {
          return {
            ...prevProduct,
            images: [prevProduct.image, ...(prevProduct.images || [])],
          };
        }
      }
      return prevProduct;
    });
  }, [product]);

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(productId, setNotification);
    } else {
      addToWishlist(product, setNotification);
    }
    setIsInWishlist(!isInWishlist);
  };

  const handleCartToggle = () => {
    if (isInCart) {
      removeFromCart(productId, setNotification);
    } else {
      addToCart(product, quantity, setNotification);
    }
    setIsInCart(!isInCart);
  };

  // Shuffle array function
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  useEffect(() => {
    if (!id) return;
    fetch(`https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setSelectedImage(data.image ? data.image : data.images[0]);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetch("https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/products")
      .then((res) => res.json())
      .then((data) => {
        const filteredProducts = data.data.filter((p) => p.id !== id);
        shuffleArray(filteredProducts);
        setRecommendedProducts(filteredProducts.slice(0, 4));
      })
      .catch((err) =>
        console.error("Error fetching recommended products:", err)
      );
  }, [id]);

  if (loading)
    return (
      <p className="text-center text-gray-400 py-16">{t.LoadingProduct}</p>
    );
  if (error) return <p className="text-center text-red-500 py-16">{error}</p>;
  if (!product)
    return (
      <p className="text-center text-red-500 py-16">{t.ProductNotFound}</p>
    );

  const {
    name,
    description,
    images,
    image,
    discountPrice,
    price,
    stock = 0,
    brand = "Unknown",
    category = "Uncategorized",
    rating = 0,
    reviewsCount = 0,
  } = product;

  const outOfStock = stock <= 0;
  const displayPrice = discountPrice || price;

  const handleColorSelection = (color) => {
    setSelectedColor(color);
  };

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  const categoryStyle = "bg-gray-200 text-gray-950 p-1 rounded";

  return (
    <>
      <Header />
      <div className={`container mx-auto px-4 sm:px-6 lg:px-10 py-24 `}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 rounded-lg">
          {/* Product Images */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white shadow-sm flex-1">
              {selectedImage ? (
                <Image
                  src={
                    selectedImage.startsWith("http")
                      ? selectedImage
                      : `https://eastern-maryjane-josamcode-baebec38.koyeb.app/images/products/${selectedImage}`
                  }
                  alt={name}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">{t.NoImageAvailable}</p>
                </div>
              )}
            </div>

            {/* Thumbnails - Vertical on desktop, horizontal on mobile */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible lg:w-20 p-2">
              {images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`relative aspect-square min-w-[80px] lg:min-w-[80px] rounded-lg overflow-hidden ${
                    selectedImage === img
                      ? "ring-2 ring-blue-500"
                      : "hover:ring-2 hover:ring-gray-200"
                  }`}
                >
                  <Image
                    src={
                      img.startsWith("http")
                        ? img
                        : `https://eastern-maryjane-josamcode-baebec38.koyeb.app/images/products/${img}`
                    }
                    alt="Thumbnail"
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-start">
            <h1 className="text-3xl font-bold text-gray-950">
              {name || t.UnnamedProduct}
            </h1>
            <p className="text-gray-600 mt-2">
              {description || t.NoDescriptionAvailable}
            </p>
            <p className="text-gray-500 mt-4">
              <strong>{t.BrandLabel}</strong>{" "}
              <span className={categoryStyle}>{brand}</span>{" "}
              <strong>{t.CategoryLabel}</strong>{" "}
              {Array.isArray(category) ? (
                category.map((category, index) => (
                  <span key={index} className={`mr-2 ${categoryStyle}`}>
                    {category} {index < category.length - 1 && " "}{" "}
                  </span>
                ))
              ) : (
                <span className={`mr-2 ${categoryStyle}`}>{category}</span>
              )}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <span className="text-2xl font-bold text-blue-600">
                ${displayPrice}
              </span>
              {price && discountPrice && (
                <span className="text-gray-400 line-through">${price}</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, index) => {
                  const fullStars = Math.floor(rating);
                  const hasHalfStar = rating % 1 !== 0;
                  if (index < fullStars) {
                    return <FaStar key={index} />;
                  } else if (index === fullStars && hasHalfStar) {
                    return <FaStarHalfAlt key={index} />;
                  } else {
                    return <FaRegStar key={index} className="text-gray-400" />;
                  }
                })}
              </div>
              <span className="text-gray-700 text-sm font-medium">
                {rating} ({reviewsCount}{" "}
                {reviewsCount === 1 ? t.Review : t.Reviews})
              </span>
            </div>
            <p
              className={`mt-2 font-semibold ${
                outOfStock ? "text-red-500" : "text-green-500"
              }`}
            >
              {outOfStock ? t.OutOfStock : t.InStock.replace("{stock}", stock)}
            </p>

            {/* Quantity Selector */}
            <div className="mt-6 max-w-32 flex flex-col sm:flex-row gap-4 text-gray-950">
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <button
                  className="text-lg font-bold px-2"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  className="w-12 text-center outline-none"
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setQuantity(Math.min(stock, Math.max(1, value)));
                  }}
                  min={1}
                  max={stock}
                />
                <button
                  className={`text-lg font-bold px-2 ${
                    quantity >= stock ? "cursor-not-allowed text-gray-400" : ""
                  }`}
                  onClick={() =>
                    setQuantity((prev) => Math.min(stock, prev + 1))
                  }
                  disabled={quantity >= stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition 
                ${isInCart ? "bg-red-600 text-white hover:bg-red-700" : ""} ${
                  outOfStock ? "cursor-not-allowed " : ""
                }`}
                onClick={handleCartToggle}
                disabled={outOfStock}
              >
                {isInCart ? (
                  <>
                    <FaTrash /> {t.RemoveFromCart}
                  </>
                ) : (
                  <>
                    <FaShoppingCart /> {t.AddToCart}
                  </>
                )}
              </button>
              <button
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-lg font-semibold border ${
                  isInWishlist
                    ? "border-red-600 text-red-600 bg-red-100"
                    : "border-gray-400 text-gray-700 hover:bg-gray-100"
                }`}
                onClick={handleWishlistToggle}
              >
                <FaHeart
                  className={isInWishlist ? "text-red-600" : "text-gray-700"}
                />
                {isInWishlist ? t.RemoveFromWishlist : t.AddToWishlist}
              </button>
            </div>
          </div>
        </div>

        {/* Color and Size Selectors */}
        <div className="mt-8 flex flex-row w-full justify-between">
          {/* Color Selector */}
          {product.colors?.length > 0 && (
            <div>
              <h3 className="text-lg font-medium">{t.ColorLabel}</h3>
              <div className="flex gap-2">
                {product.colors?.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelection(color)}
                  ></button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes?.length > 0 && (
            <div>
              <h3 className="text-lg font-medium">{t.SizeLabel}</h3>
              <div className="flex gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedSize === size
                        ? "bg-blue-500 text-white"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleSizeSelection(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Show notification if available */}
      {notification && <NotificationCard {...notification} />}

      {/* Recommended Products */}
      <section className="container mx-auto mb-24 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="sm:text-2xl lg:text-4xl font-bold text-blue-600">
            {t.RecommendedProductsTitle}
          </h2>
          <p className="text-gray-600 mt-2">{t.RecommendedProductsSubtitle}</p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.length > 0 ? (
            recommendedProducts.map((product) => (
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
        </div>
      </section>
      <Footer />
    </>
  );
}

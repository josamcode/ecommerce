"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import {
  addToCart,
  addToWishlist,
  removeFromCart,
  removeFromWishlist,
  checkProductStatus,
} from "@/utils/cartUtils";
import NotificationCard from "@/components/NotificationCard";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function Card({ product, theme = "light" }) {
  if (!product) return null;

  const router = useRouter();
  const [notification, setNotification] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  const productId = product._id || product.id;

  useEffect(() => {
    if (!productId) return;

    const { isInCart, isInWishlist } = checkProductStatus(productId);
    setIsInCart(isInCart);
    setIsInWishlist(isInWishlist);
  }, [productId]);

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
      setIsInCart(false);
    } else if (!product.stock || product.stock <= 0) {
      setNotification({
        message: "Product out of stock!",
        type: "error",
      });
    } else {
      addToCart(product, 1, setNotification);
      setIsInCart(true);
    }
  };

  const themes = {
    light: {
      card: "shadow-lg hover:shadow-xl bg-white border border-gray-100",
      text: "text-gray-900",
      description: "text-gray-500",
      price: "text-blue-600",
      whishlistIcon: "text-gray-600 hover:text-red-500",
      activeWhishlistIcon: "text-red-500",
      cartIcon: "text-blue-600 hover:text-blue-700",
      activeCartIcon: "text-green-500",
      discountBadge: "bg-red-500 text-white px-2 py-1 text-xs rounded-full",
      brandTag: "bg-gray-100 text-gray-700",
      categoryTag: "bg-blue-50 text-blue-600",
    },
    dark: {
      card: "bg-gray-800 border border-gray-700 shadow-lg hover:shadow-xl",
      text: "text-white",
      description: "text-gray-400",
      price: "text-blue-400",
      whishlistIcon: "text-gray-400 hover:text-red-400",
      activeWhishlistIcon: "text-red-400",
      cartIcon: "text-blue-400 hover:text-blue-300",
      activeCartIcon: "text-green-400",
      discountBadge: "bg-red-600 text-white px-2 py-1 text-xs rounded-full",
      brandTag: "bg-gray-700 text-gray-300",
      categoryTag: "bg-blue-900 text-blue-300",
    },
  };

  const themeStyles = themes[theme];
  const truncateText = (text, maxLength) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  const renderStars = (rating) => {
    return (
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
    );
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`rounded-xl p-4 transition duration-300 ${themeStyles.card}`}
      >
        <div className="relative w-full h-56 rounded-lg overflow-hidden group">
          <Image
            src={`http://localhost:5000/images/products/${
              product.image || product.images[0]
            }`}
            alt={product.name}
            fill
            sizes="100%"
            priority
            className="object-cover transition duration-300 group-hover:scale-105"
            onClick={() => router.push(`/product/${productId}`)}
          />
          {product.discountPrice && product.price && (
            <div className="absolute top-2 left-2">
              <span className={themeStyles.discountBadge}>
                {Math.round(
                  ((product.price - product.discountPrice) / product.price) * 100
                )}% OFF
              </span>
            </div>
          )}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <FiHeart
              className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${
                isInWishlist
                  ? themeStyles.activeWhishlistIcon
                  : themeStyles.whishlistIcon
              }`}
              onClick={handleWishlistToggle}
            />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3
              className={`text-lg font-semibold ${themeStyles.text} cursor-pointer hover:text-blue-600 transition-colors`}
              onClick={() => router.push(`/product/${productId}`)}
            >
              {truncateText(product.name, 22)}
            </h3>
            <FiShoppingCart
              className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
                isInCart ? themeStyles.activeCartIcon : themeStyles.cartIcon
              }`}
              onClick={handleCartToggle}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`text-xs px-3 py-1 rounded-full ${themeStyles.brandTag}`}>
              {product.brand}
            </span>
            {Array.isArray(product.category) ? (
              product.category.slice(0, 2).map((category, index) => (
                <span
                  key={index}
                  className={`text-xs px-3 py-1 rounded-full ${themeStyles.categoryTag}`}
                >
                  {category}
                </span>
              ))
            ) : (
              <span className={`text-xs px-3 py-1 rounded-full ${themeStyles.categoryTag}`}>
                {product.category}
              </span>
            )}
          </div>

          <p className={`text-sm ${themeStyles.description}`}>
            {truncateText(product.description, 30)}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.discountPrice ? (
                <>
                  <span className={`text-xl font-bold ${themeStyles.price}`}>
                    ${product.discountPrice}
                  </span>
                  <span className="line-through text-gray-400 text-sm">
                    ${product.price}
                  </span>
                </>
              ) : (
                <span className={`text-xl font-bold ${themeStyles.price}`}>
                  ${product.price}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {renderStars(product.rating || 0)}
              <span className="text-sm text-gray-500">
                ({product.reviewsCount || 0})
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {notification && <NotificationCard {...notification} />}
    </>
  );
}

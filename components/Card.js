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
      card: "shadow-lg hover:shadow-blue-500/10 bg-white",
      text: "text-gray-900",
      description: "text-gray-500",
      price: "text-blue-600",
      whishlistIcon:
        "bg-gray-200 text-gray-950 rounded-full p-2 hover:text-blue-600",
      activeWhishlistIcon:
        "bg-red-400 text-white rounded-full p-2 hover:text-blue-600",
      cartIcon: "text-white bg-blue-600 rounded p-2 hover:bg-blue-700",
      activeCartIcon:
        "text-green-500 bg-green-100 rounded p-2 hover:text-green-600",
      discountBadge: "bg-red-500 text-white px-2 py-1 text-xs rounded-md",
    },
    dark: {
      card: "bg-gray-800 shadow-lg hover:shadow-blue-500/5",
      text: "text-white",
      description: "text-gray-400",
      price: "text-white",
      whishlistIcon:
        "bg-gray-200 text-gray-950 rounded-full p-2 hover:text-blue-600",
      activeWhishlistIcon:
        "bg-red-400 text-white rounded-full p-2 hover:text-blue-600",
      cartIcon: "bg-gray-700 text-white rounded p-2 hover:bg-gray-200",
      activeCartIcon:
        "text-green-500 bg-green-100 rounded p-2 hover:text-green-600",
      discountBadge: "bg-red-400 text-white px-2 py-1 text-xs rounded-md",
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
        whileHover={{ scale: 1.01 }}
        className={`rounded-2xl p-6 transition duration-300 overflow-hidden ${themeStyles.card}`}
      >
        <div className="relative w-full h-48 rounded-lg overflow-hidden cursor-pointer">
          <Image
            src={`https://eastern-maryjane-josamcode-baebec38.koyeb.app/images/products/${
              product.image || product.images[0]
            }`}
            alt={product.name}
            fill
            sizes="100%"
            priority
            style={{ objectFit: "cover" }}
            onClick={() => router.push(`/product/${productId}`)}
          />
          {product.discountPrice && product.price && (
            <div className="absolute top-2 left-2">
              <span className={themeStyles.discountBadge}>
                -
                {Math.round(
                  ((product.price - product.discountPrice) /
                    product.price) *
                    100
                )}
                %
              </span>
            </div>
          )}
          <FiHeart
            className={`absolute top-2 right-2 w-8 h-8 cursor-pointer ${
              isInWishlist
                ? themeStyles.activeWhishlistIcon
                : themeStyles.whishlistIcon
            }`}
            onClick={handleWishlistToggle}
          />
        </div>

        <h3
          className={`mt-4 text-xl font-semibold ${themeStyles.text} cursor-pointer`}
          onClick={() => router.push(`/product/${productId}`)}
        >
          {truncateText(product.name, 22)}
        </h3>

        {/* Brand and Category Section */}
        <div className="flex gap-2 mt-2">
          <span
            className={`${
              theme === "light"
                ? "bg-gray-200 text-gray-700"
                : "bg-gray-700 text-white"
            } text-xs px-3 py-1 rounded-md`}
          >
            {product.brand}
          </span>
          {Array.isArray(product.category) ? (
            product.category.slice(0, 2).map((category, index) => (
              <span
                key={index}
                className={`${
                  theme === "light"
                    ? "bg-gray-200 text-gray-700"
                    : "bg-gray-700 text-white"
                } text-xs px-3 py-1 rounded-md`}
              >
                {category}
              </span>
            ))
          ) : (
            <span
              className={`${
                theme === "light"
                  ? "bg-gray-200 text-gray-700"
                  : "bg-gray-700 text-white"
              } text-xs px-3 py-1 rounded-md`}
            >
              {product.category}
            </span>
          )}
        </div>

        <p className={`mt-2 ${themeStyles.description}`}>
          {truncateText(product.description, 30)}
        </p>

        <div className="mt-4 flex items-center gap-2">
          {product.discountPrice ? (
            <>
              <span className={`text-lg font-bold ${themeStyles.price}`}>
                ${product.discountPrice}
              </span>
              <span className="line-through text-red-300 text-sm">
                ${product.price}
              </span>
            </>
          ) : (
            <span className={`text-lg font-bold ${themeStyles.price}`}>
              ${product.price}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div>
            {renderStars(product.rating || 0)}
            <p className="text-sm text-gray-600">
              ({product.rating}) {product.reviewsCount || 0} Reviews
            </p>
          </div>
          <FiShoppingCart
            className={`w-9 h-9 cursor-pointer ${
              isInCart ? themeStyles.activeCartIcon : themeStyles.cartIcon
            }`}
            onClick={handleCartToggle}
          />
        </div>
      </motion.div>

      {notification && <NotificationCard {...notification} />}
    </>
  );
}

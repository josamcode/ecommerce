"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotificationCard from "@/components/NotificationCard";
import {
  addToCart,
  removeFromCart,
  removeFromWishlist,
} from "@/utils/cartUtils";
import useTranslation from "@/app/hooks/useTranslation";
import { useLanguage } from "@/app/context/LanguageContext";
import { Trash2, ShoppingCart, X } from "lucide-react";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoaded, setWishlistLoaded] = useState(false);
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);

  const { language } = useLanguage();
  const t = useTranslation(language);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
    setWishlistLoaded(true);
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (wishlistLoaded) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setTimeout(() => {
        window.dispatchEvent(new Event("wishlistUpdated"));
      }, 0);
      if (
        wishlist.length <
          JSON.parse(localStorage.getItem("wishlist"))?.length &&
        setNotification
      ) {
        setNotification({
          message: t.ProductRemovedFromWishlist,
          type: "info",
        });
      }
    }
  }, [wishlist, wishlistLoaded]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const handleRemoveFromWishlist = (productId) => {
    setWishlist((prevWishlist) => {
      const updatedWishlist = prevWishlist.filter(
        (item) => item.id !== productId
      );
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      window.dispatchEvent(new Event("wishlistUpdated"));

      setNotification({
        message: t.ProductRemovedFromWishlist,
        type: "info",
      });

      return updatedWishlist;
    });
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(updatedCart);
    };

    window.addEventListener("cartUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("cartUpdated", handleStorageChange);
    };
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              {t.WishlistTitle}
            </h1>

            {wishlist.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-600 text-lg mb-6">
                  {t.EmptyWishlistMessage}
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  {t.ContinueShoppingButton}
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Wishlist Items */}
                <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
                  {wishlist.map((item) => {
                    const isInCart = cart.some(
                      (cartItem) => cartItem.id === item.id
                    );

                    const handleCartToggle = () => {
                      if (isInCart) {
                        removeFromCart(item.id, setNotification);
                      } else if (!item.stock || item.stock <= 0) {
                        setNotification({
                          message: t.ProductOutOfStock,
                          type: "error",
                        });
                      } else {
                        addToCart(item, 1, setNotification);
                      }
                    };

                    return (
                      <div key={item.id} className="p-6">
                        <div className="flex items-center space-x-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={
                                "https://eastern-maryjane-josamcode-baebec38.koyeb.app/images/products/" +
                                (item.image || item.images[0])
                              }
                              alt={item.name}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/product/${item.id}`}
                              className="text-lg font-medium text-gray-900 hover:text-blue-600"
                            >
                              {item.name}
                            </Link>
                            <p className="mt-1 text-lg font-semibold text-gray-900">
                              ${item.price}
                            </p>
                            {(!item.stock || item.stock <= 0) && (
                              <p className="mt-1 text-sm text-red-600">
                                {t.OutOfStockLabel}
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={handleCartToggle}
                              disabled={!item.stock || item.stock <= 0}
                              className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                                !item.stock || item.stock <= 0
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : isInCart
                                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span className="text-sm">
                                {!item.stock || item.stock <= 0
                                  ? t.OutOfStockLabel
                                  : isInCart
                                  ? t.RemoveFromCartButton
                                  : t.AddToCart}
                              </span>
                            </button>
                            <button
                              onClick={() => handleRemoveFromWishlist(item.id)}
                              className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="text-sm">{t.RemoveButton}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Continue Shopping Button */}
                <div className="flex justify-center">
                  <Link
                    href="/shop"
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    {t.ContinueShoppingButton}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Show notification if available */}
      {notification && <NotificationCard {...notification} />}

      <Footer />
    </>
  );
}

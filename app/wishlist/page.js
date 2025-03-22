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
      <section className="container mx-auto my-16 px-4 sm:px-6 lg:px-10">
        {/* Title */}
        <h2
          className={`sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-10`}
        >
          {t.WishlistTitle}
        </h2>
        {wishlist.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">
            {t.EmptyWishlistMessage}
          </p>
        ) : (
          <div
            className="overflow-x-auto"
            
          >
            <table className="w-full border-collapse border text-center border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-gray-950">
                  <th className="p-2 border">{t.ImageLabel}</th>
                  <th className="p-2 border">{t.ProductLabel}</th>
                  <th className="p-2 border">{t.PriceLabel}</th>
                  <th className="p-2 border">{t.ActionsLabel}</th>
                </tr>
              </thead>
              <tbody>
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
                    <tr key={item.id} className="border">
                      <td className="p-2 border w-24">
                        <img
                          src={
                            "https://eastern-maryjane-josamcode-baebec38.koyeb.app/images/products/" +
                            item.image
                          }
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md m-auto"
                        />
                      </td>
                      <td className="p-2 border text-blue-600">
                        <Link href={`/product/${item.id}`}>{item.name}</Link>
                      </td>
                      <td className="p-2 border font-semibold text-gray-700">
                        ${item.price}
                      </td>
                      <td className="p-2 border">
                        <button
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          {t.RemoveButton}
                        </button>
                        <button
                          onClick={handleCartToggle}
                          className={`px-4 py-1 ${
                            language === "ar" ? "mr-2" : "ml-2"
                          } rounded-md min-w-40 ${
                            !item.stock || item.stock <= 0
                              ? "cursor-not-allowed bg-gray-300 text-gray-600"
                              : isInCart
                              ? "bg-gray-500 text-white"
                              : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                          disabled={!item.stock || item.stock <= 0}
                        >
                          {!item.stock || item.stock <= 0
                            ? t.OutOfStockLabel
                            : isInCart
                            ? t.RemoveFromCartButton
                            : t.AddToCart}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Show notification if available */}
      {notification && <NotificationCard {...notification} />}

      <Footer />
    </>
  );
}

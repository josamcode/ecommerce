"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useTranslation from "@/app/hooks/useTranslation";
import { useLanguage } from "@/app/context/LanguageContext";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  const { language } = useLanguage();
  const t = useTranslation(language);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    setCartLoaded(true);
  }, []);

  const updateQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(
                Math.max(item.quantity + amount, 1),
                item.stock
              ),
            }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  useEffect(() => {
    if (cartLoaded) {
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }, [cart, cartLoaded]);

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <>
      <Header />
      <section className="container mx-auto my-16 px-4 sm:px-6 lg:px-10">
        {/* Title */}
        <h2
          className={`sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-10`}
        >
          {t.ShoppingCartTitle}
        </h2>
        {cart.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">
            {t.EmptyCartMessage}
          </p>
        ) : (
          <div
            className="overflow-x-auto"
            
          >
            <table className="w-full border-collapse border text-center border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-gray-950">
                  <th className="p-2 border">{t.ImageLabel}</th>
                  <th className="p-2 border min-w-60">{t.ProductLabel}</th>
                  <th className="p-2 border">{t.PriceLabel}</th>
                  <th className="p-2 border">{t.QuantityLabel}</th>
                  <th className="p-2 border">{t.StockLabel}</th>
                  <th className="p-2 border">{t.TotalLabel}</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border text-gray-950">
                    <td className="p-2 border w-24">
                      <img
                        src={
                          "https://eastern-maryjane-josamcode-baebec38.koyeb.app/images/products/" + item.image
                        }
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md m-auto"
                      />
                    </td>
                    <td className="p-2 border text-blue-600 min-w-60">
                      <Link href={`/product/${item.id}`}>{item.name}</Link>
                    </td>
                    <td className="p-2 border font-semibold text-gray-700">
                      ${item.price}
                    </td>
                    <td className="p-2 border space-x-2 min-w-40">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                      >
                        -
                      </button>
                      <span className={`font-semibold`}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className={`px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 ${
                          item.quantity >= item.stock
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </td>
                    <td className="p-2 border text-gray-700">{item.stock}</td>
                    <td className="p-2 border font-semibold text-green-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        {t.RemoveButton}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-10 flex flex-col sm:flex-row justify-between items-center border-t border-gray-300 pt-6">
              <p className="text-2xl font-semibold text-gray-800">
                {t.TotalLabel}:{" "}
                <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
              </p>
              <Link
                href="/checkout"
                className="mt-4 sm:mt-0 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-blue-700 transition"
                disabled={cart.length === 0}
              >
                {t.ProceedToCheckoutButton}
              </Link>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}

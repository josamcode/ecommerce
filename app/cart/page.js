"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useTranslation from "@/app/hooks/useTranslation";
import { useLanguage } from "@/app/context/LanguageContext";
import { Trash2, Plus, Minus } from "lucide-react";

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
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              {t.ShoppingCartTitle}
            </h1>

            {cart.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-600 text-lg mb-6">{t.EmptyCartMessage}</p>
                <Link
                  href="/shop"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  {t.ContinueShoppingButton}
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Cart Items */}
                <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
                  {cart.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={"http://localhost:5000/images/products/" + item.image}
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
                          <p className="mt-1 text-sm text-gray-500">
                            {t.StockLabel}: {item.stock}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              disabled={item.quantity >= item.stock}
                              className={`p-1 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full ${
                                item.quantity >= item.stock
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Price and Remove */}
                        <div className="flex flex-col items-end space-y-2">
                          <p className="text-lg font-semibold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="text-sm">{t.RemoveButton}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    {t.OrderSummaryTitle}
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.SubtotalLabel}</span>
                      <span className="font-medium">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.ShippingLabel}</span>
                      <span className="font-medium">{t.FreeShipping}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-medium text-gray-900">
                          {t.TotalLabel}
                        </span>
                        <span className="text-lg font-medium text-blue-600">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <Link
                      href="/checkout"
                      className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      {t.ProceedToCheckoutButton}
                    </Link>
                    <Link
                      href="/shop"
                      className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      {t.ContinueShoppingButton}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

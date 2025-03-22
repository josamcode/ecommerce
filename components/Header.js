"use client";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { Menu, ShoppingCart, Heart, User, Globe } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import useTranslation from "@/app/hooks/useTranslation";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setwishlistCount] = useState(0);
  const { language, toggleLanguage } = useLanguage();
  const t = useTranslation(language);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    setToken(accessToken);

    const savedLanguage = localStorage.getItem("language") || "en";
    if (savedLanguage !== language) {
      toggleLanguage();
    }

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };

    const updateWishlistCount = () => {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setwishlistCount(wishlist.length);
    };

    updateCartCount();
    updateWishlistCount();

    const handleCartUpdated = () => {
      updateCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdated);

    const handleWishlistUpdated = () => {
      setTimeout(() => {
        updateWishlistCount();
      }, 0);
    };

    window.addEventListener("wishlistUpdated", handleWishlistUpdated);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
      window.removeEventListener("wishlistUpdated", handleWishlistUpdated);
    };
  }, [language]);

  return (
    <header dir={"ltr"} className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 flex justify-between items-center py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-900">
          <span className="text-blue-600">E-</span>Shop
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            {t.home}
          </Link>
          <Link href="/shop" className="text-gray-700 hover:text-blue-600">
            {t.shop}
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600">
            {t.about}
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-600">
            {t.contact}
          </Link>
        </nav>

        {/* Icons & Language Toggle */}
        <div className="flex items-center space-x-4">
          <span>{t.language}</span>
          <button
            onClick={toggleLanguage}
            className="text-gray-700 hover:text-blue-600"
          >
            <Globe className="w-6 h-6" />
          </button>
          {token ? (
            <>
              <Link
                href="/wishlist"
                className="relative text-gray-700 hover:text-blue-600"
              >
                <Heart className="w-6 h-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                href="/cart"
                className="relative text-gray-700 hover:text-blue-600"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link
                href="/profile"
                className="text-gray-700 hover:text-blue-600"
              >
                <User className="w-6 h-6" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-gray-900 rounded shadow-lg py-1 px-2 bg-white hover:bg-blue-600 hover:text-white"
              >
                {t.login}
              </Link>
              <Link
                href="/auth/register"
                className="text-white bg-blue-600 py-1 px-2 rounded font-semibold hover:bg-white hover:text-blue-600 hover:shadow-lg"
              >
                {t.register}
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className={`md:hidden bg-white border-t p-4 space-y-4 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Link href="/" className="block text-gray-700 hover:text-blue-600">
            {t.home}
          </Link>
          <Link
            href="/shop"
            className="block text-gray-700 hover:text-blue-600"
          >
            {t.shop}
          </Link>
          <Link
            href="/about"
            className="block text-gray-700 hover:text-blue-600"
          >
            {t.about}
          </Link>
          <Link
            href="/contact"
            className="block text-gray-700 hover:text-blue-600"
          >
            {t.contact}
          </Link>
          {token ? (
            <>
              <Link
                href="/wishlist"
                className="block text-gray-700 hover:text-blue-600"
              >
                {t.wishlist}
              </Link>
              <Link
                href="/cart"
                className="block text-gray-700 hover:text-blue-600"
              >
                {t.cart} ({cartCount})
              </Link>
              <Link
                href="/profile"
                className="block text-gray-700 hover:text-blue-600"
              >
                {t.profile}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block text-gray-700 hover:text-blue-600"
              >
                {t.login}
              </Link>
              <Link
                href="/register"
                className="block text-blue-600 font-semibold"
              >
                {t.register}
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

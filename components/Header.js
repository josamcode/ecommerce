"use client";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { Menu, ShoppingCart, Heart, User, Globe, Search } from "lucide-react";
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
    <header className="bg-white sticky top-0 z-50 w-full">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">JO-</span>
              <span className="text-2xl font-bold text-gray-900">SAM</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex ml-8 space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t.home}
              </Link>
              <Link
                href="/shop"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t.shop}
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t.about}
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t.contact}
              </Link>
            </nav>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Toggle */}
            <div className="flex items-center space-x-2">
              <span
                className="text-gray-600 text-sm font-medium hidden sm:inline cursor-pointer"
                onClick={toggleLanguage}
              >
                {language === "en" ? "English" : "Arabic"}
              </span>
              <button
                onClick={toggleLanguage}
                className="text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100"
              >
                <Globe className="w-5 h-5" />
              </button>
            </div>

            {/* User Actions */}
            {token ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link
                  href="/wishlist"
                  className="relative text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/cart"
                  className="relative text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100"
                >
                  <User className="w-5 h-5" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t.login}
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  {t.register}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-4">
            <nav className="space-y-2">
              <Link
                href="/"
                className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t.home}
              </Link>
              <Link
                href="/shop"
                className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t.shop}
              </Link>
              <Link
                href="/about"
                className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t.about}
              </Link>
              <Link
                href="/contact"
                className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t.contact}
              </Link>
              {token && (
                <>
                  <Link
                    href="/wishlist"
                    className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {t.wishlist}
                  </Link>
                  <Link
                    href="/cart"
                    className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {t.cart} ({cartCount})
                  </Link>
                  <Link
                    href="/profile"
                    className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {t.profile}
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

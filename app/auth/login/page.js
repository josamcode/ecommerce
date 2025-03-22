"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/utils/api";
import { FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import Cookies from "js-cookie";
import NotificationCard from "@/components/NotificationCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import useTranslation from "@/app/hooks/useTranslation";

export default function Login() {
  const [credential, setCredential] = useState(""); // Unified field for email or phone number
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);
  const router = useRouter();

  const { language } = useLanguage();
  const t = useTranslation(language);

  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    setIsRTL(document.documentElement.dir === "rtl");
  }, []);

  useEffect(() => {
    const token = Cookies.get("accessToken");

    if (token) {
      router.push("/profile");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ credential, password });

      // Save the token for 30 days
      Cookies.set("accessToken", data.accessToken, {
        expires: 30,
        secure: true,
        sameSite: "strict",
      });

      setNotification({ message: t.loginSuccess, type: "success" });
      setTimeout(() => setNotification(null), 3000);
      router.push("/profile");
    } catch (error) {
      setNotification({ message: t.invalidCredentials, type: "error" });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <>
      <Header />
      <div
        
        className={`flex justify-center items-center my-20 ${isRTL ? "text-right" : "text-left"}`}
      >
        {notification && (
          <NotificationCard
            message={notification.message}
            type={notification.type}
          />
        )}
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-lg shadow-md w-96"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
            {t.welcomeBack}
          </h2>
          <div className="relative mb-2">
            {/* Use a unified input field for email or phone number */}
            <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text" // Changed from "email" to "text"
              placeholder={t.emailOrPhoneNumberPlaceholder}
              className="w-full p-2 pl-10 border rounded text-gray-950"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
            />
          </div>
          <div className="relative mb-2">
            <FaLock className="absolute left-3 top-3 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t.passwordPlaceholder}
              className="w-full p-2 pl-10 pr-10 border rounded text-gray-950"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded mt-2"
          >
            {t.login}
          </button>
          <p className="text-center text-sm text-gray-600 mt-4">
            {t.dontHaveAcount}{" "}
            <Link
              href="/auth/register"
              className="text-blue-600 hover:underline"
            >
              {t.Register}
            </Link>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
}

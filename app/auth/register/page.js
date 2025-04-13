"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/utils/api";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import Cookies from "js-cookie";
import NotificationCard from "@/components/NotificationCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/app/context/LanguageContext";
import useTranslation from "@/app/hooks/useTranslation";
import Link from "next/link";
import Image from "next/image";

export default function Register() {
  const [username, setUsername] = useState(""); // Now represents full name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // Add phone number state
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Fetch language and translations
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

  const validate = () => {
    const newErrors = {};
    if (!username) newErrors.username = t.errorsFullNameRequired; // Updated error message
    if (!email) {
      newErrors.email = t.errorsEmailRequired;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = t.errorsEmailInvalid;
    }
    if (!password) {
      newErrors.password = t.errorsPasswordRequired;
    } else if (password.length < 6) {
      newErrors.password = t.errorsPasswordMinLength;
    }
    if (!phoneNumber) {
      newErrors.phoneNumber = t.errorsPhoneNumberRequired;
    } else if (!/^01[0-9]{9}$/.test(phoneNumber)) {
      newErrors.phoneNumber = t.errorsPhoneNumberInvalid; // Validate phone number format
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      await registerUser({ username, email, password, phoneNumber }); // Include phone number in API call
      setNotification({
        message: t.notificationSuccess,
        type: "success",
      });
      setTimeout(() => setNotification(null), 3000);
      router.push("/auth/login");
    } catch (error) {
      setNotification({ message: t.notificationError, type: "error" });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full space-y-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Left side - Register Form */}
              <div className="w-full md:w-1/2 p-8 md:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    {t.createAccount}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    {t.alreadyHaveAccount}{" "}
                    <Link
                      href="/auth/login"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      {t.loginLink}
                    </Link>
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-4">
                    {/* Full Name Field */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder={t.fullNamePlaceholder}
                        className={`block w-full pl-10 pr-3 py-3 border ${
                          errors.username ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      {errors.username && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.username}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        placeholder={t.emailPlaceholder}
                        className={`block w-full pl-10 pr-3 py-3 border ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone Number Field */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder={t.phoneNumberPlaceholder}
                        className={`block w-full pl-10 pr-3 py-3 border ${
                          errors.phoneNumber ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                      {errors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder={t.passwordPlaceholder}
                        className={`block w-full pl-10 pr-10 py-3 border ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                        ) : (
                          <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                        )}
                      </button>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.password}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out ${
                      isLoading ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {t.loadingMessage}
                      </div>
                    ) : (
                      t.registerButton
                    )}
                  </button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        {t.orContinueWith}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed relative group"
                      title={t.comingSoon}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                      <span className="ml-2">{t.loginWithFacebook}</span>
                    </button>
                    <button
                      type="button"
                      disabled
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed relative group"
                      title={t.comingSoon}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                      </svg>
                      <span className="ml-2">{t.loginWithGoogle}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right side - Image */}
              <div className="hidden md:block md:w-1/2 bg-blue-600">
                <div className="h-full flex items-center justify-center p-12">
                  <div className="text-center text-white">
                    <h3 className="text-3xl font-bold mb-4">
                      {t.registerHeroTitle}
                    </h3>
                    <p className="text-blue-100 mb-8">
                      {t.registerHeroSubtitle}
                    </p>
                    <div className="relative w-64 h-64 mx-auto">
                      <Image
                        src="/images/login-hero.svg"
                        alt="Register Illustration"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

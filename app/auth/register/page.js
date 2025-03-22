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

export default function Register() {
  const [username, setUsername] = useState(""); // Now represents full name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // Add phone number state
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
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
    }
  };

  return (
    <>
      <Header />
      <div
        className={`flex justify-center items-center my-20 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {notification && (
          <NotificationCard
            message={notification.message}
            type={notification.type}
          />
        )}
        <form
          onSubmit={handleRegister}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
            {t.createAccount}
          </h2>

          {/* Full Name Field */}
          <div className="relative mb-4">
            <FaUser className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder={t.fullNamePlaceholder} // Updated placeholder
              className={`w-full p-3 pl-10 border rounded-lg ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="relative mb-4">
            <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
            <input
              type="email"
              placeholder={t.emailPlaceholder}
              className={`w-full p-3 pl-10 border rounded-lg ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="relative mb-4">
            <FaPhone className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder={t.phoneNumberPlaceholder}
              className={`w-full p-3 pl-10 border rounded-lg ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative mb-4">
            <FaLock className="absolute left-3 top-3 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t.passwordPlaceholder}
              className={`w-full p-3 pl-10 pr-10 border rounded-lg ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
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
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg mt-4 hover:bg-blue-700"
          >
            {t.registerButton}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            {t.alreadyHaveAccount}{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              {t.loginLink}
            </Link>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
}

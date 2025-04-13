"use client";

import Cookies from "js-cookie";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/app/context/LanguageContext";
import useTranslation from "@/app/hooks/useTranslation";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  // Fetch language and translations
  const { language } = useLanguage();
  const t = useTranslation(language);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t.errorsAllFieldsRequired);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t.errorsPasswordMismatch);
      return;
    }

    try {
      const accessToken = Cookies.get("accessToken");
      const response = await fetch(
        "http://localhost:5000/api/user/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password.");
      }

      Swal.fire({
        icon: "success",
        title: t.passwordPlaceholderUpdateSuccessTitle,
        text: t.passwordPlaceholderUpdateSuccessText,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t.errorTitle,
        text: error.message || t.unexpectedErrorMessage,
      });
    }
  };

  return (
    <>
      <Header />
      <div
        className="py-20 flex items-center justify-center bg-gray-100 p-6"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
          <h1 className="text-2xl font-semibold text-center text-gray-800">
            {t.changePasswordTitle}
          </h1>

          <form onSubmit={handleChangePassword} className="mt-6">
            <div className="mb-4">
              <input
                type="password"
                placeholder={t.currentPasswordPlaceholder}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder={t.newPasswordPlaceholder}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder={t.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            {passwordError && (
              <p className="text-red-500 text-center text-sm mb-2">{passwordError}</p>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
            >
              {t.changePasswordButtonText}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChangePassword;

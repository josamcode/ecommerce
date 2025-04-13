"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/app/context/LanguageContext";
import useTranslation from "@/app/hooks/useTranslation";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
  });
  const [formError, setFormError] = useState("");
  const router = useRouter();

  // Fetch language and translations
  const { language } = useLanguage();
  const t = useTranslation(language);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      router.push("/auth/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/user/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const data = await response.json();
        setUser(data);
        setFormData({
          username: data.username,
          email: data.email,
          phoneNumber: data.phoneNumber || "",
        });
      } catch (error) {
        setError(true);
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!formData.username || !formData.email) {
      setFormError(t.errorsRequiredFields);
      return;
    }

    try {
      const accessToken = Cookies.get("accessToken");
      const response = await fetch(
        "https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/user/edit-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }

      Swal.fire({
        icon: "success",
        title: t.profileUpdateSuccessTitle,
        text: t.profileUpdateSuccessText,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });

      router.push("/profile");
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
      <div className="py-20 flex items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
          <h1 className="text-2xl font-semibold text-center text-gray-800">
            {t.editProfileTitle}
          </h1>

          {loading ? (
            <div className="mt-4 space-y-3 animate-pulse">
              <div className="h-20 w-20 bg-gray-300 rounded-full mx-auto"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6 mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 mt-4">
              ❌ {t.failedToLoadUserDataMessage}{" "}
              <button
                onClick={() => window.location.reload()}
                className="text-blue-500 underline"
              >
                {t.retryButtonText}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder={t.fullNamePlaceholder}
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder={t.phoneNumberPlaceholder}
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              {formError && (
                <p className="text-red-500 text-sm mb-2">{formError}</p>
              )}
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
              >
                {t.saveChangesButtonText}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile;

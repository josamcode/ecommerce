"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/app/context/LanguageContext";
import useTranslation from "@/app/hooks/useTranslation";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
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
      } catch (error) {
        setError(true);
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    Swal.fire({
      title: t.logoutConfirmationTitle,
      text: t.logoutConfirmationText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t.logoutConfirmButtonText,
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove("accessToken");
        router.push("/auth/login");
        Swal.fire({
          icon: "success",
          title: t.logoutSuccessTitle,
          text: t.logoutSuccessText,
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
      }
    });
  };

  return (
    <>
      <Header />
      <div className="bg-gray-100 py-20" dir={language === "ar" ? "rtl" : "ltr"}>
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold text-center">
              {loading ? (
                t.loadingMessage
              ) : user ? (
                <>
                  👋 {t.helloMessage}{" "}
                  <span className="font-bold">{user.username}</span>!
                </>
              ) : (
                t.userNotFoundMessage
              )}
            </h1>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-20 h-20 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="w-48 h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="w-64 h-4 bg-gray-200 animate-pulse rounded"></div>
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
            ) : user ? (
              <div className="space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center space-y-4">
                  {user.avatar && (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
                    />
                  )}
                </div>

                {/* User Details */}
                <div className="space-y-2">
                  <p className="text-gray-700 flex items-center">
                    📧{" "}
                    <span className="ml-2 font-medium">
                      {t.emailLabel}: <span className="bg-gray-200 py-0 px-3 rounded-lg">{user.email}</span>
                    </span>
                  </p>
                  {user.phoneNumber && (
                    <p className="text-gray-700 flex items-center">
                      ☎️{" "}
                      <span className="ml-2 font-medium">
                        {t.phoneNumberLabel}: <span className="bg-gray-200 py-0 px-3 rounded-lg">{user.phoneNumber}</span>
                      </span>
                    </p>
                  )}
                  <p className="text-gray-500 flex items-center text-sm">
                    🔑{" "}
                    <span className="ml-2">
                      {t.idLabel}: <span className="bg-gray-200 py-0 px-3 rounded-lg">{user._id}</span>
                    </span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                    onClick={() => router.push("/profile/edit")}
                  >
                    {t.editProfileButtonText}
                  </button>
                  <button
                    className="w-full sm:w-auto px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition"
                    onClick={() => router.push("/profile/change-password")}
                  >
                    {t.changePasswordButtonText}
                  </button>
                  <button
                    className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
                    onClick={handleLogout}
                  >
                    {t.logoutButtonText}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-red-500 mt-4">
                ❌ {t.userDataNotLoadedMessage}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;

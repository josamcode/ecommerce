"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/app/context/LanguageContext";
import useTranslation from "@/app/hooks/useTranslation";
import { FiUser, FiMail, FiPhone, FiKey, FiEdit, FiLock, FiLogOut, FiPackage } from "react-icons/fi";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const router = useRouter();

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

        const ordersResponse = await fetch(
          `https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/orders/get-orders/${data._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setOrders(ordersData);
        }
      } catch (error) {
        setError(true);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        setOrdersLoading(false);
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
      <div className="min-h-screen bg-gray-50" dir={language === "ar" ? "rtl" : "ltr"}>
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-600"></div>
            <div className="relative px-6 -mt-16 pb-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                      <FiUser className="text-white w-16 h-16" />
                    </div>
                  )}
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">{user?.username}</h2>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <button
                  onClick={() => router.push("/profile/edit")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                >
                  <FiEdit className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-700">{t.editProfileButtonText}</span>
                </button>

                <button
                  onClick={() => router.push("/profile/change-password")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                >
                  <FiLock className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-700">{t.changePasswordButtonText}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-100 hover:text-red-500 transition"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span className="font-medium">{t.logoutButtonText}</span>
                </button>
              </div>

              {/* User Details */}
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <FiMail className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">{t.emailLabel}</p>
                      <p className="font-medium text-gray-900">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {user?.phoneNumber && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                      <FiPhone className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">{t.phoneNumberLabel}</p>
                        <p className="font-medium text-gray-900">{user.phoneNumber}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiPackage className="w-6 h-6 text-blue-600" />
              {t.myOrders || "My Orders"}
            </h3>

            {ordersLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="font-mono text-sm mt-2 text-purple-600">
                          #{order._id}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          order.status === "pending"
                            ? "bg-gray-100 text-gray-600"
                            : order.status === "placed"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "shipped"
                            ? "bg-amber-100 text-amber-700"
                            : order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {order.cart.map((item) => (
                        <div key={item._id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                          <img
                            src={`https://eastern-maryjane-josamcode-baebec38.koyeb.app/images/products/${item.image}`}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {item.quantity} × ${item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {order.paymentMethod === "cash_on_delivery" ? "Cash on Delivery" : "Credit Card"}
                        </div>
                        <div className="text-xl font-bold text-purple-600">
                          ${order.totalPrice}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center">
                <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {t.noOrders || "You haven't placed any orders yet."}
                </p>
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

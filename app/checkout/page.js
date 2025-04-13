"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NotificationCard from "@/components/NotificationCard";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useLanguage } from "../context/LanguageContext";
import useTranslation from "../hooks/useTranslation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_stripe_Promise);

const CheckoutForm = ({ totalPrice, setNotification }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      // Verify card data
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (error) {
        console.error("Payment error:", error.message);
        setNotification({
          message: "Payment failed. Please check your card details.",
          type: "error",
        });
      } else {
        console.log("Payment method created:", paymentMethod);

        // Send payment data to the server
        const response = await fetch("http://localhost:5000/api/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethodId: paymentMethod.id,
            amount: totalPrice, // Total price of the order
          }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log("Payment confirmed successfully:", data);
          setNotification({
            message: "Payment successful!",
            type: "success",
          });
        } else {
          console.error("Payment confirmation failed:", data.message);
          setNotification({
            message: "Payment failed. Please try again.",
            type: "error",
          });
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setNotification({
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div>
      <CardElement />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!stripe}
        className="mt-4 w-full py-3 bg-blue-600 text-white font-semibold rounded-md"
      >
        Pay with Credit Card
      </button>
    </div>
  );
};

export default function Checkout() {
  const { language } = useLanguage();
  const t = useTranslation(language);

  const [cart, setCart] = useState([]);
  const [serverCart, setServerCart] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    state: "",
    street: "",
    userId: null,
  });
  const [accessToken, setAccessToken] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("delivery");
  const [discountCode, setDiscountCode] = useState("");
  const [notification, setNotification] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    const targetCookie = cookies.find((cookie) =>
      cookie.startsWith(`${name}=`)
    );
    return targetCookie ? targetCookie.split("=")[1] : null;
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

    setCart(storedCart);

    if (storedCart.length === 0) {
      router.push("/shop");
    }

    const token = getCookie("accessToken");
    setAccessToken(token);

    if (!token) {
      router.push("/auth/login");
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {}, [cart]);

  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user/me", {
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

  useEffect(() => {
    if (accessToken) {
      fetchUserData();
    }
  }, [accessToken]);

  useEffect(() => {
    if (user) {
      setUserInfo((prev) => ({
        ...prev,
        userId: user._id,
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const validateCardDetails = () => {
    if (!userInfo.cardNumber || !userInfo.expiryDate || !userInfo.cvv) {
      setNotification({
        message: "Please enter valid card details.",
        type: "error",
      });
      return false;
    }
    return true;
  };

  const validateAddressFields = () => {
    const { country, city, state, street } = userInfo;
    
    // Regular expression to check for valid place names
    // This regex allows letters, numbers, spaces, hyphens, apostrophes, and commas
    const validPlaceRegex = /^[a-zA-Z0-9\s,'-]+$/;
    
    // Check if any field is empty
    if (!country || !city || !state || !street) {
      setNotification({
        message: "Please fill in all address fields.",
        type: "error",
      });
      return false;
    }

    // Check if fields contain only valid characters and at least one letter
    if (!validPlaceRegex.test(country) || !validPlaceRegex.test(city) || 
        !validPlaceRegex.test(state) || !validPlaceRegex.test(street)) {
      setNotification({
        message: "Address fields should contain valid place names with letters, numbers, spaces, hyphens, apostrophes, or commas only.",
        type: "error",
      });
      return false;
    }

    // Check if fields contain only special characters or spaces
    if (/^[\s.,]+$/.test(country) || /^[\s.,]+$/.test(city) || 
        /^[\s.,]+$/.test(state) || /^[\s.,]+$/.test(street)) {
      setNotification({
        message: "Address fields cannot contain only special characters or spaces.",
        type: "error",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that the cart is not empty
    if (cart.length === 0) {
      setNotification({
        message: "Your cart is empty. Add items to proceed.",
        type: "error",
      });
      return;
    }

    // Validate address fields
    if (!validateAddressFields()) {
      return;
    }

    try {
      if (paymentMethod === "delivery") {
        // Create the order with the cart data
        const orderResponse = await fetch("http://localhost:5000/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userInfo: {
              name: userInfo.name,
              email: userInfo.email,
              phone: userInfo.phone,
              country: userInfo.country,
              city: userInfo.city,
              state: userInfo.state,
              street: userInfo.street,
              userId: userInfo.userId,
            },
            cart: cart,
            totalPrice: totalPrice - discount,
            paymentMethod: "cash_on_delivery",
          }),
        });

        const orderData = await orderResponse.json();
        if (orderResponse.ok) {
          console.log("Order placed successfully:", orderData);
          setOrderSuccess(true); // Update success state

          // Clear the cart state
          setCart([]);

          // Clear the cart from localStorage
          localStorage.removeItem("cart");

          window.dispatchEvent(new Event("cartUpdated"));

          setServerCart(orderData.cart || []);
        } else {
          console.error("Order placement failed:", orderData.message);
          setNotification({
            message: "Order failed. Please try again.",
            type: "error",
          });
        }
      } else if (paymentMethod === "credit_card") {
        // Handle credit card payment logic here
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setNotification({
        message: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    }
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const discount = discountCode === "SAVE10" ? 10 : 0;

  const renderOrderSummary = () => (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Order Confirmation Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.OrderConfirmedTitle}</h1>
          <p className="text-lg text-gray-600">{t.OrderConfirmationMessage}</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t.OrderDetailsTitle}</h2>
            
            {/* Order Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t.CustomerInfoTitle}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-gray-900">{userInfo.name}</p>
                    <p className="text-gray-600">{userInfo.email}</p>
                    <p className="text-gray-600">{userInfo.phone}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t.ShippingAddressTitle}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-gray-900">{userInfo.street}</p>
                    <p className="text-gray-600">{`${userInfo.city}, ${userInfo.state}`}</p>
                    <p className="text-gray-600">{userInfo.country}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t.OrderedItemsTitle}</h3>
              <div className="space-y-4">
                {serverCart.map((item) => (
                  <div key={item._id} className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <img
                        src={`http://localhost:5000/images/products/${item.image}`}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="text-gray-900 font-medium">{item.name}</h4>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-gray-900 font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            {/* <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.SubtotalLabel}</span>
                  <span className="text-gray-900">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.DiscountLabel}</span>
                  <span className="text-green-600">-${discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">{t.TotalPriceLabel}</span>
                  <span className="text-lg font-semibold text-blue-600">
                    ${(totalPrice - discount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.NextStepsTitle}</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-gray-600">{t.OrderDeliveryTimeMessage}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-gray-600">{t.OrderConfirmationEmailMessage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Shopping Button */}
        <div className="mt-8 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t.ContinueShoppingButton}
          </Link>
        </div>
      </div>
    </div>
  );

  const renderCheckoutSteps = () => (
    <div className="flex justify-between items-center mb-8">
      <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          1
        </div>
        <span className="ml-2">{t.Shipping}</span>
      </div>
      <div className={`flex-1 h-1 mx-4 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
      <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          2
        </div>
        <span className="ml-2">{t.Payment}</span>
      </div>
      <div className={`flex-1 h-1 mx-4 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
      <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          3
        </div>
        <span className="ml-2">{t.Review}</span>
      </div>
    </div>
  );

  const renderShippingForm = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">{t.ShippingInformation}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.FullNamePlaceholder}</label>
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.JustEmailPlaceholder}</label>
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.PhonePlaceholder}</label>
          <input
            type="tel"
            name="phone"
            value={userInfo.phone}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.CountryPlaceholder}</label>
          <input
            type="text"
            name="country"
            value={userInfo.country}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.StreetAddressPlaceholder}</label>
          <input
            type="text"
            name="street"
            value={userInfo.street}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.CityPlaceholder}</label>
          <input
            type="text"
            name="city"
            value={userInfo.city}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.StatePlaceholder}</label>
          <input
            type="text"
            name="state"
            value={userInfo.state}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t.ContinueToPayment}
        </button>
      </div>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">{t.PaymentMethodLabel}</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setPaymentMethod("delivery")}
            className={`flex-1 p-4 border rounded-lg ${
              paymentMethod === "delivery"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            }`}
          >
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                paymentMethod === "delivery" ? "border-blue-500 bg-blue-500" : "border-gray-300"
              }`}>
                {paymentMethod === "delivery" && (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
              </div>
              <span className="font-medium">{t.CashOnDelivery}</span>
            </div>
          </button>
          <button
            type="button"
            className="flex-1 p-4 border border-gray-300 rounded-lg opacity-50 cursor-not-allowed"
            disabled
          >
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-3"></div>
              <span className="font-medium">{t.CreditCard}</span>
            </div>
          </button>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {t.Back}
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(3)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t.ContinueToReview}
        </button>
      </div>
    </div>
  );

  const renderReviewForm = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">{t.OrderSummaryTitle}</h3>
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={`http://localhost:5000/images/products/${item.image}`}
                  alt={item.name}
                  className="w-16 h-16 rounded object-cover"
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500">{t.QuantityLabel}: {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 mt-6 pt-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">{t.SubtotalLabel}</span>
            <span className="font-medium">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t.DiscountLabel}</span>
            <span className="text-green-600">-${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="font-semibold">{t.TotalPriceLabel}</span>
            <span className="font-semibold text-blue-600">
              ${(totalPrice - discount).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {t.Back}
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t.PlaceOrderButton}
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      {notification && (
        <NotificationCard
          message={notification.message}
          type={notification.type}
        />
      )}
      {orderSuccess ? (
        renderOrderSummary()
      ) : (
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.CheckoutTitle}</h1>
            {renderCheckoutSteps()}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <form onSubmit={handleSubmit}>
                {currentStep === 1 && renderShippingForm()}
                {currentStep === 2 && renderPaymentForm()}
                {currentStep === 3 && renderReviewForm()}
              </form>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

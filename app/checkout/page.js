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
        const response = await fetch("https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/payments", {
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

    try {
      if (paymentMethod === "delivery") {
        // Create the order with the cart data
        const orderResponse = await fetch("https://eastern-maryjane-josamcode-baebec38.koyeb.app/api/orders", {
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
    <div className="container mx-auto my-8 px-4 sm:px-6 lg:px-10 w-full flex flex-col items-center justify-center">
      <section className="bg-white p-8 border rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-4xl font-extrabold text-blue-700 mb-8 text-center">
          {t.OrderSummaryTitle}
        </h2>

        {/* User Information */}
        <div className="mb-6 space-y-2">
          <p className="text-lg">
            <strong className="text-gray-700">{t.Name}</strong> {userInfo.name}
          </p>
          <p className="text-lg">
            <strong className="text-gray-700">{t.Email}</strong>{" "}
            {userInfo.email}
          </p>
          <p className="text-lg">
            <strong className="text-gray-700">{t.PhoneLabel}</strong>{" "}
            {userInfo.phone}
          </p>
          <p className="text-lg">
            <strong className="text-gray-700">{t.AddressLabel}</strong>{" "}
            {`${userInfo.street}, ${userInfo.city}, ${userInfo.state}, ${userInfo.country}`}
          </p>
          <p className="text-lg">
            <strong className="text-gray-700">{t.PaymentMethodLabel}</strong>{" "}
            {paymentMethod === "delivery"
              ? t.CashOnDelivery
              : paymentMethod === "credit_card"
              ? "Credit Card"
              : "Bank Transfer"}
          </p>
        </div>

        {/* Ordered Items */}
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          {t.OrderedItemsTitle}
        </h3>
        {serverCart.length > 0 ? (
          <table className="w-full text-left mb-6">
            <thead>
              <tr>
                <th className="py-2">{t.ProductLabel}</th>
                <th className="py-2 text-center min-w-24">{t.QuantityLabel}</th>
                <th className="py-2 text-center">{t.PriceLabel}</th>
              </tr>
            </thead>
            <tbody>
              {serverCart.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="py-2 flex items-center">
                    <img
                      src={`https://eastern-maryjane-josamcode-baebec38.koyeb.app/images/products/${item.image}`}
                      alt={item.name}
                      className="w-10 h-10 mr-4 rounded object-cover"
                    />
                    {item.name}
                  </td>
                  <td className="py-2 text-center">{item.quantity}</td>
                  <td className="py-2 text-center">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-lg text-gray-700 text-center">
            {t.NoItemsInOrderMessage}
          </p>
        )}

        {/* Delivery Message */}
        <p className="text-lg text-gray-700 mt-6 text-center">
          {t.OrderDeliveryTimeMessage}
        </p>
      </section>

      {/* Thank You Message */}
      <p className="text-xl text-gray-700 mt-4 text-center">
        {t.ThankYouMessage}
      </p>
    </div>
  );

  if (loading) {
    return <p>Loading...</p>;
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
        <section
          className={`container mx-auto my-16 px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10`}
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 border rounded-md shadow-md"
          >
            <h2 className="text-3xl font-bold text-blue-600 mb-6">
              {t.CheckoutTitle}
            </h2>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("delivery")}
                className={`px-4 py-2 border rounded-md ${
                  paymentMethod === "delivery"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                } ${language === "ar" ? "ml-3" : ""}`}
              >
                {t.CashOnDelivery}
              </button>
              <button
                type="button"
                // onClick={() => setPaymentMethod("credit_card")}
                className={`px-4 py-2 border rounded-md flex items-center space-x-2 cursor-not-allowed ${
                  paymentMethod === "credit_card"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
                disabled
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1v-1zm8-6a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1V7z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{t.CreditCard}</span>
              </button>
            </div>
            <input
              type="text"
              name="name"
              placeholder={t.FullNamePlaceholder}
              value={userInfo.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
            <input
              type="email"
              name="email"
              placeholder={t.JustEmailPlaceholder}
              value={userInfo.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder={t.PhonePlaceholder}
              value={userInfo.phone}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md`}
              required
            />
            <input
              type="text"
              name="country"
              placeholder={t.CountryPlaceholder}
              value={userInfo.country}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="text"
              name="street"
              placeholder={t.StreetAddressPlaceholder}
              value={userInfo.street}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                placeholder={t.CityPlaceholder}
                value={userInfo.city}
                onChange={handleInputChange}
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="state"
                placeholder={t.StatePlaceholder}
                value={userInfo.state}
                onChange={handleInputChange}
                className="p-2 border rounded-md"
              />
            </div>
            {paymentMethod === "credit_card" && (
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  totalPrice={totalPrice}
                  setNotification={setNotification}
                />
              </Elements>
            )}
            <label className="flex items-center space-x-2">
              <input type="checkbox" required />
              <span className="cursor-pointer">
                {t.TermsAndConditionsMessage}{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  {t.TermsAndConditions}
                </Link>
                .
              </span>
            </label>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md"
            >
              {t.PlaceOrderButton}
            </button>
          </form>
          <div className="p-6 border h-max bg-white rounded-md shadow-md">
            <h2 className="text-3xl font-bold text-blue-600 mb-6">
              {t.ReviewCartTitle}
            </h2>
            <table className="w-full text-left mb-6">
              <thead>
                <tr
                >
                  <th className="py-2">{t.ProductLabel}</th>
                  <th className="py-2 text-center min-w-24">
                    {t.QuantityLabel}
                  </th>
                  <th className="py-2 text-center">{t.PriceLabel}</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="py-2 flex items-center">
                      <img
                        src={`https://eastern-maryjane-josamcode-baebec38.koyeb.app/images/products/${item.image}`}
                        alt={item.name}
                        className={`w-10 h-10 mr-4 rounded object-cover`}
                      />
                      {item.name}
                    </td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <p className="text-lg font-semibold">
                {t.SubtotalLabel} ${totalPrice.toFixed(2)}
              </p>
              <p className="text-lg font-semibold">
                {t.DiscountLabel} -${discount.toFixed(2)}
              </p>
              <p className="text-2xl font-bold mt-2 text-blue-600">
                {t.TotalPriceLabel} ${(totalPrice - discount).toFixed(2)}
              </p>
            </div>
          </div>
        </section>
      )}
      <Footer />
    </>
  );
}

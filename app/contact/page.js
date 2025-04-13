"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NotificationCard from "@/components/NotificationCard";
import { useState } from "react";
import useTranslation from "@/app/hooks/useTranslation";
import { useLanguage } from "@/app/context/LanguageContext";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [notification, setNotification] = useState(null);

  const { language } = useLanguage();
  const t = useTranslation(language);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    return Object.values(formData).every((value) => value.trim() !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setNotification({
        message: t.ValidationErrorMessage,
        type: "error",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({
          message: t.SuccessMessage,
          type: "success",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setNotification({
          message: data.message || t.ErrorMessage,
          type: "error",
        });
      }
    } catch (error) {
      setNotification({ message: t.NetworkErrorMessage, type: "error" });
    }
  };

  return (
    <>
      <Header />

      {notification && (
        <NotificationCard
          message={notification.message}
          type={notification.type}
        />
      )}

      <section
        className={`w-full my-24 `}
        
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Title */}
            <h2 className="text-4xl font-bold text-blue-600">
              {t.ContactUsTitle}
            </h2>
            {/* Subtitle */}
            <p className="text-gray-400 mt-2">{t.ContactUsSubtitle}</p>
          </div>

          <div className="mt-12 max-w-3xl mx-auto bg-white p-8 shadow-md rounded-md">
            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-2">
                  {t.NameLabel}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t.NamePlaceholder}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              {/* Email Field */}
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-2">
                  {t.EmailLabel}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t.EmailPlaceholder}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              {/* Message Field */}
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-2">
                  {t.MessageLabel}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t.MessagePlaceholder}
                  rows="4"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                ></textarea>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-500 transition"
              >
                {t.SendMessageButton}
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

"use client";

import { color } from "framer-motion";

export const addToCart = (product, quantity, setNotification) => {
  if (!product) return;

  // Retrieve accessToken from cookies
  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((row) => row.startsWith(name + "="));
    return cookie ? cookie.split("=")[1] : null;
  };

  const accessToken = getCookie("accessToken");

  if (!accessToken) {
    window.location.href = "/auth/login";
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProductIndex = cart.findIndex(
    (item) => item.id === product.id || item.id === product._id
  );

  if (existingProductIndex !== -1) {
    cart[existingProductIndex].quantity = quantity;
  } else {
    cart.push({
      id: product._id || product.id,
      name: product.name,
      image: product.image || product.images[0],
      price: product.discountPrice || product.price,
      quantity: quantity,
      stock: product.stock,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  setNotification({ message: "Product added to cart!", type: "success" });

  window.dispatchEvent(new Event("cartUpdated"));

  setTimeout(() => setNotification(null), 3000);
};

export const addToWishlist = (product, setNotification) => {
  if (!product) return;

  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const isAlreadyInWishlist = wishlist.some(
    (item) => item.id === product._id || item.id === product.id
  );

  if (!isAlreadyInWishlist) {
    wishlist.push({
      id: product._id || product.id,
      name: product.name,
      image: product.image || product.images[0],
      price: product.discountPrice || product.price,
      stock: product.stock,
    });
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setNotification({ message: "Product added to wishlist!", type: "success" });

    window.dispatchEvent(new Event("wishlistUpdated"));
  } else {
    setNotification({ message: "Product already in wishlist!", type: "info" });
  }

  setTimeout(() => setNotification(null), 3000);
};

export const checkProductStatus = (productId) => {
  if (!productId) return { isInCart: false, isInWishlist: false };

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  return {
    isInCart: cart.some((item) => item.id === productId),
    isInWishlist: wishlist.some((item) => item.id === productId),
  };
};

export const removeFromCart = (productId, setNotification) => {
  if (!productId) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id !== productId);

  localStorage.setItem("cart", JSON.stringify(cart));
  setNotification({ message: "Product removed from cart!", type: "error" });

  window.dispatchEvent(new Event("cartUpdated"));

  setTimeout(() => setNotification(null), 3000);
};

export const removeFromWishlist = (productId) => {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const updatedWishlist = wishlist.filter((item) => item.id !== productId);
  localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  window.dispatchEvent(new Event("wishlistUpdated"));
  return updatedWishlist; // Ensure it returns an array
};

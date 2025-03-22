import { useEffect, useState } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function NotificationCard({ message, type }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-20 right-5 p-4 rounded-lg shadow-lg text-white flex items-center gap-2 z-[999] ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
      <span>{message}</span>
    </div>
  );
}
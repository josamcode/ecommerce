import { LanguageProvider } from "./context/LanguageContext";
import "./globals.css";

export const metadata = {
  title: "E-Shop",
  description: "A Next.js social media platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-950">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

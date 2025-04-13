import { LanguageProvider } from "./context/LanguageContext";
import "./globals.css";

export const metadata = {
  title: "JO-SAM",
  description: "A Next.js social media platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-950" suppressHydrationWarning>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

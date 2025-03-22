"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Link from "next/link";

const routes = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "Collections", path: "/collections" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Terms({ type }) {
  return (
    <>
      <Header />
      <section className="w-full my-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="sm:text-2xl lg:text-4xl font-bold text-blue-600">
              Terms and Conditions
            </h2>
            <p className="text-gray-500 mt-4 text-lg">
              Welcome to our website. By accessing and using this website, you accept and agree to be bound by the following terms and conditions. If you do not agree to these terms, please do not use this website.
            </p>
            <h3 className="text-lg font-semibold text-gray-700 mt-6">1. Use of Website</h3>
            <p className="text-gray-500 mt-2 text-lg">
              You agree to use this website for lawful purposes only and in a manner that does not infringe the rights of others or restrict or inhibit their use and enjoyment of the site.
            </p>
            <h3 className="text-lg font-semibold text-gray-700 mt-6">2. Intellectual Property</h3>
            <p className="text-gray-500 mt-2 text-lg">
              All content, trademarks, and data on this website, including but not limited to text, graphics, logos, and software, are the property of the website owner and are protected by copyright and intellectual property laws.
            </p>
            <h3 className="text-lg font-semibold text-gray-700 mt-6">3. Limitation of Liability</h3>
            <p className="text-gray-500 mt-2 text-lg">
              The website owner will not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your access to or use of this website.
            </p>
            <h3 className="text-lg font-semibold text-gray-700 mt-6">4. Changes to Terms</h3>
            <p className="text-gray-500 mt-2 text-lg">
              We reserve the right to modify these terms and conditions at any time. Your continued use of the website following any changes indicates your acceptance of the new terms.
            </p>
            <h3 className="text-lg font-semibold text-gray-700 mt-6">5. Contact Information</h3>
            <p className="text-gray-500 mt-2 text-lg">
              If you have any questions about these terms, please contact us.
            </p>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-700">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {routes.map((route) => (
                <li key={route.path}>
                  <Link
                    href={route.path}
                    className="text-blue-600 hover:underline text-lg"
                  >
                    {route.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

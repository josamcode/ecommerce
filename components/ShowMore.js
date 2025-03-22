import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ShowMore({ route }) {
  const router = useRouter();

  return (
    <motion.div
      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50"
      whileHover={{ scale: 1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push(route)}
    >
      <ArrowRight className="text-blue-500 w-10 h-10" />
      <p className="mt-4 text-gray-700 font-semibold">Show More</p>
    </motion.div>
  );
}

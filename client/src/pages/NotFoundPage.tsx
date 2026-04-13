import { Link } from "react-router-dom";
import { Zap, Home, Cable } from "lucide-react";

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-montserrat text-gray-900">
      <main className="flex-grow flex items-center justify-center px-4 py-20 relative overflow-hidden">
        <Zap className="absolute -top-10 -left-10 text-brand-primary/5 w-64 h-64 rotate-12" />
        <div className="absolute -bottom-20 -right-20 bg-brand-primary/10 rounded-full w-80 h-80 blur-3xl" />

        <div className="max-w-xl w-full text-center relative z-10">
          <div className="relative">
            <h1 className="text-[150px] md:text-[200px] font-black leading-none text-gray-200 tracking-tighter">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="text-brand-primary w-20 h-20 md:w-32 md:h-32 mt-10 animate-pulse" />
            </div>
          </div>

          <div className="space-y-4 bg-white p-8 rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 mt-12">
            <h2 className="text-xl font-semibold text-gray-950 uppercase tracking-wider">
              Сторінку не знайдено...
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm">
              Сторінка, яку ви шукаєте, знеструмлена або ніколи не була
              підключена до мережі.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-6">
            <Link
              to="/"
              className="flex items-center gap-2 px-10 py-2 rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-dark shadow-lg shadow-brand-primary/25 transition-all active:scale-[0.98]"
            >
              <Home size={20} />
              На головну
            </Link>

            <Link
              to="/catalog"
              className="flex items-center gap-2.5 px-8 py-4 rounded-full text-gray-600 font-semibold hover:bg-gray-100 hover:text-gray-800 transition-colors border border-transparent hover:border-gray-200"
            >
              <Cable size={18} />
              До каталогу товарів
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

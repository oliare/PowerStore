import { useEffect, useState } from "react";
import { Handbag, HeartIcon, MapPin, Phone, Search } from "lucide-react";
import Select from "antd/es/select";
import { Link } from "react-router-dom";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full text-sm">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin size={16} />
            <p>Розташування: Рівне, Україна</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-500">
              <Select
                defaultValue="Укр"
                bordered={false}
                className="w-fit [&_.ant-select-selector]:border-none [&_.ant-select-selector]:shadow-none [&_.ant-select-selector]:bg-transparent"
              >
                <Select.Option value="ukraine">Eng</Select.Option>
                <Select.Option value="poland">Укр</Select.Option>
              </Select>

              <Select
                defaultValue="UAH"
                bordered={false}
                className="w-fit [&_.ant-select-selector]:border-none [&_.ant-select-selector]:bg-transparent"
              >
                <Select.Option value="UAH">ГРН</Select.Option>
                <Select.Option value="USD">USD</Select.Option>
                <Select.Option value="EUR">EUR</Select.Option>
              </Select>
            </div>

            <div className="h-4 w-[1px] bg-gray-300"></div>

            <div className="flex items-center gap-2 text-gray-600 hover:text-black cursor-pointer transition-colors">
              <Link to="/login">Увійти</Link>
              <Link to="/register">/ Зареєструватися</Link>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`bg-white border-b border-gray-200 z-50 transition-all duration-300 ${
          isScrolled ? "fixed top-0 left-0 w-full shadow-md" : "relative"
        }`}
      >
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
          <Link to={"/"}>
            <div className="flex items-center gap-2">
              <img
                src="public/header-logo.png"
                alt="logo"
                className="h-16 w-auto"
              />
            </div>
          </Link>

          <div className="hidden md:flex flex-1 mx-12">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Пошук електротоварів..."
                className="w-full bg-gray-100 rounded-full py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <HeartIcon size={24} strokeWidth={1.5} />
            <div className="h-4 w-[1px] bg-gray-300"></div>

            <Handbag size={24} strokeWidth={1.5} />

            <div className="flex flex-col leading-tight">
              <p className="text-xs text-gray-500">Кошик:</p>
              <p className="text-base font-semibold text-black">₴ 0.00</p>
            </div>
          </div>
        </div>
      </div>

      <nav
        className={`border-b text-white px-6 py-3 transition-all duration-300 bg-brand-primary ${
          isScrolled
            ? "-translate-y-full opacity-0 absolute w-full"
            : "relative"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <ul className="flex gap-9">
            <li>
              <Link to={"/"}>Головна</Link>
            </li>
            <li>Магазин</li>
            <li>Сторінки</li>
            <li>Блог</li>
            <li>Про нас</li>
            <li>Контакти</li>
          </ul>
          <div className="flex items-center gap-3">
            <Phone size={20} />
            <span>(219) 555-0114</span>
          </div>
        </div>
      </nav>

      {isScrolled && <div className="h-[80px]" />}
    </header>
  );
}

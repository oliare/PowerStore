import { useEffect, useState } from "react";
import {
  Handbag,
  HeartIcon,
  LogOut,
  MapPin,
  Phone,
  Search,
  Settings,
  User,
} from "lucide-react";
import Select from "antd/es/select";
import { Link, useNavigate } from "react-router-dom";
import { useGetMeQuery } from "../../services/userApi";
import type { MenuProps } from "antd/es/menu/menu";
import Dropdown from "antd/es/dropdown/dropdown";
import Avatar from "antd/es/avatar/Avatar";
import type { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { openCartSidebar } from "../../store/uiSlice";
import { useLogoutMutation } from "../../services/authApi";
import { logOut } from "../../store/authSlice";
import { baseApi } from "../../api/baseApi";
import { clearFavorites } from "../../store/favoriteSlice";
import { clearCart } from "../../store/cartSlice";

export default function Header() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useDispatch();

  const { data: user } = useGetMeQuery();
  const [logout] = useLogoutMutation();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const totalFavorites = useSelector(
    (state: RootState) => state.favorites.items.length,
  );

  const getInitials = () => {
    if (!user) return "";
    return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCart());
      dispatch(clearFavorites());
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      dispatch(logOut());
      dispatch(baseApi.util.resetApiState());
      navigate("/login");
    }
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <Link className="font-montserrat" to="/profile">
          Мій профіль
        </Link>
      ),
      icon: <Settings className="text-gray-500" size={16} />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: (
        <span className="font-montserrat text-red-600/80 group-hover:text-red-600">
          Вийти
        </span>
      ),
      icon: <LogOut size={16} className="text-red-600/80" />,
      className: "hover:!bg-red-50",
      onClick: handleLogout,
    },
  ];

  return (
    <header className="w-full text-sm font-medium">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500 font-normal">
            <MapPin size={16} />
            <p>Розташування: Рівне, Україна</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-500">
              <Select
                defaultValue="Укр"
                bordered={false}
                className="w-fit [&_.ant-select-selector]:border-none [&_.ant-select-selector]:shadow-none [&_.ant-select-selector]:bg-transparent text-gray-500 font-normal font-montserrat"
              >
                <Select.Option value="ukraine">Eng</Select.Option>
                <Select.Option value="poland">Укр</Select.Option>
              </Select>

              <Select
                defaultValue="UAH"
                bordered={false}
                className="w-fit [&_.ant-select-selector]:border-none [&_.ant-select-selector]:bg-transparent text-gray-500 font-normal font-montserrat"
              >
                <Select.Option value="UAH">ГРН</Select.Option>
                <Select.Option value="USD">USD</Select.Option>
                <Select.Option value="EUR">EUR</Select.Option>
              </Select>
            </div>

            <div className="h-4 w-[1px] bg-gray-300"></div>

            <div className="flex items-center gap-4">
              {user ? (
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  arrow
                >
                  <div className="flex items-center gap-2 cursor-pointer group">
                    <Avatar
                      style={{
                        backgroundColor: "#00B207",
                        verticalAlign: "middle",
                      }}
                      size="medium"
                      className="group-hover:opacity-80 transition-opacity"
                    >
                      {getInitials() || <User size={16} />}
                    </Avatar>
                    <span className="text-gray-700 font-medium group-hover:text-brand-primary">
                      {user.firstName}
                    </span>
                  </div>
                </Dropdown>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    to="/login"
                    className="relative text-gray-600 transition-colors duration-300 hover:text-brand-primary group"
                  >
                    Увійти
                    <span className="absolute left-1/2 -bottom-1 w-0 h-[2px] bg-brand-primary transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                  </Link>

                  <div className="h-4 w-[1px] bg-gray-300"></div>

                  <Link
                    to="/register"
                    className="relative text-gray-600 transition-colors duration-300 hover:text-brand-primary group"
                  >
                    Зареєструватися
                    <span className="absolute left-1/2 -bottom-1 w-0 h-[2px] bg-brand-primary transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`bg-white border-b border-gray-200 z-50 transition-all duration-300 ${
          isScrolled ? "fixed top-0 left-0 w-full shadow-md" : "relative"
        }`}
      >
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-4">
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
            <button
              onClick={() => navigate("/wishlist")}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <HeartIcon size={24} strokeWidth={1.5} />
              {totalFavorites > 0 && (
                <span className="absolute top-0 right-0 bg-brand-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white translate-x-1/4 -translate-y-1/4">
                  {totalFavorites}
                </span>
              )}
            </button>
            <div className="h-4 w-[1px] bg-gray-300"></div>

            <button
              onClick={() => dispatch(openCartSidebar())}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Handbag size={24} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-brand-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white translate-x-1/4 -translate-y-1/4">
                  {totalItems}
                </span>
              )}
            </button>
            <div className="flex flex-col leading-tight">
              <p className="text-xs text-gray-500">Кошик:</p>
              <p className="text-base font-semibold text-black font-manrope">
                ₴ {totalPrice.toFixed(2)}
              </p>
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
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <ul className="flex gap-9">
            <li>
              <Link to={"/"}>Головна</Link>
            </li>
            <li>
              <Link to={"/shop"}>Магазин</Link>
            </li>
            <li>
              <Link to={"/pages"}>Сторінки</Link>
            </li>
            <li>
              <Link to={"/blog"}>Блог</Link>
            </li>
            <li>
              <Link to={"/about"}>Про нас</Link>
            </li>
            <li>
              <Link to={"/contact"}>Контакти</Link>
            </li>
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

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Dot,
  Handbag,
  HeartIcon,
  LogOut,
  MapPin,
  Phone,
  Search,
  Settings,
  User,
  Menu as MenuIcon,
  X,
  Loader,
} from "lucide-react";
import { Drawer, Menu, Avatar, Dropdown } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAuthMeQuery } from "../../hooks/useAuthMe";
import type { MenuProps } from "antd/es/menu/menu";
import type { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { openCartSidebar } from "../../store/uiSlice";
import { useLogoutMutation } from "../../services/authApi";
import { logOut, setLoggingOut } from "../../store/authSlice";
import { baseApi } from "../../api/baseApi";
import { clearFavorites } from "../../store/favoriteSlice";
import { clearCart } from "../../store/cartSlice";
import { useGetCategoryTreeQuery } from "../../services/categoryApi";
import { useDebounce } from "../../hooks/useDebounce";
import { useSearchProductsQuery } from "../../services/productApi";
import { IMAGE_BASE_URL, PLACEHOLDER_IMAGE_URL } from "../../api/api";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const token = useSelector((state: RootState) => state.account.accessToken);
  const isLoggingOut = useSelector(
    (state: RootState) => state.account.isLoggingOut,
  );

  const { data: user } = useAuthMeQuery(undefined);

  const [logout] = useLogoutMutation();
  const { data: categories, isLoading } = useGetCategoryTreeQuery();
  const [activeParentId, setActiveParentId] = useState<string | null>(null);

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

  const debouncedSearch = useDebounce(searchTerm, 400);

  const { data: suggestions, isFetching } = useSearchProductsQuery(
    { query: debouncedSearch, count: 5 },
    { skip: debouncedSearch.length < 2 },
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    dispatch(setLoggingOut(true));
    try {
      await logout().unwrap();
      dispatch(clearCart());
      dispatch(clearFavorites());
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      dispatch(logOut());
      dispatch(baseApi.util.resetApiState());
      dispatch(setLoggingOut(false));
      navigate("/login");
      setIsMobileMenuOpen(false);
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
    { type: "divider" },
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

  const mobileMenuItems: MenuProps["items"] = [
    {
      key: "home",
      label: (
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
          Головна
        </Link>
      ),
    },
    {
      key: "shop",
      label: (
        <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>
          Магазин
        </Link>
      ),
    },
    {
      key: "catalog",
      label: "Каталог товарів",
      children: categories?.map((cat) => ({
        key: cat.id,
        label: cat.name,
        children:
          cat.childrens && cat.childrens.length > 0
            ? cat.childrens.map((sub) => ({
                key: sub.id,
                label: (
                  <Link
                    to={`/shop?categoryId=${sub.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {sub.name}
                  </Link>
                ),
              }))
            : undefined,
      })),
    },
    {
      key: "about",
      label: (
        <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
          Про нас
        </Link>
      ),
    },
    {
      key: "for-buyers",
      label: (
        <Link to="/for-buyers" onClick={() => setIsMobileMenuOpen(false)}>
          Для покупця
        </Link>
      ),
    },
    {
      key: "faq",
      label: (
        <Link to="/faq" onClick={() => setIsMobileMenuOpen(false)}>
          FAQ
        </Link>
      ),
    },
    {
      key: "contact",
      label: (
        <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
          Контакти
        </Link>
      ),
    },
  ];

  return (
    <header className="w-full text-sm font-medium">
      <div className="border-b border-gray-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500 font-normal">
            <MapPin size={16} />
            <p>Розташування: Київ, Україна</p>
          </div>

          <div className="flex items-center gap-4 my-1.5">
            {token && user && !isLoggingOut ? (
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                arrow
              >
                <div className="flex items-center gap-2 cursor-pointer group">
                  {user.image ? (
                    <Avatar src={`${IMAGE_BASE_URL}/${user.image}`} />
                  ) : (
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
                  )}
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
                  <span className="absolute left-1/2 -bottom-1 w-0 h-[2px] bg-brand-primary transition-all duration-300 group-hover:w-full group-hover:left-0" />
                </Link>
                <div className="h-4 w-[1px] bg-gray-300" />
                <Link
                  to="/register"
                  className="relative text-gray-600 transition-colors duration-300 hover:text-brand-primary group"
                >
                  Зареєструватися
                  <span className="absolute left-1/2 -bottom-1 w-0 h-[2px] bg-brand-primary transition-all duration-300 group-hover:w-full group-hover:left-0" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`bg-white border-b border-gray-200 z-50 transition-all duration-300 ${
          isScrolled ? "fixed top-0 left-0 w-full shadow-md" : "relative"
        }`}
      >
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-4 gap-4">
          <button
            className="md:hidden p-2 -ml-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <MenuIcon size={28} className="text-gray-700" />
          </button>

          <Link to={"/"} className="flex-shrink-0">
            <img
              src="/header-logo.png"
              alt="logo"
              className="h-12 md:h-16 w-auto"
            />
          </Link>

          <div
            className="hidden md:flex flex-1 mx-12 relative"
            ref={dropdownRef}
          >
            <div className="relative w-full group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder="Пошук електротоварів..."
                className="w-full bg-gray-100 rounded-full py-2.5 pl-12 pr-10 
                   focus:bg-white focus:ring-1 focus:ring-brand-accent/50 
                   border border-transparent focus:border-brand-primary/30
                   outline-none transition-all shadow-sm"
              />
              <Search
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                  isFocused ? "text-brand-primary" : "text-gray-400"
                }`}
                size={18}
              />
              {isFetching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader className="text-brand-primary" />
                </div>
              )}
            </div>

            {isFocused && searchTerm.length >= 2 && suggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                {suggestions.length > 0 ? (
                  <div className="py-2">
                    {suggestions.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          navigate(`/product/${product.id}`);
                          setIsFocused(false);
                          setSearchTerm("");
                        }}
                        className="px-5 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-4 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                          <img
                            src={
                              product.images?.[0]?.image ||
                              PLACEHOLDER_IMAGE_URL
                            }
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="text-sm font-semibold text-gray-800 line-clamp-1">
                            {product.name}
                          </div>
                          <div className="text-xs text-brand-primary font-medium font-manrope">
                            {product.price} грн
                          </div>
                        </div>
                        <Search size={14} className="text-gray-300" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-400 text-sm italic">
                    Нічого не знайдено за запитом "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <button
              onClick={() => navigate("/wishlist")}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <HeartIcon size={24} strokeWidth={1.5} />
              {totalFavorites > 0 && (
                <span className="font-manrope absolute top-0 right-0 bg-brand-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white translate-x-1/4 -translate-y-1/4">
                  {totalFavorites}
                </span>
              )}
            </button>

            <div className="h-4 w-[1px] bg-gray-300 hidden sm:block" />

            <button
              onClick={() => dispatch(openCartSidebar())}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Handbag size={24} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="font-manrope absolute top-0 right-0 bg-brand-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white translate-x-1/4 -translate-y-1/4">
                  {totalItems}
                </span>
              )}
            </button>

            <div className="hidden lg:flex flex-col leading-tight">
              <p className="text-xs text-gray-500">Кошик:</p>
              <p className="text-base font-semibold text-black font-manrope">
                ₴ {totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <nav
        className={`hidden md:block border-b text-white px-6 py-3 transition-all duration-300 bg-brand-primary ${
          isScrolled
            ? "-translate-y-full opacity-0 absolute w-full"
            : "relative"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-0.5">
          <ul className="flex gap-9">
            <li>
              <Link
                to={"/"}
                className="hover:text-gray-200 transition-colors font-semibold"
              >
                Головна
              </Link>
            </li>
            <li>
              <Link
                to={"/shop"}
                className="hover:text-gray-200 transition-colors font-semibold"
              >
                Магазин
              </Link>
            </li>
            <li>
              <Dropdown
                placement="bottomLeft"
                trigger={["hover"]}
                onOpenChange={(open) => {
                  if (open && categories && categories.length > 0) {
                    setActiveParentId(categories[0].id);
                  }
                }}
                dropdownRender={() => (
                  <div className="bg-white shadow-2xl border rounded-lg flex min-w-[900px] h-[500px] mt-2 overflow-hidden font-montserrat">
                    {isLoading ? (
                      <div className="p-10 text-gray-500 w-full text-center">
                        Завантаження каталогу...
                      </div>
                    ) : (
                      <>
                        <div className="w-1/3 border-r bg-gray-50/50 py-2 overflow-y-auto">
                          {categories?.map((parent) => (
                            <div
                              key={parent.id}
                              onMouseEnter={() => setActiveParentId(parent.id)}
                              className={`px-6 py-3 cursor-pointer flex justify-between items-center transition-colors ${
                                activeParentId === parent.id
                                  ? "bg-white text-brand-primary font-bold shadow-sm"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              <span className="text-sm">{parent.name}</span>
                              <ChevronDown
                                size={14}
                                className="-rotate-90 opacity-50"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="w-2/3 p-8 bg-white overflow-y-auto">
                          {activeParentId && (
                            <div>
                              <h3 className="text-xl font-semibold text-black mb-6 border-b pb-2">
                                <Dot
                                  size={45}
                                  className="text-brand-primary inline-block -ml-5"
                                />
                                {
                                  categories?.find(
                                    (c) => c.id === activeParentId,
                                  )?.name
                                }
                              </h3>
                              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                {categories
                                  ?.find((c) => c.id === activeParentId)
                                  ?.childrens?.map((child) => (
                                    <Link
                                      key={child.id}
                                      to={`/shop?categoryId=${child.id}`}
                                      className="font-semibold text-gray-600 hover:text-brand-primary transition-colors"
                                    >
                                      {child.name}
                                    </Link>
                                  ))}
                                {(!categories?.find(
                                  (c) => c.id === activeParentId,
                                )?.childrens ||
                                  categories?.find(
                                    (c) => c.id === activeParentId,
                                  )?.childrens?.length === 0) && (
                                  <div className="text-gray-400 italic">
                                    У цій категорії поки немає підкатегорій :(
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              >
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200 transition-colors">
                  <span className="font-semibold">Каталог товарів</span>
                  <ChevronDown size={14} />
                </div>
              </Dropdown>
            </li>
            <li>
              <Link
                to={"/about"}
                className="hover:text-gray-200 transition-colors font-semibold"
              >
                Про нас
              </Link>
            </li>
            <li>
              <Link
                to={"/for-buyers"}
                className="hover:text-gray-200 transition-colors font-semibold"
              >
                Для покупця
              </Link>
            </li>
            <li>
              <Link
                to={"/faq"}
                className="hover:text-gray-200 transition-colors font-semibold"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                to={"/contact"}
                className="hover:text-gray-200 transition-colors font-semibold"
              >
                Контакти
              </Link>
            </li>
          </ul>
          <div className="flex items-center gap-3">
            <Phone size={20} />
            <span className="font-manrope">(219) 555-0114</span>
          </div>
        </div>
      </nav>

      <Drawer
        placement="left"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        closable={false}
        width={300}
        styles={{ body: { padding: 0 } }}
      >
        <div className="flex flex-col h-full font-montserrat">
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <img src="/header-logo.png" alt="logo" className="h-10 w-auto" />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          <div className="p-4 border-b">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Пошук..."
                className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 outline-none"
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Menu
              mode="inline"
              className="border-none font-semibold text-gray-700 font-montserrat"
              items={mobileMenuItems}
            />
          </div>

          <div className="p-4 bg-gray-50 border-t space-y-4">
            <div className="flex items-center gap-3 text-brand-primary">
              <Phone size={20} />
              <span className="font-bold font-manrope">(219) 555-0114</span>
            </div>

            {/* Мобільна авторизація: реагує на токен, юзера та логаут */}
            {!token || !user || isLoggingOut ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2 bg-gray-200 rounded-full font-semibold text-gray-700 hover:text-brand-accent"
                >
                  Увійти
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2 bg-brand-primary text-white rounded-full font-semibold hover:text-white hover:bg-brand-accent transition-colors"
                >
                  Реєстрація
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-2 bg-white rounded-lg border">
                <Avatar style={{ backgroundColor: "#00B207" }}>
                  {getInitials()}
                </Avatar>
                <span className="font-bold">{user.firstName}</span>
              </div>
            )}
          </div>
        </div>
      </Drawer>

      {isScrolled && <div className="h-[80px]" />}
    </header>
  );
}

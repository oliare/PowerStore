import {
  LayoutDashboard,
  History,
  Heart,
  ShoppingCart,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { JSX } from "react";

interface NavItemProps {
  icon: JSX.Element;
  label: string;
  active?: boolean;
  href: string; // Робимо обов'язковим для Link
}

const NavItem = ({ icon, label, active = false, href }: NavItemProps) => (
  <Link
    to={href}
    className={`flex items-center gap-3 px-6 py-4 transition-all border-l-4 ${
      active
        ? "bg-gray-50 border-brand-primary text-gray-900 font-semibold"
        : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-200"
    }`}
  >
    <span className={active ? "text-brand-primary" : "text-gray-400"}>
      {icon}
    </span>
    {label}
  </Link>
);

export const ProfileSidebar = ({
  activeKey = "dashboard",
}: {
  activeKey?: "dashboard" | "history" | "wishlist" | "cart";
}) => {
  return (
    <aside className="w-full lg:w-1/4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit">
      <h2 className="p-6 text-lg font-semibold border-b border-gray-50 font-montserrat text-gray-900">
        Навігація
      </h2>
      <nav className="flex flex-col text-sm font-montserrat">
        <NavItem
          icon={<LayoutDashboard size={20} />}
          label="Панель керування"
          href="/profile"
          active={activeKey === "dashboard"}
        />
        <NavItem
          icon={<History size={20} />}
          label="Історія замовлень"
          href="/history"
          active={activeKey === "history"}
        />
        <NavItem
          icon={<Heart size={20} />}
          label="Улюблені"
          href="/wishlist"
          active={activeKey === "wishlist"}
        />
        <NavItem
          icon={<ShoppingCart size={20} />}
          label="Кошик"
          href="/cart"
          active={activeKey === "cart"}
        />
        
        <button className="flex items-center gap-3 px-6 py-4 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all border-l-4 border-transparent mt-2">
          <LogOut size={20} className="text-gray-400" />
          <span>Вийти</span>
        </button>
      </nav>
    </aside>
  );
};
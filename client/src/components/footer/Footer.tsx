import { Layout, Divider } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;

const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <li>
    <a
      href={href}
      className="relative flex items-center group text-gray-400 hover:text-white transition-all duration-300 hover:pl-3"
    >
      <span className="absolute left-0 w-[3px] h-0 bg-brand-primary transition-all duration-300 group-hover:h-4 opacity-0 group-hover:opacity-100 rounded-full" />
      {children}
    </a>
  </li>
);

const CustomFooter = () => {
  return (
    <Footer className="bg-[#1a1a1a] text-gray-400 py-12 px-6 md:px-24 relative overflow-hidden">
      {/* Декор фону */}
      <div className="absolute top-10 left-[-20px] opacity-[0.03] rotate-12 pointer-events-none">
        <ThunderboltOutlined style={{ fontSize: "180px", color: "#fff" }} />
      </div>
      <div className="absolute top-1/2 right-[-50px] opacity-[0.02] rotate-90 pointer-events-none hidden md:block">
        <ThunderboltOutlined style={{ fontSize: "200px", color: "#fff" }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-20">
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <img
                src="public/header-logo.png"
                alt="logo"
                className="h-16 w-auto"
              />
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Ми пропонуємо найкращі рішення для вашого дому та бізнесу. Якість,
              надійність та підтримка 24/7.
            </p>
            <div className="flex gap-4 text-xl mt-2">
              <FacebookOutlined className="hover:text-brand-primary cursor-pointer transition-colors" />
              <TwitterOutlined className="hover:text-brand-primary cursor-pointer transition-colors" />
              <InstagramOutlined className="hover:text-brand-primary cursor-pointer transition-colors" />
              <LinkedinOutlined className="hover:text-brand-primary cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-medium mb-6">Мій акаунт</h3>
            <ul className="space-y-4 text-sm">
              <FooterLink href="#">Особистий кабінет</FooterLink>
              <FooterLink href="#">Історія замовлень</FooterLink>
              <FooterLink href="#">Кошик</FooterLink>
              <FooterLink href="#">Список бажаного</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-medium mb-6">Компанія</h3>
            <ul className="space-y-4 text-sm">
              <FooterLink href="#">Про нас</FooterLink>
              <FooterLink href="#">Наші послуги</FooterLink>
              <FooterLink href="#">Контакти</FooterLink>
              <FooterLink href="#">Блог</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-medium mb-6">Підтримка</h3>
            <ul className="space-y-4 text-sm">
              <FooterLink href="#">Допомога</FooterLink>
              <FooterLink href="#">Умови використання</FooterLink>
              <FooterLink href="#">Політика конфіденційності</FooterLink>
              <FooterLink href="#">Повернення</FooterLink>
            </ul>
          </div>
        </div>

        <Divider className="border-gray-800 my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center text-xs gap-4">
          <p>© {new Date().getFullYear()} PowerStore. Всі права захищені.</p>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-white">
              Privacy Policy
            </span>
            <span className="cursor-pointer hover:text-white">
              Terms of Service
            </span>
            <span className="cursor-pointer hover:text-white">
              Cookies Settings
            </span>
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default CustomFooter;

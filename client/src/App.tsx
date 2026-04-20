import { Routes, Route } from "react-router-dom";
import "./App.css";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage/HomePage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegistrationPage } from "./pages/auth/RegistrationPage";
import { UserProfilePage } from "./pages/UserProfilePage";
import { OrderHistoryPage } from "./pages/OrderHistoryPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AuthModal } from "./common/AuthModal";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/store";
import { closeAuthModal, closeCartSidebar } from "./store/uiSlice";
import { CartSidebar } from "./common/CartSidebar";

function App() {
  const dispatch = useDispatch();
  const { isAuthModalOpen, authModalTitle, isCartSidebarOpen } = useSelector(
    (state: RootState) => state.ui,
  );

  return (
    <>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegistrationPage />} />
          <Route path="product/:id" element={<ProductDetailsPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="history" element={<OrderHistoryPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => dispatch(closeAuthModal())}
        title={authModalTitle}
      />
      <CartSidebar
        isOpen={isCartSidebarOpen}
        onClose={() => dispatch(closeCartSidebar())}
      />
    </>
  );
}

export default App;

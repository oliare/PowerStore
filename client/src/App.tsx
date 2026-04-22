import { Routes, Route } from "react-router-dom";
import "./App.css";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage/HomePage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegistrationPage } from "./pages/auth/RegistrationPage";
import { UserProfilePage } from "./pages/profile/UserProfilePage";
import { ProfileHistoryPage } from "./pages/profile/ProfileHistoryPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AuthModal } from "./common/AuthModal";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store/store";
import { closeAuthModal } from "./store/uiSlice";
import { CartSidebar } from "./common/CartSidebar";
import { WishlistPage } from "./pages/WishlistPage";
import { CartPage } from "./pages/CartPage";
import { ProfileLayout } from "./components/layout/ProfileLayout";
import { ProfileWishlist } from "./pages/profile/ProfileWishlist";
import { ProfileCart } from "./pages/profile/ProfileCart";

function App() {
  const dispatch = useDispatch();
  const { isAuthModalOpen, authModalTitle } = useSelector(
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
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="cart" element={<CartPage />} />

            <Route path="profile" element={<ProfileLayout />}>
              <Route index element={<UserProfilePage />} />
              <Route path="wishlist" element={<ProfileWishlist />} />
              <Route path="history" element={<ProfileHistoryPage />} />
              <Route path="cart" element={<ProfileCart />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => dispatch(closeAuthModal())}
        title={authModalTitle}
      />
      <CartSidebar />
    </>
  );
}

export default App;

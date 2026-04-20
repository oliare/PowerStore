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

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegistrationPage />} />
        <Route path="product/:id" element={<ProductDetailsPage />} />
        <Route path="profile" element={<UserProfilePage />} />
        <Route path="history" element={<OrderHistoryPage />} />
        <Route path="404" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;

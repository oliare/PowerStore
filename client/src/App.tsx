import { Routes, Route } from "react-router-dom";
import "./App.css";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage/HomePage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegistrationPage } from "./pages/auth/RegistrationPage";
import { UserProfilePage } from "./pages/UserProfilePage";
import { OrderHistoryPage } from "./pages/OrderHistoryPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegistrationPage />} />
        <Route path="profile" element={<UserProfilePage />} />
        <Route path="history" element={<OrderHistoryPage />} />
      </Route>
    </Routes>
  );
}

export default App;

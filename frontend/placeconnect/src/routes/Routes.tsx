import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../presentation/pages/LoginPage";
import RegisterPage from "../presentation/pages/RegisterPage";
import VerificationPage from "../presentation/pages/VerificationPage";
import HomePage from "../presentation/pages/HomePage";
import ProfilePage from "../presentation/pages/ProfilePage";
import PrivateRoute from "./PrivateRoute";

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify/:token" element={<VerificationPage />} />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);
export default AppRoutes;

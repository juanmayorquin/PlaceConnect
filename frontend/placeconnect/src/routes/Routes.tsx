import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../presentation/pages/LoginPage";
import RegisterPage from "../presentation/pages/RegisterPage";
import VerificationPage from "../presentation/pages/VerificationPage";
import HomePage from "../presentation/pages/HomePage";
import ProfilePage from "../presentation/pages/ProfilePage";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import NewPropertyPage from "../presentation/pages/NewPropertyPage";
import MyPropertiesPage from "../presentation/pages/MyPropertiesPage";
import EditPropertyPage from "../presentation/pages/EditPropertyPage";
import AdminModerationPage from "../presentation/pages/AdminModerationPage";

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
      {/* Rutas protegidas para avisos */}
      <Route path="/properties/new" element={<PrivateRoute><NewPropertyPage /></PrivateRoute>} />
      <Route path="/properties/me" element={<PrivateRoute><MyPropertiesPage /></PrivateRoute>} />
      <Route path="/properties/:id/edit" element={<PrivateRoute><EditPropertyPage /></PrivateRoute>} />
      {/* Ruta solo para administradores */}
      <Route path="/admin/moderation" element={<AdminRoute><AdminModerationPage /></AdminRoute>} />
    </Routes>
  </BrowserRouter>
);
export default AppRoutes;

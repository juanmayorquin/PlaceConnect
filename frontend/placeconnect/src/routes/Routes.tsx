import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminModerationPage from "../presentation/pages/AdminModerationPage";
import EditPropertyPage from "../presentation/pages/EditPropertyPage";
import HomePage from "../presentation/pages/HomePage";
import MyPropertiesPage from "../presentation/pages/MyPropertiesPage";
import NewPropertyPage from "../presentation/pages/NewPropertyPage";
import ProfilePage from "../presentation/pages/ProfilePage";
import PropertyDetailPage from "../presentation/pages/PropertyDetailPage";
import ReportsAdminPage from "../presentation/pages/ReportsAdminPage";
import SearchPage from "../presentation/pages/SearchPage";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "../presentation/pages/LoginPage";
import RegisterPage from "../presentation/pages/RegisterPage";
import NotificationsPage from "../presentation/pages/NotificationsPage";
import ConversationPage from "../presentation/pages/ConversationPage";
import ConversationListPage from "../presentation/pages/ConversationListPage";
import VerificationPage from "../presentation/pages/VerificationPage";

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/properties" element={<SearchPage />} />
      <Route path="/properties/:id" element={<PropertyDetailPage />} />

      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Verification & Password reset */}
      <Route path="/verify/:token" element={<VerificationPage />} />
      {/* <Route path="/request-reset" element={<RequestResetPage />} /> */}
      {/* <Route path="/reset/:token" element={<ResetPasswordPage />} /> */}

      {/* Protected routes */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/properties/new"
        element={
          <PrivateRoute>
            <NewPropertyPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/properties/me"
        element={
          <PrivateRoute>
            <MyPropertiesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/properties/:id/edit"
        element={
          <PrivateRoute>
            <EditPropertyPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/conversations"
        element={
          <PrivateRoute>
            <ConversationListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/conversations/:otherId/:propertyId"
        element={
          <PrivateRoute>
            <ConversationPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <PrivateRoute>
            <NotificationsPage />
          </PrivateRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/moderation"
        element={
          <AdminRoute>
            <AdminModerationPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <AdminRoute>
            <ReportsAdminPage />
          </AdminRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;

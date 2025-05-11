import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../presentation/pages/LoginPage';
import RegisterPage from '../presentation/pages/RegisterPage';

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Otras rutas */}
    </Routes>
  </BrowserRouter>
);
export default AppRoutes;
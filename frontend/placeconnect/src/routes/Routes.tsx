import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../presentation/pages/LoginPage';

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* Otras rutas */}
    </Routes>
  </BrowserRouter>
);
export default AppRoutes;
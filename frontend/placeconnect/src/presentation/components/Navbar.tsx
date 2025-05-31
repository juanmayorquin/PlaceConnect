import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <nav className="bg-slate-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-teal-400 transition-colors">
          PlaceConnect
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link to="/profile" className="hover:text-teal-400 transition-colors">
                Mi Perfil
              </Link>
              <Button onClick={logout} variant="secondary" size="sm">
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => nav("/login")} variant='secondary' size='sm'>
                Iniciar Sesión
              </Button>
              <Button onClick={() => nav("/register")} variant='primary' size='sm'>
                Registrarse
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

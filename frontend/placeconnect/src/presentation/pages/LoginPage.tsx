/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { login as loginAPI } from "../../infrastructure/authService";
import { Link, useNavigate } from "react-router-dom"; // Restaurar useNavigate
import { ArrowLeft, Lock, Mail } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useAuth } from "../../hooks/AuthContext";

interface LoginForm {
  email: string;
  password: string;
}

const initialForm: LoginForm = {
  email: "",
  password: "",
};

const LoginPage: React.FC = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Quitar setShowRegisterModal y setShowLoginModal
  const nav = useNavigate(); // Restaurar nav

  const {
    register: registerInput,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: initialForm,
    mode: "onTouched",
  });

  const onSubmit = async (loginData: LoginForm) => {
    setError("");
    setLoading(true);
    try {
      const { data } = await loginAPI({ email: loginData.email, password: loginData.password });
      login(data.token, data.user);
      nav("/"); // Restaurar navegación a la página de inicio
    } catch (err: any) {
      setError(err.response?.data?.msg || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Restaurar clases de layout de página completa
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-soft">
        <div className="text-center flex flex-col gap-4">
          <h2 className="text-3xl font-bold text-slate-800">Iniciar sesión</h2>
          <p className="text-slate-600">Accede a tu cuenta para continuar</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              id="email"
              {...registerInput("email", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Correo inválido",
                },
              })}
              type="email"
              autoComplete="email"
              label="Correo electrónico"
              placeholder="you@example.com"
              icon={<Mail className="h-5 w-5 text-slate-400" />}
            />
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            )}
            <Input
              id="password"
              {...registerInput("password")}
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              icon={<Lock className="h-5 w-5 text-slate-400" />}
            />
            {errors.password && (
              <span className="text-red-500 text-xs">
                {errors.password.message}
              </span>
            )}
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>
          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
            <p className="text-sm text-center text-slate-600">
              ¿No tienes cuenta?{" "}
              <Link // Cambiar button por Link
                to="/register" // Enlazar a la página de registro
                className="font-medium text-teal-600 hover:text-teal-500"
              >
                Regístrate
              </Link>
            </p>
          </div>
          <Link
            to="/"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 mt-4"
            // Quitar onClick para cerrar modal
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Volver al inicio
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

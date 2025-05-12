/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { login as loginAPI } from "../../infrastructure/authService";
import { Link, useNavigate } from "react-router-dom";
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
  const {login} = useAuth();
  const nav = useNavigate();

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
      const {data} = await loginAPI({ email: loginData.email, password: loginData.password });
      login(data.token, data.user);
      nav("/");
    } catch (err: any) {
      setError(err.response?.data?.msg || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
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
            <div className="flex justify-center items-center space-x-2 text-sm mt-2">
              <span className="text-slate-600">¿No tienes cuenta?</span>
              <Link
                to="/register"
                className="text-teal-600 hover:underline font-medium"
              >
                Regístrate
              </Link>
            </div>
            <div className="flex justify-center items-center space-x-2 text-sm mt-2">
              <Link
                to="/"
                className="flex items-center text-slate-600 hover:text-primary-500 transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" />
                Volver al inicio
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

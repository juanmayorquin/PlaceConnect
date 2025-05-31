/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { register } from "../../infrastructure/authService";
import { Link, useNavigate } from "react-router-dom"; // Restaurar useNavigate
import { ArrowLeft, Lock, Mail, MousePointerClick, User } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";

const steps = [
  { name: "Datos personales", icon: User },
  { name: "Selecciona tu rol", icon: MousePointerClick },
  { name: "Crea tu contraseña", icon: Lock },
];

type UserRole = "Propietario" | "Interesado";

interface UserForm {
  name: string;
  email: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
}

const initialForm: UserForm = {
  name: "",
  email: "",
  role: "Interesado",
  password: "",
  confirmPassword: "",
};

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate(); // Restaurar nav

  const {
    register: registerInput,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<UserForm>({
    defaultValues: initialForm,
    mode: "onTouched"
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const onSubmit = async (data: UserForm) => {
    if (data.password !== data.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    try {
      await register({
        name: data.name,
        email: data.email,
        role: data.role,
        password: data.password,
      });
      setLoading(false);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.msg || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Restaurar clases de layout de página completa
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-soft">
        {success ? (
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-2xl font-bold text-teal-600">¡Cuenta registrada exitosamente!</h2>
            <p className="text-slate-700">Revisa tu bandeja de entrada para confirmar tu cuenta.</p>
            <Button onClick={() => nav("/")}>Volver al inicio</Button> // Navegar al inicio
          </div>
        ) : (
          <>
            <div className="text-center flex flex-col gap-4">
              <h2 className="text-3xl font-bold text-slate-800">Crear cuenta</h2>
              <p>Paso {step+1} de {steps.length}: {steps[step].name}</p>
              <div className="flex items-center justify-between relative">
                <div
                  className="absolute h-2 bg-teal-400 transition-all duration-500"
                  style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                ></div>
                {steps.map((s, index) => (
                  <div
                    key={index}
                    className={`rounded-full p-2 z-10 ${
                      index <= step ? "text-white bg-teal-400" : "text-slate-400"
                    }`}
                  >
                    <s.icon className="h-5 w-5" />
                  </div>
                ))}
              </div>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {step === 0 && (
                <div className="space-y-4">
                  <Input
                    id="name"
                    {...registerInput("name", {
                      required: "El nombre es obligatorio",
                    })}
                    label="Nombre completo"
                    placeholder="Tu nombre"
                    icon={<User className="h-5 w-5 text-slate-400" />}
                  />
                  {errors.name && (
                    <span className="text-red-500 text-xs">
                      {errors.name.message}
                    </span>
                  )}
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
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-slate-700">¿Cómo usarás PlaceConnect?</p>
                  <div className="flex gap-4">
                    {(['Interesado', 'Propietario'] as UserRole[]).map((roleOption) => (
                      <Button
                        key={roleOption}
                        type="button"
                        variant={watch("role") === roleOption ? "primary" : "outline"}
                        onClick={() => setValue("role", roleOption)}
                        fullWidth
                      >
                        {roleOption}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <Input
                    id="password"
                    {...registerInput("password", {
                      required: "La contraseña es obligatoria",
                      minLength: {
                        value: 6,
                        message: "Mínimo 6 caracteres",
                      },
                    })}
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
                  <Input
                    id="confirmPassword"
                    {...registerInput("confirmPassword", {
                      required: "Confirma tu contraseña",
                      validate: (value) =>
                        value === watch("password") || "Las contraseñas no coinciden",
                    })}
                    type="password"
                    label="Confirmar contraseña"
                    placeholder="••••••••"
                    icon={<Lock className="h-5 w-5 text-slate-400" />}
                  />
                  {errors.confirmPassword && (
                    <span className="text-red-500 text-xs">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
              )}

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <div className="flex flex-col gap-2 pt-4">
                <div className="flex justify-between">
                  {step > 0 && (
                    <Button type="button" onClick={prevStep} variant="secondary">
                      Anterior
                    </Button>
                  )}
                  {step < steps.length - 1 && (
                    <Button type="button" onClick={nextStep} variant="primary" className={step === 0 ? "ml-auto" : ""}>
                      Siguiente
                    </Button>
                  )}
                  {step === steps.length - 1 && (
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                      className="ml-auto"
                    >
                      {loading ? "Registrando..." : "Finalizar registro"}
                    </Button>
                  )}
                </div>
                <p className="text-sm text-center text-slate-600 mt-4">
                  ¿Ya tienes cuenta?{" "}
                  <Link // Cambiar button por Link
                    to="/login" // Enlazar a la página de login
                    className="font-medium text-teal-600 hover:text-teal-500"
                  >
                    Inicia sesión
                  </Link>
                </p>
                <Link
                  to="/"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 mt-2"
                  // Quitar onClick para cerrar modal
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Volver al inicio
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;

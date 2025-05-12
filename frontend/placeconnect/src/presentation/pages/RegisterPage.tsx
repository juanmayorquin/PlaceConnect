/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { register } from "../../infrastructure/authService";
import { Link, useNavigate } from "react-router-dom";
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
  const nav = useNavigate();

  const {
    register: registerInput,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-soft">
        {success ? (
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-2xl font-bold text-teal-600">¡Cuenta registrada exitosamente!</h2>
            <p className="text-slate-700">Revisa tu bandeja de entrada para confirmar tu cuenta.</p>
            <Button onClick={() => nav("/")}>Volver al inicio</Button>
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
                    <s.icon size={24} />
                  </div>
                ))}
              </div>
            </div>
            <form
              className="mt-8 space-y-6"
              onSubmit={
                step === steps.length - 1
                  ? handleSubmit(onSubmit)
                  : (e) => {
                      e.preventDefault();
                      nextStep();
                    }
              }
            >
              <div className="space-y-4">
                {step === 0 && (
                  <>
                    <Input
                      id="name"
                      {...registerInput("name", { required: "El nombre es obligatorio" })}
                      type="text"
                      label="Nombre completo"
                      placeholder="John Doe"
                      icon={<User className="h-5 w-5 text-slate-400" />}
                    />
                    {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                    <Input
                      id="email"
                      {...registerInput("email", {
                        required: "El correo es obligatorio",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Correo inválido"
                        }
                      })}
                      type="email"
                      autoComplete="email"
                      label="Correo electrónico"
                      placeholder="you@example.com"
                      icon={<Mail className="h-5 w-5 text-slate-400" />}
                    />
                    {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                  </>
                )}
                {step === 1 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Selecciona tu rol
                    </label>
                    <div className="flex gap-4">
                      {[
                        {
                          value: "Interesado",
                          title: "Interesado",
                          desc: "Busca y encuentra propiedades de tu interés."
                        },
                        {
                          value: "Propietario",
                          title: "Propietario",
                          desc: "Publica y gestiona tus propiedades fácilmente."
                        }
                      ].map((role) => (
                        <label
                          key={role.value}
                          htmlFor={role.value}
                          className={`cursor-pointer flex-1 border rounded-xl p-4 transition-all shadow-sm flex flex-col items-start gap-1
                            ${watch("role") === role.value ? "border-teal-500 bg-teal-50" : "border-slate-200 bg-white"}
                          `}
                        >
                          <input
                            type="radio"
                            id={role.value}
                            value={role.value}
                            {...registerInput("role", { required: true })}
                            checked={watch("role") === role.value}
                            onChange={() => setValue("role", role.value as UserRole)}
                            className="sr-only"
                          />
                          <span className="font-semibold text-slate-800">{role.title}</span>
                          <span className="text-xs text-slate-500">{role.desc}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <>
                    <Input
                      id="password"
                      {...registerInput("password", {
                        required: "La contraseña es obligatoria",
                        minLength: { value: 8, message: "Mínimo 8 caracteres" },
                        validate: {
                          hasUpper: v => /[A-Z]/.test(v) || "Debe tener al menos una mayúscula",
                          hasNumber: v => /[0-9]/.test(v) || "Debe tener al menos un número",
                          hasSpecial: v => /[^A-Za-z0-9]/.test(v) || "Debe tener un caracter especial"
                        }
                      })}
                      type="password"
                      label="Contraseña"
                      placeholder="••••••••"
                      icon={<Lock className="h-5 w-5 text-slate-400" />}
                    />
                    {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
                    <Input
                      id="confirmPassword"
                      {...registerInput("confirmPassword", {
                        required: "Confirma tu contraseña",
                        validate: v => v === getValues("password") || "Las contraseñas no coinciden"
                      })}
                      type="password"
                      label="Confirmar contraseña"
                      placeholder="••••••••"
                      icon={<Lock className="h-5 w-5 text-slate-400" />}
                    />
                    {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>}
                  </>
                )}
                {error && <div className="text-red-500 text-sm">{error}</div>}
              </div>
              <div className="flex justify-between">
                {step > 0 && (
                  <Button type="button" variant="secondary" onClick={prevStep} disabled={loading}>
                    Atrás
                  </Button>
                )}
                {step < steps.length - 1 && (
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? "Cargando..." : "Siguiente"}
                  </Button>
                )}
                {step === steps.length - 1 && (
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? "Creando cuenta..." : "Crear cuenta"}
                  </Button>
                )}
              </div>
              <div className="flex justify-center items-center space-x-2 text-sm mt-4">
                <Link
                  to="/login"
                  className="flex items-center text-slate-600 hover:text-primary-500 transition-colors"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Volver a inicio de sesión
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

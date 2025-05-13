/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getProfile, updateProfile, deleteProfile } from "../../infrastructure/userService";
import { useAuth } from "../../hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { User, Mail, Lock, Trash2 } from "lucide-react";

const ProfilePage: React.FC = () => {
  const { logout } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getProfile()
      .then((res) => {
        const { name, email } = res.data;
        setForm({ name, email, password: "" });
      })
      .catch(() => setError("No se pudo cargar el perfil"));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      await updateProfile(form);
      setMessage("Perfil actualizado correctamente");
      setForm((prev) => ({ ...prev, password: "" }));
    } catch (err: any) {
      setError(err.response?.data?.msg || "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de eliminar tu cuenta?")) {
      setDeleting(true);
      try {
        await deleteProfile();
        logout();
        navigate("/login");
      } catch {
        setError("No se pudo eliminar la cuenta");
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-soft">
        <div className="text-center flex flex-col gap-4">
          <h2 className="text-3xl font-bold text-slate-800">Mi Perfil</h2>
          <p className="text-slate-600">Edita tus datos personales</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleUpdate}>
          <div className="space-y-4">
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              label="Nombre completo"
              placeholder="John Doe"
              icon={<User className="h-5 w-5 text-slate-400" />}
              required
            />
            <Input
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              label="Correo electrónico"
              placeholder="you@example.com"
              icon={<Mail className="h-5 w-5 text-slate-400" />}
              required
            />
            <Input
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              label="Nueva contraseña (opcional)"
              placeholder="••••••••"
              icon={<Lock className="h-5 w-5 text-slate-400" />}
            />
            {message && <div className="text-teal-600 text-sm">{message}</div>}
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>
          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
        <Button
          onClick={handleDelete}
          variant="contrast"
          className="mt-2 border-red-500 text-red-600 hover:bg-red-50"
          fullWidth
          disabled={deleting}
          icon={<Trash2 className="h-5 w-5" />}
        >
          {deleting ? "Eliminando..." : "Eliminar cuenta"}
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;

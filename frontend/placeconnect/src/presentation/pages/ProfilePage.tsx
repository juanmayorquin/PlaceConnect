/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mail, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { uploadFile } from "../../infrastructure/firebaseStorageService";
import { deleteProfile, getProfile, updateProfile } from "../../infrastructure/userService";
import Button from "../ui/Button";
import Input from "../ui/Input";

const ProfilePage: React.FC = () => {
  const { logout, user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoadingProfile(true);
    getProfile()
      .then((res) => {
        console.log(res.data);
        const { name, email, profileImageUrl } = res.data;
        setForm({ name, email });
        setAvatarUrl(profileImageUrl || null);
      })
      .catch(() => setError("No se pudo cargar el perfil"))
      .finally(() => setLoadingProfile(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !user) return;
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const file = e.target.files[0];
      const path = `avatars/${user.id}/${Date.now()}_${file.name}`;
      const url = await uploadFile(file, path);
      setAvatarUrl(url);
      setMessage("Avatar subido correctamente");
    } catch (err: any) {
      setError(err.message || "Error al subir avatar");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await updateProfile({
        ...form,
        profileImageUrl: avatarUrl ?? undefined,
      });
      setMessage("Perfil actualizado correctamente");
    } catch (err: any) {
      setError(err.response?.data?.msg || "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de eliminar tu cuenta?")) return;
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
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-soft">
        <div className="text-center flex flex-col gap-4">
          <h2 className="text-3xl font-bold text-slate-800">Mi Perfil</h2>
          <p className="text-slate-600">Edita tus datos personales</p>
        </div>
        {loadingProfile ? (
          <div className="text-center text-slate-500 py-8">Cargando...</div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleUpdate}>
            <div className="flex flex-col items-center gap-4 mb-4">
              <img
                src={avatarUrl || "/default-avatar.webp"}
                alt="Avatar"
                className="h-24 w-24 rounded-full object-cover border-2 border-slate-200 shadow"
              />
              <label className="block w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={loading || loadingProfile}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer mt-2"
                />
              </label>
            </div>
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
                disabled={loadingProfile}
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
                disabled={loadingProfile}
              />
              {message && <div className="text-teal-600 text-sm text-center">{message}</div>}
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            </div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading || loadingProfile}
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </form>
        )}
        <Button
          onClick={handleDelete}
          variant="contrast"
          className="mt-2 border-red-500 text-red-600 hover:bg-red-50"
          fullWidth
          disabled={deleting || loadingProfile}
          icon={<Trash2 className="h-5 w-5" />}
        >
          {deleting ? "Eliminando..." : "Eliminar cuenta"}
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
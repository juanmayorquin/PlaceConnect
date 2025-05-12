/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { verify } from "../../infrastructure/authService";
import Button from "../ui/Button";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

const VerificationPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    try {
      await verify(token!);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.msg || "Error al verificar la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-soft text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Verificar cuenta</h2>
        {!success && !error && (
          <>
            <p className="text-slate-600 mb-6">Haz clic en el botón para verificar tu cuenta.</p>
            <Button
              onClick={handleVerify}
              variant="primary"
              disabled={loading}
              fullWidth
              icon={loading ? <Loader2 className="animate-spin" /> : <CheckCircle />}
            >
              {loading ? "Verificando..." : "Verificar cuenta"}
            </Button>
          </>
        )}
        {success && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="text-teal-500" size={48} />
            <p className="text-teal-700 font-semibold">¡Cuenta verificada correctamente!</p>
            <Button onClick={() => nav("/login")} variant="primary" fullWidth>
              Ir a iniciar sesión
            </Button>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="text-red-500" size={48} />
            <p className="text-red-700 font-semibold">{error}</p>
            <Button onClick={() => nav("/")} variant="secondary" fullWidth>
              Volver al inicio
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;

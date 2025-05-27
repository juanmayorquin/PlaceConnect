/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { requestReset } from "../../infrastructure/authService";
import Input from "../ui/Input";
import Button from "../ui/Button";

const RequestResetPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      await requestReset(email);
      setMessage(
        "Si el correo existe, recibirás un enlace para restablecer tu contraseña."
      );
    } catch (err: any) {
      setError(err.response?.data?.msg || "Error al enviar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 bg-white p-6 rounded shadow"
      >
        <h2 className="text-xl font-bold">Recuperar Contraseña</h2>
        <Input
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {message && <p className="text-green-600 text-sm">{message}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? "Enviando..." : "Enviar enlace de reset"}
        </Button>
      </form>
    </div>
  );
};

export default RequestResetPage;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("usuario");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validate = () => {
    if (!username || !password) return "Preencha username e password.";
    if (username.length < 3) return "O username deve ter pelo menos 3 caracteres.";
    if (password.length < 6) return "O password deve ter pelo menos 6 caracteres.";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha ao autenticar");
      }

      const userRole = data.role || role;

      const destination =
        userRole === "adm"
          ? "/dashboard/adm"
          : userRole === "tecnico"
          ? "/tecnico/dashboard"
          : "/usuario/dashboard";

      router.push(destination);
    } catch (err) {
      setError(err.message || "Erro ao autenticar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-red-500 via-black to-red-500 text-white">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900/80 backdrop-blur rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">
          <div className="bg-red-700/90 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="bg-white text-red-700 font-extrabold tracking-widest px-3 py-1 rounded-sm">SENAI</div>
              <div className="h-6 w-px bg-white/60" />
              <h1 className="text-lg sm:text-xl font-semibold">Acesso ao Sistema</h1>
            </div>
            <p className="text-white/80 text-sm mt-1">Faça login com seu username</p>
          </div>

          <form onSubmit={onSubmit} className="px-6 py-6 space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm mb-1">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu username"
                className="w-full rounded-xl bg-white border border-zinc-700 px-3 py-2 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-white border border-zinc-700 px-3 py-2 pr-12 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 text-sm text-black"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500 bg-red-950/40 text-red-300 text-sm px-3 py-2">{error}</div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2 font-medium shadow-lg shadow-red-900/30 transition"
              >
                {loading ? "Entrando…" : "Entrar"}
              </button>
              <div className="flex items-center justify-between text-xs text-white/60">
                <a href="#" className="hover:text-white underline underline-offset-4">Esqueci minha senha</a>
                <a href="#" className="hover:text-white underline underline-offset-4">Precisa de ajuda?</a>
              </div>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-white/50 mt-4">© {new Date().getFullYear()} SENAI — Ambiente restrito.</p>
      </div>
    </main>
  );
}

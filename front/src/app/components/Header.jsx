import { useState } from "react";

export default function Header({ user, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="bg-red-600 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo / Título */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">Sistema Zelos</h1>
          </div>

          {/* Usuário */}
          <div className="flex items-center">
            <div className="relative">
              <button
                className="flex items-center space-x-2 focus:outline-none hover:bg-red-700 rounded-lg px-2 py-1 transition"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="text-sm font-medium text-white">
                  {user.nome}
                </span>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-sm font-semibold">
                    {user.nome.charAt(0).toUpperCase()}
                  </span>
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-red-300 rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-red-100"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

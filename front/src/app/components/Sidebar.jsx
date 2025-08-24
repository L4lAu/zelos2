"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Sidebar({ activePage, userType, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "chamados", name: "Meus Chamados", icon: "📋" },
    { id: "historico", name: "Histórico de Chamados", icon: "🔍" },
  ];

  const handleNavigation = (href) => {
    if (onNavigate) onNavigate(href);
    setIsOpen(false); // fecha sidebar no mobile ao navegar
  };

  return (
    <>
      {/* Botão hamburguer mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-red-600 text-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-red-500 p-4 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
          md:static md:translate-x-0 md:w-64`}
      >
        <h2 className="text-lg font-bold text-red-700 mb-6 hidden md:block">Menu</h2>
        <nav>
          <ul className="space-y-3">
            {menuItems.map((item) => (
              <li key={item.id}>
                <div
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200
                    ${activePage === item.id
                      ? "bg-red-600 text-white font-semibold shadow"
                      : "text-black hover:bg-red-100"
                    }`}
                    
                  onClick={() => {
                    handleNavigation(item.id);
                  }}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  <span className="text-base md:text-lg">{item.name}</span>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

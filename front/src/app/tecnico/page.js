  "use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Cookies from 'js-cookie';

// Componentes
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChamadosTable from "../components/tecnico/ChamadosTable";
import ApontamentoModal from "../components/tecnico/ApontamentoModal";
import HistoricoChamados from "../components/tecnico/HistoricoChamados";




export default function TecnicoPage() {
  const [user] = useState({ id: 1, nome: "João Silva", email: "joao@email.com", tipo: "tecnico" });
  const [activePage, setActivePage] = useState("chamados"); // ✅ Novo estado
  const [chamados, setChamados] = useState([]);
  const [chamadosFiltrados, setChamadosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
  
        const token = Cookies.get('token'); // pegar token do cookie
  
        // Buscar dados do usuário
        const userRes = await fetch('http://localhost:8080/auth/me', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!userRes.ok) throw new Error('Erro ao buscar usuário');
        const userData = await userRes.json();
        setUser(userData); // substituir o estado fixo do user
  
        // Buscar chamados
        const chamadosRes = await fetch('http://localhost:8080/chamados/listar', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!chamadosRes.ok) throw new Error('Erro ao buscar chamados');
        const chamadosData = await chamadosRes.json();
        setChamados(chamadosData);
  
      } catch (error) {
        console.error('Erro ao buscar dados do back-end:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  // Filtragem
  useEffect(() => {
    let resultado = chamados;
    if (filtroStatus !== "todos") resultado = resultado.filter(c => c.status === filtroStatus);
    if (searchTerm) {
      const termo = searchTerm.toLowerCase();
      resultado = resultado.filter(c =>
        c.id.toString().includes(termo) ||
        c.patrimonio.toLowerCase().includes(termo) ||
        c.descricaoProblema.toLowerCase().includes(termo)
      );
    }
    setChamadosFiltrados(resultado);
  }, [chamados, filtroStatus, searchTerm]);

  const handleVerDetalhes = id => console.log("Ver detalhes do chamado:", id);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header user={user} onLogout={() => console.log("Logout")} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar com callback para mudar página */}
        <Sidebar activePage={activePage} userType="tecnico" onNavigate={(pageId) => setActivePage(pageId)} />

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 mt-16 lg:mt-0">
          {activePage === "chamados" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600">Meus Chamados</h1>
                <p className="text-gray-700 text-sm sm:text-base">Gerencie os chamados atribuídos a você</p>
              </div>

              {/* Filtros */}
              <div className="bg-white border border-red-500 p-4 rounded-lg shadow mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <input
                  type="text"
                  placeholder="Buscar por ID, patrimônio ou descrição..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full lg:flex-1 p-2 border border-red-500 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                />
                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                  <select
                    value={filtroStatus}
                    onChange={e => setFiltroStatus(e.target.value)}
                    className="p-2 border border-red-500 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base w-full sm:w-auto"
                  >
                    <option value="todos">Todos os status</option>
                    <option value="aberto">Aberto</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="aguardando_aprovacao">Aguardando Aprovação</option>
                    <option value="concluido">Concluído</option>
                  </select>
                </div>
              </div>

              {/* Tabela */}
              {loading ? (
                <div className="bg-white p-6 sm:p-8 rounded-lg shadow text-center border border-red-300">
                  <p className="text-red-600 font-semibold text-sm sm:text-base">Carregando chamados...</p>
                </div>
              ) : (
                <ChamadosTable
                  chamados={chamadosFiltrados}
                  onAceitarChamado={id => console.log("Aceitar", id)}
                  onIniciarChamado={id => console.log("Iniciar", id)}
                  onFinalizarChamado={id => console.log("Finalizar", id)}
                  onAbrirApontamento={() => console.log("Apontamento")}
                  onVerDetalhes={handleVerDetalhes}
                  user={user}
                />
              )}
            </>
          )}

          {activePage === "historico" && (
            <HistoricoChamados chamados={chamados} tecnicoId={user.id} onVerDetalhes={handleVerDetalhes} />
          )}
        </main>
        </div>
    </div>
  );
}

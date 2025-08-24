  "use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";

// Componentes
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChamadosTable from "../components/tecnico/ChamadosTable";
import ApontamentoModal from "../components/tecnico/ApontamentoModal";
import HistoricoChamados from "../components/tecnico/HistoricoChamados";


// Dados mock
const mockChamados = [
  { id: 1, patrimonio: "PAT-001", descricaoProblema: "Computador não liga", tipo: "Manutenção", status: "aberto", dataCriacao: "2024-01-15T10:30:00", tecnicoId: null },
  { id: 2, patrimonio: "PAT-002", descricaoProblema: "Projetor com imagem tremida", tipo: "Apoio Técnico", status: "em_andamento", dataCriacao: "2024-01-14T14:20:00", tecnicoId: 1 },
  { id: 3, patrimonio: "PAT-003", descricaoProblema: "Cadeira com rodinha quebrada", tipo: "Manutenção", status: "aguardando_aprovacao", dataCriacao: "2024-01-13T09:15:00", tecnicoId: 1 },
  { id: 4, patrimonio: "PAT-004", descricaoProblema: "Instalação de software", tipo: "Apoio Técnico", status: "concluido", dataCriacao: "2024-01-12T16:45:00", tecnicoId: 5 },
  { id: 5, patrimonio: "PAT-005", descricaoProblema: "Monitor apresentando tela azul com frequência", tipo: "Manutenção", status: "aberto", dataCriacao: "2024-01-15T10:30:00", tecnicoId: null },
  { id: 6, patrimonio: "PAT-006", descricaoProblema: "Impressora não está puxando papel corretamente", tipo: "Apoio Técnico", status: "em_andamento", dataCriacao: "2024-01-14T14:20:00", tecnicoId: 1 },
  { id: 7, patrimonio: "PAT-007", descricaoProblema: "Mesa com parafusos soltos causando instabilidade", tipo: "Manutenção", status: "aguardando_aprovacao", dataCriacao: "2024-01-13T09:15:00", tecnicoId: 4 },
  { id: 8, patrimonio: "PAT-008", descricaoProblema: "Atualização de sistema operacional pendente", tipo: "Apoio Técnico", status: "concluido", dataCriacao: "2024-01-12T16:45:00", tecnicoId: 1 }
];


export default function TecnicoPage() {
  const [user] = useState({ id: 1, nome: "João Silva", email: "joao@email.com", tipo: "tecnico" });
  const [activePage, setActivePage] = useState("chamados"); // ✅ Novo estado
  const [chamados, setChamados] = useState([]);
  const [chamadosFiltrados, setChamadosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChamado, setSelectedChamado] = useState(null);
  const [showApontamentoModal, setShowApontamentoModal] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Carregar chamados
  useEffect(() => {
    const fetchChamados = async () => {
      setLoading(true);
      await new Promise(res => setTimeout(res, 1000));
      setChamados(mockChamados);
      setLoading(false);
    };
    fetchChamados();
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

// pages/UsuarioPage.jsx
"use client";
import { useState, useEffect } from "react";

// Componentes
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChamadosUsuarioTable from "../components/usuario/ChamadosUsuarioTable";
import ModalNovoChamado from "../components/usuario/ModalNovoChamados";

// Dados mock
const mockChamados = [
  { id: 1, patrimonio: "PAT-001", descricaoProblema: "Computador não liga", tipo: "Manutenção", status: "aberto", dataCriacao: "2024-01-15T10:30:00" },
  { id: 2, patrimonio: "PAT-002", descricaoProblema: "Projetor com imagem tremida", tipo: "Apoio Técnico", status: "em_andamento", dataCriacao: "2024-01-14T14:20:00" },
  { id: 3, patrimonio: "PAT-003", descricaoProblema: "Cadeira com rodinha quebrada", tipo: "Manutenção", status: "concluido", dataCriacao: "2024-01-13T09:15:00" },
];

export default function UsuarioPage() {
  const [user] = useState({ id: 1, nome: "Maria Santos", email: "maria@email.com", tipo: "usuario" });
  const [chamados, setChamados] = useState([]);
  const [chamadosFiltrados, setChamadosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNovoChamado, setShowNovoChamado] = useState(false);
  const [erroPatrimonio, setErroPatrimonio] = useState("");

  // Carregar chamados (async dentro do useEffect)
  useEffect(() => {
    const fetchChamados = async () => {
      setLoading(true);
      try {
        await new Promise((res) => setTimeout(res, 1000));
        setChamados(mockChamados);
      } catch (err) {
        console.error("Erro ao carregar chamados:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChamados();
  }, []);

  // Filtrar chamados
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

  // Handlers
  const carregarChamados = async () => {
    setLoading(true);
    try { 
      await new Promise(res => setTimeout(res, 1000)); 
      setChamados(mockChamados); 
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };
  
  const handleLogout = () => console.log("Usuário deslogado");
  const handleVerDetalhes = id => console.log("Ver detalhes do chamado:", id);
  
  const handleCriarChamado = (novoChamado) => {
    // Validação básica
    if (!novoChamado.patrimonio && !novoChamado.descricaoProblema) {
      setErroPatrimonio("Informe o número de patrimônio ou uma descrição do item");
      return false;
    }
    
    // Verificar se já existe chamado aberto para o mesmo patrimônio e tipo
    const chamadoExistente = chamados.find(c => 
      c.patrimonio === novoChamado.patrimonio && 
      c.tipo === novoChamado.tipo && 
      (c.status === "aberto" || c.status === "em_andamento")
    );
    
    if (chamadoExistente) {
      setErroPatrimonio(`Já existe um chamado ${novoChamado.tipo} aberto para este patrimônio`);
      return false;
    }
    
    // Criar novo chamado
    const novoId = Math.max(...chamados.map(c => c.id), 0) + 1;
    const novoChamadoCompleto = {
      id: novoId,
      patrimonio: novoChamado.patrimonio,
      descricaoProblema: novoChamado.descricaoProblema,
      tipo: novoChamado.tipo,
      status: "aberto",
      dataCriacao: new Date().toISOString()
    };
    
    setChamados([...chamados, novoChamadoCompleto]);
    setShowNovoChamado(false);
    setErroPatrimonio("");
    return true;
  };

  const handleFecharModal = () => {
    setShowNovoChamado(false);
    setErroPatrimonio("");
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Header fixo */}
      <Header user={user} onLogout={handleLogout} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activePage="meus-chamados" userType="usuario" onNavigate={() => setSidebarOpen(false)} />

        {/* Conteúdo */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 mt-16 lg:mt-0">
          {/* Título */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600">Meus Chamados</h1>
              <p className="text-gray-700 text-sm sm:text-base">Acompanhe os chamados que você criou</p>
            </div>
            <button
              onClick={() => setShowNovoChamado(true)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm sm:text-base"
            >
              Novo Chamado
            </button>
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
                <option value="concluido">Concluído</option>
              </select>
              <button
                onClick={carregarChamados}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm sm:text-base w-full sm:w-auto"
              >
                Atualizar
              </button>
            </div>
          </div>

          {/* Modal de Novo Chamado usando o componente */}
          <ModalNovoChamado
            isOpen={showNovoChamado}
            onClose={handleFecharModal}
            onCreate={handleCriarChamado}
            error={erroPatrimonio}
          />

          {/* Chamados - usando a tabela específica para usuários */}
          {loading ? (
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow text-center border border-red-300">
              <p className="text-red-600 font-semibold text-sm sm:text-base">Carregando chamados...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <ChamadosUsuarioTable
                chamados={chamadosFiltrados}
                onVerDetalhes={handleVerDetalhes}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
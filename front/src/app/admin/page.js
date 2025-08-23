// pages/AdminPage.jsx
"use client";
import { useState, useEffect } from "react";

// Componentes
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChamadosAdminTable from "../components/admin/ChamadosAdminTable";
import ModalNovoChamado from "../components/usuario/ModalNovoChamados";
import ModalGerenciarTecnicos from "../components/admin/ModalGerenciarTecnicos";
import ModalGerenciarTiposChamado from "../components/admin/ModalGerenciarTiposChamado";
import ModalRelatorios from "../components/admin/ModalRelatorios";

// Dados mock
const mockChamados = [
  { id: 1, patrimonio: "PAT-001", descricaoProblema: "Computador não liga", tipo: "Manutenção", status: "aberto", dataCriacao: "2024-01-15T10:30:00", tecnicoAtribuido: null },
  { id: 2, patrimonio: "PAT-002", descricaoProblema: "Projetor com imagem tremida", tipo: "Apoio Técnico", status: "em_andamento", dataCriacao: "2024-01-14T14:20:00", tecnicoAtribuido: "João Silva" },
  { id: 3, patrimonio: "PAT-003", descricaoProblema: "Cadeira com rodinha quebrada", tipo: "Manutenção", status: "concluido", dataCriacao: "2024-01-13T09:15:00", tecnicoAtribuido: "Maria Santos" },
  { id: 4, patrimonio: "PAT-004", descricaoProblema: "Ar condicionado com vazamento", tipo: "Manutenção", status: "aberto", dataCriacao: "2024-01-16T11:45:00", tecnicoAtribuido: null },
  { id: 5, patrimonio: "PAT-005", descricaoProblema: "Rede Wi-Fi instável", tipo: "Apoio Técnico", status: "em_andamento", dataCriacao: "2024-01-15T15:20:00", tecnicoAtribuido: "Carlos Oliveira" },
];

const mockTecnicos = [
  { id: 1, nome: "João Silva", email: "joao@email.com", especialidade: "Hardware" },
  { id: 2, nome: "Maria Santos", email: "maria@email.com", especialidade: "Móveis e Estruturas" },
  { id: 3, nome: "Carlos Oliveira", email: "carlos@email.com", especialidade: "Rede e Software" },
];

const mockTiposChamado = [
  { id: 1, nome: "Manutenção", descricao: "Problemas com equipamentos ou mobiliário" },
  { id: 2, nome: "Apoio Técnico", descricao: "Suporte técnico para equipamentos" },
  { id: 3, nome: "Instalação", descricao: "Instalação de novos equipamentos" },
];

export default function AdminPage() {
  const [user] = useState({ id: 1, nome: "Admin User", email: "admin@email.com", tipo: "administrador" });
  const [chamados, setChamados] = useState([]);
  const [tecnicos, setTecnicos] = useState(mockTecnicos);
  const [tiposChamado, setTiposChamado] = useState(mockTiposChamado);
  const [chamadosFiltrados, setChamadosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroTecnico, setFiltroTecnico] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNovoChamado, setShowNovoChamado] = useState(false);
  const [showRelatorios, setShowRelatorios] = useState(false);
  const [showGerenciarTecnicos, setShowGerenciarTecnicos] = useState(false);
  const [showGerenciarTipos, setShowGerenciarTipos] = useState(false);
  const [chamadoEditando, setChamadoEditando] = useState(null);
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
    
    // Filtro por status
    if (filtroStatus !== "todos") {
      resultado = resultado.filter(c => c.status === filtroStatus);
    }
    
    // Filtro por tipo
    if (filtroTipo !== "todos") {
      resultado = resultado.filter(c => c.tipo === filtroTipo);
    }
    
    // Filtro por técnico
    if (filtroTecnico !== "todos") {
      resultado = resultado.filter(c => c.tecnicoAtribuido === filtroTecnico);
    }
    
    // Filtro por busca
    if (searchTerm) {
      const termo = searchTerm.toLowerCase();
      resultado = resultado.filter(c =>
        c.id.toString().includes(termo) ||
        c.patrimonio.toLowerCase().includes(termo) ||
        c.descricaoProblema.toLowerCase().includes(termo) ||
        (c.tecnicoAtribuido && c.tecnicoAtribuido.toLowerCase().includes(termo))
      );
    }
    
    setChamadosFiltrados(resultado);
  }, [chamados, filtroStatus, filtroTipo, filtroTecnico, searchTerm]);

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
  
  const handleLogout = () => console.log("Administrador deslogado");
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
      dataCriacao: new Date().toISOString(),
      tecnicoAtribuido: null
    };
    
    setChamados([...chamados, novoChamadoCompleto]);
    setShowNovoChamado(false);
    setErroPatrimonio("");
    return true;
  };

  const handleAtribuirTecnico = (chamadoId, tecnicoId) => {
    const tecnico = tecnicos.find(t => t.id === tecnicoId);
    if (!tecnico) return;
    
    setChamados(chamados.map(c => 
      c.id === chamadoId 
        ? {...c, tecnicoAtribuido: tecnico.nome}
        : c
    ));
  };

  const handleEditarChamado = (chamadoId, dadosAtualizados) => {
    setChamados(chamados.map(c => 
      c.id === chamadoId 
        ? {...c, ...dadosAtualizados}
        : c
    ));
    setChamadoEditando(null);
  };

  const handleFecharChamado = (chamadoId, resolucao) => {
    setChamados(chamados.map(c => 
      c.id === chamadoId 
        ? {...c, status: "concluido", dataFechamento: new Date().toISOString(), resolucao}
        : c
    ));
  };

  const handleFecharModal = () => {
    setShowNovoChamado(false);
    setShowRelatorios(false);
    setShowGerenciarTecnicos(false);
    setShowGerenciarTipos(false);
    setChamadoEditando(null);
    setErroPatrimonio("");
  };

  const handleAdicionarTecnico = (novoTecnico) => {
    const novoId = Math.max(...tecnicos.map(t => t.id), 0) + 1;
    setTecnicos([...tecnicos, { id: novoId, ...novoTecnico }]);
  };

  const handleAdicionarTipoChamado = (novoTipo) => {
    const novoId = Math.max(...tiposChamado.map(t => t.id), 0) + 1;
    setTiposChamado([...tiposChamado, { id: novoId, ...novoTipo }]);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Header fixo */}
      <Header user={user} onLogout={handleLogout} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activePage="admin-chamados" userType="administrador" onNavigate={() => setSidebarOpen(false)} />

        {/* Conteúdo */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 mt-16 lg:mt-0">
          {/* Título */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600">Painel de Administração</h1>
              <p className="text-gray-700 text-sm sm:text-base">Gerencie chamados, técnicos e relatórios</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowRelatorios(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm sm:text-base"
              >
                Relatórios
              </button>
              <button
                onClick={() => setShowNovoChamado(true)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm sm:text-base"
              >
                Novo Chamado
              </button>
            </div>
          </div>

          {/* Filtros avançados */}
          <div className="bg-white border border-red-500 p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Buscar por ID, patrimônio, descrição ou técnico..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="p-2 border border-red-500 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
            />
            
            <select
              value={filtroStatus}
              onChange={e => setFiltroStatus(e.target.value)}
              className="p-2 border border-red-500 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
            >
              <option value="todos">Todos os status</option>
              <option value="aberto">Aberto</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
            </select>
            
            <select
              value={filtroTipo}
              onChange={e => setFiltroTipo(e.target.value)}
              className="p-2 border border-red-500 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
            >
              <option value="todos">Todos os tipos</option>
              {tiposChamado.map(tipo => (
                <option key={tipo.id} value={tipo.nome}>{tipo.nome}</option>
              ))}
            </select>
            
            <select
              value={filtroTecnico}
              onChange={e => setFiltroTecnico(e.target.value)}
              className="p-2 border border-red-500 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
            >
              <option value="todos">Todos os técnicos</option>
              <option value="null">Não atribuído</option>
              {tecnicos.map(tecnico => (
                <option key={tecnico.id} value={tecnico.nome}>{tecnico.nome}</option>
              ))}
            </select>
            
            <div className="md:col-span-2 lg:col-span-4 flex gap-2 justify-end">
              <button
                onClick={() => setShowGerenciarTecnicos(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition text-sm sm:text-base"
              >
                Gerenciar Técnicos
              </button>
              <button
                onClick={() => setShowGerenciarTipos(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition text-sm sm:text-base"
              >
                Gerenciar Tipos
              </button>
              <button
                onClick={carregarChamados}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm sm:text-base"
              >
                Atualizar
              </button>
            </div>
          </div>

          {/* Modais */}
          <ModalNovoChamado
            isOpen={showNovoChamado}
            onClose={handleFecharModal}
            onCreate={handleCriarChamado}
            error={erroPatrimonio}
            tiposChamado={tiposChamado}
          />
          
          <ModalRelatorios
            isOpen={showRelatorios}
            onClose={handleFecharModal}
            chamados={chamados}
            tecnicos={tecnicos}
          />
          
          <ModalGerenciarTecnicos
            isOpen={showGerenciarTecnicos}
            onClose={handleFecharModal}
            tecnicos={tecnicos}
            onAdicionarTecnico={handleAdicionarTecnico}
          />
          
          <ModalGerenciarTiposChamado
            isOpen={showGerenciarTipos}
            onClose={handleFecharModal}
            tiposChamado={tiposChamado}
            onAdicionarTipo={handleAdicionarTipoChamado}
          />

          {/* Chamados - usando a tabela específica para administradores */}
          {loading ? (
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow text-center border border-red-300">
              <p className="text-red-600 font-semibold text-sm sm:text-base">Carregando chamados...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <ChamadosAdminTable
                chamados={chamadosFiltrados}
                tecnicos={tecnicos}
                onAtribuirTecnico={handleAtribuirTecnico}
                onEditarChamado={handleEditarChamado}
                onFecharChamado={handleFecharChamado}
                onVerDetalhes={handleVerDetalhes}
                user={user}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
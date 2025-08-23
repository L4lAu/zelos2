// components/ModalRelatorios.jsx
import { useState } from 'react';

export default function ModalRelatorios({ isOpen, onClose, chamados, tecnicos }) {
  const [tipoRelatorio, setTipoRelatorio] = useState('chamados_status');
  const [periodoInicio, setPeriodoInicio] = useState('');
  const [periodoFim, setPeriodoFim] = useState('');
  const [filtroTecnico, setFiltroTecnico] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [dadosRelatorio, setDadosRelatorio] = useState(null);

  if (!isOpen) return null;

  const gerarRelatorio = () => {
    // Filtrar chamados pelo período selecionado
    let chamadosFiltrados = [...chamados];
    
    if (periodoInicio) {
      const inicio = new Date(periodoInicio);
      chamadosFiltrados = chamadosFiltrados.filter(c => new Date(c.dataCriacao) >= inicio);
    }
    
    if (periodoFim) {
      const fim = new Date(periodoFim);
      chamadosFiltrados = chamadosFiltrados.filter(c => new Date(c.dataCriacao) <= fim);
    }
    
    if (filtroTecnico !== 'todos') {
      chamadosFiltrados = chamadosFiltrados.filter(c => c.tecnicoAtribuido === filtroTecnico);
    }
    
    if (filtroTipo !== 'todos') {
      chamadosFiltrados = chamadosFiltrados.filter(c => c.tipo === filtroTipo);
    }

    // Gerar relatório baseado no tipo selecionado
    let relatorio = {};
    
    switch (tipoRelatorio) {
      case 'chamados_status':
        relatorio = {
          titulo: 'Chamados por Status',
          dados: {
            aberto: chamadosFiltrados.filter(c => c.status === 'aberto').length,
            em_andamento: chamadosFiltrados.filter(c => c.status === 'em_andamento').length,
            concluido: chamadosFiltrados.filter(c => c.status === 'concluido').length
          }
        };
        break;
        
      case 'chamados_tipo':
        const tipos = {};
        chamadosFiltrados.forEach(c => {
          tipos[c.tipo] = (tipos[c.tipo] || 0) + 1;
        });
        relatorio = {
          titulo: 'Chamados por Tipo',
          dados: tipos
        };
        break;
        
      case 'atividades_tecnicos':
        const atividades = {};
        tecnicos.forEach(tecnico => {
          const chamadosTecnico = chamadosFiltrados.filter(c => c.tecnicoAtribuido === tecnico.nome);
          atividades[tecnico.nome] = {
            total: chamadosTecnico.length,
            concluidos: chamadosTecnico.filter(c => c.status === 'concluido').length,
            em_andamento: chamadosTecnico.filter(c => c.status === 'em_andamento').length
          };
        });
        relatorio = {
          titulo: 'Atividades dos Técnicos',
          dados: atividades
        };
        break;
        
      default:
        relatorio = { titulo: 'Relatório', dados: {} };
    }
    
    setDadosRelatorio(relatorio);
  };

  const exportarCSV = () => {
    if (!dadosRelatorio) return;
    
    let csvContent = '';
    
    switch (tipoRelatorio) {
      case 'chamados_status':
        csvContent = 'Status,Quantidade\n';
        Object.entries(dadosRelatorio.dados).forEach(([status, quantidade]) => {
          csvContent += `${status},${quantidade}\n`;
        });
        break;
        
      case 'chamados_tipo':
        csvContent = 'Tipo,Quantidade\n';
        Object.entries(dadosRelatorio.dados).forEach(([tipo, quantidade]) => {
          csvContent += `${tipo},${quantidade}\n`;
        });
        break;
        
      case 'atividades_tecnicos':
        csvContent = 'Técnico,Total,Concluídos,Em Andamento\n';
        Object.entries(dadosRelatorio.dados).forEach(([tecnico, dados]) => {
          csvContent += `${tecnico},${dados.total},${dados.concluidos},${dados.em_andamento}\n`;
        });
        break;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${tipoRelatorio}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Relatórios</h2>
        
        {/* Filtros do Relatório */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-2 font-medium">Tipo de Relatório</label>
            <select
              value={tipoRelatorio}
              onChange={(e) => setTipoRelatorio(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="chamados_status">Chamados por Status</option>
              <option value="chamados_tipo">Chamados por Tipo</option>
              <option value="atividades_tecnicos">Atividades dos Técnicos</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Período Início</label>
            <input
              type="date"
              value={periodoInicio}
              onChange={(e) => setPeriodoInicio(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Período Fim</label>
            <input
              type="date"
              value={periodoFim}
              onChange={(e) => setPeriodoFim(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Filtrar por Técnico</label>
            <select
              value={filtroTecnico}
              onChange={(e) => setFiltroTecnico(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="todos">Todos os técnicos</option>
              {tecnicos.map(tecnico => (
                <option key={tecnico.id} value={tecnico.nome}>{tecnico.nome}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Filtrar por Tipo</label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="todos">Todos os tipos</option>
              <option value="Manutenção">Manutenção</option>
              <option value="Apoio Técnico">Apoio Técnico</option>
              <option value="Instalação">Instalação</option>
            </select>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={gerarRelatorio}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Gerar Relatório
          </button>
          
          {dadosRelatorio && (
            <button
              onClick={exportarCSV}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Exportar CSV
            </button>
          )}
          
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Fechar
          </button>
        </div>

        {/* Visualização do Relatório */}
        {dadosRelatorio && (
          <div className="border rounded-lg p-4">
            <h3 className="text-xl font-bold mb-4">{dadosRelatorio.titulo}</h3>
            
            {tipoRelatorio === 'chamados_status' && (
              <div>
                <h4 className="font-semibold mb-2">Distribuição por Status:</h4>
                <ul className="space-y-2">
                  {Object.entries(dadosRelatorio.dados).map(([status, quantidade]) => (
                    <li key={status} className="flex justify-between">
                      <span className="capitalize">{status.replace('_', ' ')}:</span>
                      <span className="font-bold">{quantidade}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {tipoRelatorio === 'chamados_tipo' && (
              <div>
                <h4 className="font-semibold mb-2">Distribuição por Tipo:</h4>
                <ul className="space-y-2">
                  {Object.entries(dadosRelatorio.dados).map(([tipo, quantidade]) => (
                    <li key={tipo} className="flex justify-between">
                      <span>{tipo}:</span>
                      <span className="font-bold">{quantidade}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {tipoRelatorio === 'atividades_tecnicos' && (
              <div className="overflow-x-auto">
                <h4 className="font-semibold mb-2">Atividades dos Técnicos:</h4>
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Técnico</th>
                      <th className="px-4 py-2 text-center">Total</th>
                      <th className="px-4 py-2 text-center">Concluídos</th>
                      <th className="px-4 py-2 text-center">Em Andamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(dadosRelatorio.dados).map(([tecnico, dados]) => (
                      <tr key={tecnico}>
                        <td className="px-4 py-2 border-b">{tecnico}</td>
                        <td className="px-4 py-2 border-b text-center">{dados.total}</td>
                        <td className="px-4 py-2 border-b text-center">{dados.concluidos}</td>
                        <td className="px-4 py-2 border-b text-center">{dados.em_andamento}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
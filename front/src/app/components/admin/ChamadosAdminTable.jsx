// components/ChamadosAdminTable.jsx
import { useState } from 'react';
import StatusBadge from '../StatusBadge';

export default function ChamadosAdminTable({ 
  chamados, 
  tecnicos,
  onAtribuirTecnico, 
  onEditarChamado, 
  onFecharChamado, 
  onVerDetalhes,
  user 
}) {
  const [sortField, setSortField] = useState('dataCriacao');
  const [sortDirection, setSortDirection] = useState('desc');
  const [chamadoAtribuindo, setChamadoAtribuindo] = useState(null);
  const [chamadoEditando, setChamadoEditando] = useState(null);
  const [chamadoFechando, setChamadoFechando] = useState(null);
  const [resolucao, setResolucao] = useState("");

  const sortedChamados = [...chamados].sort((a, b) => {
    let valueA = a[sortField];
    let valueB = b[sortField];
    
    if (sortField.includes('data')) {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
    }
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('asc'); }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const handleConfirmarAtribuicao = (chamadoId, tecnicoId) => {
    onAtribuirTecnico(chamadoId, tecnicoId);
    setChamadoAtribuindo(null);
  };

  const handleConfirmarEdicao = (chamadoId, dados) => {
    onEditarChamado(chamadoId, dados);
    setChamadoEditando(null);
  };

  const handleConfirmarFechamento = (chamadoId) => {
    onFecharChamado(chamadoId, resolucao);
    setChamadoFechando(null);
    setResolucao("");
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="hidden sm:block overflow-x-auto">
        {/* Versão tabela para telas médias/grandes */}
        <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm md:text-base">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('id')}>
                ID {renderSortIcon('id')}
              </th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Patrimônio</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Descrição</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('status')}>
                Status {renderSortIcon('status')}
              </th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Técnico</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('dataCriacao')}>
                Data Criação {renderSortIcon('dataCriacao')}
              </th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedChamados.map((chamado) => (
              <tr key={chamado.id} className="hover:bg-gray-50">
                <td className="px-2 sm:px-4 py-2 text-gray-900">#{chamado.id}</td>
                <td className="px-2 sm:px-4 py-2 text-gray-500">{chamado.patrimonio}</td>
                <td className="px-2 sm:px-4 py-2 text-gray-500 truncate max-w-[100px] sm:max-w-xs">{chamado.descricaoProblema}</td>
                <td className="px-2 sm:px-4 py-2 text-gray-500">{chamado.tipo}</td>
                <td className="px-2 sm:px-4 py-2"><StatusBadge status={chamado.status} /></td>
                <td className="px-2 sm:px-4 py-2 text-gray-500">
                  {chamado.tecnicoAtribuido || "Não atribuído"}
                </td>
                <td className="px-2 sm:px-4 py-2 text-gray-500">{new Date(chamado.dataCriacao).toLocaleDateString('pt-BR')}</td>
                <td className="px-2 sm:px-4 py-2">
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {chamado.status !== 'concluido' && (
                      <button 
                        onClick={() => setChamadoAtribuindo(chamado)} 
                        className="text-blue-600 hover:text-blue-900 text-xs px-1"
                      >
                        Atribuir
                      </button>
                    )}
                    
                    <button 
                      onClick={() => setChamadoEditando(chamado)} 
                      className="text-yellow-600 hover:text-yellow-900 text-xs px-1"
                    >
                      Editar
                    </button>
                    
                    {chamado.status !== 'concluido' && (
                      <button 
                        onClick={() => setChamadoFechando(chamado)} 
                        className="text-green-600 hover:text-green-900 text-xs px-1"
                      >
                        Fechar
                      </button>
                    )}
                    
                    <button 
                      onClick={() => onVerDetalhes(chamado.id)} 
                      className="text-gray-600 hover:text-gray-900 text-xs px-1"
                    >
                      Detalhes
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Versão responsiva para telas pequenas */}
      <div className="sm:hidden flex flex-col gap-3 p-2">
        {sortedChamados.map((chamado) => (
          <div key={chamado.id} className="border rounded-lg p-2 bg-white shadow text-xs">
            <div className="flex justify-between font-semibold text-gray-700">
              <span>ID: #{chamado.id}</span>
              <span>{new Date(chamado.dataCriacao).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="mt-1 text-gray-600"><strong>Patrimônio:</strong> {chamado.patrimonio}</div>
            <div className="mt-1 text-gray-600"><strong>Descrição:</strong> {chamado.descricaoProblema}</div>
            <div className="mt-1 text-gray-600"><strong>Tipo:</strong> {chamado.tipo}</div>
            <div className="mt-1"><StatusBadge status={chamado.status} /></div>
            <div className="mt-1 text-gray-600"><strong>Técnico:</strong> {chamado.tecnicoAtribuido || "Não atribuído"}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {chamado.status !== 'concluido' && (
                <button 
                  onClick={() => setChamadoAtribuindo(chamado)} 
                  className="text-blue-600 text-xs"
                >
                  Atribuir
                </button>
              )}
              
              <button 
                onClick={() => setChamadoEditando(chamado)} 
                className="text-yellow-600 text-xs"
              >
                Editar
              </button>
              
              {chamado.status !== 'concluido' && (
                <button 
                  onClick={() => setChamadoFechando(chamado)} 
                  className="text-green-600 text-xs"
                >
                  Fechar
                </button>
              )}
              
              <button 
                onClick={() => onVerDetalhes(chamado.id)} 
                className="text-gray-600 text-xs"
              >
                Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      {chamados.length === 0 && (
        <div className="p-4 text-center text-gray-500 text-sm">Nenhum chamado encontrado.</div>
      )}

      {/* Modal de Atribuição de Técnico */}
      {chamadoAtribuindo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Atribuir Técnico - Chamado #{chamadoAtribuindo.id}</h3>
            <select 
              className="w-full p-2 border rounded mb-4"
              onChange={(e) => handleConfirmarAtribuicao(chamadoAtribuindo.id, parseInt(e.target.value))}
            >
              <option value="">Selecione um técnico</option>
              {tecnicos.map(tecnico => (
                <option key={tecnico.id} value={tecnico.id}>{tecnico.nome}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setChamadoAtribuindo(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição de Chamado */}
      {chamadoEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Editar Chamado #{chamadoEditando.id}</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Descrição do Problema</label>
                <textarea 
                  defaultValue={chamadoEditando.descricaoProblema}
                  className="w-full p-2 border rounded"
                  rows="3"
                  ref={ref => ref && (ref.value = chamadoEditando.descricaoProblema)}
                />
              </div>
              <div>
                <label className="block mb-1">Status</label>
                <select 
                  defaultValue={chamadoEditando.status}
                  className="w-full p-2 border rounded"
                >
                  <option value="aberto">Aberto</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluido">Concluído</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button 
                onClick={() => setChamadoEditando(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  const descricao = document.querySelector('textarea').value;
                  const status = document.querySelector('select').value;
                  handleConfirmarEdicao(chamadoEditando.id, { descricaoProblema: descricao, status });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Fechamento de Chamado */}
      {chamadoFechando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Fechar Chamado #{chamadoFechando.id}</h3>
            <div>
              <label className="block mb-1">Resolução</label>
              <textarea 
                value={resolucao}
                onChange={(e) => setResolucao(e.target.value)}
                className="w-full p-2 border rounded"
                rows="3"
                placeholder="Descreva como o problema foi resolvido..."
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button 
                onClick={() => setChamadoFechando(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleConfirmarFechamento(chamadoFechando.id)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirmar Fechamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
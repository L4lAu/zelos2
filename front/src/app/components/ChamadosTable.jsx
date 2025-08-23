import { useState } from 'react';
import StatusBadge from './StatusBadge';

export default function ChamadosTable({ 
  chamados, 
  onAceitarChamado, 
  onIniciarChamado, 
  onFinalizarChamado, 
  onAbrirApontamento, 
  onVerDetalhes,
  user 
}) {
  const [sortField, setSortField] = useState('dataCriacao');
  const [sortDirection, setSortDirection] = useState('desc');

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

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Scroll horizontal em telas pequenas */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-2 text-left font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('id')}>
                ID {renderSortIcon('id')}
              </th>
              <th className="px-3 sm:px-6 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                Patrimônio
              </th>
              <th className="px-3 sm:px-6 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-3 sm:px-6 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-3 sm:px-6 py-2 text-left font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                Status {renderSortIcon('status')}
              </th>
              <th className="px-3 sm:px-6 py-2 text-left font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('dataCriacao')}>
                Data Criação {renderSortIcon('dataCriacao')}
              </th>
              <th className="px-3 sm:px-6 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedChamados.map((chamado) => (
              <tr key={chamado.id} className="hover:bg-gray-50">
                <td className="px-3 sm:px-6 py-2 whitespace-nowrap text-gray-900">#{chamado.id}</td>
                <td className="px-3 sm:px-6 py-2 whitespace-nowrap text-gray-500">{chamado.patrimonio}</td>
                <td className="px-3 sm:px-6 py-2 text-gray-500 truncate max-w-[150px] sm:max-w-xs md:max-w-md">
                  {chamado.descricaoProblema}
                </td>
                <td className="px-3 sm:px-6 py-2 whitespace-nowrap text-gray-500">{chamado.tipo}</td>
                <td className="px-3 sm:px-6 py-2 whitespace-nowrap">
                  <StatusBadge status={chamado.status} />
                </td>
                <td className="px-3 sm:px-6 py-2 whitespace-nowrap text-gray-500">
                  {new Date(chamado.dataCriacao).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-3 sm:px-6 py-2 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {chamado.status === 'aberto' && (
                      <button onClick={() => onAceitarChamado(chamado.id)} className="text-green-600 hover:text-green-900 text-xs sm:text-sm px-1 sm:px-2 py-0.5 rounded" title="Aceitar chamado">
                        Aceitar
                      </button>
                    )}
                    {(chamado.status === 'aberto' || chamado.status === 'em_andamento') && (
                      <button onClick={() => onAbrirApontamento(chamado)} className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm px-1 sm:px-2 py-0.5 rounded" title="Registrar apontamento">
                        Apontamento
                      </button>
                    )}
                    {chamado.status === 'aberto' && chamado.tecnicoId === user.id && (
                      <button onClick={() => onIniciarChamado(chamado.id)} className="text-yellow-600 hover:text-yellow-900 text-xs sm:text-sm px-1 sm:px-2 py-0.5 rounded" title="Iniciar atendimento">
                        Iniciar
                      </button>
                    )}
                    {chamado.status === 'em_andamento' && (
                      <button onClick={() => onFinalizarChamado(chamado.id)} className="text-purple-600 hover:text-purple-900 text-xs sm:text-sm px-1 sm:px-2 py-0.5 rounded" title="Finalizar atendimento">
                        Finalizar
                      </button>
                    )}
                    <button onClick={() => onVerDetalhes(chamado.id)} className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm px-1 sm:px-2 py-0.5 rounded" title="Ver detalhes">
                      Detalhes
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {chamados.length === 0 && (
        <div className="p-6 sm:p-8 text-center">
          <p className="text-gray-500 text-sm sm:text-base">Nenhum chamado encontrado.</p>
        </div>
      )}
    </div>
  );
}

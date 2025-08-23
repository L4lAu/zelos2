import { useState } from 'react';
import StatusBadge from '../StatusBadge';

export default function ChamadosUsuarioTable({ 
  chamados, 
  onVerDetalhes 
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
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('dataCriacao')}>
                Data {renderSortIcon('dataCriacao')}
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
                <td className="px-2 sm:px-4 py-2 text-gray-500">{new Date(chamado.dataCriacao).toLocaleDateString('pt-BR')}</td>
                <td className="px-2 sm:px-4 py-2">
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    <button 
                      onClick={() => onVerDetalhes(chamado.id)} 
                      className="text-blue-600 hover:text-blue-900 text-xs px-1"
                    >
                      Ver Detalhes
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
            <div className="mt-2">
              <button 
                onClick={() => onVerDetalhes(chamado.id)} 
                className="text-blue-600 text-xs"
              >
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      {chamados.length === 0 && (
        <div className="p-4 text-center text-gray-500 text-sm">Nenhum chamado encontrado.</div>
      )}
    </div>
  );
}
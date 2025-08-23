// components/ModalGerenciarTiposChamado.jsx
import { useState } from 'react';

export default function ModalGerenciarTiposChamado({ isOpen, onClose, tiposChamado, onAdicionarTipo }) {
  const [novoTipo, setNovoTipo] = useState({ nome: '', descricao: '' });

  if (!isOpen) return null;

  const handleAdicionar = () => {
    if (!novoTipo.nome) {
      alert('Nome do tipo é obrigatório');
      return;
    }
    
    onAdicionarTipo(novoTipo);
    setNovoTipo({ nome: '', descricao: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Gerenciar Tipos de Chamado</h2>

        {/* Formulário para adicionar novo tipo */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">Adicionar Novo Tipo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nome do Tipo"
              value={novoTipo.nome}
              onChange={(e) => setNovoTipo({ ...novoTipo, nome: e.target.value })}
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Descrição"
              value={novoTipo.descricao}
              onChange={(e) => setNovoTipo({ ...novoTipo, descricao: e.target.value })}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            onClick={handleAdicionar}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Adicionar Tipo
          </button>
        </div>

        {/* Lista de tipos existentes */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Tipos de Chamado Cadastrados</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Nome</th>
                  <th className="px-4 py-2 text-left">Descrição</th>
                  <th className="px-4 py-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {tiposChamado.map((tipo) => (
                  <tr key={tipo.id}>
                    <td className="px-4 py-2 border-b">{tipo.nome}</td>
                    <td className="px-4 py-2 border-b">{tipo.descricao}</td>
                    <td className="px-4 py-2 border-b text-center">
                      <button
                        onClick={() => {/* Implementar edição */}}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {/* Implementar remoção */}}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
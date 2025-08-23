// components/ModalGerenciarTecnicos.jsx
import { useState } from 'react';

export default function ModalGerenciarTecnicos({ isOpen, onClose, tecnicos, onAdicionarTecnico }) {
  const [novoTecnico, setNovoTecnico] = useState({ nome: '', email: '', especialidade: '' });
  const [editandoTecnico, setEditandoTecnico] = useState(null);

  if (!isOpen) return null;

  const handleAdicionar = () => {
    if (!novoTecnico.nome || !novoTecnico.email) {
      alert('Nome e email são obrigatórios');
      return;
    }
    
    onAdicionarTecnico(novoTecnico);
    setNovoTecnico({ nome: '', email: '', especialidade: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Gerenciar Técnicos</h2>

        {/* Formulário para adicionar novo técnico */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">Adicionar Novo Técnico</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Nome"
              value={novoTecnico.nome}
              onChange={(e) => setNovoTecnico({ ...novoTecnico, nome: e.target.value })}
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={novoTecnico.email}
              onChange={(e) => setNovoTecnico({ ...novoTecnico, email: e.target.value })}
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Especialidade"
              value={novoTecnico.especialidade}
              onChange={(e) => setNovoTecnico({ ...novoTecnico, especialidade: e.target.value })}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            onClick={handleAdicionar}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Adicionar Técnico
          </button>
        </div>

        {/* Lista de técnicos existentes */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Técnicos Cadastrados</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Nome</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Especialidade</th>
                  <th className="px-4 py-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {tecnicos.map((tecnico) => (
                  <tr key={tecnico.id}>
                    <td className="px-4 py-2 border-b">{tecnico.nome}</td>
                    <td className="px-4 py-2 border-b">{tecnico.email}</td>
                    <td className="px-4 py-2 border-b">{tecnico.especialidade}</td>
                    <td className="px-4 py-2 border-b text-center">
                      <button
                        onClick={() => setEditandoTecnico(tecnico)}
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
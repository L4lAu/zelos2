// components/ModalNovoChamado.jsx
import { useState } from 'react';

export default function ModalNovoChamado({ isOpen, onClose, onCreate, error }) {
  const [novoChamado, setNovoChamado] = useState({
    patrimonio: "",
    descricaoProblema: "",
    tipo: "Manutenção"
  });

  const handleSubmit = () => {
    onCreate(novoChamado);
    setNovoChamado({ patrimonio: "", descricaoProblema: "", tipo: "Manutenção" });
  };

  const handleClose = () => {
    onClose();
    setNovoChamado({ patrimonio: "", descricaoProblema: "", tipo: "Manutenção" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-red-600 mb-4">Novo Chamado</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Número de Patrimônio</label>
          <input
            type="text"
            placeholder="Digite o número de patrimônio"
            value={novoChamado.patrimonio}
            onChange={e => setNovoChamado({...novoChamado, patrimonio: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Tipo de Chamado</label>
          <select
            value={novoChamado.tipo}
            onChange={e => setNovoChamado({...novoChamado, tipo: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="Manutenção">Manutenção</option>
            <option value="Apoio Técnico">Apoio Técnico</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Descrição do Problema *</label>
          <textarea
            placeholder="Descreva o problema em detalhes"
            value={novoChamado.descricaoProblema}
            onChange={e => setNovoChamado({...novoChamado, descricaoProblema: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 h-24"
            required
          />
        </div>
        
        {error && (
          <div className="mb-4 text-red-600 text-sm">{error}</div>
        )}
        
        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Criar Chamado
          </button>
        </div>
      </div>
    </div>
  );
}
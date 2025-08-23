import { useState } from 'react';

export default function ApontamentoModal({ chamado, tecnicoId, onClose, onSave }) {
  const [descricao, setDescricao] = useState('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(fim) < new Date(inicio)) {
      setError('A data de término não pode ser anterior à data de início.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      setTimeout(() => {
        onSave();
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao salvar apontamento:', error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Novo Apontamento - #{chamado.id}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-2" htmlFor="descricao">
                Descrição do Serviço
              </label>
              <textarea
                id="descricao"
                rows="4"
                className="w-full p-2 border border-gray-300 rounded text-xs sm:text-sm"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-2" htmlFor="inicio">
                  Início
                </label>
                <input
                  type="datetime-local"
                  id="inicio"
                  className="w-full p-2 border border-gray-300 rounded text-xs sm:text-sm"
                  value={inicio}
                  onChange={(e) => setInicio(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-2" htmlFor="fim">
                  Fim
                </label>
                <input
                  type="datetime-local"
                  id="fim"
                  className="w-full p-2 border border-gray-300 rounded text-xs sm:text-sm"
                  value={fim}
                  onChange={(e) => setFim(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-xs sm:text-sm mb-4">{error}</p>
            )}
            
            <div className="flex justify-end space-x-2 sm:space-x-3">
              <button
                type="button"
                className="px-3 sm:px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-xs sm:text-sm"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 text-xs sm:text-sm"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

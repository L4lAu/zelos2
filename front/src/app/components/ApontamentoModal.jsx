import { useState } from 'react';

export default function ApontamentoModal({ chamado, tecnicoId, onClose, onSave }) {
  const [descricao, setDescricao] = useState('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Aqui viria a chamada API para salvar o apontamento
      // await api.post('/apontamentos', {
      //   chamadoId: chamado.id,
      //   tecnicoId,
      //   descricao,
      //   inicio: new Date(inicio).toISOString(),
      //   fim: new Date(fim).toISOString()
      // });
      
      // Simulando uma requisição bem-sucedida
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Novo Apontamento - #{chamado.id}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descricao">
                Descrição do Serviço
              </label>
              <textarea
                id="descricao"
                rows="4"
                className="w-full p-2 border border-gray-300 rounded"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="inicio">
                  Início
                </label>
                <input
                  type="datetime-local"
                  id="inicio"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={inicio}
                  onChange={(e) => setInicio(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fim">
                  Fim
                </label>
                <input
                  type="datetime-local"
                  id="fim"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={fim}
                  onChange={(e) => setFim(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
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
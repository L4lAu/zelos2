"use client";
import { useEffect, useState } from "react";

export default function HistoricoChamados({ chamados, tecnicoId, onVerDetalhes }) {
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const filtrados = chamados
      .filter(c => c.tecnicoId === tecnicoId && c.status === "concluido")
      .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
    setHistorico(filtrados);
  }, [chamados, tecnicoId]);

  if (historico.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center border border-gray-200">
        <p className="text-gray-600 font-medium">Nenhum chamado concluído encontrado.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-red-600">Histórico de Chamados</h2>
      <ul className="divide-y divide-gray-200">
        {historico.map((chamado) => (
          <li key={chamado.id} className="flex justify-between items-center py-3">
            <div>
              <p className="text-gray-700 font-semibold">{chamado.tipo}</p>
              <p className="text-sm text-gray-500">
                Finalizado em: {new Date(chamado.dataCriacao).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <button
              onClick={() => onVerDetalhes(chamado.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Ver Detalhes
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [chamados, setChamados] = useState([]);


  useEffect(() => {
    fetch('http://localhost:8080/api/chamados')
      .then(res => res.json())
      .then(data => setChamados(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chamados Atribuídos</h1>
      <table className="min-w-full bg-white border">
        <thead className="bg-red-600 text-white">
          <tr>
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Patrimônio</th>
            <th className="py-2 px-4">Descrição</th>
            <th className="py-2 px-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {chamados.map(c => (
            <tr key={c.id} className="text-center border-t">
              <td className="py-2 px-4">{c.id}</td>
              <td className="py-2 px-4">{c.patrimonio}</td>
              <td className="py-2 px-4">{c.descricao}</td>
              <td className="py-2 px-4">{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
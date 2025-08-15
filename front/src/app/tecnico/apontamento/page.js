'use client';
import { useState } from 'react';

export default function Apontamento({ chamadoId }) {
  const [descricao, setDescricao] = useState('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8080/api/apontamentos/${chamadoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ descricao, inicio, fim })
      });
      const data = await res.json();
      alert('Apontamento criado ID: ' + data.id);
      setDescricao('');
      setInicio('');
      setFim('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="p-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-2">Adicionar Apontamento</h2>
      <div className="mb-2">
        <label>Descrição:</label>
        <textarea className="border w-full" value={descricao} onChange={e => setDescricao(e.target.value)} />
      </div>
      <div className="mb-2">
        <label>Início:</label>
        <input type="datetime-local" className="border w-full" value={inicio} onChange={e => setInicio(e.target.value)} />
      </div>
      <div className="mb-2">
        <label>Fim:</label>
        <input type="datetime-local" className="border w-full" value={fim} onChange={e => setFim(e.target.value)} />
      </div>
      <button type="submit" className="bg-red-600 text-white px-4 py-2">Salvar Apontamento</button>
    </form>
  );
}
export default function StatusBadge({ status }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'aberto':
        return { text: 'Aberto', color: 'bg-yellow-100 text-yellow-800' };
      case 'em_andamento':
        return { text: 'Em Andamento', color: 'bg-blue-100 text-blue-800' };
      case 'aguardando_aprovacao':
        return { text: 'Aguardando Aprovação', color: 'bg-purple-100 text-purple-800' };
      case 'concluido':
        return { text: 'Concluído', color: 'bg-green-100 text-green-800' };
      default:
        return { text: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.text}
    </span>
  );
}
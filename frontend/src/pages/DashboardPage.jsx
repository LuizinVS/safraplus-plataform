import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProperties } from '../services/capitalService';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DashboardPage = () => {
  // Exemplo de uso do react-query para buscar dados
  const { data: properties, isLoading, isError, error } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
  });

  if (isLoading) return <div className="text-center text-gray-600">Carregando propriedades...</div>;
  if (isError) return <div className="text-center text-red-600">Erro ao carregar propriedades: {error.message}</div>;

  // Mock de dados para KPIs (substituir por dados reais do backend quando disponíveis)
  const kpis = [
    { name: 'Total de Propriedades', value: properties?.length || 0, change: '+5% este mês' },
    { name: 'Safras Ativas', value: 7, change: '-2% este mês' },
    { name: 'Recomendações Pendentes', value: 3, change: '+1 este mês' },
    { name: 'Notificações Não Lidas', value: 5, change: 'Estável' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-gray-600">Visão geral do seu sistema agrícola.</p>

      {/* Cards de KPIs */}
      <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <div key={index} className="px-4 py-5 overflow-hidden bg-white rounded-lg shadow sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">{kpi.name}</dt>
            <dd className="flex items-baseline mt-1">
              <div className="text-2xl font-semibold text-gray-900">{kpi.value}</div>
              <div className="ml-2 text-sm font-medium text-green-600">
                {kpi.change}
              </div>
            </dd>
          </div>
        ))}
      </div>

      {/* Tabela de Propriedades Recentes/Ativas */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900">Suas Propriedades</h2>
        {properties && properties.length > 0 ? (
          <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Nome
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Localização
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Área (ha)
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Ver</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {properties.slice(0, 5).map((property) => ( // Mostrar apenas 5 recentes
                  <tr key={property.id}>
                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                      {property.name}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {property.location}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {property.area}
                    </td>
                    <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                      <Link to={`/properties/${property.id}`} className="text-primary hover:text-primary-dark">
                        Ver detalhes<span className="sr-only">, {property.name}</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-gray-500">Nenhuma propriedade cadastrada ainda. <Link to="/properties" className="text-primary hover:underline">Cadastre uma nova!</Link></p>
        )}
      </div>

      {/* Outras seções como "Próximas Recomendações" ou "Alertas Recentes" podem ser adicionadas aqui */}
    </div>
  );
};

export default DashboardPage;
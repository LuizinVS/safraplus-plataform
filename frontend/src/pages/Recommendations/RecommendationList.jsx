import React, { useState, Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRecommendations, deleteRecommendation } from '../../services/recommendationService';
import { getSafraById, getPropertyById } from '../../services/capitalService'; // Para breadcrumbs
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import RecommendationForm from './RecommendationForm';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const RecommendationList = () => {
  const { propertyId, safraId } = useParams(); // Pode ser undefined se acessar direto /recommendations
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecommendation, setEditingRecommendation] = useState(null);

  // Busca recomendações, pode ser filtrada por safraId
  const { data: recommendations, isLoading, isError, error } = useQuery({
    queryKey: ['recommendations', safraId],
    queryFn: () => getRecommendations(safraId), // safraId será undefined se não estiver na URL
  });

  // Busca dados da propriedade e safra para breadcrumbs, se aplicável
  const { data: property } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => getPropertyById(propertyId),
    enabled: !!propertyId,
  });

  const { data: safra } = useQuery({
    queryKey: ['safra', propertyId, safraId],
    queryFn: () => getSafraById(propertyId, safraId),
    enabled: !!propertyId && !!safraId,
  });

  const deleteRecommendationMutation = useMutation({
    mutationFn: deleteRecommendation,
    onSuccess: () => {
      queryClient.invalidateQueries(['recommendations', safraId]); // Invalida as recomendações da safra atual
      toast.success('Recomendação excluída com sucesso!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erro ao excluir recomendação.');
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta recomendação?')) {
      deleteRecommendationMutation.mutate(id);
    }
  };

  const openCreateModal = () => {
    setEditingRecommendation(null);
    setIsModalOpen(true);
  };

  const openEditModal = (recommendation) => {
    setEditingRecommendation(recommendation);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRecommendation(null);
  };

  if (isLoading) return <div className="text-center text-gray-600">Carregando recomendações...</div>;
  if (isError) return <div className="text-center text-red-600">Erro ao carregar recomendações: {error.message}</div>;

  return (
    <div className="p-6">
      <nav className="flex mb-4" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-4">
          <li>
            <div className="flex items-center">
              <Link to="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Dashboard
              </Link>
            </div>
          </li>
          {propertyId && (
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
                <Link to="/properties" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Propriedades
                </Link>
              </div>
            </li>
          )}
          {propertyId && property && (
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
                <Link to={`/properties/${propertyId}`} className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  {property.name}
                </Link>
              </div>
            </li>
          )}
          {safraId && safra && (
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
                <Link to={`/properties/${propertyId}/safras`} className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Safras
                </Link>
              </div>
            </li>
          )}
          {safraId && safra && (
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
                <span className="ml-4 text-sm font-medium text-gray-700">Recomendações da Safra: {safra.name}</span>
              </div>
            </li>
          )}
          {!safraId && (
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
                <span className="ml-4 text-sm font-medium text-gray-700">Todas as Recomendações</span>
              </div>
            </li>
          )}
        </ol>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {safra ? `Recomendações para Safra: ${safra.name}` : 'Todas as Recomendações'}
        </h1>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <PlusIcon className="w-5 h-5 -ml-1 mr-2" aria-hidden="true" />
          Adicionar Recomendação
        </button>
      </div>

      {recommendations && recommendations.length > 0 ? (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Tipo
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Descrição
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Prioridade
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Criado Em
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recommendations.map((rec) => (
                      <tr key={rec.id}>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                          {rec.type}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 truncate max-w-xs">
                          {rec.description}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            rec.priority === 'LOW' ? 'bg-gray-100 text-gray-800' :
                            rec.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-800' :
                            rec.priority === 'HIGH' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800' // URGENT
                          }`}>
                            {rec.priority}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            rec.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                            rec.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800' // DISCARDED
                          }`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {rec.createdAt ? format(new Date(rec.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'N/A'}
                        </td>
                        <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                          <button
                            onClick={() => openEditModal(rec)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                            title="Editar Recomendação"
                          >
                            <PencilIcon className="w-5 h-5 inline" />
                          </button>
                          <button
                            onClick={() => handleDelete(rec.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir Recomendação"
                          >
                            <TrashIcon className="w-5 h-5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-gray-500">Nenhuma recomendação encontrada {safra ? `para a safra ${safra.name}` : ''}. Clique em "Adicionar Recomendação" para começar.</p>
      )}

      {/* Modal para Adicionar/Editar Recomendação */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {editingRecommendation ? 'Editar Recomendação' : 'Adicionar Nova Recomendação'}
                  </Dialog.Title>
                  <div className="mt-4">
                    <RecommendationForm
                      safraId={safraId} // Passa o safraId se estiver no contexto da safra
                      recommendation={editingRecommendation}
                      onSuccess={closeModal}
                      onCancel={closeModal}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default RecommendationList;
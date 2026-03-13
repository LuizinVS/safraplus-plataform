import React, { useState, Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSafrasByProperty, deleteSafra, getPropertyById } from '../../services/capitalService';
import { PlusIcon, PencilIcon, TrashIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import SafraForm from './SafraForm';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SafrasPage = () => {
  const { propertyId } = useParams();
  const queryClient = useQueryClient();
  const [isSafraModalOpen, setIsSafraModalOpen] = useState(false);
  const [editingSafra, setEditingSafra] = useState(null);

  // Busca detalhes da propriedade para exibir no breadcrumb/título
  const { data: property, isLoading: isLoadingProperty, isError: isErrorProperty } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => getPropertyById(propertyId),
    enabled: !!propertyId,
  });

  const { data: safras, isLoading, isError, error } = useQuery({
    queryKey: ['safras', propertyId],
    queryFn: () => getSafrasByProperty(propertyId),
    enabled: !!propertyId,
  });

  const deleteSafraMutation = useMutation({
    mutationFn: ({ propertyId, safraId }) => deleteSafra(propertyId, safraId),
    onSuccess: () => {
      queryClient.invalidateQueries(['safras', propertyId]);
      toast.success('Safra excluída com sucesso!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erro ao excluir safra.');
    },
  });

  const handleDeleteSafra = (safraId) => {
    if (window.confirm('Tem certeza que deseja excluir esta safra?')) {
      deleteSafraMutation.mutate({ propertyId, safraId });
    }
  };

  const openCreateSafraModal = () => {
    setEditingSafra(null);
    setIsSafraModalOpen(true);
  };

  const openEditSafraModal = (safra) => {
    setEditingSafra(safra);
    setIsSafraModalOpen(true);
  };

  const closeSafraModal = () => {
    setIsSafraModalOpen(false);
    setEditingSafra(null);
  };

  if (isLoadingProperty) return <div className="text-center text-gray-600">Carregando propriedade...</div>;
  if (isErrorProperty) return <div className="text-center text-red-600">Erro ao carregar propriedade.</div>;
  if (!property) return <div className="text-center text-gray-600">Propriedade não encontrada.</div>;

  if (isLoading) return <div className="text-center text-gray-600">Carregando safras...</div>;
  if (isError) return <div className="text-center text-red-600">Erro ao carregar safras: {error.message}</div>;

  return (
    <div className="p-6">
      <nav className="flex mb-4" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-4">
          <li>
            <div className="flex items-center">
              <Link to="/properties" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Propriedades
              </Link>
            </div>
          </li>
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
          <li>
            <div className="flex items-center">
              <svg className="flex-shrink-0 w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
              <span className="ml-4 text-sm font-medium text-gray-700">Safras</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Safras da Propriedade: {property.name}</h1>
        <button
          onClick={openCreateSafraModal}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <PlusIcon className="w-5 h-5 -ml-1 mr-2" aria-hidden="true" />
          Adicionar Safra
        </button>
      </div>

      {safras && safras.length > 0 ? (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Nome
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Início
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Fim
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Rendimento Esperado
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {safras.map((safra) => (
                      <tr key={safra.id}>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                          {safra.name}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {format(new Date(safra.startDate), 'dd/MM/yyyy', { locale: ptBR })}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {format(new Date(safra.endDate), 'dd/MM/yyyy', { locale: ptBR })}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            safra.status === 'PLANTADA' ? 'bg-blue-100 text-blue-800' :
                            safra.status === 'CRESCIMENTO' ? 'bg-green-100 text-green-800' :
                            safra.status === 'COLHEITA' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {safra.status}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {safra.expectedYield ? `${safra.expectedYield} kg/ha` : 'N/A'}
                        </td>
                        <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                          <Link
                            to={`/properties/${propertyId}/safras/${safra.id}/recommendations`} // Link para recomendações da safra
                            className="text-green-600 hover:text-green-900 mr-4"
                            title="Ver Recomendações"
                          >
                            <SparklesIcon className="w-5 h-5 inline" />
                          </Link>
                          <button
                            onClick={() => openEditSafraModal(safra)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                            title="Editar Safra"
                          >
                            <PencilIcon className="w-5 h-5 inline" />
                          </button>
                          <button
                            onClick={() => handleDeleteSafra(safra.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir Safra"
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
        <p className="mt-4 text-gray-500">Nenhuma safra cadastrada para esta propriedade ainda. Clique em "Adicionar Safra" para começar.</p>
      )}

      {/* Modal para Adicionar/Editar Safra */}
      <Transition appear show={isSafraModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeSafraModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

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
                    {editingSafra ? 'Editar Safra' : 'Adicionar Nova Safra'}
                  </Dialog.Title>
                  <div className="mt-4">
                    <SafraForm
                      propertyId={propertyId}
                      safra={editingSafra}
                      onSuccess={closeSafraModal}
                      onCancel={closeSafraModal}
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

export default SafrasPage;
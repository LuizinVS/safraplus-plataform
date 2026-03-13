import React, { useState, Fragment } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProperties, deleteProperty } from '../../services/capitalService';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import PropertyForm from './PropertyForm';
import { Dialog, Transition } from '@headlessui/react'; // CORRECT import
import toast from 'react-hot-toast';

const PropertiesPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null); // Para editar uma propriedade existente

  const { data: properties, isLoading, isError, error } = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
  });

  const deletePropertyMutation = useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries(['properties']);
      toast.success('Propriedade excluída com sucesso!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erro ao excluir propriedade.');
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta propriedade?')) {
      deletePropertyMutation.mutate(id);
    }
  };

  const openCreateModal = () => {
    setEditingProperty(null);
    setIsModalOpen(true);
  };

  const openEditModal = (property) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProperty(null);
  };

  if (isLoading) return <div className="text-center text-gray-600">Carregando propriedades...</div>;
  if (isError) return <div className="text-center text-red-600">Erro ao carregar propriedades: {error.message}</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Propriedades</h1>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <PlusIcon className="w-5 h-5 -ml-1 mr-2" aria-hidden="true" />
          Adicionar Propriedade
        </button>
      </div>

      {properties && properties.length > 0 ? (
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
                        Localização
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Área (ha)
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {properties.map((property) => (
                      <tr key={property.id}>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                          <Link to={`/properties/${property.id}`} className="text-primary hover:text-primary-dark">
                            {property.name}
                          </Link>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {property.location}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {property.area}
                        </td>
                        <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                          <button
                            onClick={() => openEditModal(property)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <PencilIcon className="w-5 h-5 inline" />
                            <span className="sr-only">, {property.name}</span>
                          </button>
                          <button
                            onClick={() => handleDelete(property.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="w-5 h-5 inline" />
                            <span className="sr-only">, {property.name}</span>
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
        <p className="mt-4 text-gray-500">Nenhuma propriedade cadastrada ainda. Clique em "Adicionar Propriedade" para começar.</p>
      )}

      {/* Modal para Adicionar/Editar Propriedade */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                    {editingProperty ? 'Editar Propriedade' : 'Adicionar Nova Propriedade'}
                  </Dialog.Title>
                  <div className="mt-4">
                    <PropertyForm
                      property={editingProperty}
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

export default PropertiesPage;
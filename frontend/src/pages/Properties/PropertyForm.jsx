import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { propertySchema } from '../../utils/validationSchemas';
import { createProperty, updateProperty } from '../../services/capitalService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const PropertyForm = ({ property, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(propertySchema),
    defaultValues: property || { name: '', location: '', area: '', description: '' },
  });

  const createMutation = useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries(['properties']);
      toast.success('Propriedade criada com sucesso!');
      onSuccess();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erro ao criar propriedade.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProperty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['properties']);
      queryClient.invalidateQueries(['property', property.id]); // Invalida detalhes da propriedade também
      toast.success('Propriedade atualizada com sucesso!');
      onSuccess();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erro ao atualizar propriedade.');
    },
  });

  const onSubmit = (data) => {
    if (property) {
      updateMutation.mutate({ id: property.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Localização</label>
        <input
          type="text"
          id="location"
          {...register('location')}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
        {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>}
      </div>

      <div>
        <label htmlFor="area" className="block text-sm font-medium text-gray-700">Área (hectares)</label>
        <input
          type="number"
          step="0.01"
          id="area"
          {...register('area')}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
        {errors.area && <p className="mt-1 text-xs text-red-600">{errors.area.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          id="description"
          {...register('description')}
          rows="3"
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        ></textarea>
        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
      </div>

      <div className="flex justify-end pt-4 space-x-3 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {property ? 'Salvar Alterações' : 'Adicionar Propriedade'}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { safraSchema } from '../../utils/validationSchemas';
import { createSafra, updateSafra } from '../../services/capitalService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const SafraForm = ({ propertyId, safra, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(safraSchema),
    defaultValues: safra ? {
      ...safra,
      startDate: format(new Date(safra.startDate), 'yyyy-MM-dd'),
      endDate: format(new Date(safra.endDate), 'yyyy-MM-dd'),
    } : {
      name: '',
      startDate: '',
      endDate: '',
      expectedYield: '',
      status: 'PLANTADA', // Default status
    },
  });

  const startDate = watch('startDate');

  const createMutation = useMutation({
    mutationFn: (data) => createSafra(propertyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['safras', propertyId]);
      toast.success('Safra criada com sucesso!');
      onSuccess();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erro ao criar safra.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ safraId, data }) => updateSafra(propertyId, safraId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['safras', propertyId]);
      queryClient.invalidateQueries(['safra', propertyId, safra.id]); // Invalida detalhes da safra
      toast.success('Safra atualizada com sucesso!');
      onSuccess();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erro ao atualizar safra.');
    },
  });

  const onSubmit = (data) => {
    // Garantir que as datas sejam enviadas no formato correto, se necessário formatar para ISO
    const payload = {
      ...data,
      startDate: data.startDate ? format(new Date(data.startDate), 'yyyy-MM-dd') : null,
      endDate: data.endDate ? format(new Date(data.endDate), 'yyyy-MM-dd') : null,
      expectedYield: data.expectedYield ? parseFloat(data.expectedYield) : null, // Converter para número
    };

    if (safra) {
      updateMutation.mutate({ safraId: safra.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Safra</label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Data de Início</label>
        <input
          type="date"
          id="startDate"
          {...register('startDate')}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
        {errors.startDate && <p className="mt-1 text-xs text-red-600">{errors.startDate.message}</p>}
      </div>

      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Data Final</label>
        <input
          type="date"
          id="endDate"
          min={startDate} // Garante que a data final não seja anterior à data inicial
          {...register('endDate')}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
        {errors.endDate && <p className="mt-1 text-xs text-red-600">{errors.endDate.message}</p>}
      </div>

      <div>
        <label htmlFor="expectedYield" className="block text-sm font-medium text-gray-700">Rendimento Esperado (kg/ha)</label>
        <input
          type="number"
          step="0.01"
          id="expectedYield"
          {...register('expectedYield')}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
        {errors.expectedYield && <p className="mt-1 text-xs text-red-600">{errors.expectedYield.message}</p>}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status"
          {...register('status')}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        >
          <option value="PLANTADA">Plantada</option>
          <option value="CRESCIMENTO">Crescimento</option>
          <option value="COLHEITA">Colheita</option>
          <option value="FINALIZADA">Finalizada</option>
        </select>
        {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>}
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
          {safra ? 'Salvar Alterações' : 'Adicionar Safra'}
        </button>
      </div>
    </form>
  );
};

export default SafraForm;
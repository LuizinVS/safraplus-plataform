import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { recommendationSchema } from '../../utils/validationSchemas';
import { createRecommendation, updateRecommendation } from '../../services/recommendationService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const RecommendationForm = ({ safraId, recommendation, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(recommendationSchema),
    defaultValues: recommendation ? { ...recommendation, safraId: recommendation.safraId || safraId } : {
      type: '',
      description: '',
      priority: 'MEDIUM', // Default
      status: 'PENDING',  // Default
      safraId: safraId || '', // Preenche com safraId se disponível
    },
  });

  const createMutation = useMutation({
    mutationFn: createRecommendation,
    onSuccess: () => {
      queryClient.invalidateQueries(['recommendations', safraId]); // Invalida as recomendações desta safra
      queryClient.invalidateQueries(['recommendations', undefined]); // Invalida todas as recomendações (se safraId for undefined)
      toast.success('Recomendação criada com sucesso!');
      onSuccess();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erro ao criar recomendação.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateRecommendation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['recommendations', safraId]);
      queryClient.invalidateQueries(['recommendations', undefined]);
      toast.success('Recomendação atualizada com sucesso!');
      onSuccess();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Erro ao atualizar recomendação.');
    },
  });

  const onSubmit = (data) => {
    // Se o formulário não tiver o safraId por ser uma lista geral, adicionamos
    const payload = { ...data, safraId: data.safraId || safraId };

    if (recommendation) {
      updateMutation.mutate({ id: recommendation.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo de Recomendação</label>
        <input
          type="text"
          id="type"
          {...register('type')}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
        {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>}
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

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Prioridade</label>
        <select
          id="priority"
          {...register('priority')}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        >
          <option value="LOW">Baixa</option>
          <option value="MEDIUM">Média</option>
          <option value="HIGH">Alta</option>
          <option value="URGENT">Urgente</option>
        </select>
        {errors.priority && <p className="mt-1 text-xs text-red-600">{errors.priority.message}</p>}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status"
          {...register('status')}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        >
          <option value="PENDING">Pendente</option>
          <option value="COMPLETED">Concluída</option>
          <option value="DISCARDED">Descartada</option>
        </select>
        {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>}
      </div>

      {/* Campo Safra ID visível apenas se não estiver no contexto de uma safra específica */}
      {!safraId && (
        <div>
          <label htmlFor="safraId" className="block text-sm font-medium text-gray-700">ID da Safra (Opcional)</label>
          <input
            type="text"
            id="safraId"
            {...register('safraId')}
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            placeholder="Preencher se a recomendação for para uma safra específica"
          />
          {errors.safraId && <p className="mt-1 text-xs text-red-600">{errors.safraId.message}</p>}
        </div>
      )}


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
          {recommendation ? 'Salvar Alterações' : 'Adicionar Recomendação'}
        </button>
      </div>
    </form>
  );
};

export default RecommendationForm;
// src/services/recommendationService.js

// 1. CORREÇÃO: Importa a 'capitalApi' (porta 8082), e não a 'recommenderApi'
import { capitalApi } from './api';

// As recomendações são salvas e lidas a partir do capital-service

export const getRecommendations = async (safraId) => {
    // 2. CORREÇÃO: Usa 'capitalApi'
    const response = await capitalApi.get(`/recommendations`, { params: { safraId } });
    return response.data;
};

export const getRecommendationById = async (id) => {
    const response = await capitalApi.get(`/recommendations/${id}`);
    return response.data;
};

export const createRecommendation = async (recommendationData) => {
    const response = await capitalApi.post('/recommendations', recommendationData);
    return response.data;
};

export const updateRecommendation = async (id, recommendationData) => {
    const response = await capitalApi.put(`/recommendations/${id}`, recommendationData);
    return response.data;
};

export const deleteRecommendation = async (id) => {
    const response = await capitalApi.delete(`/recommendations/${id}`);
    return response.data;
};
// src/services/capitalService.js

// 1. CORREÇÃO: Importa a 'capitalApi' (porta 8082) como um named import
import { capitalApi } from './api';

// Propriedades
export const getProperties = async () => {
    // 2. CORREÇÃO: Usa 'capitalApi'
    const response = await capitalApi.get('/properties');
    return response.data;
};

export const getPropertyById = async (id) => {
    const response = await capitalApi.get(`/properties/${id}`);
    return response.data;
};

export const createProperty = async (propertyData) => {
    // Esta era a linha 20 que quebrava
    const response = await capitalApi.post('/properties', propertyData);
    return response.data;
};

export const updateProperty = async (id, propertyData) => {
    const response = await capitalApi.put(`/properties/${id}`, propertyData);
    return response.data;
};

export const deleteProperty = async (id) => {
    const response = await capitalApi.delete(`/properties/${id}`);
    return response.data;
};

// Safras
export const getSafrasByProperty = async (propertyId) => {
    const response = await capitalApi.get(`/properties/${propertyId}/safras`);
    return response.data;
};

export const getSafraById = async (propertyId, safraId) => {
    const response = await capitalApi.get(`/properties/${propertyId}/safras/${safraId}`);
    return response.data;
};

export const createSafra = async (propertyId, safraData) => {
    const response = await capitalApi.post(`/properties/${propertyId}/safras`, safraData);
    return response.data;
};

export const updateSafra = async (propertyId, safraId, safraData) => {
    const response = await capitalApi.put(`/properties/${propertyId}/safras/${safraId}`, safraData);
    return response.data;
};

export const deleteSafra = async (propertyId, safraId) => {
    const response = await capitalApi.delete(`/properties/${propertyId}/safras/${safraId}`);
    return response.data;
};
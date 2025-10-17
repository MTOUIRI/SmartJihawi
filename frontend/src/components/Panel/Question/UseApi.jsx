import { useState } from 'react';

export const useApi = () => {
  const getAuthToken = () => localStorage.getItem('token');
  
  const apiCall = async (endpoint, options = {}) => {
    const token = getAuthToken();
    const baseURL = 'http://localhost:8080/api';
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      ...options
    };

    try {
      const response = await fetch(`${baseURL}${endpoint}`, config);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      if (response.status === 204) return {};
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  return { apiCall };
};

import { useState } from 'react';
import API_URL from '../../../config';

export const useApi = () => {
  const [tokenError, setTokenError] = useState(null);
  
  const getAuthToken = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setTokenError('No authentication token found. Please login again.');
    }
    return token;
  };
  
  const apiCall = async (endpoint, options = {}) => {
    const token = getAuthToken();
    
    // Check if token exists
    if (!token) {
      throw new Error('Authentication required. Please login again.');
    }
    
    const baseURL = API_URL;
    
    // Properly merge headers to avoid overwriting Authorization
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.headers || {})  // Merge any additional headers from options
      }
    };

    try {
      const response = await fetch(`${baseURL}${endpoint}`, config);
      
      // Handle 403 specifically
      if (response.status === 403) {
        // Token might be expired or invalid
        const errorData = await response.json().catch(() => ({}));
        
        // Check if it's a token issue
        if (errorData.message?.toLowerCase().includes('token') || 
            errorData.message?.toLowerCase().includes('expired') ||
            errorData.message?.toLowerCase().includes('unauthorized')) {
          // Clear the token and redirect to login
          localStorage.removeItem('admin_token');
          throw new Error('Session expired. Please login again.');
        }
        
        throw new Error(errorData.message || 'Access forbidden. You do not have permission to perform this action.');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {};
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  return { apiCall, tokenError };
};
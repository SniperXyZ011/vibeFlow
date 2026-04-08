import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://vibeflow-backend-production.up.railway.app/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getPrediction = async (features: Record<string, number>) => {
  try {
    const response = await api.post('/predict', features);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.detail || 'Failed to get prediction from the server.');
    }
    throw new Error('Network error. Is the AI server running?');
  }
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export default api;

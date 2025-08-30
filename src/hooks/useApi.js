import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export const useApi = () => {
  const { authenticatedFetch } = useAuth();
  const { addToast } = useToast();

  const apiCall = async (url, options = {}, showSuccessToast = false, successMessage = 'Operation successful') => {
    try {
      const response = await authenticatedFetch(url, options);
      const data = await response.json();

      if (response.ok) {
        if (showSuccessToast) {
          addToast(successMessage, 'success');
        }
        return { success: true, data };
      } else {
        addToast(data.message || 'Operation failed', 'error');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('API call error:', error);
      addToast('Network error occurred', 'error');
      return { success: false, error: error.message };
    }
  };

  return { apiCall };
};
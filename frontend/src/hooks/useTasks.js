import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';

export const useTasks = (params = {}, endpoint = '/tasks') => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(endpoint, { params });
      setTasks(data.tasks || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load tasks');
    } finally {
      setLoading(false);
    }
  }, [endpoint, JSON.stringify(params)]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, refresh: fetchTasks, setTasks };
};

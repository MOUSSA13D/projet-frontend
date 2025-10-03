// src/hooks/useUsers.js
import { useState, useEffect } from 'react';
import userService from '../services/userService';

const useUsers = () => {
  const [statistics, setStatistics] = useState({
    totalClients: 0,
    totalDistributeurs: 0,
    totalAgents: 0
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const stats = await userService.getStatistics();
      setStatistics({
        totalClients: stats.totalClients,
        totalDistributeurs: stats.totalDistributeurs,
        totalAgents: stats.totalAgents
      });
      setUsers(stats.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadData();
  };

  return {
    statistics,
    users,
    loading,
    error,
    refreshData
  };
};

export default useUsers;
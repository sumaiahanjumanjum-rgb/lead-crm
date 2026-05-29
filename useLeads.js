import { useState, useEffect, useCallback } from 'react';
import { leadsAPI } from '../utils/api';
import toast from 'react-hot-toast';

export const useLeads = (filters = {}) => {
  const [leads, setLeads]     = useState([]);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const [leadsRes, statsRes] = await Promise.all([
        leadsAPI.getAll(filters),
        leadsAPI.getStats(),
      ]);
      setLeads(leadsRes.data.data);
      setStats(statsRes.data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]); // eslint-disable-line

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const addLead = async (data) => {
    await leadsAPI.create(data);
    toast.success('Lead added successfully!');
    await fetchLeads();
  };

  const updateStatus = async (id, status, notes) => {
    await leadsAPI.updateStatus(id, status, notes);
    toast.success(`Status updated to "${status}"`);
    await fetchLeads();
  };

  const updateLead = async (id, data) => {
    await leadsAPI.update(id, data);
    toast.success('Lead updated!');
    await fetchLeads();
  };

  const deleteLead = async (id) => {
    await leadsAPI.delete(id);
    toast.success('Lead deleted');
    await fetchLeads();
  };

  return { leads, stats, loading, error, addLead, updateStatus, updateLead, deleteLead, refetch: fetchLeads };
};

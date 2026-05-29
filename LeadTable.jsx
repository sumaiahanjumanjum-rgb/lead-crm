import { useState } from 'react';
import toast from 'react-hot-toast';
import EditLeadModal from './EditLeadModal';

const STATUSES = ['New', 'Interested', 'Not Interested', 'Converted'];

const sourceBadge = (s) => {
  const map = { Call: 'badge-source-call', WhatsApp: 'badge-source-whatsapp', Field: 'badge-source-field' };
  const icons = { Call: '📞', WhatsApp: '💬', Field: '📍' };
  return <span className={`badge ${map[s] || ''}`}>{icons[s]} {s}</span>;
};

const statusBadge = (s) => {
  const map = { New: 'badge-new', Interested: 'badge-interested', Converted: 'badge-converted', 'Not Interested': 'badge-not-interested' };
  return <span className={`badge ${map[s] || 'badge-new'}`}>{s}</span>;
};

const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export default function LeadTable({ leads, loading, onUpdateStatus, onUpdateLead, onDelete }) {
  const [editLead, setEditLead]   = useState(null);
  const [deleting, setDeleting]   = useState(null);
  const [updating, setUpdating]   = useState(null);

  const handleStatusChange = async (id, status) => {
    setUpdating(id);
    try {
      await onUpdateStatus(id, status);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (lead) => {
    if (!window.confirm(`Delete lead "${lead.name}"? This cannot be undone.`)) return;
    setDeleting(lead.id);
    try {
      await onDelete(lead.id);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <div className="card">
        <div className="leads-table-wrap">
          <table className="leads-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Status</th>
                <th>Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr className="loading-row">
                  <td colSpan="7">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                      <span className="spinner" /> Loading leads…
                    </div>
                  </td>
                </tr>
              )}

              {!loading && leads.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <div className="empty-icon">📋</div>
                      <h3>No leads found</h3>
                      <p>Add your first lead using the form above, or adjust filters.</p>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && leads.map((lead, i) => (
                <tr key={lead.id}>
                  <td style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', fontSize: '0.75rem' }}>
                    {i + 1}
                  </td>
                  <td>
                    <div className="lead-name">{lead.name}</div>
                    {lead.notes && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {lead.notes}
                      </div>
                    )}
                  </td>
                  <td><span className="lead-phone">{lead.phone}</span></td>
                  <td>{sourceBadge(lead.source)}</td>
                  <td>
                    {updating === lead.id
                      ? <span className="spinner" />
                      : (
                        <select
                          className="status-select"
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          title="Change status"
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      )
                    }
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                    {fmtDate(lead.created_at)}
                  </td>
                  <td>
                    <div className="action-cell">
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => setEditLead(lead)}
                        title="Edit lead"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-danger btn-xs"
                        onClick={() => handleDelete(lead)}
                        disabled={deleting === lead.id}
                        title="Delete lead"
                      >
                        {deleting === lead.id ? '…' : '🗑'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {leads.length > 0 && (
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
              {leads.length} lead{leads.length !== 1 ? 's' : ''} shown
            </span>
          </div>
        )}
      </div>

      {editLead && (
        <EditLeadModal
          lead={editLead}
          onSave={onUpdateLead}
          onClose={() => setEditLead(null)}
        />
      )}
    </>
  );
}

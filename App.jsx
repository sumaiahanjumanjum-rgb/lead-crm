import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import AddLeadForm from './components/AddLeadForm';
import LeadTable   from './components/LeadTable';
import StatsPanel  from './components/StatsPanel';
import { useLeads } from './hooks/useLeads';
import './index.css';

const TABS = ['Leads', 'Dashboard'];

export default function App() {
  const [activeTab,  setActiveTab]  = useState('Leads');
  const [search,     setSearch]     = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  const filters = {
    ...(search       ? { search }       : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(sourceFilter ? { source: sourceFilter } : {}),
  };

  const { leads, stats, loading, addLead, updateStatus, updateLead, deleteLead } = useLeads(filters);

  return (
    <div className="app-shell">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <header className="app-header">
        <div className="logo">
          <span className="logo-dot" />
          LeadFlow CRM
        </div>
        <div className="header-meta">
          {stats?.total ?? '–'} TOTAL LEADS
        </div>
      </header>

      <main className="main-content">
        {/* Tab Navigation */}
        <nav className="tab-nav">
          {TABS.map(t => (
            <button
              key={t}
              className={`tab-btn${activeTab === t ? ' active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t === 'Leads' ? '📋 Leads' : '📊 Dashboard'}
            </button>
          ))}
        </nav>

        {activeTab === 'Dashboard' && (
          <StatsPanel stats={stats} />
        )}

        {activeTab === 'Leads' && (
          <>
            {/* Add Lead Form */}
            <AddLeadForm onAdd={addLead} />

            {/* Filter Bar */}
            <div className="filter-bar">
              <div className="search-input-wrap">
                <span className="search-icon">🔍</span>
                <input
                  placeholder="Search by name or phone…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="New">New</option>
                <option value="Interested">Interested</option>
                <option value="Not Interested">Not Interested</option>
                <option value="Converted">Converted</option>
              </select>
              <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
                <option value="">All Sources</option>
                <option value="Call">Call</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Field">Field</option>
              </select>
              {(search || statusFilter || sourceFilter) && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => { setSearch(''); setStatusFilter(''); setSourceFilter(''); }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Section Header */}
            <div className="section-header">
              <span className="section-title">All Leads</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                {loading ? '…' : `${leads.length} result${leads.length !== 1 ? 's' : ''}`}
              </span>
            </div>

            {/* Leads Table */}
            <LeadTable
              leads={leads}
              loading={loading}
              onUpdateStatus={updateStatus}
              onUpdateLead={updateLead}
              onDelete={deleteLead}
            />
          </>
        )}
      </main>
    </div>
  );
}

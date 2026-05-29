export default function StatsPanel({ stats }) {
  if (!stats) return null;

  const total      = Number(stats.total) || 0;
  const pct = (n) => total ? Math.round((Number(n) / total) * 100) : 0;

  const cards = [
    { label: 'Total Leads',    value: stats.total,        accent: 'var(--amber)',  sub: 'all time' },
    { label: 'Converted',      value: stats.converted,    accent: 'var(--green)',  sub: `${pct(stats.converted)}% conversion` },
    { label: 'Interested',     value: stats.interested,   accent: 'var(--blue)',   sub: `${pct(stats.interested)}% of total` },
    { label: 'Not Interested', value: stats.not_interested, accent: 'var(--red)', sub: `${pct(stats.not_interested)}% of total` },
    { label: 'New',            value: stats.new_leads,    accent: 'var(--text-muted)', sub: 'awaiting contact' },
    { label: 'This Week',      value: stats.this_week,    accent: 'var(--purple)', sub: 'last 7 days' },
  ];

  const sources = [
    { label: 'Call',      value: Number(stats.from_call),      color: 'var(--blue)' },
    { label: 'WhatsApp',  value: Number(stats.from_whatsapp),  color: 'var(--green)' },
    { label: 'Field',     value: Number(stats.from_field),     color: 'var(--purple)' },
  ];

  return (
    <>
      <div className="stats-grid">
        {cards.map(c => (
          <div className="stat-card" key={c.label} style={{ '--accent': c.accent }}>
            <div className="stat-label">{c.label}</div>
            <div className="stat-value" style={{ color: c.accent }}>{c.value ?? 0}</div>
            <div className="stat-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '20px 24px', marginBottom: 24 }}>
        <div className="section-title" style={{ marginBottom: 16 }}>Lead Sources</div>
        <div className="source-bars">
          {sources.map(s => (
            <div className="source-bar-row" key={s.label}>
              <div className="source-bar-label">
                <span>{s.label}</span>
                <span>{s.value}</span>
              </div>
              <div className="source-bar-track">
                <div
                  className="source-bar-fill"
                  style={{ width: `${pct(s.value)}%`, background: s.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

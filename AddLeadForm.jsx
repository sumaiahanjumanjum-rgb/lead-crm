import { useState } from 'react';
import toast from 'react-hot-toast';

const SOURCES = ['Call', 'WhatsApp', 'Field'];

const validate = ({ name, phone, source }) => {
  const errors = {};
  if (!name.trim())               errors.name   = 'Name is required';
  else if (name.trim().length < 2) errors.name   = 'Name must be at least 2 characters';
  if (!phone.trim())               errors.phone  = 'Phone is required';
  else if (!/^[+]?[\d\s\-().]{7,20}$/.test(phone.trim()))
                                   errors.phone  = 'Enter a valid phone number';
  if (!source)                     errors.source = 'Please select a source';
  return errors;
};

export default function AddLeadForm({ onAdd }) {
  const [form, setForm]       = useState({ name: '', phone: '', source: '', notes: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors(er => ({ ...er, [k]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await onAdd(form);
      setForm({ name: '', phone: '', source: '', notes: '' });
      setErrors({});
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2 className="form-card-title">
        <span>＋</span> Add New Lead
      </h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className={`form-input${errors.name ? ' error' : ''}`}
              placeholder="e.g. Rahul Sharma"
              value={form.name}
              onChange={set('name')}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              className={`form-input${errors.phone ? ' error' : ''}`}
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={set('phone')}
              type="tel"
            />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Lead Source</label>
            <select
              className={`form-select${errors.source ? ' error' : ''}`}
              value={form.source}
              onChange={set('source')}
            >
              <option value="">— Select source —</option>
              {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.source && <span className="form-error">{errors.source}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Notes <span style={{ opacity: 0.5 }}>(optional)</span></label>
            <input
              className="form-input"
              placeholder="Any remarks..."
              value={form.notes}
              onChange={set('notes')}
            />
          </div>
        </div>

        <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading
              ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Adding…</>
              : 'Add Lead'
            }
          </button>
        </div>
      </form>
    </div>
  );
}

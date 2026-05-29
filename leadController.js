const db = require('../config/db');
const { validationResult } = require('express-validator');

const now = () => new Date().toISOString();

const getAllLeads = (req, res) => {
  try {
    const { search, status, source } = req.query;
    let leads = db.get('leads').value();

    if (search) {
      const s = search.toLowerCase();
      leads = leads.filter(l => l.name.toLowerCase().includes(s) || l.phone.includes(s));
    }
    if (status) leads = leads.filter(l => l.status === status);
    if (source) leads = leads.filter(l => l.source === source);

    leads = [...leads].reverse(); // newest first
    res.json({ success: true, count: leads.length, data: leads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getStats = (req, res) => {
  try {
    const leads = db.get('leads').value();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    res.json({
      success: true,
      data: {
        total:         leads.length,
        new_leads:     leads.filter(l => l.status === 'New').length,
        interested:    leads.filter(l => l.status === 'Interested').length,
        not_interested:leads.filter(l => l.status === 'Not Interested').length,
        converted:     leads.filter(l => l.status === 'Converted').length,
        from_call:     leads.filter(l => l.source === 'Call').length,
        from_whatsapp: leads.filter(l => l.source === 'WhatsApp').length,
        from_field:    leads.filter(l => l.source === 'Field').length,
        this_week:     leads.filter(l => l.created_at >= weekAgo).length,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getLeadById = (req, res) => {
  const lead = db.get('leads').find({ id: Number(req.params.id) }).value();
  if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
  res.json({ success: true, data: lead });
};

const createLead = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ success: false, errors: errors.array() });

  try {
    const { name, phone, source, notes } = req.body;

    const existing = db.get('leads').find(l => l.phone === phone.trim()).value();
    if (existing)
      return res.status(409).json({ success: false, message: 'A lead with this phone number already exists' });

    const id = db.get('nextId').value();
    const lead = {
      id,
      name: name.trim(),
      phone: phone.trim(),
      source,
      status: 'New',
      notes: notes?.trim() || null,
      created_at: now(),
      updated_at: now(),
    };

    db.get('leads').push(lead).write();
    db.update('nextId', n => n + 1).write();

    res.status(201).json({ success: true, message: 'Lead created', data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateLeadStatus = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ success: false, errors: errors.array() });

  try {
    const id = Number(req.params.id);
    const { status, notes } = req.body;

    const lead = db.get('leads').find({ id }).value();
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    db.get('leads').find({ id }).assign({
      status,
      ...(notes !== undefined ? { notes } : {}),
      updated_at: now()
    }).write();

    res.json({ success: true, message: 'Status updated', data: db.get('leads').find({ id }).value() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateLead = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ success: false, errors: errors.array() });

  try {
    const id = Number(req.params.id);
    const { name, phone, source, status, notes } = req.body;

    const lead = db.get('leads').find({ id }).value();
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    if (phone) {
      const dup = db.get('leads').find(l => l.phone === phone && l.id !== id).value();
      if (dup) return res.status(409).json({ success: false, message: 'Phone already used by another lead' });
    }

    const updates = { updated_at: now() };
    if (name)   updates.name   = name.trim();
    if (phone)  updates.phone  = phone.trim();
    if (source) updates.source = source;
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    db.get('leads').find({ id }).assign(updates).write();
    res.json({ success: true, message: 'Lead updated', data: db.get('leads').find({ id }).value() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteLead = (req, res) => {
  try {
    const id = Number(req.params.id);
    const lead = db.get('leads').find({ id }).value();
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    db.get('leads').remove({ id }).write();
    res.json({ success: true, message: 'Lead deleted', data: lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllLeads, getStats, getLeadById, createLead, updateLeadStatus, updateLead, deleteLead };

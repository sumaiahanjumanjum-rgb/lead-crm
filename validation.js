const { body } = require('express-validator');

const VALID_SOURCES  = ['Call', 'WhatsApp', 'Field'];
const VALID_STATUSES = ['New', 'Interested', 'Not Interested', 'Converted'];

const createLeadValidation = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('phone').trim().notEmpty().withMessage('Phone is required')
    .matches(/^[+]?[\d\s\-().]{7,20}$/).withMessage('Invalid phone number'),
  body('source').notEmpty().withMessage('Source is required')
    .isIn(VALID_SOURCES).withMessage('Invalid source'),
  body('notes').optional().trim().isLength({ max: 500 }),
];

const updateStatusValidation = [
  body('status').notEmpty().withMessage('Status is required')
    .isIn(VALID_STATUSES).withMessage('Invalid status'),
];

const updateLeadValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('phone').optional().trim().matches(/^[+]?[\d\s\-().]{7,20}$/),
  body('source').optional().isIn(VALID_SOURCES),
  body('status').optional().isIn(VALID_STATUSES),
  body('notes').optional().trim().isLength({ max: 500 }),
];

module.exports = { createLeadValidation, updateStatusValidation, updateLeadValidation };

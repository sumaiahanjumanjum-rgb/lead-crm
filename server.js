const express    = require('express');
const cors       = require('cors');
const leadRoutes = require('./routes/leads');

// Initialize DB (runs on require)
require('./config/db');

const app  = express();
const PORT = 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api/leads', leadRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, req, res, _next) => res.status(500).json({ success: false, message: err.message }));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

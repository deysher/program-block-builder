require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/v1/auth', require('./routes/auth'));
app.use('/v1/exercises', require('./routes/exercises'));
app.use('/v1/programs', require('./routes/programs'));
app.use('/v1/blocks', require('./routes/blocks'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
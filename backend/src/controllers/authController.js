const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'All fields required' } });

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const trainer = await prisma.trainer.create({ data: { name, email, passwordHash } });
    const token = jwt.sign({ id: trainer.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ trainer: { id: trainer.id, name: trainer.name, email: trainer.email }, token });
  } catch (e) {
    console.error('Register error:', e);
    if (e.code === 'P2002')
      return res.status(409).json({ error: { code: 'CONFLICT', message: 'Email already registered' } });
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong' } });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Email and password required' } });

  try {
    const trainer = await prisma.trainer.findUnique({ where: { email } });
    if (!trainer || !(await bcrypt.compare(password, trainer.passwordHash)))
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });

    const token = jwt.sign({ id: trainer.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ trainer: { id: trainer.id, name: trainer.name, email: trainer.email }, token });
  } catch {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong' } });
  } 
};
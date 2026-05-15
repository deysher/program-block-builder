const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
    if (e.code === 'P2002')
      return res.status(409).json({ error: { code: 'CONFLICT', message: 'Email already registered' } });
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong' } });
  }
};

exports.login = a
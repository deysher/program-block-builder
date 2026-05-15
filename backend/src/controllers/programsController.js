const prisma = require('../lib/prisma');

exports.getPrograms = async (req, res) => {
  try {
    const data = await prisma.program.findMany({ where: { trainerId: req.trainer.id }, orderBy: { createdAt: 'desc' } });
    res.json({ data });
  } catch {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong' } });
  }
};

exports.createProgram = async (req, res) => {
  const { name, description, duration_weeks } = req.body;
  if (!name) return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Name is required' } });
  try {
    const program = await prisma.program.create({
      data: { name, description, durationWeeks: duration_weeks, trainerId: req.trainer.id },
    });
    res.status(201).json(program);
  } catch {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong' } });
  }
};

exports.getProgram = async (req, res) => {
  try {
    const program = await prisma.program.findUnique({
      where: { id: req.params.id },
      include: { blocks: { orderBy: { orderIndex: 'asc' }, include: { exercises: { orderBy: { orderIndex: 'asc' }, include: { exercise: true } } } } },
    });
    if (!program) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Program not found' } });
    if (program.trainerId !== req.trainer.id) return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Access denied' } });
    res.json(program);
  } catch {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong' } });
  }
};

exports.updateProgram = async (req, res) => {
  try {
    const program = await prisma.program.findUnique({ where: { id: req.params.id } });
    if (!program) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Program not found' } });
    if (program.trainerId !== req.trainer.id) return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Access denied' } });
    const updated = await prisma.program.update({ where: { id: req.params.id }, data: req.body });
    res.json(updated);
  } catch {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong' } });
  }
};

exports.deleteProgram = async (req, res) => {
  try {
    const program = await prisma.program.findUnique({ where: { id: req.params.id } });
    if (!program) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Program not found' } });
    if (program.trainerId !== req.trainer.id) return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Access denied' } });
    await prisma.program.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong' } });
  }
};
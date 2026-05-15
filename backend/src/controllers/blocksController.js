const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createBlock = async (req, res) => {
  const { name, focus, order_index } = req.body;
  if (!name) return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Name is required' } });
  try {
    const block = await prisma.block.create({
      data: { name, focus, orderIndex: order_index ?? 0, programId: req.params.programId },
    });
    res.status(201).json(block);
  } catch {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong' } });
  }
};

exports.updateBlock = async (req, res) => {
  try {
    const block = await prisma.block.update({
      where: { id: req.params.blockId },
      data: { name: req.body.name, focus: req.body.focus, orderIndex: req.body.order_index },
    });
    res.json(block);
  } catch {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong' } });
  }
};

exports.deleteBlock = async (req, res) => {
  try {
    await prisma.block.delete({ where: { id: req.params.blockId } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong' } });
  }
};
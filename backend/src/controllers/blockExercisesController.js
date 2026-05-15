const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.addExercise = async (req, res) => {
  const { exercise_id, sets, reps, notes, order_index } = req.body;
  if (!exercise_id) return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'exercise_id is required' } });
  try {
    const blockExercise = await prisma.blockExercise.create({
      data: { blockId: req.params.blockId, exerciseId: exercise_id, sets: sets ?? 3, reps: reps ?? 10, notes, orderIndex: order_index ?? 0 },
      include: { exercise: true },
    });
    res.status(201).json(blockExercise);
  } catch {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong' } });
  }
};

exports.updateExercise = async (req, res) => {
  try {
    const updated = await prisma.blockExercise.update({
      where: { id: req.params.id },
      data: { sets: req.body.sets, reps: req.body.reps, notes: req.body.notes, orderIndex: req.body.order_index },
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong' } });
  }
};

exports.removeExercise = async (req, res) => {
  try {
    await prisma.blockExercise.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong' } });
  }
};
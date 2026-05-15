const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getExercises = async (req, res) => {
  const { search, muscle_group, equipment, difficulty, page = 1, limit = 20 } = req.query;

  const where = {
    ...(search && { name: { contains: search, mode: 'insensitive' } }),
    ...(muscle_group && { muscleGroup: muscle_group }),
    ...(equipment && { equipment }),
    ...(difficulty && { difficulty }),
  };

  try {
    const [data, total] = await Promise.all([
      prisma.exercise.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        orderBy: { name: 'asc' },
      }),
      prisma.exercise.count({ where }),
    ]);
    res.json({ data, pagination: { page: parseInt(page), limit: parseInt(limit), total } });
  } catch {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong' } });
  }
};

exports.getExercise = async (req, res) => {
  try {
    const exercise = await prisma.exercise.findUnique({ where: { id: req.params.id } });
    if (!exercise) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Exercise not found' } });
    res.json(exercise);
  } catch {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Something went wrong' } });
  }
};
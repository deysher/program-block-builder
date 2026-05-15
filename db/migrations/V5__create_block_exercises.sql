CREATE TABLE block_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  block_id UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sets INT NOT NULL DEFAULT 3,
  reps INT NOT NULL DEFAULT 10,
  notes TEXT,
  order_index INT NOT NULL DEFAULT 0
);
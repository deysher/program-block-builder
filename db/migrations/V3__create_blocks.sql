CREATE TABLE blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  focus VARCHAR(255),
  order_index INT NOT NULL DEFAULT 0
);
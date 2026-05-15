# API Contracts — Program Block Builder

Base URL: `https://api.programblockbuilder.com/v1`

All requests require the header:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## Auth

### POST /auth/register
Register a new trainer account.

**Request**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

**Response 201**
```json
{
  "trainer": {
    "id": "uuid",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "created_at": "2026-05-14T00:00:00Z"
  },
  "token": "jwt_token_here"
}
```

**Errors**
- `400` — missing fields
- `409` — email already registered

---

### POST /auth/login
Log in as an existing trainer.

**Request**
```json
{
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

**Response 200**
```json
{
  "trainer": {
    "id": "uuid",
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "token": "jwt_token_here"
}
```

**Errors**
- `401` — invalid credentials

---

## Exercises

### GET /exercises
Search and filter the exercise database.

**Query Parameters**
| Parameter | Type | Description |
|---|---|---|
| `search` | string | Search by name (partial match) |
| `muscle_group` | string | Filter by muscle group (e.g. `chest`, `legs`) |
| `equipment` | string | Filter by equipment (e.g. `barbell`, `bodyweight`) |
| `difficulty` | string | `beginner`, `intermediate`, `advanced` |
| `page` | int | Page number (default: 1) |
| `limit` | int | Results per page (default: 20, max: 50) |

**Response 200**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Barbell Back Squat",
      "muscle_group": "legs",
      "equipment": "barbell",
      "difficulty": "intermediate",
      "instructions": "Stand with feet shoulder-width apart...",
      "video_url": "https://..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 142
  }
}
```

---

### GET /exercises/:id
Get a single exercise by ID.

**Response 200**
```json
{
  "id": "uuid",
  "name": "Barbell Back Squat",
  "muscle_group": "legs",
  "equipment": "barbell",
  "difficulty": "intermediate",
  "instructions": "Stand with feet shoulder-width apart...",
  "video_url": "https://..."
}
```

**Errors**
- `404` — exercise not found

---

## Programs

### GET /programs
Get all programs for the authenticated trainer.

**Response 200**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "12-Week Strength Program",
      "description": "Progressive overload focus",
      "duration_weeks": 12,
      "created_at": "2026-05-14T00:00:00Z"
    }
  ]
}
```

---

### POST /programs
Create a new program.

**Request**
```json
{
  "name": "12-Week Strength Program",
  "description": "Progressive overload focus",
  "duration_weeks": 12
}
```

**Response 201**
```json
{
  "id": "uuid",
  "name": "12-Week Strength Program",
  "description": "Progressive overload focus",
  "duration_weeks": 12,
  "created_at": "2026-05-14T00:00:00Z"
}
```

**Errors**
- `400` — missing required fields

---

### GET /programs/:id
Get a full program with all its blocks and exercises.

**Response 200**
```json
{
  "id": "uuid",
  "name": "12-Week Strength Program",
  "description": "Progressive overload focus",
  "duration_weeks": 12,
  "blocks": [
    {
      "id": "uuid",
      "name": "Week 1 — Upper Body",
      "focus": "Hypertrophy",
      "order_index": 0,
      "exercises": [
        {
          "id": "uuid",
          "exercise_id": "uuid",
          "name": "Barbell Back Squat",
          "sets": 4,
          "reps": 8,
          "notes": "Focus on depth",
          "order_index": 0
        }
      ]
    }
  ]
}
```

**Errors**
- `403` — program belongs to another trainer
- `404` — program not found

---

### PATCH /programs/:id
Update program details.

**Request**
```json
{
  "name": "Updated Program Name",
  "description": "Updated description",
  "duration_weeks": 8
}
```

**Response 200** — returns updated program object.

**Errors**
- `403` — not the owner
- `404` — program not found

---

### DELETE /programs/:id
Delete a program and all its blocks.

**Response 204** — no content.

**Errors**
- `403` — not the owner
- `404` — program not found

---

## Blocks

### POST /programs/:programId/blocks
Add a new block to a program.

**Request**
```json
{
  "name": "Week 1 — Upper Body",
  "focus": "Hypertrophy",
  "order_index": 0
}
```

**Response 201**
```json
{
  "id": "uuid",
  "program_id": "uuid",
  "name": "Week 1 — Upper Body",
  "focus": "Hypertrophy",
  "order_index": 0
}
```

---

### PATCH /programs/:programId/blocks/:blockId
Update a block's name, focus, or order (used for drag-and-drop reordering).

**Request**
```json
{
  "name": "Week 1 — Lower Body",
  "focus": "Strength",
  "order_index": 1
}
```

**Response 200** — returns updated block object.

---

### DELETE /programs/:programId/blocks/:blockId
Delete a block and all its exercises.

**Response 204** — no content.

---

## Block Exercises

### POST /blocks/:blockId/exercises
Add an exercise to a block (triggered by drag-and-drop).

**Request**
```json
{
  "exercise_id": "uuid",
  "sets": 4,
  "reps": 8,
  "notes": "Focus on depth",
  "order_index": 0
}
```

**Response 201**
```json
{
  "id": "uuid",
  "block_id": "uuid",
  "exercise_id": "uuid",
  "name": "Barbell Back Squat",
  "sets": 4,
  "reps": 8,
  "notes": "Focus on depth",
  "order_index": 0
}
```

**Errors**
- `404` — block or exercise not found

---

### PATCH /blocks/:blockId/exercises/:id
Update sets, reps, notes, or order for an exercise in a block.

**Request**
```json
{
  "sets": 5,
  "reps": 5,
  "notes": "Add 5lbs from last week",
  "order_index": 1
}
```

**Response 200** — returns updated block exercise object.

---

### DELETE /blocks/:blockId/exercises/:id
Remove an exercise from a block.

**Response 204** — no content.

---

## Error Format

All errors follow this shape:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Program not found"
  }
}
```

| HTTP Status | Code | Meaning |
|---|---|---|
| 400 | `BAD_REQUEST` | Missing or invalid fields |
| 401 | `UNAUTHORIZED` | Missing or invalid token |
| 403 | `FORBIDDEN` | Authenticated but not allowed |
| 404 | `NOT_FOUND` | Resource does not exist |
| 409 | `CONFLICT` | Resource already exists |
| 500 | `SERVER_ERROR` | Unexpected server error |

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const exercises = [
    { name: 'Barbell Back Squat', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'intermediate', instructions: 'Stand with feet shoulder-width apart, bar resting on upper traps. Descend until thighs are parallel to floor, then drive back up.' },
    { name: 'Deadlift', muscleGroup: 'back', equipment: 'barbell', difficulty: 'intermediate', instructions: 'Stand with feet hip-width apart, grip bar just outside legs. Keep back flat, drive hips forward to stand.' },
    { name: 'Bench Press', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate', instructions: 'Lie flat, grip bar slightly wider than shoulder-width. Lower to chest, press back up.' },
    { name: 'Pull Up', muscleGroup: 'back', equipment: 'bodyweight', difficulty: 'intermediate', instructions: 'Hang from bar with overhand grip. Pull chest to bar, lower with control.' },
    { name: 'Push Up', muscleGroup: 'chest', equipment: 'bodyweight', difficulty: 'beginner', instructions: 'Start in plank position. Lower chest to floor, press back up keeping core tight.' },
    { name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', equipment: 'dumbbell', difficulty: 'beginner', instructions: 'Sit upright, dumbbells at shoulder height. Press overhead until arms are extended.' },
    { name: 'Romanian Deadlift', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'intermediate', instructions: 'Hold bar at hip level, hinge forward keeping back flat until you feel hamstring stretch, return to standing.' },
    { name: 'Barbell Row', muscleGroup: 'back', equipment: 'barbell', difficulty: 'intermediate', instructions: 'Hinge forward 45 degrees, pull bar to lower chest, squeeze shoulder blades together.' },
    { name: 'Dumbbell Curl', muscleGroup: 'arms', equipment: 'dumbbell', difficulty: 'beginner', instructions: 'Stand with dumbbells at sides, curl to shoulder height keeping elbows fixed.' },
    { name: 'Tricep Pushdown', muscleGroup: 'arms', equipment: 'cable', difficulty: 'beginner', instructions: 'Stand at cable machine, push bar down until arms are fully extended, control the return.' },
    { name: 'Leg Press', muscleGroup: 'legs', equipment: 'machine', difficulty: 'beginner', instructions: 'Sit in machine, feet shoulder-width on platform. Lower until 90 degrees, press back up.' },
    { name: 'Lat Pulldown', muscleGroup: 'back', equipment: 'cable', difficulty: 'beginner', instructions: 'Sit at machine, pull bar to upper chest, squeeze lats, control return.' },
    { name: 'Plank', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'beginner', instructions: 'Hold forearm plank position with straight body line, brace core throughout.' },
    { name: 'Dumbbell Lunges', muscleGroup: 'legs', equipment: 'dumbbell', difficulty: 'beginner', instructions: 'Step forward, lower back knee toward floor, push back to start. Alternate legs.' },
    { name: 'Incline Bench Press', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate', instructions: 'Set bench to 30-45 degrees. Press bar from upper chest upward.' },
  ];

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: {},
      create: exercise,
    });
  }
  console.log('Seeded exercises successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
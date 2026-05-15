const router = require('express').Router({ mergeParams: true });
const auth = require('../middleware/auth');
const { addExercise, updateExercise, removeExercise } = require('../controllers/blockExercisesController');

router.post('/:blockId/exercises', auth, addExercise);
router.patch('/:blockId/exercises/:id', auth, updateExercise);
router.delete('/:blockId/exercises/:id', auth, removeExercise);

module.exports = router;
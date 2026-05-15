const router = require('express').Router({ mergeParams: true });
const auth = require('../middleware/auth');
const { createBlock, updateBlock, deleteBlock } = require('../controllers/blocksController');
const { addExercise, updateExercise, removeExercise } = require('../controllers/blockExercisesController');

router.post('/programs/:programId/blocks', auth, createBlock);
router.patch('/programs/:programId/blocks/:blockId', auth, updateBlock);
router.delete('/programs/:programId/blocks/:blockId', auth, deleteBlock);

router.post('/blocks/:blockId/exercises', auth, addExercise);
router.patch('/blocks/:blockId/exercises/:id', auth, updateExercise);
router.delete('/blocks/:blockId/exercises/:id', auth, removeExercise);

module.exports = router;
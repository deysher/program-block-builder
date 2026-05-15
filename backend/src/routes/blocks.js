const router = require('express').Router({ mergeParams: true });
const auth = require('../middleware/auth');
const { createBlock, updateBlock, deleteBlock } = require('../controllers/blocksController');
const { addExercise, updateExercise, removeExercise } = require('../controllers/blockExercisesController');

router.post('/:programId/blocks', auth, createBlock);
router.patch('/:programId/blocks/:blockId', auth, updateBlock);
router.delete('/:programId/blocks/:blockId', auth, deleteBlock);

module.exports = router;
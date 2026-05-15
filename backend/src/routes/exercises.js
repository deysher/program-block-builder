const router = require('express').Router();
const auth = require('../middleware/auth');
const { getExercises, getExercise } = require('../controllers/exercisesController');

router.get('/', auth, getExercises);
router.get('/:id', auth, getExercise);

module.exports = router;
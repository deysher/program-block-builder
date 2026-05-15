const router = require('express').Router();
const auth = require('../middleware/auth');
const { getPrograms, createProgram, getProgram, updateProgram, deleteProgram } = require('../controllers/programsController');

router.get('/', auth, getPrograms);
router.post('/', auth, createProgram);
router.get('/:id', auth, getProgram);
router.patch('/:id', auth, updateProgram);
router.delete('/:id', auth, deleteProgram);

module.exports = router;
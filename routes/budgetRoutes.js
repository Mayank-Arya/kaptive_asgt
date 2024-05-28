const express = require('express');
const { getBudgets, addBudget, updateBudget, deleteBudget } = require('../controllers/budgetController');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', auth, getBudgets);
router.post('/', auth, addBudget);
router.put('/:id', auth, updateBudget);
router.delete('/:id', auth, deleteBudget);

module.exports = router;

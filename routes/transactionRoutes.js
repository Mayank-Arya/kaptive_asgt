const express = require('express');
const { getTransactions, addTransaction, updateTransaction, deleteTransaction, getMonthlyReport } = require('../controllers/transactionController');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', auth, getTransactions);
router.post('/', auth, addTransaction);
router.put('/:id', auth, updateTransaction);
router.delete('/:id', auth, deleteTransaction);
router.get('/report/:year/:month', auth, getMonthlyReport);

module.exports = router;

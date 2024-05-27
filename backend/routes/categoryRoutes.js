
const express = require('express');
const { getCategories, addCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', auth, getCategories);
router.post('/', auth, addCategory);
router.put('/:id', auth, updateCategory);
router.delete('/:id', auth, deleteCategory);

module.exports = router;

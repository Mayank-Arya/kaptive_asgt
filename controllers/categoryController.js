const Category = require('../models/categoryModel');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const addCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const newCategory = new Category({ name });

    const category = await newCategory.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    let category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    let category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    await Category.findByIdAndRemove(id);

    res.json({ msg: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { getCategories, addCategory, updateCategory, deleteCategory };

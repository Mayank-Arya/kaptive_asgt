const Budget = require('../models/budgetModel');

const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    res.json(budgets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const addBudget = async (req, res) => {
  const { amount, startDate, endDate } = req.body;

  try {
    const newBudget = new Budget({
      userId: req.user.id,
      amount,
      startDate,
      endDate
    });

    const budget = await newBudget.save();
    res.json(budget);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const updateBudget = async (req, res) => {
  const { id } = req.params;
  const { amount, startDate, endDate } = req.body;

  try {
    let budget = await Budget.findById(id);

    if (!budget) {
      return res.status(404).json({ msg: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    budget = await Budget.findByIdAndUpdate(
      id,
      { amount, startDate, endDate },
      { new: true }
    );

    res.json(budget);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const deleteBudget = async (req, res) => {
  const { id } = req.params;

  try {
    let budget = await Budget.findById(id);

    if (!budget) {
      return res.status(404).json({ msg: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Budget.findByIdAndRemove(id);

    res.json({ msg: 'Budget removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { getBudgets, addBudget, updateBudget, deleteBudget };

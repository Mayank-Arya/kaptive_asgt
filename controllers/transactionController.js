const Transaction = require('../models/transactionModel');
const axios = require('axios');

const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  try {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    const rate = response.data.rates[toCurrency];
    return amount * rate;
  } catch (err) {
    console.error(err.message);
    throw new Error('Currency conversion failed');
  }
};

const getTransactions = async (req, res) => {
  const { targetCurrency } = req.query; // Example of getting target currency from query params

  try {
    const transactions = await Transaction.find({ userId: req.user.id }).populate('categoryId');
    
    if (targetCurrency) {
      // Convert transaction amounts to the target currency
      for (const transaction of transactions) {
        transaction.amount = await convertCurrency(transaction.amount, 'USD', targetCurrency); // Assuming your transactions are stored in USD
      }
    }

    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const addTransaction = async (req, res) => {
  const { amount, type, categoryId, date, description } = req.body;

  try {
    const newTransaction = new Transaction({
      userId: req.user.id,
      amount,
      type,
      categoryId,
      date,
      description
    });

    const transaction = await newTransaction.save();
    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { amount, type, categoryId, date, description } = req.body;

  try {
    let transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ msg: 'Transaction not found' });
    }

    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    transaction = await Transaction.findByIdAndUpdate(
      id,
      { amount, type, categoryId, date, description },
      { new: true }
    );

    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    let transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ msg: 'Transaction not found' });
    }

    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Transaction.findByIdAndRemove(id);

    res.json({ msg: 'Transaction removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


const getMonthlyReport = async (req, res) => {
  const { year, month } = req.params;
  
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const transactions = await Transaction.find({
      userId: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    }).populate('categoryId');

    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        income += transaction.amount;
      } else if (transaction.type === 'expense') {
        expense += transaction.amount;
      }
    });

    res.json({ income, expense, transactions });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


module.exports = { getTransactions, addTransaction, updateTransaction, deleteTransaction, getMonthlyReport ,convertCurrency};

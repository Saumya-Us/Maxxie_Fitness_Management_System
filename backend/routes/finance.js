const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Expense = require('../models/Expense');
const { validateToken } = require('../middleware/AuthMiddleWare');

// Payments CRUD
router.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.find().populate('userId', 'email firstName lastName');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Secure POST payment
router.post('/payments', validateToken, async (req, res) => {
  try {
    const { userId, amount, type, method, description } = req.body;
    if (!userId || !amount || !type || !method) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number.' });
    }
    // Only allow user to create payment for themselves, or admin for anyone
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ error: 'Not authorized to create payment for this user.' });
    }
    const payment = new Payment({ userId, amount, type, method, description });
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Secure PUT payment
router.put('/payments/:id', validateToken, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found.' });
    // Only allow user to update their own payment, or admin
    if (req.user.role !== 'admin' && req.user.id !== String(payment.userId)) {
      return res.status(403).json({ error: 'Not authorized to update this payment.' });
    }
    // Only allow updating allowed fields
    const allowed = ['amount', 'type', 'method', 'status', 'description'];
    for (const key of Object.keys(req.body)) {
      if (!allowed.includes(key)) delete req.body[key];
    }
    Object.assign(payment, req.body);
    await payment.save();
    res.json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Secure DELETE payment
router.delete('/payments/:id', validateToken, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found.' });
    if (req.user.role !== 'admin' && req.user.id !== String(payment.userId)) {
      return res.status(403).json({ error: 'Not authorized to delete this payment.' });
    }
    await payment.deleteOne();
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Expenses CRUD
router.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/expenses', async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/expenses/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/expenses/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalExpenses = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalExpenses: totalExpenses[0]?.total || 0,
      profit: (totalRevenue[0]?.total || 0) - (totalExpenses[0]?.total || 0)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 
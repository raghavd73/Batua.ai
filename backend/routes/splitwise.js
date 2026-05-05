const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const Expense = require('../models/Expense');

function buildEqualShares(amount, participants) {
  const perHead = Number((amount / participants.length).toFixed(2));
  let total = 0;

  const shares = participants.map((user, index) => {
    let share = perHead;
    total += share;

    if (index === participants.length - 1) {
      share = Number((amount - (total - perHead)).toFixed(2));
    }

    return { user, amount: share };
  });

  return shares;
}

function calculateGroupBalances(expenses) {
  const balances = {};

  for (const expense of expenses) {
    if (!balances[expense.paidBy]) balances[expense.paidBy] = 0;
    balances[expense.paidBy] += expense.amount;

    for (const share of expense.shares) {
      if (!balances[share.user]) balances[share.user] = 0;
      balances[share.user] -= share.amount;
    }
  }

  return Object.entries(balances).map(([user, balance]) => ({
    user,
    balance: Number(balance.toFixed(2))
  }));
}

router.post('/groups', async (req, res) => {
  try {
    const { name, description, members, createdBy } = req.body;
    const group = await Group.create({
      name,
      description,
      members,
      createdBy
    });
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create group' });
  }
});

router.get('/groups', async (req, res) => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

router.get('/groups/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    const expenses = await Expense.find({ groupId: req.params.id }).sort({ date: -1 });
    const balances = calculateGroupBalances(expenses);

    res.json({ group, expenses, balances });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch group details' });
  }
});

router.post('/expenses', async (req, res) => {
  try {
    const {
      groupId,
      description,
      amount,
      paidBy,
      splitType,
      participants,
      shares,
      note,
      date
    } = req.body;

    let finalShares = shares;

    if (splitType === 'equal') {
      finalShares = buildEqualShares(Number(amount), participants);
    }

    const expense = await Expense.create({
      groupId,
      description,
      amount: Number(amount),
      paidBy,
      splitType,
      participants,
      shares: finalShares,
      note,
      date
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

module.exports = router;

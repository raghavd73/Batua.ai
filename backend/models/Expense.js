const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true
    },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    paidBy: { type: String, required: true },
    splitType: {
      type: String,
      enum: ['equal', 'custom'],
      default: 'equal'
    },
    participants: [{ type: String, required: true }],
    shares: [
      {
        user: { type: String, required: true },
        amount: { type: Number, required: true }
      }
    ],
    note: { type: String, default: '' },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', ExpenseSchema);

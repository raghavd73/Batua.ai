const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    members: [{ type: String, required: true }],
    createdBy: { type: String, default: 'Raghav' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Group', GroupSchema);

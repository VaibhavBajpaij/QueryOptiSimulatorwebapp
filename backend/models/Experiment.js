const mongoose = require('mongoose');

const ExperimentSchema = new mongoose.Schema({
  algorithm: {
    type: String,
    required: true,
    enum: ['linear_search', 'binary_search', 'hash_lookup', 'sorting_based_grouping', 'hash_based_grouping', 'nested_loop_join', 'hash_join']
  },
  task: {
    type: String,
    required: true,
    enum: ['search', 'groupby', 'join']
  },
  datasetSize: {
    type: Number,
    required: true
  },
  executionTime: {
    type: Number,
    required: true
  },
  complexity: {
    type: String,
    required: true
  },
  additionalInfo: {
    type: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Experiment', ExperimentSchema);
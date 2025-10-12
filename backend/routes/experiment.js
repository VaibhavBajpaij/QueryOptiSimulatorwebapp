const express = require('express');
const Experiment = require('../models/Experiment');

const router = express.Router();

// Get all experiments
router.get('/', async (req, res) => {
  try {
    const experiments = await Experiment.find().sort({ timestamp: -1 });
    res.json(experiments);
  } catch (error) {
    console.error('Error fetching experiments:', error);
    res.status(500).json({ error: 'Failed to fetch experiments' });
  }
});

// Get experiments by task type
router.get('/task/:taskType', async (req, res) => {
  try {
    const { taskType } = req.params;
    
    if (!['search', 'groupby', 'join'].includes(taskType)) {
      return res.status(400).json({ error: 'Invalid task type' });
    }
    
    const experiments = await Experiment.find({ task: taskType }).sort({ timestamp: -1 });
    res.json(experiments);
  } catch (error) {
    console.error('Error fetching experiments by task:', error);
    res.status(500).json({ error: 'Failed to fetch experiments' });
  }
});

// Get experiments by algorithm
router.get('/algorithm/:algo', async (req, res) => {
  try {
    const { algo } = req.params;
    const experiments = await Experiment.find({ algorithm: algo }).sort({ timestamp: -1 });
    res.json(experiments);
  } catch (error) {
    console.error('Error fetching experiments by algorithm:', error);
    res.status(500).json({ error: 'Failed to fetch experiments' });
  }
});

// Get experiments by dataset size
router.get('/size/:size', async (req, res) => {
  try {
    const { size } = req.params;
    const experiments = await Experiment.find({ datasetSize: parseInt(size) }).sort({ timestamp: -1 });
    res.json(experiments);
  } catch (error) {
    console.error('Error fetching experiments by size:', error);
    res.status(500).json({ error: 'Failed to fetch experiments' });
  }
});

// Get experiment by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const experiment = await Experiment.findById(id);
    
    if (!experiment) {
      return res.status(404).json({ error: 'Experiment not found' });
    }
    
    res.json(experiment);
  } catch (error) {
    console.error('Error fetching experiment by ID:', error);
    res.status(500).json({ error: 'Failed to fetch experiment' });
  }
});

// Delete experiment by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const experiment = await Experiment.findByIdAndDelete(id);
    
    if (!experiment) {
      return res.status(404).json({ error: 'Experiment not found' });
    }
    
    res.json({ message: 'Experiment deleted successfully' });
  } catch (error) {
    console.error('Error deleting experiment:', error);
    res.status(500).json({ error: 'Failed to delete experiment' });
  }
});

// Export experiments as JSON
router.get('/export/json', async (req, res) => {
  try {
    const experiments = await Experiment.find().sort({ timestamp: -1 });
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=experiments.json');
    
    res.json(experiments);
  } catch (error) {
    console.error('Error exporting experiments:', error);
    res.status(500).json({ error: 'Failed to export experiments' });
  }
});

// Export experiments as CSV
router.get('/export/csv', async (req, res) => {
  try {
    const experiments = await Experiment.find().sort({ timestamp: -1 });
    
    // Convert to CSV format
    const fields = ['algorithm', 'task', 'datasetSize', 'executionTime', 'complexity', 'timestamp'];
    
    let csv = fields.join(',') + '\n';
    
    experiments.forEach(exp => {
      const row = [
        exp.algorithm,
        exp.task,
        exp.datasetSize,
        exp.executionTime,
        exp.complexity,
        new Date(exp.timestamp).toISOString()
      ];
      
      csv += row.join(',') + '\n';
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=experiments.csv');
    
    res.send(csv);
  } catch (error) {
    console.error('Error exporting experiments as CSV:', error);
    res.status(500).json({ error: 'Failed to export experiments as CSV' });
  }
});

module.exports = router;
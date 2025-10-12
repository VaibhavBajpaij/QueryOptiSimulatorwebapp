const express = require('express');
const { PythonShell } = require('python-shell');
const path = require('path');
const Experiment = require('../models/Experiment');

const router = express.Router();

// Helper function to run Python simulation
const runPythonSimulation = (scriptPath, args) => {
  return new Promise((resolve, reject) => {
    const options = {
      mode: 'text',  // Changed from 'json' to 'text' to handle output manually
      pythonPath: 'python', // or 'python3' depending on your system
      scriptPath: path.dirname(scriptPath),
      args: args,
      pythonOptions: ['-u'] // Add unbuffered mode to ensure output is sent immediately
    };

    console.log(`Running Python script: ${path.basename(scriptPath)} with args: ${args.join(', ')}`);
    
    let jsonOutput = '';
    let errorOutput = '';
    
    // Use spawn instead of run to handle output streams separately
    const pyshell = new PythonShell(path.basename(scriptPath), options);
    
    pyshell.on('message', function (message) {
      console.log('Python output:', message);
      // Collect output that looks like JSON
      if (message.trim().startsWith('{') || message.trim().startsWith('[')) {
        jsonOutput = message;
      } else if (message.includes('Debug:')) {
        console.log('Python debug:', message);
      }
    });
    
    pyshell.on('stderr', function (stderr) {
      console.log('Python stderr:', stderr);
      errorOutput += stderr;
    });
    
    pyshell.end(function (err) {
      if (err) {
        console.error('Python script error:', err);
        return reject(err);
      }
      
      if (!jsonOutput) {
        console.error('No JSON output found in Python script output');
        return reject(new Error('No JSON output found in Python script output. Error: ' + errorOutput));
      }
      
      try {
        const result = JSON.parse(jsonOutput);
        console.log('Parsed Python result:', result);
        resolve(result);
      } catch (parseError) {
        console.error('Failed to parse Python output as JSON:', parseError);
        console.error('Raw output:', jsonOutput);
        reject(new Error('Failed to parse Python output as JSON: ' + parseError.message));
      }
    });
  });
};

// Run search algorithm simulation
router.get('/run-search', async (req, res) => {
  try {
    const { algo, size } = req.query;
    
    if (!algo || !size) {
      return res.status(400).json({ error: 'Algorithm and dataset size are required' });
    }
    
    const simulationPath = path.join(__dirname, '..', '..', 'simulation', 'simulator.py');
    const result = await runPythonSimulation(simulationPath, ['search', algo, size]);
    
    // Save experiment result to database
    const experiment = new Experiment({
      algorithm: result.algorithm,
      task: 'search',
      datasetSize: parseInt(size),
      executionTime: result.execution_time,
      complexity: result.complexity,
      additionalInfo: {
        found: result.found,
        index: result.index,
        target: result.target
      }
    });
    
    await experiment.save();
    
    res.json(result);
  } catch (error) {
    console.error('Error running search simulation:', error);
    res.status(500).json({ error: 'Failed to run search simulation' });
  }
});

// Run groupby algorithm simulation
router.get('/run-groupby', async (req, res) => {
  try {
    const { method, size } = req.query;
    
    if (!method || !size) {
      return res.status(400).json({ error: 'Method and dataset size are required' });
    }
    
    const simulationPath = path.join(__dirname, '..', '..', 'simulation', 'simulator.py');
    const result = await runPythonSimulation(simulationPath, ['groupby', method, size]);
    
    // Save experiment result to database
    const experiment = new Experiment({
      algorithm: result.algorithm,
      task: 'groupby',
      datasetSize: parseInt(size),
      executionTime: result.execution_time,
      complexity: result.complexity,
      additionalInfo: {
        num_groups: result.num_groups
      }
    });
    
    await experiment.save();
    
    res.json(result);
  } catch (error) {
    console.error('Error running groupby simulation:', error);
    res.status(500).json({ error: 'Failed to run groupby simulation' });
  }
});

// Run join algorithm simulation
router.get('/run-join', async (req, res) => {
  try {
    const { method, size } = req.query;
    
    if (!method || !size) {
      return res.status(400).json({ error: 'Method and dataset size are required' });
    }
    
    const simulationPath = path.join(__dirname, '..', '..', 'simulation', 'simulator.py');
    const result = await runPythonSimulation(simulationPath, ['join', method, size]);
    
    // Save experiment result to database
    const experiment = new Experiment({
      algorithm: result.algorithm,
      task: 'join',
      datasetSize: parseInt(size),
      executionTime: result.execution_time,
      complexity: result.complexity,
      additionalInfo: {
        joined_rows: result.joined_rows,
        second_dataset_size: result.second_dataset_size
      }
    });
    
    await experiment.save();
    
    res.json(result);
  } catch (error) {
    console.error('Error running join simulation:', error);
    res.status(500).json({ error: 'Failed to run join simulation' });
  }
});

// Run all experiments
router.get('/run-all', async (req, res) => {
  try {
    const { size } = req.query;
    
    if (!size) {
      return res.status(400).json({ error: 'Dataset size is required' });
    }
    
    const simulationPath = path.join(__dirname, '..', '..', 'simulation', 'simulator.py');
    const result = await runPythonSimulation(simulationPath, ['all', null, size]);
    
    res.json(result);
  } catch (error) {
    console.error('Error running all simulations:', error);
    res.status(500).json({ error: 'Failed to run all simulations' });
  }
});

module.exports = router;
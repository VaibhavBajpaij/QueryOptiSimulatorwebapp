import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ExperimentHistory = () => {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    task: '',
    algorithm: '',
    datasetSize: ''
  });
  
  // Fetch experiments on component mount
  useEffect(() => {
    fetchExperiments();
  }, []);
  
  const fetchExperiments = async (queryParams = '') => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/experiment${queryParams}`);
      setExperiments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch experiment history. Please try again.');
      console.error('Error fetching experiments:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };
  
  const applyFilters = () => {
    let queryParams = '?';
    if (filter.task) queryParams += `task=${filter.task}&`;
    if (filter.algorithm) queryParams += `algorithm=${filter.algorithm}&`;
    if (filter.datasetSize) queryParams += `datasetSize=${filter.datasetSize}&`;
    
    // Remove trailing '&' or '?' if no filters
    queryParams = queryParams.endsWith('&') 
      ? queryParams.slice(0, -1) 
      : queryParams === '?' ? '' : queryParams;
    
    fetchExperiments(queryParams);
  };
  
  const resetFilters = () => {
    setFilter({ task: '', algorithm: '', datasetSize: '' });
    fetchExperiments();
  };
  
  const exportResults = async (format) => {
    try {
      const response = await axios.get(`/api/experiment/export?format=${format}`, {
        responseType: 'blob'
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `experiment_results.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(`Failed to export results as ${format.toUpperCase()}. Please try again.`);
      console.error('Error exporting results:', err);
    }
  };
  
  const deleteExperiment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experiment?')) return;
    
    try {
      await axios.delete(`/api/experiment/${id}`);
      // Refresh the list
      fetchExperiments();
    } catch (err) {
      setError('Failed to delete experiment. Please try again.');
      console.error('Error deleting experiment:', err);
    }
  };
  
  // Group experiments by task for visualization
  const groupedByTask = {};
  experiments.forEach(exp => {
    if (!groupedByTask[exp.task]) {
      groupedByTask[exp.task] = [];
    }
    groupedByTask[exp.task].push(exp);
  });
  
  // Prepare chart data
  const chartData = {
    labels: Array.from(new Set(experiments.map(exp => exp.dataset_size))).sort((a, b) => a - b),
    datasets: Object.entries(groupedByTask).flatMap(([task, exps]) => {
      // Group by algorithm within each task
      const byAlgorithm = {};
      exps.forEach(exp => {
        if (!byAlgorithm[exp.algorithm]) {
          byAlgorithm[exp.algorithm] = [];
        }
        byAlgorithm[exp.algorithm].push(exp);
      });
      
      // Create a dataset for each algorithm
      return Object.entries(byAlgorithm).map(([algo, algoExps]) => {
        // Sort by dataset size
        algoExps.sort((a, b) => a.dataset_size - b.dataset_size);
        
        // Generate a consistent color based on algorithm name
        const hue = Math.abs(algo.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360);
        
        return {
          label: `${task} - ${algo}`,
          data: algoExps.map(exp => ({
            x: exp.dataset_size,
            y: exp.execution_time
          })),
          borderColor: `hsl(${hue}, 70%, 50%)`,
          backgroundColor: `hsla(${hue}, 70%, 50%, 0.5)`,
          tension: 0.1
        };
      });
    })
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Experiment History</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Filter Experiments</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Task Type:</label>
            <select 
              name="task"
              value={filter.task}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Tasks</option>
              <option value="search">Search</option>
              <option value="groupby">Group By</option>
              <option value="join">Join</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Algorithm:</label>
            <select 
              name="algorithm"
              value={filter.algorithm}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Algorithms</option>
              <option value="linear">Linear Search</option>
              <option value="binary">Binary Search</option>
              <option value="hash">Hash Lookup</option>
              <option value="sort">Sorting-based Grouping</option>
              <option value="hash">Hash-based Grouping</option>
              <option value="nested">Nested Loop Join</option>
              <option value="hash">Hash Join</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Dataset Size:</label>
            <select 
              name="datasetSize"
              value={filter.datasetSize}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sizes</option>
              <option value="1000">1,000</option>
              <option value="10000">10,000</option>
              <option value="100000">100,000</option>
              <option value="1000000">1,000,000</option>
            </select>
          </div>
          
          <div className="flex items-end space-x-2">
            <button 
              onClick={applyFilters}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Apply Filters
            </button>
            
            <button 
              onClick={resetFilters}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Reset
            </button>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button 
            onClick={() => exportResults('json')}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition duration-300"
          >
            Export as JSON
          </button>
          
          <button 
            onClick={() => exportResults('csv')}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition duration-300"
          >
            Export as CSV
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading experiments...</p>
        </div>
      ) : experiments.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-yellow-700">No experiments found. Run some simulations to see results here.</p>
        </div>
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Performance Visualization</h2>
            
            <Line 
              id="experiment-history-chart"
              data={chartData} 
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Algorithm Performance by Dataset Size' },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const point = context.raw;
                        return `${context.dataset.label}: ${point.y.toFixed(6)}s (Size: ${point.x.toLocaleString()})`;
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    type: 'linear',
                    position: 'bottom',
                    title: { display: true, text: 'Dataset Size' },
                    ticks: {
                      callback: (value) => value.toLocaleString()
                    }
                  },
                  y: {
                    title: { display: true, text: 'Execution Time (seconds)' }
                  }
                }
              }}
            />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Experiment Results</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Task</th>
                    <th className="py-3 px-4 text-left">Algorithm</th>
                    <th className="py-3 px-4 text-left">Dataset Size</th>
                    <th className="py-3 px-4 text-left">Execution Time (s)</th>
                    <th className="py-3 px-4 text-left">Complexity</th>
                    <th className="py-3 px-4 text-left">Timestamp</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {experiments.map((exp) => (
                    <tr key={exp._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{exp.task}</td>
                      <td className="py-3 px-4">{exp.algorithm}</td>
                      <td className="py-3 px-4">{exp.dataset_size.toLocaleString()}</td>
                      <td className="py-3 px-4">{exp.execution_time.toFixed(6)}</td>
                      <td className="py-3 px-4">{exp.complexity}</td>
                      <td className="py-3 px-4">{new Date(exp.timestamp).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <button 
                          onClick={() => deleteExperiment(exp._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExperimentHistory;
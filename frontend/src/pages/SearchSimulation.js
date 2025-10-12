import React, { useState } from 'react';
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

const SearchSimulation = () => {
  const [algorithm, setAlgorithm] = useState('linear');
  const [datasetSize, setDatasetSize] = useState('10000');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/simulation/run-search?algo=${algorithm}&size=${datasetSize}`);
      setResults(response.data);
    } catch (err) {
      setError('Failed to run simulation. Please try again.');
      console.error('Error running simulation:', err);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data if results are available
  const chartData = results ? {
    labels: ['Current Run'],
    datasets: [
      {
        label: `${results.algorithm} (${results.complexity})`,
        data: [results.execution_time],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      }
    ],
  } : null;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Search Algorithm Simulation</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Run Simulation</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Algorithm:</label>
            <select 
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="linear">Linear Search - O(n)</option>
              <option value="binary">Binary Search - O(log n)</option>
              <option value="hash">Hash Lookup - O(1)</option>
              <option value="all">Run All Algorithms</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Dataset Size:</label>
            <select 
              value={datasetSize}
              onChange={(e) => setDatasetSize(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1000">1,000 elements</option>
              <option value="10000">10,000 elements</option>
              <option value="100000">100,000 elements</option>
              <option value="1000000">1,000,000 elements</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-300"
            disabled={loading}
          >
            {loading ? 'Running Simulation...' : 'Run Simulation'}
          </button>
        </form>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {results && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Simulation Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Performance Metrics</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Algorithm:</span>
                  <span>{results.algorithm}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Dataset Size:</span>
                  <span>{parseInt(datasetSize).toLocaleString()} elements</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Execution Time:</span>
                  <span>{results.execution_time.toFixed(6)} seconds</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Time Complexity:</span>
                  <span>{results.complexity}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Target Found:</span>
                  <span>{results.found ? 'Yes' : 'No'}</span>
                </div>
                
                {results.found && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Index:</span>
                    <span>{results.index}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Execution Time</h3>
              {chartData && (
                <Line 
                  id="search-algorithm-chart"
                  data={chartData} 
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'Algorithm Performance' },
                    },
                    scales: {
                      y: {
                        title: { display: true, text: 'Execution Time (seconds)' }
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-blue-50 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">About Search Algorithms</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-blue-700">Linear Search - O(n)</h3>
            <p className="text-gray-700">
              Linear search checks each element in the dataset sequentially until it finds the target or reaches the end.
              Its time complexity is O(n), meaning the execution time grows linearly with the dataset size.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-blue-700">Binary Search - O(log n)</h3>
            <p className="text-gray-700">
              Binary search works on sorted data by repeatedly dividing the search interval in half.
              Its time complexity is O(log n), making it much faster than linear search for large datasets.
              However, it requires the data to be sorted first.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-blue-700">Hash Lookup - O(1)</h3>
            <p className="text-gray-700">
              Hash lookup uses a hash table (dictionary) to store and retrieve values by their keys.
              Its average time complexity is O(1), meaning it takes constant time regardless of dataset size.
              However, it requires additional memory to store the hash table.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSimulation;
import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const JoinSimulation = () => {
  const [algorithm, setAlgorithm] = useState('hash');
  const [datasetSize, setDatasetSize] = useState('10000');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/simulation/run-join?method=${algorithm}&size=${datasetSize}`);
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
    labels: Array.isArray(results) 
      ? results.map(r => r.algorithm) 
      : [results.algorithm],
    datasets: [
      {
        label: 'Execution Time (seconds)',
        data: Array.isArray(results) 
          ? results.map(r => r.execution_time) 
          : [results.execution_time],
        backgroundColor: [
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderColor: [
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-purple-600 mb-6">Join Algorithm Simulation</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Run Simulation</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Algorithm:</label>
            <select 
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="nested">Nested Loop Join - O(n²)</option>
              <option value="hash">Hash Join - O(n+m)</option>
              <option value="all">Run All Algorithms</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Dataset Size:</label>
            <select 
              value={datasetSize}
              onChange={(e) => setDatasetSize(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="1000">1,000 elements</option>
              <option value="10000">10,000 elements</option>
              <option value="100000">100,000 elements</option>
              <option value="1000000">1,000,000 elements</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md transition duration-300"
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
                {Array.isArray(results) ? (
                  results.map((result, index) => (
                    <div key={index} className="border-b pb-3 mb-3">
                      <div className="flex justify-between pb-2">
                        <span className="font-medium">Algorithm:</span>
                        <span>{result.algorithm}</span>
                      </div>
                      
                      <div className="flex justify-between pb-2">
                        <span className="font-medium">Dataset Size:</span>
                        <span>{parseInt(datasetSize).toLocaleString()} elements</span>
                      </div>
                      
                      <div className="flex justify-between pb-2">
                        <span className="font-medium">Execution Time:</span>
                        <span>{result.execution_time.toFixed(6)} seconds</span>
                      </div>
                      
                      <div className="flex justify-between pb-2">
                        <span className="font-medium">Time Complexity:</span>
                        <span>{result.complexity}</span>
                      </div>
                      
                      <div className="flex justify-between pb-2">
                        <span className="font-medium">Matches Found:</span>
                        <span>{result.match_count}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
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
                      <span className="font-medium">Matches Found:</span>
                      <span>{results.match_count}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Execution Time Comparison</h3>
              {chartData && (
                <Bar 
                  id="join-algorithm-chart"
                  data={chartData} 
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'Algorithm Performance' },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
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
      
      <div className="bg-purple-50 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">About Join Algorithms</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-purple-700">Nested Loop Join - O(n²)</h3>
            <p className="text-gray-700">
              Nested Loop Join compares each element of the first dataset with every element of the second dataset.
              Its time complexity is O(n²), making it inefficient for large datasets.
              However, it requires minimal memory and is simple to implement.
              In database systems, this is often used when joining small tables or when more efficient join methods aren't applicable.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-purple-700">Hash Join - O(n+m)</h3>
            <p className="text-gray-700">
              Hash Join builds a hash table from one dataset and then probes it with elements from the second dataset.
              Its time complexity is O(n+m), where n and m are the sizes of the two datasets.
              This makes it much more efficient than nested loop joins for large datasets.
              However, it requires more memory to store the hash table.
              In database systems, this is often the preferred method for equi-joins on large tables.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-purple-700">SQL JOIN Implementation</h3>
            <p className="text-gray-700">
              In SQL databases, the query optimizer chooses between different join algorithms based on factors like:
              table sizes, available indexes, join conditions, and system resources.
              Understanding these algorithms helps in designing efficient queries and database schemas.
              For example, creating appropriate indexes can help the optimizer choose more efficient join methods.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinSimulation;
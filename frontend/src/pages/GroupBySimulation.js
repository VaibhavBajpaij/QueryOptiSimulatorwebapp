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

const GroupBySimulation = () => {
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
      const response = await axios.get(`/api/simulation/run-groupby?method=${algorithm}&size=${datasetSize}`);
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
          'rgba(255, 99, 132, 0.5)',
          'rgba(53, 162, 235, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(53, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-green-600 mb-6">Group By Algorithm Simulation</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Run Simulation</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Algorithm:</label>
            <select 
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="sort">Sorting-based Grouping - O(n log n)</option>
              <option value="hash">Hash-based Grouping - O(n)</option>
              <option value="all">Run All Algorithms</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Dataset Size:</label>
            <select 
              value={datasetSize}
              onChange={(e) => setDatasetSize(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="1000">1,000 elements</option>
              <option value="10000">10,000 elements</option>
              <option value="100000">100,000 elements</option>
              <option value="1000000">1,000,000 elements</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition duration-300"
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
                        <span className="font-medium">Groups Found:</span>
                        <span>{result.group_count}</span>
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
                      <span className="font-medium">Groups Found:</span>
                      <span>{results.group_count}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Execution Time Comparison</h3>
              {chartData && (
                <Bar 
                  id="groupby-algorithm-chart"
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
      
      <div className="bg-green-50 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">About Group By Algorithms</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-green-700">Sorting-based Grouping - O(n log n)</h3>
            <p className="text-gray-700">
              Sorting-based grouping first sorts the data by the grouping key, then iterates through the sorted data to identify groups.
              Its time complexity is O(n log n) due to the sorting operation, which dominates the performance.
              This approach is memory-efficient but slower for large datasets compared to hash-based grouping.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-green-700">Hash-based Grouping - O(n)</h3>
            <p className="text-gray-700">
              Hash-based grouping uses a hash table (dictionary) to group elements by their keys in a single pass through the data.
              Its time complexity is O(n), making it faster than sorting-based approaches for large datasets.
              However, it requires more memory to store the hash table structure.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-green-700">SQL GROUP BY Implementation</h3>
            <p className="text-gray-700">
              In SQL databases, the GROUP BY operation typically uses either hash-based or sorting-based algorithms depending on the query optimizer's decision.
              The choice between these algorithms affects query performance, especially for large datasets.
              Understanding these trade-offs helps in optimizing database queries and designing efficient data models.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupBySimulation;
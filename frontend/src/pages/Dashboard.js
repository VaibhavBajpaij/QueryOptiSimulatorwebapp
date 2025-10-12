import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [recentExperiments, setRecentExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentExperiments = async () => {
      try {
        const response = await axios.get('/api/experiment');
        setRecentExperiments(response.data.slice(0, 5)); // Get only the 5 most recent experiments
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch recent experiments');
        setLoading(false);
        console.error('Error fetching experiments:', err);
      }
    };

    fetchRecentExperiments();
  }, []);

  // Sample data for the charts (in a real app, this would come from the API)
  const searchPerformanceData = {
    labels: ['1,000', '10,000', '100,000', '1,000,000'],
    datasets: [
      {
        label: 'Linear Search O(n)',
        data: [0.0001, 0.001, 0.01, 0.1],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Binary Search O(log n)',
        data: [0.00005, 0.0001, 0.00015, 0.0002],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Hash Lookup O(1)',
        data: [0.00001, 0.00001, 0.00002, 0.00002],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const groupByPerformanceData = {
    labels: ['1,000', '10,000', '100,000', '1,000,000'],
    datasets: [
      {
        label: 'Sorting-based Grouping O(n log n)',
        data: [0.0005, 0.006, 0.07, 0.8],
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
      },
      {
        label: 'Hash-based Grouping O(n)',
        data: [0.0002, 0.002, 0.02, 0.2],
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      },
    ],
  };

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Query Optimizer Simulator</h1>
        <p className="text-xl text-gray-600 mb-6">Explore how different DSA algorithms affect analytics performance</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Link to="/search" className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-6 shadow-md transition duration-300 transform hover:scale-105">
            <h2 className="text-xl font-bold mb-2">Search Algorithms</h2>
            <p>Compare Linear Search, Binary Search, and Hash Lookup performance</p>
          </Link>
          
          <Link to="/groupby" className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-6 shadow-md transition duration-300 transform hover:scale-105">
            <h2 className="text-xl font-bold mb-2">GroupBy Algorithms</h2>
            <p>Compare Sorting-based and Hash-based grouping performance</p>
          </Link>
          
          <Link to="/join" className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg p-6 shadow-md transition duration-300 transform hover:scale-105">
            <h2 className="text-xl font-bold mb-2">Join Algorithms</h2>
            <p>Compare Nested Loop Join and Hash Join performance</p>
          </Link>
        </div>
      </section>
      
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Overview</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Search Algorithm Performance</h3>
            <Line 
              id="search-performance-chart"
              data={searchPerformanceData} 
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Execution Time vs Dataset Size' },
                },
                scales: {
                  y: {
                    type: 'logarithmic',
                    title: { display: true, text: 'Execution Time (seconds)' }
                  },
                  x: {
                    title: { display: true, text: 'Dataset Size' }
                  }
                }
              }}
            />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">GroupBy Algorithm Performance</h3>
            <Bar 
              id="groupby-performance-chart"
              data={groupByPerformanceData} 
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Execution Time vs Dataset Size' },
                },
                scales: {
                  y: {
                    type: 'logarithmic',
                    title: { display: true, text: 'Execution Time (seconds)' }
                  },
                  x: {
                    title: { display: true, text: 'Dataset Size' }
                  }
                }
              }}
            />
          </div>
        </div>
      </section>
      
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Experiments</h2>
        
        {loading ? (
          <p className="text-center text-gray-600">Loading recent experiments...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : recentExperiments.length === 0 ? (
          <p className="text-center text-gray-600">No experiments have been run yet. Try running a simulation!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Algorithm</th>
                  <th className="py-3 px-4 text-left">Task</th>
                  <th className="py-3 px-4 text-left">Dataset Size</th>
                  <th className="py-3 px-4 text-left">Execution Time (s)</th>
                  <th className="py-3 px-4 text-left">Complexity</th>
                  <th className="py-3 px-4 text-left">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentExperiments.map((exp) => (
                  <tr key={exp._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{exp.algorithm}</td>
                    <td className="py-3 px-4">{exp.task}</td>
                    <td className="py-3 px-4">{exp.datasetSize.toLocaleString()}</td>
                    <td className="py-3 px-4">{exp.executionTime.toFixed(6)}</td>
                    <td className="py-3 px-4">{exp.complexity}</td>
                    <td className="py-3 px-4">{new Date(exp.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-4 text-center">
          <Link to="/history" className="text-blue-600 hover:text-blue-800 font-medium">
            View all experiments →
          </Link>
        </div>
      </section>
      
      <section className="mt-12 bg-blue-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Project</h2>
        <p className="text-gray-700 mb-4">
          The Query Optimizer Simulator demonstrates how different Data Structures and Algorithms (DSA) 
          affect analytics performance. This project helps you understand the performance characteristics 
          of various algorithms used in database query optimization.
        </p>
        <p className="text-gray-700">
          Run experiments with different dataset sizes and algorithms to see how execution time scales 
          with data volume. Visualize the results and learn about Big-O complexity in a practical way.
        </p>
        <div className="mt-4 text-center">
          <Link to="/about" className="text-blue-600 hover:text-blue-800 font-medium">
            Learn more about the project →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;